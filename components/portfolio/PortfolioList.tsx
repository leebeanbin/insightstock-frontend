/**
 * PortfolioList Component
 * 포트폴리오 보유 종목 목록 테이블 컴포넌트
 */

'use client';

import React from 'react';
import Card from '@/components/molecules/Card';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { TrendingUp, TrendingDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { PortfolioItem } from '@/lib/types/api/portfolio.types';
import { cn } from '@/lib/utils';
import Button from '@/components/atoms/Button';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, spacing, typography, borderRadius } from '@/lib/design-tokens';

interface PortfolioListProps {
  portfolios: PortfolioItem[];
  currentValue: number;
  sortBy: 'profit' | 'profitRate' | 'currentValue';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'profit' | 'profitRate' | 'currentValue') => void;
  onSortOrderChange: () => void;
  onEdit: (portfolio: PortfolioItem) => void;
  onDelete: (id: string, stockName: string) => void;
  isDeleting: boolean;
}

export const PortfolioList = React.memo(function PortfolioList({
  portfolios,
  currentValue,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  onEdit,
  onDelete,
  isDeleting,
}: PortfolioListProps) {
  const { t } = useLanguage();

  const calculateWeight = (value: number) => {
    if (currentValue === 0) return 0;
    return (value / currentValue) * 100;
  };

  return (
    <Card variant="default">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">{t('portfolio.holdings')}</h3>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'profit' | 'profitRate' | 'currentValue')}
            className={`text-[var(--font-size-sm)] border-2 border-gray-200 rounded-[var(--radius-lg)] px-[var(--spacing-3)] py-[var(--spacing-1_5)] focus:outline-none focus:ring-2 focus:ring-primary-600`}
          >
            <option value="currentValue">{t('portfolio.sortByValue')}</option>
            <option value="profit">{t('portfolio.sortByProfit')}</option>
            <option value="profitRate">{t('portfolio.sortByReturn')}</option>
          </select>
          <button
            onClick={onSortOrderChange}
            className={`p-[var(--spacing-1_5)] rounded-[var(--radius-lg)] hover:bg-gray-100 transition-colors`}
            aria-label={t('aria.sortOrder')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      {portfolios.length === 0 ? (
        <div className={`py-[var(--spacing-12)] text-center`}>
          <p className={`text-[var(--font-size-sm)] font-medium text-gray-900 mb-[var(--spacing-1)]`}>
            {t('portfolio.noPortfolio')}
          </p>
          <p className={`text-[var(--font-size-xs)] text-gray-500 mb-[var(--spacing-4)]`}>
            {t('portfolio.noPortfolioDescription')}
          </p>
          <Button
            icon={Plus}
            onClick={() => {
              toast.info(t('portfolio.addStock'));
            }}
          >
            {t('portfolio.addStock')}
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className={`text-left py-[var(--spacing-2)] px-[var(--spacing-3)] text-[var(--font-size-xs)] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap`}>
                    {t('portfolio.stockName')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.quantity')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.averagePrice')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.currentPrice')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.evaluation')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.profitRate')}
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.weight')}
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    {t('portfolio.action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((portfolio) => {
                  const weight = calculateWeight(portfolio.currentValue);
                  return (
                    <tr
                      key={portfolio.id}
                      className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-white transition-all duration-200 group"
                    >
                      <td className={`py-[var(--spacing-2_5)] px-[var(--spacing-3)]`}>
                        <div>
                          <span className={`text-[var(--font-size-sm)] font-semibold text-gray-900`}>
                            {portfolio.stock.name}
                          </span>
                          <span className={`text-[var(--font-size-xs)] text-gray-500 ml-[var(--spacing-2)]`}>
                            {portfolio.stock.code}
                          </span>
                        </div>
                      </td>
                      <td className={`py-[var(--spacing-4)] px-[var(--spacing-4)] text-right`}>
                        <span className={`text-[var(--font-size-sm)] text-gray-900 number`}>
                          {portfolio.quantity.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm text-gray-700 number">
                          {formatPrice(portfolio.averagePrice)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`flex items-center justify-end gap-[var(--spacing-1)]`}>
                          <span className={`text-[var(--font-size-sm)] font-semibold text-gray-900 number`}>
                            {formatPrice(portfolio.stock.currentPrice)}
                          </span>
                          <span className={cn(`text-[var(--font-size-xs)]`, getChangeColorClass(portfolio.stock.changeRate))}>
                            {formatChange(portfolio.stock.changeRate)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-[var(--font-size-sm)] font-medium text-gray-900 number`}>
                          {formatPrice(portfolio.currentValue)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`flex items-center justify-end gap-[var(--spacing-1_5)]`}>
                          {portfolio.profitRate >= 0 ? (
                            <TrendingUp size={sizes.icon.px.sm} strokeWidth={2} className="text-semantic-red shrink-0" />
                          ) : (
                            <TrendingDown size={sizes.icon.px.sm} strokeWidth={2} className="text-semantic-blue shrink-0" />
                          )}
                          <span className={cn(`text-[var(--font-size-sm)] font-semibold number`, getChangeColorClass(portfolio.profitRate))}>
                            {formatChange(portfolio.profitRate)}
                          </span>
                        </div>
                        <p className={`text-[var(--font-size-xs)] text-gray-500 mt-[var(--spacing-0_5)] number`}>
                          {formatPrice(portfolio.profit)}
                        </p>
                      </td>
                      <td className={`py-[var(--spacing-4)] px-[var(--spacing-4)] text-right`}>
                        <span className={`text-[var(--font-size-sm)] text-gray-600 number`}>
                          {weight.toFixed(1)}%
                        </span>
                      </td>
                      <td className={`py-[var(--spacing-4)] px-[var(--spacing-4)]`}>
                        <div className={`flex items-center justify-center gap-[var(--spacing-2)]`}>
                          <button
                            onClick={() => onEdit(portfolio)}
                            className={`p-[var(--spacing-1_5)] rounded-[var(--radius-lg)] hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors`}
                            aria-label={t('aria.edit')}
                          >
                            <Edit2 size={sizes.icon.px.sm} />
                          </button>
                          <button
                            onClick={() => onDelete(portfolio.id, portfolio.stock.name)}
                            disabled={isDeleting}
                            className={`p-[var(--spacing-1_5)] rounded-[var(--radius-lg)] hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50`}
                            aria-label={t('aria.delete')}
                          >
                            <Trash2 size={sizes.icon.px.sm} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
});

