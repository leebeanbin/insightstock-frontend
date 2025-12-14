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
      <div className={`p-[var(--spacing-4)] text-center text-sm text-gray-500 dark:text-gray-400`}>
        {t('common.error')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <div className={`p-[var(--spacing-4)] border-b border-[var(--border-default)] space-y-[var(--spacing-3)]`}>
        <button
          onClick={onCreateNew}
          className={cn(
            'w-full px-[var(--spacing-4)] py-[var(--spacing-3)] rounded-xl font-semibold',
            'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white',
            'hover:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)]',
            'hover:shadow-md active:shadow-sm',
            'hover:scale-[0.98] active:scale-[0.96]',
            'transition-all duration-200',
            'flex items-center justify-center gap-[var(--spacing-2)]'
          )}
        >
          <MessageSquare size={sizes.icon.px.lg} />
          {t('chat.newConversation')}
        </button>

        {/* 검색 입력 */}
        <div className="relative">
          <Search
            size={sizes.icon.px.sm}
            className="absolute left-[var(--spacing-3)] top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className={cn(
              'w-full pl-[var(--spacing-10)] pr-[var(--spacing-10)] py-[var(--spacing-2_5)]',
              'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
              'text-sm text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)]/20 dark:focus:ring-[var(--brand-purple)]/20',
              'focus:border-[var(--brand-main)] dark:focus:border-[var(--brand-purple)]',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'transition-all duration-200'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-[var(--spacing-3)] top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X size={sizes.icon.px.sm} className="text-gray-400 dark:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className={`p-[var(--spacing-4)] text-center`}>
            <div className={`w-[var(--spacing-6)] h-[var(--spacing-6)] border-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-[var(--spacing-2)]`} />
            <p className={`text-xs text-gray-500 dark:text-gray-400`}>{t('common.loading')}</p>
          </div>
        ) : allConversations.length === 0 ? (
          <div className={`p-[var(--spacing-4)] text-center text-sm text-gray-500 dark:text-gray-400`}>
            {t('chat.noConversations')}
            <br />
            {t('chat.startNewConversation')}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
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
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
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
        `p-[var(--spacing-4)] cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 group relative`,
        isSelected && 'bg-[var(--brand-light-purple)]/10 dark:bg-[var(--brand-purple)]/15 border-l-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)]'
      )}
    >
      <div className={`flex items-start justify-between gap-[var(--spacing-2)]`}>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              `text-sm font-semibold mb-1 truncate`,
              isSelected ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {conversation.title || t('chat.untitled')}
          </h3>
          <p className={`text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1`}>
            {conversation.lastMessage || t('chat.noMessages')}
          </p>
          <p className={`text-xs text-gray-400 dark:text-gray-500`}>
            {formatRelativeTime(conversation.updatedAt)}
          </p>
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={cn(
            `opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg`,
            'hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Trash2 size={sizes.icon.px.sm} />
        </button>
      </div>
    </div>
  );
}

