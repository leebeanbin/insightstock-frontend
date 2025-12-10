/**
 * useStocks Hook
 * 종목 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 * 
 * 기존 useStocks.ts를 새로운 3-Layer Architecture로 리팩토링
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services';
import { useAddHistory } from './use-history';
import { StockDetail, StockListResponse, StockPricesResponse, StockSearchResponse } from '../types/api/stock.types';
import { Stock, ChartData } from '../types';
import { getCacheConfig } from '../config/cache';

// Query Keys
export const stockKeys = {
  all: ['stocks'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (params?: {
    market?: 'KOSPI' | 'KOSDAQ' | 'all';
    sector?: string;
    sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }) => [...stockKeys.lists(), params] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockKeys.details(), id] as const,
  byCode: (code: string) => [...stockKeys.details(), 'code', code] as const,
  prices: (id: string, params?: { period?: string; interval?: string }) =>
    [...stockKeys.detail(id), 'prices', params] as const,
  searches: () => [...stockKeys.all, 'search'] as const,
  search: (query: string, limit?: number) =>
    [...stockKeys.searches(), query, limit] as const,
};

/**
 * 종목 목록 조회 Hook
 */
export function useStocks(params?: {
  market?: 'KOSPI' | 'KOSDAQ' | 'all';
  sector?: string;
  sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) {
  return useQuery<StockListResponse, Error>({
    queryKey: stockKeys.list(params),
    queryFn: () => stockService.getStocks(params),
    ...getCacheConfig('stock', 'list'),
  });
}

/**
 * 종목 상세 조회 Hook
 */
export function useStock(id: string | null) {
  return useQuery<StockDetail, Error>({
    queryKey: stockKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Stock ID is required');
      return stockService.getStock(id);
    },
    enabled: !!id,
    ...getCacheConfig('stock', 'detail'),
  });
}

/**
 * 종목 코드로 조회 Hook
 */
export function useStockByCode(code: string | null) {
  return useQuery<StockDetail, Error>({
    queryKey: stockKeys.byCode(code || ''),
    queryFn: () => {
      if (!code) throw new Error('Stock code is required');
      return stockService.getStockByCode(code);
    },
    enabled: !!code,
    ...getCacheConfig('stock', 'detail'),
  });
}

/**
 * 차트 데이터 조회 Hook
 */
export function useStockPrices(
  id: string | null,
  params?: {
    period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | '3y' | '5y';
    interval?: '1m' | '5m' | '30m' | '1h' | '1d';
  }
) {
  return useQuery<StockPricesResponse, Error>({
    queryKey: stockKeys.prices(id || '', params),
    queryFn: () => {
      if (!id) throw new Error('Stock ID is required');
      return stockService.getStockPrices(id, params);
    },
    enabled: !!id,
    ...getCacheConfig('stock', 'chart'),
  });
}

/**
 * 종목 검색 Hook (Auto-complete)
 * 기존 API와의 호환성을 위해 useState 기반으로 변경
 * 검색 성공 시 History 자동 저장
 */
export function useStockSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const addHistory = useAddHistory();

  const search = useCallback((searchQuery: string) => {
    // 이전 검색어와 동일하면 무시 (무한 루프 방지)
    if (query === searchQuery) {
      return;
    }

    setQuery(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery || searchQuery.length < 1) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        // 새로운 검색 API 사용
        const { searchService } = await import('../services');
        const results = await searchService.searchStocks(searchQuery, 10);
        setResults(results);

        // 검색 성공 시 첫 번째 결과에 대해 History 저장 (비동기, 에러 무시)
        // 백엔드에서 자동으로 처리하므로 여기서는 선택적으로 호출
        if (results && results.length > 0) {
          const firstResult = results[0];
          if (firstResult.id) {
            // 백엔드가 자동 처리하므로 여기서는 선택적으로 호출
            // addHistory.mutate({ stockId: firstResult.id, type: 'search' });
          }
        }
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [query, addHistory]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
  }, []);

  return { query, results, isSearching, search, clearSearch };
}

/**
 * 시장별 종목 조회 Hook
 */
export function useStocksByMarket(
  market: 'KOSPI' | 'KOSDAQ',
  params?: {
    sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }
) {
  return useQuery<StockListResponse, Error>({
    queryKey: stockKeys.list({ ...params, market }),
    queryFn: () => stockService.getStocksByMarket(market, params),
    ...getCacheConfig('stock', 'list'),
  });
}

/**
 * 섹터별 종목 조회 Hook
 */
export function useStocksBySector(
  sector: string | null,
  params?: {
    sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }
) {
  return useQuery<StockListResponse, Error>({
    queryKey: stockKeys.list({ ...params, sector: sector || undefined }),
    queryFn: () => {
      if (!sector) throw new Error('Sector is required');
      return stockService.getStocksBySector(sector, params);
    },
    enabled: !!sector,
    ...getCacheConfig('stock', 'list'),
  });
}

// ============================================
// 기존 API와의 호환성을 위한 래퍼 함수들
// ============================================

/**
 * 카테고리별 종목 목록 조회 (기존 API 호환)
 * 기존 useStocks.ts와의 호환성을 위해 useState 기반으로 변경
 */
