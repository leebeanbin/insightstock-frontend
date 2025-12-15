/**
 * useChat Hook
 * 채팅 메시지 관리 (Controller Layer 역할)
 * React Query + SSE 스트리밍 지원
 * SOLID: Single Responsibility Principle
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services';
import {
  Message,
  SendMessageRequest,
  SendMessageResponse,
  MessagesListResponse,
} from '../types/api/chat.types';
import { conversationKeys } from './use-conversations';
import { getCacheConfig } from '../config/cache';

// Query Keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (conversationId: string) =>
    [...messageKeys.lists(), conversationId] as const,
};

/**
 * 메시지 목록 조회 Hook
 */
export function useMessages(conversationId: string | null) {
  return useQuery<MessagesListResponse, Error>({
    queryKey: messageKeys.list(conversationId || ''),
    queryFn: () => {
      if (!conversationId) {
        // conversationId가 없으면 빈 응답 반환 (에러 throw하지 않음)
        return Promise.resolve({ messages: [], hasMore: false });
      }
      return chatService.getMessages(conversationId);
    },
    enabled: !!conversationId,
    retry: false, // 에러 발생 시 재시도하지 않음
    ...getCacheConfig('chat', 'messages'),
  });
}

/**
 * 메시지 전송 Hook (일반 응답)
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, SendMessageRequest>({
    mutationFn: (data) => chatService.sendMessage(data),
    onSuccess: (response) => {
      // 메시지 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(response.conversationId),
      });
      // 대화 목록 캐시 무효화 (마지막 메시지 업데이트)
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

/**
 * 메시지 스트리밍 Hook (SSE)
 */
export function useSendMessageStream() {
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (data: SendMessageRequest): Promise<SendMessageResponse> => {
      if (isStreaming) {
        throw new Error('Already streaming');
      }

      setIsStreaming(true);
      setStreamingMessage('');

      // 클라이언트 사이드에서만 SSE 사용
      if (typeof window === 'undefined') {
        // SSR 환경에서는 일반 메시지 전송
        return await chatService.sendMessage(data);
      }

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('token');
        
        // SSE 엔드포인트 URL 생성
        const sseUrl = `${baseURL}/chat/stream?conversationId=${data.conversationId || ''}&message=${encodeURIComponent(data.message)}${token ? `&token=${token}` : ''}`;
        
        // EventSource 생성 (SSE 연결)
        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;
        
        let fullContent = '';
        let resolved = false;

        return new Promise<SendMessageResponse>((resolve, reject) => {
          // 타임아웃 설정 (30초)
          const timeout = setTimeout(() => {
            if (!resolved && eventSource.readyState === EventSource.OPEN) {
              eventSource.close();
              setIsStreaming(false);
              setStreamingMessage('');
              resolved = true;
              // 타임아웃 시 에러 반환 (fallback 제거)
              reject(new Error('Request timeout. Please try again.'));
            }
          }, 30000);

          // SSE 메시지 수신
          eventSource.onmessage = (event) => {
            try {
              const parsed = JSON.parse(event.data);
              
              if (parsed.type === 'chunk') {
                // 스트리밍 청크 추가
                fullContent += parsed.content || '';
                setStreamingMessage(fullContent);
              } else if (parsed.type === 'done') {
                // 스트리밍 완료
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeout);
                  eventSource.close();
                  setIsStreaming(false);
                  setStreamingMessage('');
                  
                  // 메시지 목록 캐시 무효화
                  queryClient.invalidateQueries({
                    queryKey: messageKeys.list(data.conversationId || ''),
                  });
                  queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });

                  resolve({
                    conversationId: data.conversationId || parsed.conversationId,
                    message: {
                      id: parsed.messageId || `msg_${Date.now()}`,
                      conversationId: data.conversationId || parsed.conversationId,
                      userId: '',
                      role: 'assistant',
                      content: fullContent,
                      createdAt: new Date().toISOString(),
                    },
                  });
                }
              } else if (parsed.type === 'error') {
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeout);
                  eventSource.close();
                  setIsStreaming(false);
                  setStreamingMessage('');
                  reject(new Error(parsed.error || 'Streaming error'));
                }
              }
            } catch (error) {
              console.error('SSE parsing error:', error);
            }
          };

          // SSE 에러 처리
          eventSource.onerror = (error) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              // 백엔드로 로깅 (경고 레벨)
              if (typeof window !== 'undefined') {
                import('@/lib/utils/backend-logger').then(({ backendLogger }) => {
                  backendLogger.warn('SSE 연결 실패, 일반 메시지 전송으로 대체', {
                    metadata: { error: String(error) },
                  });
                }).catch(() => {
                  // 로거 로드 실패 시 무시
                });
              }
              eventSource.close();
              setIsStreaming(false);
              setStreamingMessage('');
              
              // SSE 연결 실패 시 에러 반환 (fallback 제거)
              // 임시 conversationId 사용 시 DB에 존재하지 않아 추가 에러 발생 가능
              reject(new Error('SSE connection failed. Please try again.'));
            }
          };
          
          // SSE 연결이 열리지 않은 경우 처리
          eventSource.onopen = () => {
            // 연결 성공 시 아무것도 하지 않음 (메시지 수신 대기)
          };
          
          // 타임아웃 처리 (30초)
          setTimeout(() => {
            if (!resolved && eventSource.readyState === EventSource.CONNECTING) {
              eventSource.close();
              setIsStreaming(false);
              setStreamingMessage('');
              resolved = true;
              reject(new Error('Connection timeout. Please try again.'));
            }
          }, 30000);
        });
      } catch (error) {
        setIsStreaming(false);
        setStreamingMessage('');
        throw error;
      }
    },
    [isStreaming, queryClient]
  );

  const stopStreaming = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessage('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return { sendMessage, streamingMessage, isStreaming, stopStreaming };
}

