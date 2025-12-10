/**
 * Select Component
 * 셀렉트 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className,
  size = 'medium',
  searchable = false,
  multiple = false,
  clearable = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : []);

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  // 그룹별로 옵션 정리
  const groupedOptions = options.reduce((acc, opt) => {
    const group = opt.group || '기타';
    if (!acc[group]) acc[group] = [];
    acc[group].push(opt);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
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

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  const handleRemoveTag = (e: React.MouseEvent, tagValue: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter((v) => v !== tagValue));
    }
  };

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2',
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
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          {multiple && selectedOptions.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              {selectedOptions.slice(0, 2).map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20 text-[var(--brand-main)] dark:text-[var(--brand-purple)] rounded text-xs"
                >
                  {opt.label}
                  <button
                    onClick={(e) => handleRemoveTag(e, opt.value)}
                    className="hover:bg-[var(--brand-main)]/20 dark:hover:bg-[var(--brand-purple)]/20 rounded"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedOptions.length > 2 && (
                <span className="text-xs text-text-tertiary">
                  +{selectedOptions.length - 2}
                </span>
              )}
            </div>
          ) : selectedOptions.length > 0 ? (
            <span className="truncate text-text-primary">
              {selectedOptions[0].label}
            </span>
          ) : (
            <span className="text-text-tertiary">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {clearable && selectedOptions.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-background-hover rounded"
            >
              <X size={sizes.icon.px.sm} className="text-text-tertiary" />
            </button>
          )}
          <ChevronDown
            size={sizes.icon.px.sm}
            className={cn(
              'text-text-tertiary transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
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
            <div className="p-2 border-b border-border-subtle sticky top-0 bg-background-card z-10">
              <div className="relative">
                <Search
                  size={sizes.icon.px.sm}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색..."
                  className={cn(
                    'w-full pl-8 pr-3 py-2',
                    'bg-background-subtle border border-border-default',
                    'rounded-[var(--radius-md)]',
                    'text-sm text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)]/20 dark:focus:ring-[var(--brand-purple)]/20'
                  )}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-tertiary text-center">
                결과가 없습니다
              </div>
            ) : (
              Object.keys(groupedOptions).map((group) => {
                const groupOptions = groupedOptions[group].filter((opt) =>
                  filteredOptions.includes(opt)
                );
                if (groupOptions.length === 0) return null;

                return (
                  <div key={group}>
                    {Object.keys(groupedOptions).length > 1 && (
                      <div className="px-4 py-2 text-xs font-semibold text-text-tertiary uppercase">
                        {group}
                      </div>
                    )}
                    {groupOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
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
                            isSelected && 'bg-[var(--brand-light-purple)]/10 dark:bg-[var(--brand-purple)]/10'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {option.icon && (
                              <span className="shrink-0">{option.icon}</span>
                            )}
                            <span className="truncate">{option.label}</span>
                          </div>
                          {isSelected && (
                            <Check
                              size={sizes.icon.px.sm}
                              className="text-[var(--brand-main)] dark:text-[var(--brand-purple)] shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;

