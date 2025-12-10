/**
 * Toggle Component
 * 토글 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { spacing, borderRadius } from '@/lib/design-tokens';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  className,
}: ToggleProps) => {
  const sizeStyles = {
    small: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    medium: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    large: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const styles = sizeStyles[size];

  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            styles.track,
            'rounded-full transition-colors duration-200',
            checked
              ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]'
              : 'bg-gray-300 dark:bg-gray-600'
          )}
        >
          <div
            className={cn(
              styles.thumb,
              'absolute left-0.5 top-0.5',
              'bg-white rounded-full',
              'shadow-sm',
              'transition-transform duration-200 ease-in-out',
              checked && styles.translate
            )}
          />
        </div>
      </div>
      {label && (
        <span className={cn(
          'text-sm font-medium',
          checked ? 'text-text-primary' : 'text-text-secondary'
        )}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;

