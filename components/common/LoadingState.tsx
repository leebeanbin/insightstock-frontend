/**
 * LoadingState Component
 * 공통 로딩 상태 컴포넌트
 */

'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingState({
  message,
  size = 'medium',
  className,
}: LoadingStateProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <div
        className={cn(
          'border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4',
          sizeClasses[size]
        )}
      />
      <p className={cn('text-gray-500', textSizes[size])}>{message || t('common.loading')}</p>
    </div>
  );
}

