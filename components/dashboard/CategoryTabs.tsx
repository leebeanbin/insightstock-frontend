/**
 * CategoryTabs Component
 * 카테고리 탭 컴포넌트
 */

'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { spacing, typography, borderRadius } from '@/lib/design-tokens';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  hidden?: boolean;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  hidden = false,
}: CategoryTabsProps) {
  const { t } = useLanguage();
  
  if (hidden) return null;

  return (
    <div className={`px-[var(--spacing-3)] py-[var(--spacing-2)] border-b border-border-default shrink-0 overflow-x-auto bg-background-card`}>
      <div className={`flex items-center gap-[var(--spacing-1_5)]`}>
        {categories.map((cat) => {
          // 카테고리 키를 번역 키로 변환
          const categoryKey = `dashboard.categories.${cat}`;
          const categoryLabel = t(categoryKey) || cat;
          
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                `px-[var(--spacing-3)] py-[var(--spacing-1_5)] rounded-[var(--radius-lg)] text-[var(--font-size-xs)] font-semibold whitespace-nowrap transition-all`,
                'shadow-sm border',
                selectedCategory === cat
                  ? 'bg-primary-700 dark:bg-primary-600 text-white border-primary-700 dark:border-primary-600 shadow-md'
                  : 'bg-background-card text-text-secondary border-border-default hover:bg-primary-500/20 dark:hover:bg-primary-600/20 hover:border-primary-500 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-600'
              )}
            >
              {categoryLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

