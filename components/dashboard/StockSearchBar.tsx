/**
 * StockSearchBar Component
 * 종목 검색 바 컴포넌트
 */

'use client';

import Input from '@/components/atoms/Input';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, spacing } from '@/lib/design-tokens';

interface StockSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function StockSearchBar({
  value,
  onChange,
  onClear,
  placeholder,
}: StockSearchBarProps) {
  const { t } = useLanguage();
  const defaultPlaceholder = placeholder || t('dashboard.searchPlaceholder');
  
  return (
    <div className={`p-[var(--spacing-3)] border-b border-border-default shrink-0 bg-background-card`}>
      <div className="relative">
        <Input
          placeholder={defaultPlaceholder}
          prefix={<Search size={sizes.icon.px.md} strokeWidth={2} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background-card border-border-default focus:border-[var(--brand-main)] dark:focus:border-[var(--brand-purple)] focus:ring-[var(--brand-light-purple)]/20 dark:focus:ring-[var(--brand-purple)]/20 text-sm"
        />
        {value && (
          <button
            onClick={onClear}
            className={`absolute right-[var(--spacing-2_5)] top-1/2 -translate-y-1/2 p-[var(--spacing-1)] hover:bg-[var(--brand-light-purple)]/20 dark:hover:bg-[var(--brand-purple)]/20 rounded-full transition-colors`}
            aria-label={t('common.clear')}
          >
            <X size={sizes.icon.px.sm} className="text-gray-500 dark:text-text-tertiary hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]" />
          </button>
        )}
      </div>
    </div>
  );
}

