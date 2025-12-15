/**
 * Chat Repository
 * AI 챗봇 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import {
  Conversation,
  ConversationListItem,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  ConversationsListResponse,
  MessagesListResponse,
} from '../types/api/chat.types';

export class ChatRepository extends BaseRepository<Conversation> {
  protected basePath = '/chat';

  /**
   * 대화 생성
   */
  async createConversation(
    data: CreateConversationRequest
  ): Promise<Conversation> {
    // Fallback 제거: 실제 API 호출만 사용
    // 임시 ID 생성은 DB에 존재하지 않아 404 에러를 유발함
    return await this.post<Conversation>('/conversations', data);
  }

  /**
   * 대화 목록 조회
   */
  async getConversations(
    params?: { limit?: number; offset?: number; search?: string; category?: string }
  ): Promise<ConversationsListResponse> {
    try {
      // 백엔드 ConversationResponseDto 타입
      type BackendConversation = {
        id: string;
        title: string;
        lastMessage: string;
        category?: string;
        tags: string[];
        createdAt: string;
        updatedAt: string;
      };

      const backendConversations = await this.get<BackendConversation[]>('/conversations', params);

      // 백엔드 DTO를 프론트엔드 타입으로 변환
      const conversations: ConversationListItem[] = (backendConversations || []).map(c => ({
        id: c.id,
        title: c.title,
        lastMessage: c.lastMessage || '',
        updatedAt: c.updatedAt,
      }));

      return {
        conversations,
        total: conversations.length,
      };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 대화 삭제
   */
  async deleteConversation(id: string): Promise<{ message: string }> {
    try {
      return await this.delete<{ message: string }>(`/conversations/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { message: 'Conversation deleted successfully' };
    }
  }

  /**
   * 메시지 전송 (일반) - 실제로는 SSE 스트리밍 사용 권장
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // POST /chat/stream을 사용해서 메시지 전송
      // 백엔드는 SSE 스트리밍으로만 응답하므로 일반 POST는 지원하지 않음
      // 대신 streamChat hook을 사용하도록 유도
      throw new Error('Use SSE streaming (useSendMessageStream hook) instead');
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Fallback 제거: 에러를 그대로 전파하여 호출자가 처리하도록 함
      throw error;
    }
  }

  /**
   * 대화 내역 조회
   */
  async getMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessagesListResponse> {
    try {
      // 백엔드 ChatResponseDto 타입
      type BackendChatResponse = {
        conversationId: string;
        message: {
          id: string;
          role: 'user' | 'assistant';
          content: string;
          sources: string[];
          createdAt: string;
        };
      };

      const backendMessages = await this.get<BackendChatResponse[]>(
        `/conversations/${conversationId}/messages`,
        params,
        { validateStatus: (status) => status === 200 || status === 404 }
      );

      // 404 응답이거나 데이터가 없는 경우 빈 배열 반환
      if (!backendMessages || !Array.isArray(backendMessages)) {
        return { messages: [], hasMore: false };
      }

      // 백엔드 DTO를 프론트엔드 Message 타입으로 변환
      const messages: Message[] = backendMessages.map(m => ({
        id: m.message.id,
        conversationId: m.conversationId,
        userId: '', // 백엔드가 제공하지 않으므로 빈 문자열
        role: m.message.role,
        content: m.message.content,
        createdAt: m.message.createdAt,
        sources: m.message.sources.length > 0 ? m.message.sources : undefined,
      }));

      return {
        messages,
        hasMore: false,
      };
    } catch (error: any) {
      // 404는 새 대화라서 메시지가 없는 경우 (정상)
      if (error?.response?.status === 404) {
        return { messages: [], hasMore: false };
      }
      console.error('API 호출 실패:', error);
      return { messages: [], hasMore: false }; // 에러 시에도 빈 배열 반환
    }
  }

  /**
   * 메시지 피드백 토글 (좋아요/싫어요)
   */
  async toggleMessageFeedback(
    messageId: string,
    type: 'like' | 'dislike'
  ): Promise<{ feedback: { id: string; type: string; messageId: string }; counts: { likes: number; dislikes: number } }> {
    try {
      return await this.post(`/messages/${messageId}/feedback`, { type });
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 메시지 피드백 카운트 조회
   */
  async getMessageFeedbackCounts(messageId: string): Promise<{ likes: number; dislikes: number }> {
    try {
      return await this.get(`/messages/${messageId}/feedback`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { likes: 0, dislikes: 0 };
    }
  }

  /**
   * 사용자 메시지 피드백 조회
   */
  async getUserMessageFeedback(messageId: string): Promise<{ id: string; type: string; messageId: string } | null> {
    try {
      return await this.get(`/messages/${messageId}/feedback/user`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return null;
    }
  }

  /**
   * 메시지 재생성 (SSE 스트리밍)
   */
  async regenerateMessage(messageId: string): Promise<ReadableStream<Uint8Array>> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${baseURL}/chat/messages/${messageId}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate message');
      }

      return response.body!;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }
}

