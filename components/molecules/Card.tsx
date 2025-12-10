import React from 'react';
import { cn } from '@/lib/utils';
import { spacing, borderRadius } from '@/lib/design-tokens';

export interface CardProps {
  variant?: 'default' | 'hover' | 'selected';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({
  variant = 'default',
  header,
  footer,
  children,
  className,
  onClick,
}: CardProps) => {
  const baseStyles = cn(
    'bg-background-card border rounded-[var(--radius-2xl)]',
    'transition-all duration-200'
  );
  
  const variantStyles = {
    default: cn(
      'border-border-default shadow-sm',
      'hover:shadow-lg hover:shadow-[var(--brand-main)]/5 dark:hover:shadow-[var(--brand-purple)]/10',
      'hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)]',
      'hover:-translate-y-0.5',
      'dark:shadow-md dark:shadow-black/20',
      'transition-all duration-300 ease-out'
    ),
    hover: cn(
      'border-border-default shadow-lg',
      'hover:shadow-xl hover:shadow-[var(--brand-main)]/10 dark:hover:shadow-[var(--brand-purple)]/15',
      'dark:shadow-xl dark:shadow-black/30',
      'transition-all duration-300 ease-out'
    ),
    selected: cn(
      'border-2 border-[var(--selected-border)] dark:border-[var(--selected-border-dark)]',
      'shadow-lg shadow-[var(--selected-shadow)]/15 dark:shadow-[var(--selected-shadow-dark)]/25',
      'bg-background-card dark:bg-background-card',
      'scale-[1.01] ring-2 ring-[var(--selected-shadow)]/20 dark:ring-[var(--selected-shadow-dark)]/30',
      'transition-all duration-200 ease-out'
    ),
  };

  const paddingStyles = header || footer ? 'p-0' : 'p-[var(--spacing-4)]';

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className={cn(
          'px-[var(--spacing-4)] pt-[var(--spacing-4)] pb-[var(--spacing-3)]',
          'border-b border-border-subtle'
        )}>
          {header}
        </div>
      )}
      <div className={cn(header || footer ? 'px-[var(--spacing-4)] py-[var(--spacing-3)]' : '')}>
        {children}
      </div>
      {footer && (
        <div className={cn(
          'px-[var(--spacing-4)] pt-[var(--spacing-3)] pb-[var(--spacing-4)]',
          'border-t border-border-subtle'
        )}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

