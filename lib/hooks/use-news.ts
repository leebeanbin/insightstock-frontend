/**
 * useNews Hook
 * 뉴스 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { newsService } from '../services';
import {
  News,
  NewsListResponse,
  NewsDetailResponse,
} from '../types/api/news.types';
import { getCacheConfig } from '../config/cache';
import { useTrackNewsRead } from './use-user-activity';

// Query Keys
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (params?: {
    limit?: number;
    offset?: number;
    stockId?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }) => [...newsKeys.lists(), params] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
  byStock: (stockId: string) => [...newsKeys.lists(), 'stock', stockId] as const,
  bySentiment: (sentiment: 'positive' | 'negative' | 'neutral') =>
    [...newsKeys.lists(), 'sentiment', sentiment] as const,
};

/**
 * 뉴스 목록 조회 Hook
 */
export function useNews(params?: {
  limit?: number;
  offset?: number;
  stockId?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}) {
  return useQuery<NewsListResponse, Error>({
    queryKey: newsKeys.list(params),
    queryFn: () => newsService.getNews(params),
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

/**
 * 뉴스 상세 조회 Hook
 */
export function useNewsDetail(
  id: string | null,
  options?: { enabled?: boolean }
) {
  const { mutate: trackRead } = useTrackNewsRead();

  const query = useQuery<NewsDetailResponse, Error>({
    queryKey: newsKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('News ID is required');
      return newsService.getNewsDetail(id);
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
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
    ...getCacheConfig('news', 'detail'),
  });

  // 뉴스 상세 조회 시 읽기 추적
  useEffect(() => {
    if (id && query.data) {
      trackRead(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, query.data]);

  return query;
}

/**
 * 종목별 뉴스 조회 Hook
 */
export function useNewsByStock(
  stockId: string | null,
  params?: { limit?: number; offset?: number }
) {
  return useQuery<NewsListResponse, Error>({
    queryKey: newsKeys.byStock(stockId || ''),
    queryFn: () => {
      if (!stockId) throw new Error('Stock ID is required');
      return newsService.getNewsByStock(stockId, params);
    },
    enabled: !!stockId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 감성별 뉴스 조회 Hook
 */
export function useNewsBySentiment(
  sentiment: 'positive' | 'negative' | 'neutral',
  params?: { limit?: number; offset?: number }
) {
  return useQuery<NewsListResponse, Error>({
    queryKey: newsKeys.bySentiment(sentiment),
    queryFn: () => newsService.getNewsBySentiment(sentiment, params),
    staleTime: 5 * 60 * 1000,
  });
}

