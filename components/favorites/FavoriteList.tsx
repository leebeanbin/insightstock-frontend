/**
 * FavoriteList Component
 * 즐겨찾기 목록 컴포넌트
 */

'use client';

import { useFavorites, useRemoveFavorite } from '@/lib/hooks/use-favorites';
import { Favorite } from '@/lib/types/api/favorites.types';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Heart, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes } from '@/lib/design-tokens';

interface FavoriteListProps {
  limit?: number;
  showRemoveButton?: boolean;
  onStockClick?: (stockId: string) => void;
}

export function FavoriteList({
  limit,
  showRemoveButton = true,
  onStockClick,
}: FavoriteListProps) {
  const { data, isLoading, error } = useFavorites({ limit });
  const removeMutation = useRemoveFavorite();
  const { t } = useLanguage();

  const handleRemove = async (stockId: string, stockName: string) => {
    const confirmMessage = t('favorites.removeConfirm').replace('{{name}}', stockName);
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await removeMutation.mutateAsync(stockId);
      toast.success(t('favorites.removed'));
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleMutationError } = await import('@/lib/utils/error-handler');
      handleMutationError(
        error,
        'Failed to remove favorite',
        t('favorites.removeFailed')
      );
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        {t('common.error')}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!data?.favorites || data.favorites.length === 0) {
    return (
      <div className="p-8 text-center">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-900 mb-1">
          {t('favorites.noFavorites')}
        </p>
        <p className="text-xs text-gray-500">
          {t('favorites.noFavoritesDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.favorites.map((favorite) => (
        <FavoriteItem
          key={favorite.id}
          favorite={favorite}
          onRemove={showRemoveButton ? handleRemove : undefined}
          onClick={onStockClick}
          isRemoving={removeMutation.isPending}
        />
      ))}
    </div>
  );
}

interface FavoriteItemProps {
  favorite: Favorite;
  onRemove?: (stockId: string, stockName: string) => void;
  onClick?: (stockId: string) => void;
  isRemoving: boolean;
}

function FavoriteItem({
  favorite,
  onRemove,
  onClick,
  isRemoving,
}: FavoriteItemProps) {
  const { stock } = favorite;
  const isPositive = stock.changeRate >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 transition-colors group',
        onClick && 'cursor-pointer'
      )}
      onClick={() => onClick?.(stock.id)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/stocks/${stock.code}`}
              onClick={(e) => e.stopPropagation()}
              className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {stock.name}
            </Link>
            <span className="text-sm text-gray-500">{stock.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(stock.currentPrice)}
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon
                size={sizes.icon.px.sm}
                className={cn(
                  isPositive ? 'text-semantic-red' : 'text-semantic-blue'
                )}
              />
              <span
                className={cn(
                  'text-sm font-semibold',
                  getChangeColorClass(stock.changeRate)
                )}
              >
                {formatChange(stock.changeRate)}
              </span>
            </div>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(stock.id, stock.name);
            }}
            disabled={isRemoving}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg',
              'hover:bg-red-50 text-gray-400 hover:text-red-600',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label={t('aria.removeFavorite')}
          >
            <Trash2 size={sizes.icon.px.md} />
          </button>
        )}
      </div>
    </div>
  );
}

