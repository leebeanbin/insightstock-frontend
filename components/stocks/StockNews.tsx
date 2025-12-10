/**
 * StockNews Component
 * 종목 관련 뉴스 컴포넌트
 */

'use client';

import { useNewsByStock } from '@/lib/hooks/use-news';
import { NewsList } from '@/components/news/NewsList';
import Card from '@/components/molecules/Card';
import { LoadingState } from '@/components/common/LoadingState';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface StockNewsProps {
  stockId: string;
  limit?: number;
}

export function StockNews({ stockId, limit = 6 }: StockNewsProps) {
  const { t } = useLanguage();
  const { data, isLoading, error } = useNewsByStock(stockId, { limit });

  if (error) {
    return (
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('stock.relatedNews')}</h3>
        <p className="text-sm text-gray-500">{t('stock.newsLoadError')}</p>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('stock.relatedNews')}</h3>
      {isLoading ? (
        <LoadingState message={t('stock.newsLoading')} size="small" />
      ) : (
        <NewsList news={data?.news || []} isLoading={false} />
      )}
    </div>
  );
}

