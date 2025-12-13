import React from 'react';
import { cn } from '@/lib/utils';
import { spacing, typography, borderRadius } from '@/lib/design-tokens';

export type BadgeVariant = 'default' | 'primary' | 'warning' | 'success' | 'error';
export type BadgeSize = 'small' | 'medium';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant = 'default', size = 'medium', dot = false, children, className }: BadgeProps) => {
  // 토스 스타일: 더 부드럽고 미니멀한 색상 시스템
  const variantStyles = {
    default: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500 dark:bg-gray-400',
    },
    primary: {
      bg: 'bg-[var(--brand-main)]/8 dark:bg-[var(--brand-purple)]/10',
      text: 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]',
      dot: 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-400',
      dot: 'bg-orange-500 dark:bg-orange-400',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500 dark:bg-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500 dark:bg-red-400',
    },
  };

  // 토스 스타일: 크기별 패딩 조정
  const sizeStyles = {
    small: 'px-2 py-0.5 text-xs gap-1',
    medium: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        // 토스 스타일: 더 작은 rounded, 깔끔한 폰트
        'inline-flex items-center rounded-md font-medium transition-colors',
        sizeStyles[size],
        styles.bg,
        styles.text,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full',
            size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            styles.dot
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

