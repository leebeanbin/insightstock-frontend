'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon';
}

export function ThemeToggle({ className, variant = 'button' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR 방지
  if (!mounted) {
    return (
      <div className={cn('p-2 rounded-lg bg-background-hover', className)}>
        <div className="w-5 h-5" />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-lg',
          'bg-background-hover hover:bg-background-subtle',
          'text-text-secondary hover:text-text-primary',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
          className
        )}
        aria-label={resolvedTheme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
      >
        {resolvedTheme === 'dark' ? (
          <Sun size={sizes.icon.px.lg} className="text-yellow-400" />
        ) : (
          <Moon size={sizes.icon.px.lg} className="text-blue-600" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl',
        'bg-background-card border border-border-default',
        'text-text-secondary hover:text-text-primary',
        'hover:bg-background-hover',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        'shadow-sm hover:shadow-md',
        className
      )}
      aria-label={resolvedTheme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
    >
      {resolvedTheme === 'dark' ? (
        <>
          <Sun size={sizes.icon.px.lg} className="text-yellow-400" />
          <span className="text-sm font-medium">{t('theme.lightMode')}</span>
        </>
      ) : (
        <>
          <Moon size={sizes.icon.px.lg} className="text-blue-600" />
          <span className="text-sm font-medium">{t('theme.darkMode')}</span>
        </>
      )}
    </button>
  );
}

