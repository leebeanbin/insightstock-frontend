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
                {/* FinFolio Logo */}
                <div className="w-8 h-8 shrink-0">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#4E56C0"/>
                    <path d="M10 9C10 8.44772 10.4477 8 11 8H15C15.5523 8 16 8.44772 16 9V23C16 23.5523 15.5523 24 15 24H11C10.4477 24 10 23.5523 10 23V9Z" fill="white" fillOpacity="0.95"/>
                    <path d="M16 9C16 8.44772 16.4477 8 17 8H21C21.5523 8 22 8.44772 22 9V23C22 23.5523 21.5523 24 21 24H17C16.4477 24 16 23.5523 16 23V9Z" fill="white" fillOpacity="0.95"/>
                    <rect x="17.5" y="18" width="1.5" height="4" rx="0.5" fill="#4E56C0"/>
                    <rect x="19.5" y="15" width="1.5" height="7" rx="0.5" fill="#4E56C0"/>
                    <rect x="21.5" y="13" width="1.5" height="9" rx="0.5" fill="#4E56C0"/>
                    <path d="M14 8L14 12L15.5 10.5L17 12L17 8" fill="#D78FEE" fillOpacity="0.9"/>
                    <rect x="15.5" y="8" width="1" height="16" fill="white" fillOpacity="0.3"/>
                  </svg>
                </div>
                {!isCollapsed && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#4E56C0] via-[#9b5DE0] to-[#D78FEE] bg-clip-text text-transparent transition-all duration-300">
                    FinFolio
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

