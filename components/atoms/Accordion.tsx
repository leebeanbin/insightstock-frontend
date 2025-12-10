/**
 * Accordion Component
 * 아코디언 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

export interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
  variant?: 'default' | 'bordered' | 'separated';
}

const Accordion = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  multiple = false,
  className,
  variant = 'default',
}: AccordionProps) => {
  const getInitialValue = (): string[] => {
    if (multiple) {
      return Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
    }
    return defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
  };

  const [internalValue, setInternalValue] = useState<string[]>(getInitialValue);

  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalValue;

  const handleToggle = (itemValue: string) => {
    const newValues = currentValues.includes(itemValue)
      ? currentValues.filter((v) => v !== itemValue)
      : multiple
      ? [...currentValues, itemValue]
      : [itemValue];

    if (!isControlled) {
      setInternalValue(newValues);
    }
    onChange?.(multiple ? newValues : newValues[0] || '');
  };

  const variantStyles = {
    default: 'space-y-1',
    bordered: 'space-y-2',
    separated: 'space-y-4',
  };

  const itemStyles = {
    default: 'border border-border-default rounded-[var(--radius-lg)]',
    bordered: 'border border-border-default rounded-[var(--radius-lg)]',
    separated: 'border border-border-default rounded-[var(--radius-lg)]',
  };

  return (
    <div className={cn('w-full', variantStyles[variant], className)}>
      {items.map((item) => {
        const isOpen = currentValues.includes(item.value);
        return (
          <div
            key={item.value}
            className={cn(itemStyles[variant], 'overflow-hidden')}
          >
            <button
              onClick={() => !item.disabled && handleToggle(item.value)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between p-4',
                'bg-background-card hover:bg-background-hover',
                'transition-colors duration-200',
                'text-left',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="font-medium text-text-primary truncate">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                size={sizes.icon.px.sm}
                className={cn(
                  'shrink-0 text-text-tertiary transition-transform duration-200',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-4 border-t border-border-default bg-background-subtle">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

