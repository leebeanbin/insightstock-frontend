/**
 * Stock Detail Page
 * 종목 상세 페이지
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStockByCode, useStockPrices } from '@/lib/hooks/use-stocks';
import { StockDetail as StockDetailType } from '@/lib/types/api/stock.types';
import { Stock } from '@/lib/types';
import { PageLayout } from '@/components/common/PageLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { StockDetail as StockDetailComponent } from '@/components/stocks/StockDetail';
import { StockChart } from '@/components/stocks/StockChart';
import { StockNews } from '@/components/stocks/StockNews';
import { trackView } from '@/lib/utils/trackView';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/atoms/Button';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stockCode = params.code as string;

  // 종목 상세 조회
  const { data: stockData, isLoading, error } = useStockByCode(stockCode);

  // 차트 데이터 조회 (기본 1개월)
  const stockId: string | null = stockData?.id || null;
  const { data: pricesData, isLoading: isPricesLoading } = useStockPrices(
    stockId,
    {
      period: '1m',
      interval: '1d',
    }
  );

  // 히스토리 자동 기록
  useEffect(() => {
    if (stockId) {
      trackView({ stockId });
    }
  }, [stockId]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <LoadingState message="종목 정보를 불러오는 중..." />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <ErrorState
            message={error.message}
            onRetry={() => router.refresh()}
          />
        </div>
      </PageLayout>
    );
  }

  if (!stockData) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <ErrorState
            title="종목을 찾을 수 없습니다"
            message="요청한 종목이 존재하지 않습니다."
            onRetry={() => router.push('/dashboard')}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => router.back()}
        >
          목록으로
        </Button>

        {/* Stock Detail */}
        <StockDetailComponent stock={stockData} />

        {/* Chart */}
        <StockChart
          stockId={stockId || ''}
          prices={pricesData?.prices}
          isPositive={((stockData as unknown as Stock)?.changePercent ?? 0) >= 0}
          isLoading={isPricesLoading}
        />

        {/* Related News */}
        <StockNews stockId={stockId || ''} />
      </div>
    </PageLayout>
  );
}

