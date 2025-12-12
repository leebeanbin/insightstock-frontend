'use client';

import React, { memo, useState, useEffect, useRef, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// SearchModal을 동적으로 로드 (코드 스플리팅)
const SearchModal = dynamic(() => import('./SearchModal').then(mod => ({ default: mod.SearchModal })), {
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="animate-spin text-gray-400" size={20} />
    </div>
  ),
  ssr: false,
});

export interface HeaderProps {
  className?: string;
  onStockSelect?: (stock: any) => void;
}

const Header = ({ className, onStockSelect }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 주요 네비게이션 링크들 (헤더에 표시)
  const mainNavLinks = [
    { href: '/dashboard', label: t('nav.dashboard'), key: 'dashboard' },
    { href: '/news', label: t('nav.news'), key: 'news' },
    { href: '/explore', label: t('nav.explore'), key: 'explore' },
  ];

  // 키보드 단축키 (Q 또는 /)로 검색 포커스
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Q 또는 / 키를 눌렀을 때 검색 포커스 (입력 필드에 포커스가 없을 때만)
      if ((e.key === 'q' || e.key === '/') && !isSearchFocused && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // ESC로 검색 포커스 해제
      if (e.key === 'Escape' && isSearchFocused) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // 검색 처리 - 모달 열기만 (실제 검색은 모달에서 처리)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 모달이 이미 열려있으면 검색 실행, 아니면 모달만 열기
    if (isSearchModalOpen && searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchModalOpen(false);
      setIsSearchFocused(false);
    } else {
      setIsSearchModalOpen(true);
      setIsSearchFocused(true);
    }
  };

  return (
    <header
      className={cn(
        'min-h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
        'flex items-center justify-between px-4 py-3 gap-4',
        'transition-colors duration-200 sticky top-0 z-50',
        className
      )}
    >
      {/* 왼쪽: 주요 네비게이션 (로고 제거) */}
      <div className="flex items-center gap-4 shrink-0">
        <nav className="hidden md:flex items-center gap-1">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/dashboard' && pathname === '/');
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ease-out relative',
                  'hover:scale-[0.98] active:scale-[0.96]',
                  'hover:shadow-sm active:shadow-none',
                  isActive
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] bg-[var(--brand-main)]/8 dark:bg-[var(--brand-purple)]/12 font-bold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 오른쪽: 여백 공간 + 검색 바 */}
      <div className="flex-1 flex items-center justify-end gap-4 pr-4">
        {/* 여백 공간 - 모달이 여기에 표시됨 */}
        <div className="relative flex-1 max-w-2xl min-w-0">
          {/* 검색 모달 - 여백 공간에 표시 */}
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => {
              setIsSearchModalOpen(false);
              setIsSearchFocused(false);
            }}
            searchQuery={searchQuery}
            onStockSelect={onStockSelect}
          />
        </div>

        {/* 검색 바 - 오른쪽에 고정 */}
        <form onSubmit={handleSearch} className="relative w-56 shrink-0">
        <div
          className={cn(
            'relative flex items-center',
            'bg-gray-100 dark:bg-gray-800 rounded-lg',
            'border-2',
            'transition-all',
            // 모달이 열려있지 않을 때만 포커스 스타일 적용
            isSearchModalOpen ? 'border-transparent' : 'border-transparent focus-within:border-purple-500 dark:focus-within:border-purple-400',
            isSearchFocused && !isSearchModalOpen && 'bg-white dark:bg-gray-900'
          )}
        >
          <Search
            size={16}
            className="absolute left-3 text-gray-400 dark:text-gray-500"
            strokeWidth={2.5}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (!isSearchModalOpen) {
                setIsSearchFocused(true);
                setIsSearchModalOpen(true);
              }
            }}
            onBlur={() => {
              setIsSearchFocused(false);
            }}
            onClick={() => {
              if (!isSearchModalOpen) {
                setIsSearchFocused(true);
                setIsSearchModalOpen(true);
              }
            }}
            // 모달이 열려있을 때는 포커스를 받지 못하도록 설정
            readOnly={isSearchModalOpen}
            tabIndex={isSearchModalOpen ? -1 : 0}
            placeholder={isSearchFocused && !isSearchModalOpen ? t('search.placeholderFocused') : t('search.placeholder')}
            className={cn(
              'w-full pl-8 pr-3 py-2 bg-transparent',
              'text-base font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
              'focus:outline-none',
              // 모달이 열려있을 때는 포인터 이벤트 비활성화
              isSearchModalOpen && 'pointer-events-none'
            )}
          />
          {isSearchFocused && !isSearchModalOpen && (
            <kbd className="absolute right-2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
              ESC
            </kbd>
          )}
        </div>
        </form>
      </div>
    </header>
  );
};

export default memo(Header);

