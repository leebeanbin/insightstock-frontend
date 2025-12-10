/**
 * HistoryFilter Component
 * 히스토리 필터 컴포넌트
 */

'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export type HistoryFilterType = string;

interface HistoryFilterProps {
  selectedFilter: HistoryFilterType;
  onFilterChange: (filter: HistoryFilterType) => void;
}

export function HistoryFilter({ selectedFilter, onFilterChange }: HistoryFilterProps) {
  const { t } = useLanguage();
  
  const filters = [
    { key: 'filterAll', value: t('history.filterAll') },
    { key: 'filterView', value: t('history.filterView') },
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border-2 border-gray-100">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap',
            selectedFilter === filter.value
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
          )}
        >
          {filter.value}
        </button>
      ))}
    </div>
  );
}

