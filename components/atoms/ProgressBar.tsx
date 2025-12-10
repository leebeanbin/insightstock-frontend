/**
 * Progress Bar Component
 * 프로그레스 바 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  size = 'medium',
  variant = 'default',
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  };

  const variantStyles = {
    default: 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
    success: 'bg-semantic-green',
    warning: 'bg-semantic-yellow',
    error: 'bg-semantic-red',
    info: 'bg-semantic-blue',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            {label || `${Math.round(percentage)}%`}
          </span>
          {showLabel && label && (
            <span className="text-sm text-text-tertiary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-background-subtle rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantStyles[variant],
            striped && 'bg-stripes',
            animated && 'animate-pulse'
          )}
          style={{
            width: `${percentage}%`,
            backgroundImage: striped
              ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
              : undefined,
            backgroundSize: striped ? '1rem 1rem' : undefined,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

