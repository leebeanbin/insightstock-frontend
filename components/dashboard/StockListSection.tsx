/**
 * StockListSection Component
 * 종목 목록 사이드바 컴포넌트
 */

'use client';

import { memo, useMemo } from 'react';
import { Stock } from '@/lib/types';
import { CategoryTabs } from './CategoryTabs';
import { StockListItem } from './StockListItem';
import { Skeleton, SkeletonListItem } from '@/components/common/Skeleton';
import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { usePortfolios } from '@/lib/hooks/use-portfolio';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, typography } from '@/lib/design-tokens';

interface StockListSectionProps {
  stocks: Stock[];
  selectedStock: Stock | null;
  categories: string[];
  category: string;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  onStockSelect: (stock: Stock) => void;
  onStockHover?: (stock: Stock | null) => void; // 호버 이벤트 핸들러 추가
  onCategoryChange: (category: string) => void;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onRefetch: () => void;
}

function StockListSectionComponent({
  stocks,
  selectedStock,
  categories,
  category,
  searchQuery,
  isLoading,
  isSearching,
  onStockSelect,
  onStockHover,
  onCategoryChange,
  onSearchChange,
  onSearchClear,
  onRefetch,
}: StockListSectionProps) {
  const { t } = useLanguage();
  
  // 즐겨찾기 목록 조회 (아이콘 표시용)
  const { data: favoritesData } = useFavorites();
  const favoriteStockIds = useMemo(() => {
    return new Set(favoritesData?.favorites?.map(fav => fav.stock.id) || []);
  }, [favoritesData]);

  // 포트폴리오 목록 조회 (아이콘 표시용)
  const { data: portfoliosData } = usePortfolios();
  const portfolioStockIds = useMemo(() => {
    // stock.id와 stock.code 모두 체크 (백엔드가 둘 다 지원)
    const ids = new Set<string>();
    portfoliosData?.portfolios?.forEach(port => {
      if (port.stock.id) ids.add(port.stock.id);
      if (port.stock.code) ids.add(port.stock.code);
    });
    return ids;
  }, [portfoliosData]);
  
  // 포트폴리오 ID 매핑 (stockId -> portfolioId)
  const portfolioIdMap = useMemo(() => {
    const map = new Map<string, string>();
    portfoliosData?.portfolios?.forEach(port => {
      if (port.stock.id) map.set(port.stock.id, port.id);
      if (port.stock.code) map.set(port.stock.code, port.id);
    });
    return map;
  }, [portfoliosData]);

  return (
    <div className={cn(
      'w-[var(--layout-sidebar-width)] min-w-[var(--layout-sidebar-min-width)]',
      'bg-background-card border-r border-border-default',
      'flex flex-col overflow-hidden shadow-sm transition-colors duration-200'
    )}>
      <div className="h-full flex flex-col">
        <CategoryTabs
          categories={categories}
          selectedCategory={category}
          onCategoryChange={onCategoryChange}
          hidden={!!searchQuery}
        />

        {/* 종목 목록 헤더 */}
        <div className={cn(
          'px-[var(--spacing-4)] py-[var(--spacing-2)] flex items-center justify-between shrink-0',
          'bg-background-card border-b border-border-default'
        )}>
          <h3 className="text-[var(--font-size-sm)] font-bold text-text-primary">
            {searchQuery 
              ? `"${searchQuery}" ${t('common.search')} ${t('common.results')}` 
              : `${t(`dashboard.categories.${category}`)} ${t('dashboard.stockList')}`
            }
          </h3>
          <div className="flex items-center gap-[var(--spacing-2)]">
            <span className={cn(
              'text-[var(--font-size-xs)] text-text-tertiary font-semibold',
              'bg-background-card dark:bg-background-subtle',
              'px-[var(--spacing-1_5)] py-[var(--spacing-0_5)] rounded border border-border-default'
            )}>
              {stocks.length}{t('common.count')}
            </span>
            {!searchQuery && (
              <button
                onClick={onRefetch}
                className={cn(
                  'p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]',
                  'hover:bg-primary-500/20 dark:hover:bg-primary-600/20',
                  'hover:text-primary-700 dark:hover:text-primary-600',
                  'transition-colors'
                )}
                title={t('common.refresh')}
                aria-label={t('common.refresh')}
              >
                <RefreshCw
                  size={sizes.icon.px.sm}
                  strokeWidth={2}
                  className={cn('text-text-tertiary', isLoading && 'animate-spin')}
                />
              </button>
            )}
          </div>
        </div>

        {/* 종목 목록 */}
        <div className={cn(
          'flex-1 min-h-0 overflow-y-auto px-[var(--spacing-3)] pb-[var(--spacing-3)]',
          'bg-background-subtle',
          'data-testid="stock-list"'
        )} data-testid="stock-list">
          {(isLoading || isSearching) ? (
            <div className="space-y-[var(--spacing-2)]">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonListItem key={i} className="p-[var(--spacing-2_5)] rounded-[var(--radius-lg)] border border-border-subtle" />
              ))}
            </div>
          ) : stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[var(--spacing-12)] px-[var(--spacing-6)] text-center">
              <div className={cn(
                'w-[var(--spacing-16)] h-[var(--spacing-16)] rounded-[var(--radius-2xl)] flex items-center justify-center mb-[var(--spacing-4)]',
                'bg-background-hover'
              )}>
                <Search size={sizes.icon.px.xl} strokeWidth={2} className="text-text-disabled" />
              </div>
              <p className="text-[var(--font-size-base)] font-medium text-text-secondary mb-[var(--spacing-1)]">
                {searchQuery ? t('common.noResults') : t('common.noData')}
              </p>
              <p className="text-[var(--font-size-sm)] text-text-tertiary">
                {searchQuery ? t('common.tryDifferentSearch') : t('common.selectDifferentCategory')}
              </p>
            </div>
          ) : (
            <div className="space-y-[var(--spacing-2)]">
              {stocks.map((stock) => (
                <StockListItem
                  key={stock.id}
                  stock={stock}
                  isSelected={selectedStock?.code === stock.code}
                  onClick={() => onStockSelect(stock)}
                  onHover={onStockHover ? (stock) => {
                    // 선택된 종목이 있으면 호버 무시
                    if (!selectedStock) {
                      onStockHover(stock);
                    }
                  } : undefined}
                  isFavorite={favoriteStockIds.has(stock.id) || favoriteStockIds.has(stock.code)}
                  isInPortfolio={portfolioStockIds.has(stock.id) || portfolioStockIds.has(stock.code)}
                  portfolioId={portfolioIdMap.get(stock.id) || portfolioIdMap.get(stock.code) || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const StockListSection = memo(StockListSectionComponent);

