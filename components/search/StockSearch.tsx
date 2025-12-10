/**
 * StockSearch Component
 * 종목 검색 Auto-complete 컴포넌트
 * Debounce 적용, 실시간 검색 결과 표시
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useStockSearch } from '@/lib/hooks/use-stocks';
import { useSearchHistory } from '@/lib/hooks/use-history';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search, TrendingUp, TrendingDown, X, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes } from '@/lib/design-tokens';
import { useDeleteHistory } from '@/lib/hooks/use-history';
import { toast } from 'sonner';

interface StockSearchProps {
  placeholder?: string;
  onSelect?: (stock: Stock) => void;
  className?: string;
  autoFocus?: boolean;
}

export function StockSearch({
  placeholder,
  onSelect,
  className,
  autoFocus = false,
}: StockSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isSearching, search, clearSearch } = useStockSearch();
  const { searchHistory } = useSearchHistory(5);
  const deleteHistory = useDeleteHistory();
  
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      search(debouncedQuery);
    } else {
      clearSearch();
    }
  }, [debouncedQuery, search, clearSearch]);
  
  const isLoading = isSearching;
  const error = null;

  // 검색 결과가 있으면 드롭다운 열기
  useEffect(() => {
    if (results && results.length > 0 && debouncedQuery.length >= 2) {
      setIsOpen(true);
      setShowHistory(false);
    } else if (query.length === 0 && searchHistory.length > 0) {
      // 검색어가 없고 히스토리가 있으면 히스토리 표시
      setShowHistory(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setShowHistory(false);
    }
  }, [results, debouncedQuery, query, searchHistory]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // 클라이언트 사이드에서만 document 접근
    if (typeof document === 'undefined') return;
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);

  const handleSelect = (stock: Stock) => {
    setQuery('');
    setIsOpen(false);
    onSelect?.(stock);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* 검색 입력창 */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results && results.length > 0) {
              setIsOpen(true);
              setShowHistory(false);
            } else if (query.length === 0 && searchHistory.length > 0) {
              setShowHistory(true);
              setIsOpen(true);
            }
          }}
          placeholder={placeholder || t('search.stockSearchPlaceholder')}
          autoFocus={autoFocus}
          className={cn(
            'w-full h-14 pl-12 pr-10 rounded-xl border-2 transition-all duration-200',
            'text-base text-gray-900 placeholder:text-gray-400',
            'bg-white border-gray-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-primary-600/20 focus:border-primary-500',
            isOpen && 'rounded-b-none border-b-0'
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('aria.clearSearch')}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-background-card border-2 border-t-0 border-gray-200 dark:border-border-default rounded-b-xl shadow-lg max-h-96 overflow-y-auto">
          {showHistory && searchHistory.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-border-default">
              <div className="px-4 py-2 bg-gray-50 dark:bg-background-subtle border-b border-gray-200 dark:border-border-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={sizes.icon.px.sm} className="text-text-tertiary" />
                    <span className="text-xs font-semibold text-text-tertiary">
                      {t('search.recentSearches')}
                    </span>
                  </div>
                </div>
              </div>
              {searchHistory.map((item) => {
                if (!item.stock) return null;
                const stock = item.stock;
                return (
                  <Link
                    key={item.id}
                    href={`/stocks/${stock.code}`}
                    onClick={() => {
                      setQuery('');
                      setIsOpen(false);
                      onSelect?.({
                        id: stock.id,
                        code: stock.code,
                        name: stock.name,
                        currentPrice: stock.currentPrice,
                        changePercent: 0,
                      } as Stock);
                    }}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-background-hover transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Clock size={sizes.icon.px.sm} className="text-text-tertiary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-semibold text-text-primary">
                              {stock.name}
                            </span>
                            <span className="text-sm text-text-tertiary">
                              {stock.code}
                            </span>
                          </div>
                          <span className="text-sm text-text-tertiary">
                            {formatPrice(stock.currentPrice)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteHistory.mutate(item.id, {
                            onSuccess: () => {
                              toast.success(t('search.historyDeleted'));
                            },
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-semantic-red/10 text-text-tertiary hover:text-semantic-red transition-all"
                      >
                        <Trash2 size={sizes.icon.px.xs} />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">{t('search.searching')}</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {t('search.searchError')}
            </div>
          ) : !results || results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {t('search.noSearchResults')}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-border-default">
              {results.map((stock, index) => {
                const isSelected = index === selectedIndex;
                const isPositive = stock.changePercent >= 0;
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                return (
                  <Link
                    key={stock.id}
                    href={`/stocks/${stock.code}`}
                    onClick={() => handleSelect(stock)}
                    className={cn(
                      'block p-4 hover:bg-gray-50 dark:hover:bg-background-hover transition-colors',
                      isSelected && 'bg-primary-50 dark:bg-background-subtle'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-semibold text-gray-900 dark:text-text-primary">
                            {stock.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-text-tertiary">
                            {stock.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-text-primary">
                            {formatPrice(stock.currentPrice)}
                          </span>
                          <div className="flex items-center gap-1">
                            <TrendIcon
                              size={sizes.icon.px.sm}
                              className={cn(
                                isPositive
                                  ? 'text-semantic-red'
                                  : 'text-semantic-blue'
                              )}
                            />
                            <span
                              className={cn(
                                'text-sm font-semibold',
                                getChangeColorClass(stock.changePercent)
                              )}
                            >
                              {formatChange(stock.changePercent)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

