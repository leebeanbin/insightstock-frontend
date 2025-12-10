import React from 'react';
import { cn } from '@/lib/utils';
import { spacing, typography, borderRadius } from '@/lib/design-tokens';

export type BadgeVariant = 'default' | 'primary' | 'warning' | 'success' | 'error';

export interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant = 'default', dot = false, children, className }: BadgeProps) => {
  const variantStyles = {
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      dot: 'bg-gray-600',
    },
    primary: {
      bg: 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20',
      text: 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]',
      dot: 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
    },
    warning: {
      bg: 'bg-[var(--brand-light-purple)] dark:bg-[var(--brand-purple)]/30',
      text: 'text-[var(--brand-main)] dark:text-[var(--brand-light-purple)]',
      dot: 'bg-[var(--brand-purple)] dark:bg-[var(--brand-light-purple)]',
    },
    success: {
      bg: 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20',
      text: 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]',
      dot: 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
    },
    error: {
      bg: 'bg-[var(--brand-light-purple)] dark:bg-[var(--brand-purple)]/30',
      text: 'text-[var(--brand-main)] dark:text-[var(--brand-light-purple)]',
      dot: 'bg-[var(--brand-purple)] dark:bg-[var(--brand-light-purple)]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[var(--spacing-1_5)] px-[var(--spacing-3)] py-[var(--spacing-1_5)] rounded-[var(--radius-lg)] text-[var(--font-size-sm)] font-semibold',
        styles.bg,
        styles.text,
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-[var(--spacing-1_5)] h-[var(--spacing-1_5)] rounded-full', styles.dot)}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

