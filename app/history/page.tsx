'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHistory } from '@/lib/hooks/use-history';
import { PageLayout } from '@/components/common/PageLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { HistoryFilter, HistoryFilterType } from '@/components/history/HistoryFilter';
import { HistoryList } from '@/components/history/HistoryList';
import { trackView } from '@/lib/utils/trackView';
import { HistoryItem as HistoryItemType } from '@/lib/types/api/history.types';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function HistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilterType>(t('history.filterAll') as HistoryFilterType);

  // 히스토리 데이터 조회
  const { data, isLoading, error } = useHistory({ limit: 50 });

  // 필터링된 히스토리
  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];

    if (selectedFilter === t('history.filterAll')) {
      return data.history;
    }

    // 타입별 필터링
    if (selectedFilter === t('history.filterView')) {
      return data.history.filter((item) => item.type === 'view');
    }

    return data.history;
  }, [data, selectedFilter, t]);

  const handleItemClick = (item: HistoryItemType) => {
    // 종목 상세 페이지로 이동
    if (item.stock?.code) {
      router.push(`/stocks/${item.stock.code}`);
    } else if (item.newsId) {
      router.push(`/news/${item.newsId}`);
    }
    // noteId, conceptId는 추후 구현
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-8">
          <LoadingState message={t('history.loading')} />
        </div>
      </PageLayout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-8">
          <ErrorState
            message={error.message}
            onRetry={() => router.refresh()}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('history.title')}</h1>
          <p className="text-base text-gray-600 mt-1">
            {t('history.subtitle')}
          </p>
            </div>

            {/* Filters */}
        <HistoryFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

            {/* History List */}
        <HistoryList items={filteredHistory} onItemClick={handleItemClick} />
      </div>
    </PageLayout>
  );
}