/**
 * 메시지 피드백 토글 Hook
 */
export function useToggleMessageFeedback() {
  const queryClient = useQueryClient();

  return useMutation<
    { feedback: { id: string; type: string; messageId: string }; counts: { likes: number; dislikes: number } },
    Error,
    { messageId: string; type: 'like' | 'dislike' }
  >({
    mutationFn: ({ messageId, type }) => chatService.toggleMessageFeedback(messageId, type),
    onSuccess: () => {
      // 메시지 목록 캐시 무효화 (피드백 카운트 업데이트)
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
  });
}

/**
 * 메시지 피드백 카운트 조회 Hook
 */
export function useMessageFeedbackCounts(messageId: string | null) {
  return useQuery<{ likes: number; dislikes: number }, Error>({
    queryKey: [...messageKeys.all, 'feedback', messageId || ''],
    queryFn: () => {
      if (!messageId) {
        return Promise.resolve({ likes: 0, dislikes: 0 });
      }
      return chatService.getMessageFeedbackCounts(messageId);
    },
    enabled: !!messageId,
    ...getCacheConfig('chat', 'feedback'),
  });
}

/**
 * 사용자 메시지 피드백 조회 Hook
 */
export function useUserMessageFeedback(messageId: string | null) {
  return useQuery<{ id: string; type: string; messageId: string } | null, Error>({
    queryKey: [...messageKeys.all, 'feedback', 'user', messageId || ''],
    queryFn: () => {
      if (!messageId) {
        return Promise.resolve(null);
      }
      return chatService.getUserMessageFeedback(messageId);
    },
    enabled: !!messageId,
    ...getCacheConfig('chat', 'feedback'),
  });
}

/**
 * 메시지 재생성 Hook (SSE 스트리밍)
 */
export function useRegenerateMessage() {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingContent, setRegeneratingContent] = useState<string>('');
  const queryClient = useQueryClient();

  const regenerateMessage = useCallback(async (messageId: string, conversationId: string): Promise<void> => {
    if (isRegenerating) {
      throw new Error('Already regenerating');
    }

    setIsRegenerating(true);
    setRegeneratingContent('');

    try {
      const stream = await chatService.regenerateMessage(messageId);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setRegeneratingContent(fullContent);
              }
              if (data.done) {
                break;
              }
            } catch (e) {
              // JSON 파싱 실패 무시
            }
          }
        }
      }

      // 메시지 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    } catch (error) {
      console.error('Message regeneration failed:', error);
      throw error;
    } finally {
      setIsRegenerating(false);
      setRegeneratingContent('');
    }
  }, [isRegenerating, queryClient]);

  return {
    regenerateMessage,
    isRegenerating,
    regeneratingContent,
  };
}

