/**
 * FavoriteButton Component
 * 즐겨찾기 토글 버튼 컴포넌트
 */

'use client';

import { Heart } from 'lucide-react';
import { useCheckFavorite, useToggleFavorite } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface FavoriteButtonProps {
  stockId: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function FavoriteButton({
  stockId,
  size = 'medium',
  className,
}: FavoriteButtonProps) {
  const { data: checkData, isLoading } = useCheckFavorite(stockId);
  const toggleMutation = useToggleFavorite();
  const { t } = useLanguage();

  const isFavorite = checkData?.isFavorite ?? false;

  const handleToggle = async () => {
    try {
      const result = await toggleMutation.mutateAsync(stockId);
      toast.success(result.message);
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleMutationError } = await import('@/lib/utils/error-handler');
      handleMutationError(
        error,
        'Failed to toggle favorite',
        t('favorites.changeFailed')
      );
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || toggleMutation.isPending}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        isFavorite
          ? 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20 text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:bg-[var(--brand-light-purple)]/30 dark:hover:bg-[var(--brand-purple)]/30'
          : 'bg-gray-100 dark:bg-background-hover text-gray-400 dark:text-text-tertiary hover:bg-gray-200 dark:hover:bg-background-subtle',
        className
      )}
      aria-label={isFavorite ? t('stock.removeFromFavorites') : t('stock.addToFavorites')}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          'transition-all duration-200',
          isFavorite && 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
        )}
        strokeWidth={2}
      />
    </button>
  );
}

