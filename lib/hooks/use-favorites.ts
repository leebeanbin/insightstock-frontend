/**
 * useFavorites Hook
 * 즐겨찾기 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../services';
import {
  Favorite,
  FavoriteListResponse,
  CheckFavoriteResponse,
} from '../types/api/favorites.types';
import { getCacheConfig } from '../config/cache';

// Query Keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...favoriteKeys.lists(), params] as const,
  checks: () => [...favoriteKeys.all, 'check'] as const,
  check: (stockId: string) => [...favoriteKeys.checks(), stockId] as const,
};

/**
 * 즐겨찾기 목록 조회 Hook
 */
export function useFavorites(params?: { limit?: number; offset?: number }) {
  return useQuery<FavoriteListResponse, Error>({
    queryKey: favoriteKeys.list(params),
    queryFn: () => favoritesService.getFavorites(params),
    ...getCacheConfig('favorites', 'list'),
  });
}

/**
 * 즐겨찾기 확인 Hook
 */
export function useCheckFavorite(stockId: string | null) {
  return useQuery<CheckFavoriteResponse, Error>({
    queryKey: favoriteKeys.check(stockId || ''),
    queryFn: () => {
      if (!stockId) throw new Error('Stock ID is required');
      return favoritesService.checkFavorite(stockId);
    },
    enabled: !!stockId,
    ...getCacheConfig('favorites', 'check'),
  });
}

/**
 * 즐겨찾기 추가 Hook
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation<Favorite, Error, string>({
    mutationFn: (stockId) => favoritesService.addFavorite(stockId),
    onSuccess: (data) => {
      // 즐겨찾기 목록 및 확인 캐시 무효화
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(data.stock.id) });
    },
  });
}

/**
 * 즐겨찾기 삭제 Hook
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (stockId) => favoritesService.removeFavorite(stockId),
    onSuccess: (_, stockId) => {
      // 즐겨찾기 목록 및 확인 캐시 무효화
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(stockId) });
    },
  });
}

/**
 * 즐겨찾기 토글 Hook
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<
    { isFavorite: boolean; message: string },
    Error,
    string
  >({
    mutationFn: (stockId) => favoritesService.toggleFavorite(stockId),
    onSuccess: (_, stockId) => {
      // 즐겨찾기 목록 및 확인 캐시 무효화
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(stockId) });
    },
  });
}

