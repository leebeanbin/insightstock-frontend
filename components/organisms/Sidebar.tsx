'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  BarChart3,
  Newspaper,
  GraduationCap,
  Compass,
  Briefcase,
  Star,
  Clock,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

// 주요 네비게이션은 헤더로 이동, 사이드바에는 개인 기능만
const mainNavItems: NavItem[] = [
  { labelKey: 'nav.education', href: '/education', icon: GraduationCap },
  { labelKey: 'nav.portfolio', href: '/portfolio', icon: Briefcase },
];

const secondaryNavItems: NavItem[] = [
  { labelKey: 'nav.favorites', href: '/favorites', icon: Star },
  { labelKey: 'nav.history', href: '/history', icon: Clock },
  { labelKey: 'nav.hotIssue', href: '/hot-issue', icon: TrendingUp },
];

export interface SidebarProps {
  className?: string;
}

  const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();

  // localStorage에서 접기 상태 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    }
  }, []);

  // 접기 상태 저장
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState));
    }
  };

  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
            {/* Logo Area */}
            <div className={cn(
              'h-16 flex items-center gap-3 px-4',
              'border-b border-gray-200 dark:border-gray-800',
              'relative group/logo',
              isCollapsed && 'justify-center'
            )}>
              {/* 로고 - 접혀있을 때도 항상 표시 */}
              <Link 
                href="/dashboard" 
                className={cn(
                  'flex items-center gap-3 shrink-0',
                  'hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 ease-out',
                  'hover:opacity-80',
                  isCollapsed && 'justify-center'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md shrink-0">
                  <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
                </div>
                {!isCollapsed && (
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300">
                    InsightStock
                  </h1>
                )}
              </Link>
              
              {/* 접기/펼치기 버튼 - 펼쳐있을 때만 호버 시 표시, 접혀있을 때는 항상 표시 */}
              <button
                onClick={toggleCollapse}
                className={cn(
                  'p-1.5 rounded-lg',
                  'hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out',
                  'hover:scale-110 active:scale-95',
                  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                  'absolute right-2',
                  isCollapsed 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover/logo:opacity-100'
                )}
                title={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
              >
                {isCollapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1 px-2">
                {mainNavItems.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                          'text-base font-semibold transition-all duration-200 ease-out',
                          'relative group/item',
                          'hover:scale-[0.98] active:scale-[0.96]',
                          'hover:shadow-sm active:shadow-none',
                          isActive
                            ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] bg-[var(--brand-main)]/10 dark:bg-[var(--brand-purple)]/15 font-bold shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]'
                        )}
                        title={isCollapsed ? t(item.labelKey) : undefined}
                      >
                        <div className={cn(
                          'shrink-0 transition-all duration-200',
                          isActive 
                            ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' 
                            : 'text-gray-500 dark:text-gray-400 group-hover/item:text-[var(--brand-main)] dark:group-hover/item:text-[var(--brand-purple)]'
                        )}>
                          <Icon 
                            size={20} 
                            strokeWidth={isActive ? 2.5 : 2}
                            className="transition-transform duration-200 group-hover/item:scale-110"
                          />
                        </div>
                        <span className={cn(
                          'transition-opacity duration-300 whitespace-nowrap',
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                        )}>{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Divider */}
              <div className="my-2 mx-2 h-px bg-gray-200 dark:bg-gray-800" />

              {/* Secondary Navigation */}
              <ul className="space-y-1 px-2">
                {secondaryNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                          'text-base font-semibold transition-all duration-200 ease-out',
                          'relative group/item',
                          'hover:scale-[0.98] active:scale-[0.96]',
                          'hover:shadow-sm active:shadow-none',
                          isActive
                            ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] bg-[var(--brand-main)]/10 dark:bg-[var(--brand-purple)]/15 font-bold shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]'
                        )}
                        title={isCollapsed ? t(item.labelKey) : undefined}
                      >
                        <div className={cn(
                          'shrink-0 transition-all duration-200',
                          isActive 
                            ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' 
                            : 'text-gray-500 dark:text-gray-400 group-hover/item:text-[var(--brand-main)] dark:group-hover/item:text-[var(--brand-purple)]'
                        )}>
                          <Icon 
                            size={20} 
                            strokeWidth={isActive ? 2.5 : 2}
                            className="transition-transform duration-200 group-hover/item:scale-110"
                          />
                        </div>
                        <span className={cn(
                          'transition-opacity duration-300 whitespace-nowrap',
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                        )}>{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
      </nav>

            {/* Settings */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-base font-semibold transition-all duration-200 ease-out',
                  'relative group/item',
                  'hover:scale-[0.98] active:scale-[0.96]',
                  'hover:shadow-sm active:shadow-none',
                  pathname === '/settings'
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] bg-[var(--brand-main)]/8 dark:bg-[var(--brand-purple)]/12 font-bold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]'
                )}
                title={isCollapsed ? t('nav.settings') : undefined}
              >
                <div className={cn(
                  'shrink-0 transition-all duration-200',
                  pathname === '/settings' 
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' 
                    : 'text-gray-500 dark:text-gray-400 group-hover/item:text-[var(--brand-main)] dark:group-hover/item:text-[var(--brand-purple)]'
                )}>
                  <Settings 
                    size={20} 
                    strokeWidth={pathname === '/settings' ? 2.5 : 2}
                    className="transition-transform duration-200 group-hover/item:scale-110"
                  />
                </div>
                <span className={cn(
                  'transition-all duration-300 whitespace-nowrap',
                  isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                )}>{t('nav.settings')}</span>
              </Link>
            </div>
    </aside>
  );
};

export default Sidebar;

