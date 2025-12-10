import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { spacing, borderRadius, sizes } from '@/lib/design-tokens';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  size?: 'small' | 'medium';
  variant?: 'default' | 'ghost';
  state?: 'default' | 'hover' | 'active';
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      size = 'medium',
      variant = 'default',
      state = 'default',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled;

    const sizeStyles = {
      small: 'w-[var(--spacing-8)] h-[var(--spacing-8)]',
      medium: 'w-[var(--spacing-10)] h-[var(--spacing-10)]',
    };

    const iconSizes = {
      small: sizes.icon.px.md,
      medium: sizes.icon.px.lg,
    };

    const variantStyles = {
      default: {
        default: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-primary-600',
        active: 'bg-primary-100 text-primary-600',
      },
      ghost: {
        default: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-primary-600',
        active: 'bg-primary-100 text-primary-600',
      },
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-lg)]',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
          sizeStyles[size],
          isDisabled
            ? 'opacity-60 cursor-not-allowed'
            : state === 'active'
            ? variantStyles[variant].active
            : variantStyles[variant].default,
          className
        )}
        {...props}
      >
        <Icon size={iconSizes[size]} strokeWidth={1.75} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;

