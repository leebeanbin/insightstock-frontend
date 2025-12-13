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
  // 브랜드 컬러 기반 색상 시스템
  const variantStyles = {
    default: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500 dark:bg-gray-400',
    },
    primary: {
      bg: 'bg-[#4E56C0]/10 dark:bg-[#9b5DE0]/15',
      text: 'text-[#4E56C0] dark:text-[#9b5DE0]',
      dot: 'bg-[#4E56C0] dark:bg-[#9b5DE0]',
    },
    warning: {
      bg: 'bg-[#D78FEE]/15 dark:bg-[#D78FEE]/20',
      text: 'text-[#9b5DE0] dark:text-[#D78FEE]',
      dot: 'bg-[#9b5DE0] dark:bg-[#D78FEE]',
    },
    success: {
      bg: 'bg-[#4E56C0]/8 dark:bg-[#4E56C0]/12',
      text: 'text-[#4E56C0] dark:text-[#9b5DE0]',
      dot: 'bg-[#4E56C0] dark:bg-[#9b5DE0]',
    },
    error: {
      bg: 'bg-[#D78FEE]/20 dark:bg-[#D78FEE]/25',
      text: 'text-[#9b5DE0] dark:text-[#D78FEE]',
      dot: 'bg-[#9b5DE0] dark:bg-[#D78FEE]',
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

