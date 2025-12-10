/**
 * StockListItem Component
 * 종목 목록 아이템 컴포넌트
 */

'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { TrendingUp, TrendingDown, Heart, Star, Plus, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToggleFavorite } from '@/lib/hooks/use-favorites';
import { useCreatePortfolio, useDeletePortfolio } from '@/lib/hooks/use-portfolio';
import { usePrefetchStock } from '@/lib/hooks/use-prefetch';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, spacing, typography, borderRadius } from '@/lib/design-tokens';
import Tooltip from '@/components/atoms/Tooltip';
import { listItemVariants, buttonTap, hoverScale } from '@/lib/utils/animations';

interface StockListItemProps {
  stock: Stock;
  isSelected: boolean;
  onClick: () => void;
  onHover?: (stock: Stock) => void;
  isFavorite?: boolean;
  isInPortfolio?: boolean;
  portfolioId?: string | null;
}

function StockListItemComponent({ stock, isSelected, onClick, onHover, isFavorite: initialIsFavorite = false, isInPortfolio: initialIsInPortfolio = false, portfolioId = null }: StockListItemProps) {
  const { t } = useLanguage();
  const isPositive = useMemo(() => (stock.changePercent ?? 0) >= 0, [stock.changePercent]);
  const TrendIcon = useMemo(() => isPositive ? TrendingUp : TrendingDown, [isPositive]);
  
  // stock.id가 UUID가 아니면 stock.code 사용 (백엔드가 둘 다 지원)
  const stockIdentifier = useMemo(() => stock.id || stock.code, [stock.id, stock.code]);
  
  // 즐겨찾기와 포트폴리오는 prop으로 전달받은 값 사용 (중복 API 호출 방지)
  // StockListSection에서 이미 useFavorites()와 usePortfolios()로 전체 목록을 가져오므로
  // 개별 확인은 불필요함 (React Query 캐시로 동기화됨)
  const actualIsFavorite = initialIsFavorite;
  const actualIsInPortfolio = initialIsInPortfolio;
  
  const [showActions, setShowActions] = useState(false);

  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavorite();
  const { mutate: addToPortfolio, isPending: isAddingToPortfolio } = useCreatePortfolio();
  const { mutate: deletePortfolio, isPending: isDeletingPortfolio } = useDeletePortfolio();
  
  // 프리페칭: 호버 시 종목 상세 데이터 미리 로드
  const { prefetchStock } = usePrefetchStock();

  // prop으로 전달받은 값 사용 (중복 API 호출 방지)

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(stockIdentifier, {
      onSuccess: (result) => {
        // 서버에서 반환한 실제 상태 사용
        const newIsFavorite = result.isFavorite;
        toast.success(newIsFavorite ? t('favorites.added') : t('favorites.removed'));
      },
      onError: (error: any) => {
        toast.error(error?.message || t('common.error'));
      },
    });
  }, [stockIdentifier, toggleFavorite, t]);

  const handlePortfolioClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 포트폴리오에 있으면 제거, 없으면 추가
    if (actualIsInPortfolio && portfolioId) {
      deletePortfolio(portfolioId, {
        onSuccess: () => {
          toast.success(t('portfolio.removed') || '포트폴리오에서 제거되었습니다.');
        },
        onError: (error: any) => {
          toast.error(error?.message || t('common.error'));
        },
      });
    } else {
      addToPortfolio(
        {
          stockId: stockIdentifier,
          quantity: 1, // 기본값, 나중에 모달로 수정 가능
          averagePrice: stock.currentPrice,
        },
        {
          onSuccess: () => {
            toast.success(t('portfolio.added'));
          },
          onError: (error: any) => {
            toast.error(error?.message || t('common.error'));
          },
        }
      );
    }
  }, [actualIsInPortfolio, portfolioId, deletePortfolio, stock.id, stock.code, stock.currentPrice, addToPortfolio, t]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setShowActions(true);
    // 호버 이벤트 전달 (선택된 종목이 없고 현재 아이템이 선택되지 않았을 때만)
    if (onHover && !isSelected) {
      onHover(stock);
      // 호버 시 프리페칭 (성능 최적화)
      prefetchStock(stockIdentifier);
    }
  }, [onHover, isSelected, stock, stockIdentifier, prefetchStock]);

  const handleMouseLeave = useCallback(() => {
    setShowActions(false);
    // 호버 해제 시 미리보기 유지 (onHoverLeave 호출하지 않음)
  }, []);

  return (
    <motion.div
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={hoverScale}
      whileTap={buttonTap}
      className={cn(
        `relative px-[var(--spacing-3)] py-[var(--spacing-2_5)] rounded-[var(--radius-lg)]`,
        'cursor-pointer border',
        'shadow-sm hover:shadow-md',
        isSelected
          ? 'bg-background-card dark:bg-background-card border-2 border-[var(--selected-border)] dark:border-[var(--selected-border-dark)] shadow-lg shadow-[var(--selected-shadow)]/10 dark:shadow-[var(--selected-shadow-dark)]/20 ring-1 ring-[var(--selected-shadow)]/20 dark:ring-[var(--selected-shadow-dark)]/30'
          : 'bg-background-card dark:bg-background-card border border-border-default hover:bg-background-hover dark:hover:bg-background-hover hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)] hover:shadow-md'
      )}
    >
      <div className={`flex items-center justify-between gap-[var(--spacing-2)]`}>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-[var(--spacing-1_5)] mb-[var(--spacing-0_5)]`}>
            <h4 className={`text-[var(--font-size-sm)] font-bold text-text-primary truncate`}>
              {stock.name}
            </h4>
            {actualIsInPortfolio && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="shrink-0"
              >
                <Tooltip content="포트폴리오에 추가됨 (클릭하여 제거)" position="top">
                  <BadgeCheck
                    size={18}
                    strokeWidth={2.5}
                    className="text-white fill-[var(--brand-main)] dark:fill-[var(--brand-purple)]"
                  />
                </Tooltip>
              </motion.div>
            )}
            <span className={`text-[var(--font-size-xs)] text-text-tertiary font-mono bg-background-subtle dark:bg-background-hover px-[var(--spacing-1)] py-[var(--spacing-0_5)] rounded font-medium shrink-0`}>
              {stock.code}
            </span>
          </div>
          <div className={`flex items-center gap-[var(--spacing-1_5)] text-[var(--font-size-xs)] text-text-tertiary`}>
            <span className={`text-[var(--font-size-xs)]`}>{stock.market}</span>
            <span>·</span>
            <span className={`text-[var(--font-size-xs)]`}>{stock.sector}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-[var(--font-size-base)] font-bold text-text-primary number`}>
            {formatPrice(stock.currentPrice)}
          </div>
          <div className={`flex items-center justify-end gap-[var(--spacing-1)]`}>
            <TrendIcon
              size={sizes.icon.px.xs}
              strokeWidth={2.5}
              className={isPositive ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : 'text-[var(--brand-light-purple)] dark:text-[var(--brand-light-purple)]'}
            />
            <span className={cn(`text-[var(--font-size-xs)] font-bold number`, getChangeColorClass(stock.changePercent))}>
              {formatChange(stock.changePercent)}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 - 호버 시 표시 */}
      {showActions && (
        <div className={`absolute top-[var(--spacing-2)] right-[var(--spacing-2)] flex gap-[var(--spacing-1_5)] opacity-100 animate-in fade-in duration-200 z-20`}>
          <Tooltip
            content={actualIsFavorite ? t('favorites.removeFavorite') : t('favorites.addFavorite')}
            position="left"
          >
            <motion.button
              onClick={handleFavoriteClick}
              disabled={isTogglingFavorite}
              whileHover={hoverScale}
              whileTap={buttonTap}
              animate={{
                scale: actualIsFavorite ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className={cn(
                `p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]`,
                'bg-background-card/90 dark:bg-background-card/90 backdrop-blur-sm',
                'hover:bg-[var(--brand-light-purple)]/20 dark:hover:bg-[var(--brand-purple)]/20',
                'border border-border-default',
                actualIsFavorite && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/30',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Star
                size={sizes.icon.px.sm}
                fill={actualIsFavorite ? 'currentColor' : 'none'}
                className={cn(
                  'transition-all duration-200',
                  actualIsFavorite
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
                    : 'text-text-tertiary'
                )}
              />
            </motion.button>
          </Tooltip>
          <Tooltip
            content={actualIsInPortfolio ? (t('portfolio.remove') || '포트폴리오에서 제거') : t('stock.addToPortfolio')}
            position="left"
          >
            <motion.button
              onClick={handlePortfolioClick}
              disabled={isAddingToPortfolio || isDeletingPortfolio}
              whileHover={hoverScale}
              whileTap={buttonTap}
              animate={{
                scale: actualIsInPortfolio ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className={cn(
                `p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]`,
                'bg-background-card/90 dark:bg-background-card/90 backdrop-blur-sm',
                'hover:bg-[#FDCFFA] dark:hover:bg-[#9b5DE0]/20',
                'border border-border-default',
                actualIsInPortfolio && 'bg-[#FDCFFA] dark:bg-[#9b5DE0]/30',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {actualIsInPortfolio ? (
                <BadgeCheck
                  size={sizes.icon.px.sm}
                  strokeWidth={2.5}
                  className="text-white fill-[var(--brand-main)] dark:fill-[var(--brand-purple)]"
                />
              ) : (
                <Plus
                  size={sizes.icon.px.sm}
                  className="text-text-tertiary"
                />
              )}
            </motion.button>
          </Tooltip>
        </div>
      )}
    </motion.div>
  );
}

export const StockListItem = memo(StockListItemComponent);

