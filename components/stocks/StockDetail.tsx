/**
 * StockDetail Component
 * 종목 상세 정보 컴포넌트
 */

'use client';

import { StockDetail as StockDetailType } from '@/lib/types/api/stock.types';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange, formatVolume, formatMarketCap, getChangeColorClass } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/molecules/Card';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface StockDetailProps {
  stock: StockDetailType;
}

export function StockDetail({ stock }: StockDetailProps) {
  const { t } = useLanguage();
  const stockData = stock as unknown as Stock & { changePercent?: number; changeRate?: number };
  const changePercent = stockData.changePercent ?? stockData.changeRate ?? 0;
  const isPositive = changePercent >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <Card variant="default" className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{stockData.name}</h1>
              <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded font-medium">
                {stockData.code}
              </span>
              <Badge variant={isPositive ? 'error' : 'default'} dot>
                {isPositive ? t('stock.rising') : t('stock.falling')}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{stockData.market}</span>
              {stockData.sector && (
                <>
                  <span>·</span>
                  <span>{stockData.sector}</span>
                </>
              )}
            </div>
          </div>
          <FavoriteButton stockId={stockData.id} size="large" />
        </div>

        {/* Price Info */}
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-4xl font-bold text-gray-900 number">
            {formatPrice(stockData.currentPrice)}
          </span>
          <div className="flex items-center gap-2">
            <TrendIcon size={24} strokeWidth={2.5} className={isPositive ? 'text-semantic-red' : 'text-semantic-blue'} />
            <span className={cn('text-2xl font-bold number', getChangeColorClass(changePercent))}>
              {formatChange(changePercent)}
            </span>
            <span className={cn('text-lg font-semibold number', getChangeColorClass(stockData.change))}>
              {formatPrice(stockData.change)}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('stock.volume')}</p>
            <p className="text-sm font-semibold text-gray-900 number">
              {formatVolume(stockData.volume)}
            </p>
          </div>
          {stockData.marketCap && (
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('stock.marketCap')}</p>
              <p className="text-sm font-semibold text-gray-900 number">
                {formatMarketCap(stockData.marketCap)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('stock.high')}</p>
            <p className="text-sm font-semibold text-gray-900 number">
              {formatPrice(stockData.currentPrice * 1.05)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('stock.low')}</p>
            <p className="text-sm font-semibold text-gray-900 number">
              {formatPrice(stockData.currentPrice * 0.95)}
            </p>
          </div>
        </div>
      </Card>

      {/* Description */}
      {(stock as StockDetailType).description && (
        <Card variant="default" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('stock.companyOverview')}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{(stock as StockDetailType).description}</p>
        </Card>
      )}
    </div>
  );
}

