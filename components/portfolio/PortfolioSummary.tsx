/**
 * PortfolioSummary Component
 * 포트폴리오 요약 카드 컴포넌트
 */

'use client';

import React, { useMemo } from 'react';
import Card from '@/components/molecules/Card';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PortfolioSummary as PortfolioSummaryType, PortfolioItem } from '@/lib/types/api/portfolio.types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  portfolios: PortfolioItem[];
}

export const PortfolioSummary = React.memo(function PortfolioSummary({ summary, portfolios }: PortfolioSummaryProps) {
  const { totalCost, currentValue, totalProfit, totalProfitRate } = summary;
  const { t } = useLanguage();

  const totalShares = useMemo(() => {
    return portfolios.reduce((sum, p) => sum + p.quantity, 0);
  }, [portfolios]);

  return (
    <Card variant="default">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">{t('portfolio.totalValue')}</p>
          <p className="text-2xl font-bold text-gray-900 number">
            {formatPrice(currentValue)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('portfolio.purchaseAmount')}: {formatPrice(totalCost)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">{t('portfolio.totalReturn')}</p>
          <div className="flex items-baseline gap-1.5">
            {totalProfitRate >= 0 ? (
              <TrendingUp size={16} strokeWidth={2} className="text-semantic-red" />
            ) : (
              <TrendingDown size={16} strokeWidth={2} className="text-semantic-blue" />
            )}
            <p className={cn('text-2xl font-bold number', getChangeColorClass(totalProfitRate))}>
              {formatChange(totalProfitRate)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-0.5 number">
            {formatPrice(totalProfit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">{t('portfolio.holdings')}</p>
          <p className="text-2xl font-bold text-gray-900 number">
            {portfolios.length}{t('common.count')}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('common.total')} {totalShares.toLocaleString()}{t('common.unit')}
          </p>
        </div>
      </div>
    </Card>
  );
});

