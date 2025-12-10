/**
 * StockChart Component
 * 종목 차트 컴포넌트 (재사용 가능한 래퍼)
 */

'use client';

import { useState, useEffect } from 'react';
import { useStockPrices } from '@/lib/hooks/use-stocks';
import Card from '@/components/molecules/Card';
import StockChartBase, { generateChartData } from '@/components/molecules/StockChart';
import { StockPriceData } from '@/lib/types/api/stock.types';
import { ChartData } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface StockChartProps {
  stockId: string;
  prices?: StockPriceData[];
  isPositive: boolean;
  isLoading?: boolean;
}

export function StockChart({ stockId, prices: initialPrices, isPositive, isLoading: initialIsLoading = false }: StockChartProps) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  
  // period 변경 시 API 재호출
  const { data: pricesData, isLoading: isPricesLoading } = useStockPrices(
    stockId,
    {
      period: period === '1m' ? '1m' : period === '3m' ? '3m' : period === '6m' ? '6m' : '1y',
      interval: '1d',
    }
  );
  
  // API 데이터 우선 사용, 없으면 initialPrices 사용
  const prices = pricesData?.prices || initialPrices;
  const isLoading = isPricesLoading || initialIsLoading;

  // API 데이터를 ChartData 형식으로 변환
  const chartData: ChartData[] = prices
    ? prices.map((price) => ({
        time: new Date(price.date).toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
        }),
        value: price.close, // 하위 호환성
        volume: price.volume,
        // OHLC 데이터 (캔들스틱 차트용)
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
      }))
    : [];

  return (
    <Card variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('stock.priceChart')}</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {(['1m', '3m', '6m', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                period === p
                  ? 'bg-white text-primary-600 shadow-sm ring-1 ring-primary-200'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
              )}
            >
              {p === '1m' ? t('stock.oneMonth') : p === '3m' ? t('stock.threeMonths') : p === '6m' ? t('stock.sixMonths') : t('stock.oneYear')}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[450px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw size={32} className="animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-base font-medium text-gray-400">{t('stock.chartLoading')}</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <StockChartBase data={chartData} isPositive={isPositive} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-base font-medium text-gray-400">{t('stock.noChartData')}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

