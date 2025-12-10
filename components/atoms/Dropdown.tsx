/**
 * Dropdown Component
 * 드롭다운 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spacing, borderRadius, sizes } from '@/lib/design-tokens';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  searchable?: boolean;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className,
  size = 'medium',
  searchable = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, searchable]);

  const sizeStyles = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-10 px-4 text-base',
    large: 'h-12 px-5 text-lg',
  };

  const handleSelect = (optionValue: string) => {
    if (options.find((opt) => opt.value === optionValue)?.disabled) return;
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between',
          'bg-background-card border border-border-default',
          'rounded-[var(--radius-lg)]',
          'hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)]/20 dark:focus:ring-[var(--brand-purple)]/20',
          'transition-all duration-200',
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-[var(--brand-main)] dark:border-[var(--brand-purple)] ring-2 ring-[var(--brand-main)]/20 dark:ring-[var(--brand-purple)]/20'
        )}
      >
        <span className={cn(
          'truncate',
          selectedOption ? 'text-text-primary' : 'text-text-tertiary'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={sizes.icon.px.sm}
          className={cn(
            'ml-2 shrink-0 text-text-tertiary transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1',
            'bg-background-card border border-border-default',
            'rounded-[var(--radius-lg)] shadow-xl',
            'max-h-60 overflow-auto',
            'animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200'
          )}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-border-subtle">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색..."
                className={cn(
                  'w-full px-3 py-2',
                  'bg-background-subtle border border-border-default',
                  'rounded-[var(--radius-md)]',
                  'text-sm text-text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)]/20 dark:focus:ring-[var(--brand-purple)]/20'
                )}
              />
            </div>
          )}

          {/* Options */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-tertiary text-center">
                결과가 없습니다
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2',
                    'text-left text-sm',
                    'hover:bg-background-hover',
                    'transition-colors duration-150',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    value === option.value && 'bg-[var(--brand-light-purple)]/10 dark:bg-[var(--brand-purple)]/10'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {value === option.value && (
                    <Check size={sizes.icon.px.sm} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)] shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

