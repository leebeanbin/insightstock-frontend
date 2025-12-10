/**
 * ConversationList Component
 * 대화 목록 사이드바 컴포넌트
 */

'use client';

import { useState, useEffect } from 'react';
import { useInfiniteConversations } from '@/lib/hooks/use-infinite-conversations';
import { useDeleteConversation } from '@/lib/hooks/use-conversations';
import { ConversationListItem, ConversationsListResponse } from '@/lib/types/api/chat.types';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { spacing, typography, borderRadius, sizes } from '@/lib/design-tokens';
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export function ConversationList({
  selectedId,
  onSelect,
  onCreateNew,
}: ConversationListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteConversations({
    limit: 20,
    search: searchQuery || undefined,
  });
  const deleteMutation = useDeleteConversation();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // 모든 페이지의 대화를 하나의 배열로 합치기
  const allConversations = data?.pages
    ? (data.pages as ConversationsListResponse[]).flatMap((page) => page.conversations)
    : [];

  // 무한 스크롤 트리거
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = async (
    e: React.MouseEvent,
    conversationId: string
  ) => {
    e.stopPropagation();

    if (!confirm(t('chat.deleteConfirm'))) return;

    try {
      await deleteMutation.mutateAsync(conversationId);
      toast.success(t('chat.deleteSuccess'));

      // 선택된 대화가 삭제된 경우 선택 해제
      if (selectedId === conversationId) {
        onSelect('');
      }
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleMutationError } = await import('@/lib/utils/error-handler');
      handleMutationError(
        error,
        'Failed to delete conversation',
        t('chat.deleteFailed')
      );
    }
  };

  if (error) {
    return (
      <div className={`p-[var(--spacing-4)] text-center text-[var(--font-size-sm)] text-gray-500`}>
        {t('common.error')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-subtle dark:bg-background-subtle">
      {/* 헤더 */}
      <div className={`p-[var(--spacing-4)] border-b border-border-default space-y-[var(--spacing-3)]`}>
        <button
          onClick={onCreateNew}
          className={`w-full px-[var(--spacing-4)] py-[var(--spacing-3)] bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white rounded-[var(--radius-xl)] font-semibold hover:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)] transition-colors flex items-center justify-center gap-[var(--spacing-2)]`}
        >
          <MessageSquare size={sizes.icon.px.lg} />
          {t('chat.newConversation')}
        </button>

        {/* 검색 입력 */}
        <div className="relative">
          <Search
            size={sizes.icon.px.sm}
            className="absolute left-[var(--spacing-3)] top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className={cn(
              'w-full pl-[var(--spacing-10)] pr-[var(--spacing-10)] py-[var(--spacing-2_5)]',
              'bg-background-card border border-border-default rounded-[var(--radius-lg)]',
              'text-[var(--font-size-sm)] text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)] dark:focus:ring-[var(--brand-purple)]',
              'placeholder:text-text-tertiary'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-[var(--spacing-3)] top-1/2 -translate-y-1/2 p-1 hover:bg-background-hover rounded"
            >
              <X size={sizes.icon.px.sm} className="text-text-tertiary" />
            </button>
          )}
        </div>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className={`p-[var(--spacing-4)] text-center`}>
            <div className={`w-[var(--spacing-6)] h-[var(--spacing-6)] border-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-[var(--spacing-2)]`} />
            <p className={`text-[var(--font-size-xs)] text-gray-500`}>{t('common.loading')}</p>
          </div>
        ) : allConversations.length === 0 ? (
          <div className={`p-[var(--spacing-4)] text-center text-[var(--font-size-sm)] text-gray-500`}>
            {t('chat.noConversations')}
            <br />
            {t('chat.startNewConversation')}
          </div>
        ) : (
          <>
            <div className="divide-y divide-border-default">
              {allConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedId === conversation.id}
                  onSelect={() => onSelect(conversation.id)}
                  onDelete={(e) => handleDelete(e, conversation.id)}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
            {/* 무한 스크롤 트리거 */}
            {hasNextPage && (
              <div ref={ref} className="py-4 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-text-tertiary">
                    <div className="w-4 h-4 border-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">{t('common.loading')}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: ConversationItemProps) {
  const { t } = useLanguage();
  return (
    <div
      onClick={onSelect}
      className={cn(
        `p-[var(--spacing-4)] cursor-pointer transition-all duration-200 hover:bg-background-hover group relative`,
        isSelected && 'bg-[var(--brand-light-purple)]/10 dark:bg-[var(--brand-purple)]/20 border-l-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)]'
      )}
    >
      <div className={`flex items-start justify-between gap-[var(--spacing-2)]`}>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              `text-[var(--font-size-sm)] font-semibold mb-[var(--spacing-1)] truncate`,
              isSelected ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : 'text-text-primary'
            )}
          >
            {conversation.title || t('chat.untitled')}
          </h3>
          <p className={`text-[var(--font-size-xs)] text-text-tertiary line-clamp-2 mb-[var(--spacing-1)]`}>
            {conversation.lastMessage || t('chat.noMessages')}
          </p>
          <p className={`text-[var(--font-size-xs)] text-text-tertiary/70`}>
            {formatRelativeTime(conversation.updatedAt)}
          </p>
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={cn(
            `opacity-0 group-hover:opacity-100 transition-opacity p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]`,
            'hover:bg-semantic-red/10 text-text-tertiary hover:text-semantic-red',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Trash2 size={sizes.icon.px.sm} />
        </button>
      </div>
    </div>
  );
}

