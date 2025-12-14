/**
 * ChatMessage Component
 * 개별 메시지 컴포넌트 - 마크다운 및 코드 하이라이팅 지원
 */

'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types/api/chat.types';
import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { sizes, spacing, typography, borderRadius } from '@/lib/design-tokens';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Tooltip from '@/components/atoms/Tooltip';
import {
  useToggleMessageFeedback,
  useMessageFeedbackCounts,
  useUserMessageFeedback,
  useRegenerateMessage,
} from '@/lib/hooks/use-chat';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, isStreaming = false, onRegenerate }: ChatMessageProps) {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isDark = resolvedTheme === 'dark';

  // 피드백 관련 hooks
  const { mutate: toggleFeedback, isPending: isTogglingFeedback } = useToggleMessageFeedback();
  const { data: feedbackCounts } = useMessageFeedbackCounts(isAssistant ? message.id : null);
  const { data: userFeedback } = useUserMessageFeedback(isAssistant ? message.id : null);
  const { regenerateMessage, isRegenerating } = useRegenerateMessage();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (isTogglingFeedback) return;
    
    toggleFeedback(
      { messageId: message.id, type },
      {
        onSuccess: () => {
          toast.success(type === 'like' ? t('chat.feedbackLiked') : t('chat.feedbackDisliked'));
        },
        onError: async (error: unknown) => {
          // 공통 에러 핸들러 사용
          const { handleMutationError } = await import('@/lib/utils/error-handler');
          handleMutationError(
            error,
            'Failed to toggle message feedback',
            t('chat.feedbackFailed')
          );
        },
      }
    );
  };

  const handleRegenerate = async () => {
    if (isRegenerating || !message.conversationId) return;
    
    try {
      await regenerateMessage(message.id, message.conversationId);
      toast.success(t('chat.messageRegenerated'));
      onRegenerate?.();
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleError } = await import('@/lib/utils/error-handler');
      handleError(
        error,
        'Failed to regenerate message',
        t('chat.regenerateFailed')
      );
    }
  };

  return (
    <div
      className={cn(
        `flex gap-[var(--spacing-4)] p-[var(--spacing-4)]`,
        isUser ? 'justify-end' : 'justify-start',
        'group'
      )}
    >
      {isAssistant && (
        <div className={`flex-shrink-0 w-[var(--spacing-8)] h-[var(--spacing-8)] rounded-full bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20 flex items-center justify-center`}>
          <Bot size={sizes.icon.px.md} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
        </div>
      )}

      <div
        className={cn(
          `flex flex-col gap-[var(--spacing-2)] max-w-[80%]`,
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'relative rounded-[var(--radius-2xl)] px-[var(--spacing-4)] py-[var(--spacing-3)] text-[var(--font-size-base)] leading-relaxed',
            isUser
              ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white'
              : 'bg-gray-100 dark:bg-background-subtle text-gray-900 dark:text-text-primary'
          )}
        >
          {/* 액션 버튼들 (복사, 피드백, 재생성) */}
          {!isUser && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content={copied ? t('common.copied') : t('common.copy')} position="left">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'p-1.5 rounded-lg',
                    'hover:bg-white/10 dark:hover:bg-black/10',
                    'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  {copied ? (
                    <Check size={sizes.icon.px.sm} className="text-green-600" />
                  ) : (
                    <Copy size={sizes.icon.px.sm} />
                  )}
                </button>
              </Tooltip>

              <Tooltip content={t('chat.regenerate')} position="left">
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className={cn(
                    'p-1.5 rounded-lg',
                    'hover:bg-white/10 dark:hover:bg-black/10',
                    'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <RotateCcw size={sizes.icon.px.sm} className={isRegenerating ? 'animate-spin' : ''} />
                </button>
              </Tooltip>
            </div>
          )}

          {/* 메시지 내용 - 마크다운 렌더링 */}
          {isAssistant ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={isDark ? vscDarkPlus : vs}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={cn('px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-sm', className)} {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className={`inline-block w-[var(--spacing-2)] h-[var(--spacing-4)] ml-[var(--spacing-1)] bg-current animate-pulse`} />
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>

        {/* 출처 표시 (assistant 메시지에만) */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className={`flex flex-wrap gap-[var(--spacing-2)] text-[var(--font-size-xs)] text-gray-500`}>
            {message.sources.map((source, index) => (
              <span
                key={index}
                className={`px-[var(--spacing-2)] py-[var(--spacing-1)] bg-gray-50 rounded-[var(--radius-lg)] border border-gray-200`}
              >
                {source}
              </span>
            ))}
          </div>
        )}

        {/* 피드백 버튼 (assistant 메시지에만) */}
        {isAssistant && (
          <div className="flex items-center gap-2 mt-1">
            <Tooltip content={t('chat.like')} position="top">
              <button
                onClick={() => handleFeedback('like')}
                disabled={isTogglingFeedback}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-xs',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors',
                  userFeedback?.type === 'like' && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ThumbsUp size={sizes.icon.px.xs} className={userFeedback?.type === 'like' ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : ''} />
                {feedbackCounts?.likes || 0}
              </button>
            </Tooltip>

            <Tooltip content={t('chat.dislike')} position="top">
              <button
                onClick={() => handleFeedback('dislike')}
                disabled={isTogglingFeedback}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-xs',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors',
                  userFeedback?.type === 'dislike' && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ThumbsDown size={sizes.icon.px.xs} className={userFeedback?.type === 'dislike' ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : ''} />
                {feedbackCounts?.dislikes || 0}
              </button>
            </Tooltip>
          </div>
        )}

        {/* 시간 표시 */}
        <span className={`text-[var(--font-size-xs)] text-gray-400`}>
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>

      {isUser && (
        <div className={`flex-shrink-0 w-[var(--spacing-8)] h-[var(--spacing-8)] rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
          <User size={sizes.icon.px.md} className="text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
}

