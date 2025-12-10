/**
 * ChatInterface Component
 * 메인 채팅 인터페이스 컴포넌트
 * SSE 스트리밍 지원, 자동 스크롤, 무한 스크롤
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useMessages, useSendMessageStream, useRegenerateMessage } from '@/lib/hooks/use-chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Message, MessagesListResponse } from '@/lib/types/api/chat.types';
import { toast } from 'sonner';
import { useChatbotConsentStatus, useSetChatbotConsent, useSuggestedQuestions } from '@/lib/hooks/use-chatbot-consent';
import { useQueryClient } from '@tanstack/react-query';
import { messageKeys } from '@/lib/hooks/use-chat';
import Button from '../atoms/Button';
import { Link2, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes } from '@/lib/design-tokens';

interface ChatInterfaceProps {
  conversationId: string | null;
  onCreateNew?: () => void;
}

export function ChatInterface({ conversationId, onCreateNew }: ChatInterfaceProps) {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // 메시지 목록 조회 (conversationId가 없어도 빈 응답 반환)
  const { data: messagesData, isLoading, error, refetch } = useMessages(conversationId);
  const { sendMessage, isStreaming, streamingMessage } = useSendMessageStream();
  const queryClient = useQueryClient();

  // 정보 연결 동의 상태
  const { data: consentStatus } = useChatbotConsentStatus();
  const { mutate: setConsent, isPending: isSettingConsent } = useSetChatbotConsent();
  const { data: suggestedQuestions } = useSuggestedQuestions();

  // 동의 상태 확인 및 배너 표시
  useEffect(() => {
    if (consentStatus && !consentStatus.enabled && localMessages.length === 0) {
      setShowConsentBanner(true);
    } else {
      setShowConsentBanner(false);
    }
  }, [consentStatus, localMessages.length]);

  const handleConsent = (enabled: boolean) => {
    setConsent(enabled, {
      onSuccess: () => {
        setShowConsentBanner(false);
        toast.success(enabled ? t('chat.consentEnabled') : t('chat.consentDisabled'));
      },
      onError: async (error: unknown) => {
        // 공통 에러 핸들러 사용
        const { handleMutationError } = await import('@/lib/utils/error-handler');
        handleMutationError(
          error,
          'Failed to set chatbot consent',
          t('chat.consentFailed')
        );
      },
    });
  };

  // 서버 메시지와 로컬 메시지 병합
  useEffect(() => {
    if (messagesData) {
      const data = messagesData as unknown as MessagesListResponse;
      if (data && data.messages && Array.isArray(data.messages)) {
        setLocalMessages(data.messages);
      }
    } else if (!conversationId) {
      // conversationId가 없으면 빈 메시지 배열 유지
      setLocalMessages([]);
    }
  }, [messagesData, conversationId]);

  // 자동 스크롤 (새 메시지 추가 시)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, streamingMessage]);

  // 메시지 전송
  const handleSend = async (content: string) => {
    if (!content.trim() || isStreaming || !conversationId) return;

    // 사용자 메시지 즉시 추가
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      userId: '', // 실제로는 인증에서 가져옴
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);

    try {
      // 스트리밍 메시지 전송
      const response = await sendMessage({
        conversationId,
        message: content,
      });

      // 응답 메시지 추가
      if (response?.message) {
        setLocalMessages((prev) => {
          // 임시 사용자 메시지 제거하고 실제 메시지로 교체
          const filtered = prev.filter((msg) => msg.id !== userMessage.id);
          return [...filtered, userMessage, response.message];
        });
      }
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleError } = await import('@/lib/utils/error-handler');
      handleError(
        error,
        'Failed to send message',
        t('chat.error.sendFailed'),
        { showToast: true }
      );
      // 사용자 메시지 제거 (실패 시)
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  // 에러가 발생해도 기본 UI는 표시 (에러는 무시하고 빈 상태로 표시)
  // conversationId가 없거나 에러가 발생하면 빈 상태 UI 표시
  if (!conversationId || error) {
    return (
      <div className="flex flex-col h-full bg-background-card dark:bg-background-card relative">
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20'
              )}>
                <MessageSquare size={sizes.icon.px.xl} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-2">
                {t('chat.startConversation')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-text-tertiary mb-6">
                {t('chat.startConversationDesc')}
              </p>

              {/* 새 대화 시작 버튼 */}
              {onCreateNew && (
                <button
                  onClick={onCreateNew}
                  className={cn(
                    'px-6 py-3 mb-6',
                    'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
                    'text-white rounded-xl',
                    'font-semibold',
                    'hover:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)]',
                    'transition-colors'
                  )}
                >
                  {t('chat.startNew')}
                </button>
              )}

              {/* 추천 질문 */}
              {suggestedQuestions && Array.isArray(suggestedQuestions) && suggestedQuestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-text-tertiary mb-3">{t('chat.suggested')}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onCreateNew) {
                            onCreateNew();
                          } else {
                            toast.info(t('chat.clickStartNewToBegin'));
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-background-subtle hover:bg-background-hover text-text-secondary dark:text-text-tertiary hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)] rounded-lg border border-border-default hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)] transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 입력 영역 - 비활성화 */}
        <div className="border-t border-border-default p-4 bg-background-card shrink-0">
          <div className={cn(
            'px-4 py-3',
            'bg-background-subtle rounded-xl',
            'border border-border-default',
            'text-sm text-text-tertiary',
            'flex items-center justify-center'
          )}>
            {onCreateNew ? t('chat.clickStartNewToBegin') : t('chat.clickStartNewToBegin')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-card dark:bg-background-card relative">
      {/* 정보 연결 동의 배너 */}
      {showConsentBanner && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-background-subtle to-background-hover border-b border-[var(--brand-light-purple)]/30 dark:border-[var(--brand-purple)]/30 px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Link2 size={sizes.icon.px.lg} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('chat.consentTitle')}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {t('chat.consentDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleConsent(true)}
                    disabled={isSettingConsent}
                    className="bg-[var(--brand-main)] hover:bg-[var(--brand-purple)] dark:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)]"
                  >
                    {t('chat.enableConsent')}
                  </Button>
              <button
                onClick={() => setShowConsentBanner(false)}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                title={t('aria.close')}
              >
                <X size={sizes.icon.px.md} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className={cn(
        "flex-1 overflow-y-auto px-4 py-6 space-y-2",
        showConsentBanner && "pt-20"
      )}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-text-tertiary">{t('chat.messageLoading')}</p>
            </div>
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {t('chat.startConversation')}
              </h3>
              <p className="text-sm text-text-tertiary mb-6">
                {t('chat.startConversationDesc')}
              </p>

              {/* 추천 질문 */}
              {suggestedQuestions && Array.isArray(suggestedQuestions) && suggestedQuestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-text-tertiary mb-3">{t('chat.suggested')}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSend(question)}
                        className="px-3 py-1.5 text-sm bg-background-subtle hover:bg-background-hover text-text-secondary dark:text-text-tertiary hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)] rounded-lg border border-border-default hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)] transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {localMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={false}
                onRegenerate={() => {
                  // 메시지 목록 새로고침
                  if (conversationId) {
                    queryClient.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
                    refetch();
                  }
                }}
              />
            ))}
            {isStreaming && streamingMessage && (
              <ChatMessage
                message={{
                  id: 'streaming',
                  conversationId: conversationId || '',
                  userId: '',
                  role: 'assistant',
                  content: streamingMessage,
                  createdAt: new Date().toISOString(),
                }}
                isStreaming={true}
                onRegenerate={() => {
                  if (conversationId) {
                    queryClient.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
                    refetch();
                  }
                }}
              />
            )}
            {isStreaming && !streamingMessage && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming || isLoading}
        placeholder={t('chat.messagePlaceholder')}
      />
    </div>
  );
}

