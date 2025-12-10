/**
 * HistoryList Component
 * 히스토리 목록 컴포넌트
 */

'use client';

import React from 'react';
import { HistoryItem } from './HistoryItem';
import { HistoryItem as HistoryItemType } from '@/lib/types/api/history.types';
import { Clock } from 'lucide-react';
import Card from '@/components/molecules/Card';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface HistoryListProps {
  items: HistoryItemType[];
  onItemClick?: (item: HistoryItemType) => void;
}

export const HistoryList = React.memo(function HistoryList({ items, onItemClick }: HistoryListProps) {
  const { t } = useLanguage();
  
  if (items.length === 0) {
    return (
      <Card variant="default" className="py-16">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Clock size={40} strokeWidth={2} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
            {t('history.noHistory')}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed text-center max-w-xs">
            {t('history.noHistoryDescription')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <HistoryItem
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  );
});

