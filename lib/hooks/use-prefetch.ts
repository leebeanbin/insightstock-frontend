/**
 * 프리페칭 훅
 * 사용자가 특정 페이지로 이동할 가능성이 높을 때 미리 데이터를 로드
 * 토스 스타일의 부드러운 사용자 경험을 위한 프리페칭 전략
 */

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCacheConfig } from '@/lib/config/cache';
import { stockKeys } from './use-stocks';
import { favoriteKeys } from './use-favorites';
import { portfolioKeys } from './use-portfolio';

/**
 * 종목 상세 페이지 프리페칭
 * 호버 시 또는 링크 클릭 전에 미리 데이터를 로드
 */
export function usePrefetchStock() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const prefetchStock = async (stockId: string | null) => {
    if (!stockId) return;

    // 종목 상세 데이터 프리페칭
    await queryClient.prefetchQuery({
      queryKey: stockKeys.detail(stockId),
      queryFn: async () => {
        const { stockService } = await import('@/lib/services');
        return stockService.getStockByCode(stockId);
      },
      ...getCacheConfig('stock', 'detail'),
    });

    // 종목 차트 데이터 프리페칭
    await queryClient.prefetchQuery({
      queryKey: stockKeys.prices(stockId, { period: '1m' }),
      queryFn: async () => {
        const { stockService } = await import('@/lib/services');
        return stockService.getStockPrices(stockId, { period: '1m' });
      },
      ...getCacheConfig('stock', 'chart'),
    });

    // 즐겨찾기 상태 프리페칭
    await queryClient.prefetchQuery({
      queryKey: favoriteKeys.check(stockId),
      queryFn: async () => {
        const { favoritesService } = await import('@/lib/services');
        return favoritesService.checkFavorite(stockId);
      },
      ...getCacheConfig('favorites', 'check'),
    });

    // 포트폴리오 상태는 이미 usePortfolios()로 전체 목록을 가져오므로
    // 개별 체크 API 호출 불필요 (404 에러 방지 및 성능 최적화)
    // StockListSection에서 이미 포트폴리오 목록을 캐시하고 있음
  };

  return { prefetchStock };
}

/**
 * 뉴스 상세 페이지 프리페칭
 */
export function usePrefetchNews() {
  const queryClient = useQueryClient();

  const prefetchNews = async (newsId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['news', newsId],
      queryFn: async () => {
        const { newsService } = await import('@/lib/services');
        return newsService.getNewsDetail(newsId);
      },
      ...getCacheConfig('news', 'detail'),
    });
  };

  return { prefetchNews };
}

/**
 * 종목 목록 프리페칭
 * 카테고리 변경 시 미리 다음 카테고리 데이터를 로드
 */
export function usePrefetchStockList() {
  const queryClient = useQueryClient();

  const prefetchStockList = async (category: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['stocks', 'category', category],
      queryFn: async () => {
        const { fetchStocksByCategory } = await import('@/lib/api/krx');
        return fetchStocksByCategory(category);
      },
      ...getCacheConfig('stock', 'list'),
    });
  };

  return { prefetchStockList };
}

