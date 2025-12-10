/**
 * NewsFilter Component
 * 뉴스 필터 컴포넌트 - 토스 스타일 탭 필터
 */

'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export type NewsSentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

interface NewsFilterProps {
  sentiment: NewsSentimentFilter;
  onSentimentChange: (sentiment: NewsSentimentFilter) => void;
}

export function NewsFilter({
  sentiment,
  onSentimentChange,
}: NewsFilterProps) {
  const { t } = useLanguage();
  const sentiments: { value: NewsSentimentFilter; label: string }[] = [
    { value: 'all', label: t('news.filterAll') || '전체' },
    { value: 'positive', label: t('news.filterPositive') || '긍정' },
    { value: 'negative', label: t('news.filterNegative') || '부정' },
    { value: 'neutral', label: t('news.filterNeutral') || '중립' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {sentiments.map((item) => {
        const isActive = sentiment === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onSentimentChange(item.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isActive
                ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white shadow-sm'
                : 'bg-[var(--background-card)] dark:bg-gray-800 text-[var(--text-secondary)] dark:text-gray-300 hover:bg-[var(--background-hover)] dark:hover:bg-gray-700 border border-[var(--border-default)] dark:border-gray-700'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

