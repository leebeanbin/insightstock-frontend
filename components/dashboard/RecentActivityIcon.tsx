/**
 * RecentActivityIcon Component
 * 최근 활동 아이콘 버튼 - 호버 시 팝오버로 최근 활동 목록 표시
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from '@/lib/hooks/use-history';
import { usePortfolios } from '@/lib/hooks/use-portfolio';
import { formatRelativeTime } from '@/lib/formatters';
import { Activity, Eye, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, spacing, typography, borderRadius } from '@/lib/design-tokens';

export function RecentActivityIcon() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: historyData, isLoading: isHistoryLoading } = useHistory({ limit: 5 });
  const { data: portfolioData, isLoading: isPortfolioLoading } = usePortfolios({ limit: 5 });

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const history = historyData?.history || [];
  const portfolios = portfolioData?.portfolios || [];

  // 최근 활동 목록 생성 (조회 + 추가)
  const activities: Array<{
    id: string;
    type: 'view' | 'add';
    title: string;
    subtitle: string;
    time: string;
    stockId?: string;
  }> = [
    ...history.slice(0, 3).map((h) => ({
      id: h.id,
      type: 'view' as const,
      title: h.stock?.name || t('common.unknown'),
      subtitle: t('history.viewed'),
      time: formatRelativeTime(h.viewedAt),
      stockId: h.stock?.id || '',
    })),
    ...portfolios.slice(0, 2).map((p) => ({
      id: p.id,
      type: 'add' as const,
      title: p.stock.name,
      subtitle: t('portfolio.addStock'),
      time: formatRelativeTime(p.createdAt),
      stockId: p.stock.id,
    })),
  ]
    .sort((a, b) => {
      const getTimeA = () => {
        if (a.type === 'view') {
          const h = history.find(h => h.id === a.id);
          return h?.viewedAt ? new Date(h.viewedAt).getTime() : 0;
        } else {
          const p = portfolios.find(p => p.id === a.id);
          return p?.createdAt ? new Date(p.createdAt).getTime() : 0;
        }
      };
      const getTimeB = () => {
        if (b.type === 'view') {
          const h = history.find(h => h.id === b.id);
          return h?.viewedAt ? new Date(h.viewedAt).getTime() : 0;
        } else {
          const p = portfolios.find(p => p.id === b.id);
          return p?.createdAt ? new Date(p.createdAt).getTime() : 0;
        }
      };
      return getTimeB() - getTimeA();
    })
    .slice(0, 5);

  const handleClick = (activity: typeof activities[0]) => {
    if (activity.stockId) {
      const stock = history.find(h => h.id === activity.id)?.stock || 
                   portfolios.find(p => p.id === activity.id)?.stock;
      if (stock?.code) {
        router.push(`/stocks/${stock.code}`);
        setIsOpen(false);
      }
    }
  };

  const activityCount = activities.length;

  return (
    <div className="relative" ref={containerRef}>
      {/* 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          `relative p-[var(--spacing-2)] rounded-[var(--radius-lg)] transition-all duration-200`,
          'hover:bg-[var(--brand-light-purple)]/20 dark:hover:bg-[var(--brand-purple)]/20 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]',
          'text-text-tertiary',
          isOpen && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20 text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
        )}
        aria-label={t('dashboard.recentActivity')}
        title={t('dashboard.recentActivity')}
      >
        <Activity size={sizes.icon.px.lg} strokeWidth={2} />
        {activityCount > 0 && (
          <span className={`absolute -top-[var(--spacing-1)] -right-[var(--spacing-1)] w-[var(--spacing-4)] h-[var(--spacing-4)] bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
            {activityCount > 9 ? '9+' : activityCount}
          </span>
        )}
      </button>

      {/* 팝오버 */}
      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-[var(--spacing-2)] w-80 bg-white rounded-[var(--radius-lg)] border border-gray-200 shadow-xl z-50`}>
          <div className={`flex items-center justify-between px-[var(--spacing-4)] py-[var(--spacing-3)] border-b border-gray-200`}>
            <h3 className={`text-[var(--font-size-sm)] font-bold text-gray-900 dark:text-text-primary`}>{t('dashboard.recentActivity')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-[var(--spacing-1)] rounded hover:bg-gray-100 dark:hover:bg-background-hover transition-colors`}
              aria-label={t('common.close')}
            >
              <X size={sizes.icon.px.md} className="text-gray-500" />
            </button>
          </div>
          
          {isHistoryLoading || isPortfolioLoading ? (
            <div className={`p-[var(--spacing-4)] text-center text-[var(--font-size-sm)] text-gray-500`}>
              {t('common.loading')}
            </div>
          ) : activities.length === 0 ? (
            <div className={`p-[var(--spacing-4)] text-center text-[var(--font-size-sm)] text-gray-500`}>
              {t('dashboard.noRecentActivity')}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleClick(activity)}
                  className={`flex items-center gap-[var(--spacing-3)] px-[var(--spacing-4)] py-[var(--spacing-3)] hover:bg-[var(--brand-light-purple)]/20 dark:hover:bg-[var(--brand-purple)]/20 cursor-pointer transition-colors border-b border-gray-50 dark:border-border-default last:border-0`}
                >
                  <div className={cn(
                    `p-[var(--spacing-2)] rounded-[var(--radius-lg)] shrink-0`,
                    activity.type === 'view' 
                      ? 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20' 
                      : 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20'
                  )}>
                    {activity.type === 'view' ? (
                      <Eye size={sizes.icon.px.md} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                    ) : (
                      <Plus size={sizes.icon.px.md} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[var(--font-size-sm)] font-medium text-gray-900 truncate`}>
                      {activity.title}
                    </p>
                    <p className={`text-[var(--font-size-xs)] text-gray-500 truncate`}>{activity.subtitle}</p>
                  </div>
                  <p className={`text-[var(--font-size-xs)] text-gray-400 whitespace-nowrap shrink-0`}>
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

