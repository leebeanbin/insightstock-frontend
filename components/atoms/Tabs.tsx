/**
 * Tabs Component
 * 탭 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  scrollable?: boolean;
}

const Tabs = ({
  items,
  value: controlledValue,
  onChange,
  defaultValue,
  variant = 'default',
  orientation = 'horizontal',
  className,
  scrollable = false,
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.value || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const variantStyles = {
    default: {
      container: 'border-b border-border-default',
      tab: (active: boolean) =>
        cn(
          'px-4 py-2 border-b-2 transition-colors',
          active
            ? 'border-[var(--brand-main)] dark:border-[var(--brand-purple)] text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
        ),
    },
    pills: {
      container: 'gap-2',
      tab: (active: boolean) =>
        cn(
          'px-4 py-2 rounded-[var(--radius-lg)] transition-colors',
          active
            ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white'
            : 'bg-background-subtle text-text-secondary hover:bg-background-hover hover:text-text-primary'
        ),
    },
    underline: {
      container: 'border-b border-border-default',
      tab: (active: boolean) =>
        cn(
          'px-4 py-2 relative transition-colors',
          active
            ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
            : 'text-text-secondary hover:text-text-primary',
          active && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--brand-main)] dark:after:bg-[var(--brand-purple)]'
        ),
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col',
        styles.container,
        className
      )}
    >
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col',
          scrollable && orientation === 'horizontal' && 'overflow-x-auto scrollbar-hide',
          'w-full'
        )}
      >
        {items.map((item) => {
          const isActive = currentValue === item.value;
          return (
            <button
              key={item.value}
              onClick={() => !item.disabled && handleChange(item.value)}
              disabled={item.disabled}
              className={cn(
                'flex items-center gap-2 text-sm font-medium whitespace-nowrap',
                'transition-colors duration-200',
                styles.tab(isActive),
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-background-hover text-text-tertiary'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;

