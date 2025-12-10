/**
 * NewsList Component
 * 뉴스 목록 컴포넌트
 */

'use client';

import React, { useMemo, useEffect } from 'react';
import { News as APINews } from '@/lib/types/api/news.types';
import { News } from '@/lib/types';
import NewsCard from '@/components/molecules/NewsCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';
import Skeleton from '@/components/atoms/Skeleton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { spacing, borderRadius } from '@/lib/design-tokens';
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';

interface NewsListProps {
  news: APINews[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onNewsClick?: (news: APINews) => void;
  onLoadMore?: () => void;
}

// API News를 컴포넌트 News 타입으로 변환
const convertToNewsCardType = (apiNews: APINews): News => {
  return {
    id: apiNews.id,
    title: apiNews.title,
    content: apiNews.content,
    summary: apiNews.summary,
    url: apiNews.url || '#',
    source: apiNews.source,
    publishedAt: new Date(apiNews.publishedAt),
    thumbnailUrl: apiNews.thumbnailUrl, // 썸네일 URL 추가
    stockIds: apiNews.relatedStocks || [],
    aiAnalysis: apiNews.sentiment
      ? {
          sentiment: apiNews.sentiment,
          keyPoints: apiNews.keyPoints || [],
          relatedConcepts: [],
        }
      : undefined,
  };
};

export const NewsList = React.memo(function NewsList({
  news,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onNewsClick,
  onLoadMore,
}: NewsListProps) {
  const { t } = useLanguage();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const convertedNews = useMemo(() => {
    return news.map(convertToNewsCardType);
  }, [news]);

  // 무한 스크롤 트리거
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, onLoadMore]);
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-6)]`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-[var(--spacing-6)] rounded-[var(--radius-2xl)] border border-gray-100">
            <Skeleton variant="text" width="80%" height={20} className="mb-3" />
            <Skeleton variant="text" width="60%" height={16} className="mb-4" />
            <Skeleton variant="text" width="100%" height={14} className="mb-2" />
            <Skeleton variant="text" width="90%" height={14} />
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={40} strokeWidth={2} className="text-gray-400" />}
        title={t('news.noNews')}
        description={t('common.selectDifferentCategory')}
      />
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-6)]`}>
        {convertedNews.map((item, index) => (
          <NewsCard
            key={item.id}
            news={item}
            onClick={() => onNewsClick?.(news[index])}
          />
        ))}
      </div>
      
      {/* 무한 스크롤 트리거 */}
      {hasNextPage && (
        <div ref={ref} className="py-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-text-tertiary">
              <div className="w-5 h-5 border-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">{t('common.loading')}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
});

