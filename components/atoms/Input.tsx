import React from 'react';
import { cn } from '@/lib/utils';
import { spacing, typography, borderRadius, sizes } from '@/lib/design-tokens';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`block text-[var(--font-size-sm)] font-medium text-gray-700 mb-[var(--spacing-1)]`}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className={`absolute left-[var(--spacing-4)] top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none`}>
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              `w-full h-[${sizes.input.lg.height}] px-[${sizes.input.lg.paddingX}] rounded-[var(--radius-xl)] border-2 transition-all duration-200`,
              `text-[${sizes.input.lg.fontSize}] text-gray-900 placeholder:text-gray-400`,
              'bg-white border-gray-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-primary-600/20 focus:border-primary-500 focus:ring-offset-0',
              'disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-200',
              error && 'border-semantic-red focus:ring-semantic-red focus:border-semantic-red',
              prefix && `pl-[var(--spacing-12)]`,
              suffix && `pr-[var(--spacing-12)]`,
              className
            )}
            {...props}
          />
          {suffix && (
            <div className={`absolute right-[var(--spacing-4)] top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none`}>
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className={`mt-[var(--spacing-1)] text-[var(--font-size-sm)] text-semantic-red`}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

