/**
 * TypingIndicator Component
 * 입력 중 표시 컴포넌트
 */

'use client';

import { Bot } from 'lucide-react';
import { sizes, spacing, borderRadius } from '@/lib/design-tokens';

export function TypingIndicator() {
  return (
    <div className={`flex gap-[var(--spacing-4)] p-[var(--spacing-4)] justify-start`}>
      <div className={`flex-shrink-0 w-[var(--spacing-8)] h-[var(--spacing-8)] rounded-full bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20 flex items-center justify-center`}>
        <Bot size={sizes.icon.px.md} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
      </div>
      <div className="flex items-center gap-[var(--spacing-1)] bg-gray-100 dark:bg-gray-800 rounded-[var(--radius-2xl)] px-[var(--spacing-4)] py-[var(--spacing-3)]">
        <span className={`w-[var(--spacing-2)] h-[var(--spacing-2)] bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <span className={`w-[var(--spacing-2)] h-[var(--spacing-2)] bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <span className={`w-[var(--spacing-2)] h-[var(--spacing-2)] bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

