/**
 * useInfiniteNews Hook
 * 뉴스 무한 스크롤 Hook
 */

'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { newsService } from '../services';
import { NewsListResponse } from '../types/api/news.types';
import { newsKeys } from './use-news';
import { getCacheConfig } from '../config/cache';

export interface UseInfiniteNewsParams {
  limit?: number;
  stockId?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export function useInfiniteNews(params?: UseInfiniteNewsParams) {
  const limit = params?.limit || 20;

  return useInfiniteQuery<NewsListResponse, Error, InfiniteData<NewsListResponse>, readonly unknown[], number>({
    queryKey: newsKeys.list(params),
    queryFn: ({ pageParam = 0 }) => {
      return newsService.getNews({
        ...params,
        limit,
        offset: pageParam * limit,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.news.length, 0);
      const hasMore = lastPage.total > totalLoaded;
      return hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    // 백엔드 문제 시에도 캐시된 데이터 표시
    keepPreviousData: true,
    // 에러 발생 시에도 캐시된 데이터 사용
    retry: 3, // 백엔드 복구 감지를 위해 재시도 증가
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 최대 10초
    // 백엔드 복구 감지를 위한 주기적 refetch (백그라운드)
    refetchInterval: (query) => {
      // 에러가 발생한 경우에만 주기적으로 재시도 (백엔드 복구 감지)
      if (query.state.error) {
        return 30000; // 30초마다 재시도
      }
      return false; // 정상일 때는 주기적 refetch 비활성화
    },
    ...getCacheConfig('news', 'list'),
  });
}

