/**
 * useHistory Hook
 * 히스토리 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historyService } from '../services';
import { HistoryItem, HistoryListResponse, CreateHistoryRequest } from '../types/api/history.types';
import { getCacheConfig } from '../config/cache';

// Query Keys
export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...historyKeys.lists(), params] as const,
};

/**
 * 히스토리 목록 조회 Hook
 */
export function useHistory(params?: { limit?: number; offset?: number }) {
  return useQuery<HistoryListResponse, Error>({
    queryKey: historyKeys.list(params),
    queryFn: () => historyService.getHistory(params),
    ...getCacheConfig('history', 'list'),
  });
}

/**
 * 히스토리 추가 Hook (자동 기록)
 */
export function useAddHistory() {
  const queryClient = useQueryClient();

  return useMutation<HistoryItem, Error, CreateHistoryRequest | string>({
    mutationFn: (data) => historyService.addHistory(data),
    onSuccess: () => {
      // 히스토리 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });
}

/**
 * 히스토리 삭제 Hook
 */
export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => historyService.deleteHistory(id),
    onSuccess: () => {
      // 히스토리 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });
}

/**
 * 검색 히스토리 조회 Hook (type='search'만 필터링)
 */
export function useSearchHistory(limit: number = 10) {
  const { data, isLoading, error } = useHistory({ limit: 100 }); // 더 많이 가져와서 필터링

  const searchHistory = data?.history
    ?.filter((item) => item.type === 'search' && item.stock)
    .slice(0, limit) || [];

  return {
    searchHistory,
    isLoading,
    error,
  };
}

