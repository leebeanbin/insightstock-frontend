'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, X, Search, Loader2, Heart, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useStockSearch } from '@/lib/hooks/use-stocks';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { useHistory } from '@/lib/hooks/use-history';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange } from '@/lib/formatters';
import { modalVariants, overlayVariants, staggerContainer, listItemVariants, fadeInUp } from '@/lib/utils/animations';
import { Skeleton, SkeletonListItem } from '@/components/common/Skeleton';

interface PopularStock {
  id: string;
  code: string;
  name: string;
  price: number;
  changePercent: number;
  logo?: string;
}

interface StockGroup {
  id: string;
  title: string;
  description: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onStockSelect?: (stock: Stock) => void;
}

export function SearchModal({ isOpen, onClose, searchQuery: initialSearchQuery, onStockSelect }: SearchModalProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [popularStocks, setPopularStocks] = useState<PopularStock[]>([]);
  const [stockGroups, setStockGroups] = useState<StockGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 실시간 종목 검색
  const { results: searchStocks, isSearching, search } = useStockSearch();
  
  // 관심 주식 조회
  const { data: favoritesData } = useFavorites();
  const favoriteStocks = useMemo(() => {
    return favoritesData?.favorites?.map(fav => fav.stock).slice(0, 5) || [];
  }, [favoritesData]);
  
  // 최근 본 종목 조회
  const { data: historyData } = useHistory({ limit: 5 });
  const recentStocks = useMemo(() => {
    if (!historyData?.history) return [];
    const stockMap = new Map<string, any>();
    historyData.history.forEach(h => {
      if (h.stock && !stockMap.has(h.stock.id)) {
        stockMap.set(h.stock.id, h.stock);
      }
    });
    return Array.from(stockMap.values()).slice(0, 5);
  }, [historyData]);
  
  // 검색어가 변경될 때마다 검색 실행 (2글자 이상일 때만)
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      search(searchQuery.trim());
    } else {
      search('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // search 함수는 useCallback으로 메모이제이션되어 있으므로 의존성에서 제외

  // 인기 검색 종목 데이터 (새로운 검색 API 사용)
  useEffect(() => {
    if (isOpen) {
      // 인기 검색어 API 호출
      (async () => {
        try {
          const { searchService } = await import('@/lib/services');
          const popularSearches = await searchService.getPopularSearches(5);
          
          // 인기 검색어를 종목으로 변환 (종목 코드/이름으로 검색)
          if (popularSearches && popularSearches.length > 0) {
            const stockPromises = popularSearches.slice(0, 5).map(async (term) => {
              try {
                const stocks = await searchService.searchStocks(term.term, 1);
                if (stocks && stocks.length > 0) {
                  const stock = stocks[0];
                  return {
                    id: stock.id,
                    code: stock.code,
                    name: stock.name,
                    price: stock.currentPrice,
                    changePercent: stock.changePercent ?? 0,
                  };
                }
                return null;
              } catch (err) {
                // 개별 검색 실패는 무시
                return null;
              }
            });
            
            const stocks = (await Promise.all(stockPromises)).filter((s): s is PopularStock => s !== null);
            if (stocks.length > 0) {
              setPopularStocks(stocks);
              return; // 성공 시 종료
            }
          }
          
          // Fallback: 인기 검색어가 없거나 종목 변환 실패 시 임시 데이터 사용
          setPopularStocks([
            { id: '1', code: '005930', name: '삼성전자', price: 68946, changePercent: -2.89 },
            { id: '2', code: '000660', name: 'SK하이닉스', price: 179818, changePercent: 1.02 },
            { id: '3', code: '035420', name: 'NAVER', price: 175863, changePercent: -2.30 },
            { id: '4', code: '035720', name: '카카오', price: 42790, changePercent: 1.88 },
            { id: '5', code: '373220', name: 'LG에너지솔루션', price: 376889, changePercent: 1.86 },
          ]);
        } catch (error) {
          // 에러 발생 시 조용히 fallback 데이터 사용 (콘솔 에러는 repository에서만 표시)
          setPopularStocks([
            { id: '1', code: '005930', name: '삼성전자', price: 69055, changePercent: 1.25 },
            { id: '2', code: '000660', name: 'SK하이닉스', price: 152000, changePercent: -0.89 },
            { id: '3', code: 'BMNU', name: 'BMNU', price: 12500, changePercent: 12.39 },
            { id: '4', code: '034020', name: '두산에너빌리티', price: 78300, changePercent: 4.66 },
            { id: '5', code: 'CONY', name: 'CONY', price: 23400, changePercent: 2.34 },
          ]);
        }
      })();

      // TODO: 실제 API에서 가져오기
      setStockGroups([
        {
          id: '1',
          title: t('search.stockGroups.undervalued'),
          description: t('search.stockGroups.undervaluedDesc'),
        },
        {
          id: '2',
          title: t('search.stockGroups.dividend'),
          description: t('search.stockGroups.dividendDesc'),
        },
        {
          id: '3',
          title: t('search.stockGroups.dualBuy'),
          description: t('search.stockGroups.dualBuyDesc'),
        },
      ]);
    }
  }, [isOpen, t]);

  // 검색어 동기화
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // 모달이 열릴 때 검색바에 포커스 (Header 검색창 포커스 해제)
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Header의 검색창 포커스 강제 해제
      const headerInput = document.querySelector('header input[type="text"]') as HTMLInputElement;
      if (headerInput) {
        headerInput.blur();
        // 포커스를 완전히 제거
        if (document.activeElement === headerInput) {
          (document.activeElement as HTMLElement).blur();
        }
      }
      
      // 모달 검색창으로 포커스 이동
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // 검색 처리 (Enter 키 또는 검색 버튼 클릭 시)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };
  
  // 검색어가 있을 때 검색 결과 표시 여부
  const showSearchResults = searchQuery.trim().length >= 2;

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={onClose}
          />
          
          {/* Modal - 헤더의 여백 공간에 표시 (검색창 왼쪽 여백) */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-800 max-h-[calc(100vh-100px)] overflow-hidden flex flex-col"
          >
        <div className="p-6 flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('search.title')}
            </h2>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={t('search.close')}
            >
              <X size={20} strokeWidth={2} />
            </motion.button>
          </div>

          {/* 검색 바 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-transparent transition-colors pointer-events-auto">
              <Search
                size={18}
                className="absolute left-3 text-gray-400 dark:text-gray-500"
                strokeWidth={2.5}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholderFocused')}
                className={cn(
                  'w-full pl-10 pr-10 py-3 bg-transparent',
                  'text-base font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                  'focus:outline-none'
                )}
              />
              <div className="absolute right-3 flex items-center gap-2">
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </motion.div>
                )}
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="검색어 지우기"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </form>

          </div>

          {/* 검색 결과 - 스크롤 영역 */}
          {showSearchResults && (
            <div className="overflow-y-auto flex-1 px-6 pb-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                {isSearching ? t('search.searching') : t('search.searchResults', { query: searchQuery })}
              </h3>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-purple-500" />
                </div>
              ) : searchStocks.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  {searchStocks.map((stock, index) => {
                    const isPositive = (stock.changePercent ?? 0) >= 0;
                    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                    const handleClick = () => {
                      if (onStockSelect) {
                        onStockSelect(stock);
                      }
                      onClose();
                    };
                    return (
                      <motion.button
                        key={stock.id || stock.code || `search-${index}`}
                        variants={listItemVariants}
                        onClick={handleClick}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-white">
                            {stock.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {stock.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {stock.code} · {stock.market}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                            {formatPrice(stock.currentPrice)}
                          </div>
                          <div className={cn(
                            'flex items-center justify-end gap-1 text-sm font-bold',
                            isPositive ? 'text-red-500' : 'text-blue-500'
                          )}>
                            <TrendIcon size={14} strokeWidth={2.5} />
                            {formatChange(stock.changePercent)}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('search.noSearchResults')}
                </div>
              )}
            </div>
          )}

          {/* 그리드 레이아웃 - 검색어가 없을 때만 표시 */}
          {!showSearchResults && (
            <div className="overflow-y-auto flex-1 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 인기 검색 */}
              <div>
                <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {t('search.popularSearch')}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('search.popularSearchTime', { time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) })}
              </span>
            </div>
            <div className="space-y-1">
              {popularStocks.map((stock, index) => {
                const isPositive = stock.changePercent >= 0;
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                const handleClick = () => {
                  if (onStockSelect) {
                    // PopularStock을 Stock으로 변환
                    const fullStock: Stock = {
                      id: stock.id,
                      code: stock.code,
                      name: stock.name,
                      market: 'KOSPI' as const,
                      currentPrice: stock.price,
                      change: 0,
                      changePercent: stock.changePercent,
                      volume: 0,
                    };
                    onStockSelect(fullStock);
                  }
                  onClose();
                };
                return (
                  <button
                    key={stock.id || stock.code || `popular-${index}`}
                    onClick={handleClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                  >
                    <span className="text-base font-bold text-gray-400 dark:text-gray-500 w-5">
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">
                        {stock.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stock.code}
                      </div>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-base font-bold',
                      isPositive ? 'text-red-500' : 'text-blue-500'
                    )}>
                      <TrendIcon size={16} strokeWidth={2.5} />
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 관심 주식 */}
          {favoriteStocks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} className="text-red-500 fill-red-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  관심 주식
                </h3>
              </div>
              <div className="space-y-1">
                {favoriteStocks.map((stock, index) => {
                  const changePercent = (stock as any).changePercent ?? (stock as any).changeRate ?? 0;
                  const isPositive = changePercent >= 0;
                  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                  const handleClick = () => {
                    if (onStockSelect) {
                      const fullStock: Stock = {
                        ...stock,
                        market: (stock as any).market || 'KOSPI',
                        change: (stock as any).change || 0,
                        changePercent: changePercent,
                        volume: (stock as any).volume || 0,
                      };
                      onStockSelect(fullStock);
                    }
                    onClose();
                  };
                  return (
                    <button
                      key={stock.id || stock.code || `favorite-${index}`}
                      onClick={handleClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {stock.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {stock.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stock.code}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(stock.currentPrice)}
                        </div>
                        <div className={cn(
                          'flex items-center justify-end gap-1 text-sm font-bold',
                          isPositive ? 'text-red-500' : 'text-blue-500'
                        )}>
                          <TrendIcon size={14} strokeWidth={2.5} />
                          {formatChange(changePercent)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 최근 본 */}
          {recentStocks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  최근 본
                </h3>
              </div>
              <div className="space-y-1">
                {recentStocks.map((stock, index) => {
                  const changePercent = (stock as any).changePercent ?? (stock as any).changeRate ?? 0;
                  const isPositive = changePercent >= 0;
                  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                  const handleClick = () => {
                    if (onStockSelect) {
                      const fullStock: Stock = {
                        id: stock.id,
                        code: stock.code,
                        name: stock.name,
                        market: 'KOSPI' as const,
                        currentPrice: stock.currentPrice,
                        change: (stock as any).change || 0,
                        changePercent: changePercent,
                        volume: (stock as any).volume || 0,
                      };
                      onStockSelect(fullStock);
                    }
                    onClose();
                  };
                  return (
                    <button
                      key={stock.id || stock.code || `recent-${index}`}
                      onClick={handleClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {stock.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {stock.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stock.code}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(stock.currentPrice)}
                        </div>
                        <div className={cn(
                          'flex items-center justify-end gap-1 text-sm font-bold',
                          isPositive ? 'text-red-500' : 'text-blue-500'
                        )}>
                          <TrendIcon size={14} strokeWidth={2.5} />
                          {formatChange(changePercent)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 인기있는 주식 골라보기 */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {t('search.popularStocksToChoose')}
              </h3>
              <Link
                href="/explore"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                onClick={onClose}
              >
                {t('search.seeMore')} &gt;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stockGroups.map((group) => (
                <Link
                  key={group.id}
                  href={`/explore?category=${group.id}`}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all group"
                  onClick={onClose}
                >
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {group.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
              </div>
            </div>
          )}
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