export function useStocksByCategory(initialCategory: string = 'popular') {
  const [category, setCategory] = useState(initialCategory);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, Stock[]>>({});

  const fetchStocks = useCallback(async (cat: string) => {
    if (cacheRef.current[cat]) {
      setStocks(cacheRef.current[cat]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 기존 API 사용
      const { fetchStocksByCategory, STOCK_CATEGORIES } = await import('../api/krx');
      // 카테고리 키를 한글 이름으로 변환 (API 호환성)
      const categoryMap: Record<string, string> = {
        popular: '인기',
        battery: '2차전지',
        it: 'IT/반도체',
        bio: '바이오',
        finance: '금융',
        auto: '자동차',
        media: '엔터/미디어',
      };
      const koreanCategory = categoryMap[cat] || cat;
      const data = await fetchStocksByCategory(koreanCategory);
      cacheRef.current[cat] = data;
      setStocks(data);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
      setError(null); // 번역 키는 컴포넌트에서 처리
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks(category);
  }, [category, fetchStocks]);

  const changeCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  const refetch = useCallback(() => {
    delete cacheRef.current[category];
    fetchStocks(category);
  }, [category, fetchStocks]);

  // 카테고리 키 목록 (번역 키로 사용)
  const categories = ['popular', 'battery', 'it', 'bio', 'finance', 'auto', 'media'];

  return {
    stocks,
    isLoading,
    error,
    category,
    categories,
    changeCategory,
    refetch,
  };
}

/**
 * 종목 차트 데이터 (기존 API 호환)
 * ChartData 형식으로 변환
 */
export function useStockChart(
  code: string | null,
  period: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | number = '1m'
) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Record<string, ChartData[]>>({});

  useEffect(() => {
    if (!code) {
      setChartData([]);
      return;
    }

    // 기간 문자열을 일수로 변환
    let periodDays: number;
    if (typeof period === 'string') {
      // 기간 문자열을 일수로 변환
      const periodMap: Record<string, number> = {
        '1d': 1,
        '1w': 7,
        '1m': 30,
        '3m': 90,
        '6m': 180,
        '1y': 365,
      };
      periodDays = periodMap[period] || 30;
    } else {
      periodDays = period;
    }

    // 1일 차트는 시간대별 세부 데이터를 위해 interval을 '1h'로 설정
    const interval = period === '1d' ? '1h' : '1d';
    
    const cacheKey = `${code}-${periodDays}-${interval}`;
    if (cacheRef.current[cacheKey]) {
      setChartData(cacheRef.current[cacheKey]);
      return;
    }

    setIsLoading(true);

    (async () => {
      try {
        // 백엔드 API 사용 시도 (1일 차트는 시간대별 데이터)
        const stockDetail = await stockService.getStockByCode(code, { chart: true, period: periodDays, interval });
        if (stockDetail?.chartData && Array.isArray(stockDetail.chartData) && stockDetail.chartData.length > 0) {
          // chartData가 이미 올바른 형식인지 확인 (OHLC 데이터 포함)
          // 유효한 데이터만 필터링 (0이나 undefined가 아닌 데이터만)
          const data = stockDetail.chartData
            .map((item: any) => {
              const open = typeof item.open === 'number' && item.open > 0 ? item.open : null;
              const high = typeof item.high === 'number' && item.high > 0 ? item.high : null;
              const low = typeof item.low === 'number' && item.low > 0 ? item.low : null;
              const close = typeof item.close === 'number' && item.close > 0 ? item.close : (typeof item.value === 'number' && item.value > 0 ? item.value : null);
              
              // OHLC 데이터가 모두 유효한 경우만 포함
              if (open != null && high != null && low != null && close != null) {
                return {
                  time: item.time || '',
                  value: close, // 하위 호환성
                  volume: typeof item.volume === 'number' ? item.volume : 0,
                  open: open,
                  high: high,
                  low: low,
                  close: close,
                };
              }
              // OHLC가 없어도 value가 있으면 포함 (선차트용)
              if (close != null) {
                return {
                  time: item.time || '',
                  value: close,
                  volume: typeof item.volume === 'number' ? item.volume : 0,
                };
              }
              return null;
            })
            .filter((item: any): item is NonNullable<typeof item> => item != null);
          
          if (data.length > 0) {
            cacheRef.current[cacheKey] = data;
            setChartData(data);
          } else {
            // 차트 데이터가 없는 것은 정상적인 상황일 수 있음 (백엔드에 데이터 없음)
            setChartData([]);
          }
        } else {
          // 백엔드 응답에 차트 데이터가 없으면 빈 배열 반환 (fallback 제거)
          // 차트 데이터가 없는 것은 정상적인 상황일 수 있음
          setChartData([]);
        }
      } catch (err) {
        // 에러 발생 시에도 조용히 빈 배열 반환
        // 차트 데이터가 없는 것은 정상적인 상황일 수 있음
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [code, period]);

  return { chartData, isLoading };
}

/**
 * 종목 목록 필터링 (로컬)
 */
export function useFilteredStocks(
  stocks: Stock[],
  searchQuery: string
) {
  const [filtered, setFiltered] = useState<Stock[]>(stocks);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(stocks);
      return;
    }

    const result = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.code.includes(searchQuery)
    );

    setFiltered(result);
  }, [stocks, searchQuery]);

  return filtered;
}

// useStocks는 이미 위에서 정의됨 (line 41)

