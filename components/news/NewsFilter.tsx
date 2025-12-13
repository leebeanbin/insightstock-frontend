/**
 * NewsFilter Component
 * 뉴스 필터 컴포넌트 - 토스 스타일 탭 필터
 */

'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { FileCheck } from 'lucide-react';

export type NewsSentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

interface NewsFilterProps {
  sentiment: NewsSentimentFilter;
  onSentimentChange: (sentiment: NewsSentimentFilter) => void;
  showNotesOnly?: boolean;
  onShowNotesOnlyChange?: (show: boolean) => void;
  notesCount?: number;
}

export function NewsFilter({
  sentiment,
  onSentimentChange,
  showNotesOnly = false,
  onShowNotesOnlyChange,
  notesCount = 0,
}: NewsFilterProps) {
  const { t } = useLanguage();
  const sentiments: { value: NewsSentimentFilter; label: string }[] = [
    { value: 'all', label: t('news.filterAll') || '전체' },
    { value: 'positive', label: t('news.filterPositive') || '긍정' },
    { value: 'negative', label: t('news.filterNegative') || '부정' },
    { value: 'neutral', label: t('news.filterNeutral') || '중립' },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* 감정 필터 */}
      <div className="flex items-center gap-2">
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
                  ? 'bg-[#4E56C0] dark:bg-[#9b5DE0] text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 구분선 */}
      {onShowNotesOnlyChange && (
        <>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* 노트한 기사만 필터 */}
          <button
            onClick={() => onShowNotesOnlyChange(!showNotesOnly)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              showNotesOnly
                ? 'bg-[#4E56C0] dark:bg-[#9b5DE0] text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            )}
          >
            <FileCheck size={16} />
            노트한 기사만
            {notesCount > 0 && (
              <span className={cn(
                'ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold',
                showNotesOnly
                  ? 'bg-white/20'
                  : 'bg-[#4E56C0]/10 dark:bg-[#9b5DE0]/10 text-[#4E56C0] dark:text-[#9b5DE0]'
              )}>
                {notesCount}
              </span>
            )}
          </button>
        </>
      )}
    </div>
  );
}

