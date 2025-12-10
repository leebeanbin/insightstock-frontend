import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { spacing, typography, borderRadius, sizes } from '@/lib/design-tokens';

export type ButtonType = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonType;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      icon: Icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-[var(--radius-xl)] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)] focus:ring-offset-2 disabled:pointer-events-none';
    
    const variantStyles = {
      primary: {
        default: 'bg-[var(--brand-main)] text-white hover:bg-[var(--brand-purple)] hover:shadow-lg hover:shadow-[var(--brand-main)]/20 active:scale-[0.98] active:bg-[var(--primary-700)] dark:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)] dark:active:bg-[var(--brand-main)] shadow-md shadow-[var(--brand-main)]/10',
        disabled: 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60 shadow-none',
      },
      secondary: {
        default: 'bg-white text-[var(--text-primary)] border-2 border-[var(--brand-light-purple)] hover:bg-[var(--brand-light-purple)]/20 hover:border-[var(--brand-purple)] hover:text-[var(--brand-main)] hover:shadow-md active:scale-[0.98]',
        disabled: 'bg-white text-gray-600 border-gray-200 cursor-not-allowed opacity-60',
      },
      ghost: {
        default: 'bg-transparent text-[var(--brand-main)] hover:bg-[var(--brand-light-purple)]/20 active:bg-[var(--brand-purple)]/20 dark:text-[var(--brand-purple)] dark:hover:bg-[var(--brand-purple)]/10',
        disabled: 'bg-transparent text-gray-600 cursor-not-allowed opacity-60',
      },
    };

    const sizeStyles = {
      small: `h-[var(--button-sm-height)] px-[var(--button-sm-paddingX)] py-[var(--button-sm-paddingY)] text-[var(--button-sm-fontSize)] min-w-[80px] gap-[var(--spacing-1)] whitespace-nowrap`,
      medium: `h-[var(--button-md-height)] px-[var(--button-md-paddingX)] py-[var(--button-md-paddingY)] text-[var(--button-md-fontSize)] min-w-[120px] gap-[var(--spacing-1_5)] whitespace-nowrap`,
      large: `h-[var(--button-lg-height)] px-[var(--button-lg-paddingX)] py-[var(--button-lg-paddingY)] text-[var(--button-lg-fontSize)] min-w-[140px] gap-[var(--spacing-2)] whitespace-nowrap`,
    };

    const iconSizes = {
      small: sizes.icon.px.xs,
      medium: sizes.icon.px.sm,
      large: sizes.icon.px.md,
    };

    const isDisabled = disabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          isDisabled ? variantStyles[variant].disabled : variantStyles[variant].default,
          className
        )}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <Icon size={iconSizes[size]} strokeWidth={1.75} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon size={iconSizes[size]} strokeWidth={1.75} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

