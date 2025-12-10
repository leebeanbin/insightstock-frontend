/**
 * useUserActivity Hook
 * 사용자 활동 추적 훅
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userActivityService } from '../services/user-activity.service';

// Query Keys
export const userActivityKeys = {
  all: ['user-activity'] as const,
  context: () => [...userActivityKeys.all, 'context'] as const,
  readNews: () => [...userActivityKeys.all, 'read-news'] as const,
  likedNews: () => [...userActivityKeys.all, 'liked-news'] as const,
  favoriteNews: () => [...userActivityKeys.all, 'favorite-news'] as const,
};

/**
 * 뉴스 읽기 추적 Hook
 */
export function useTrackNewsRead() {
  return useMutation({
    mutationFn: (newsId: string) => userActivityService.trackNewsRead(newsId),
  });
}

/**
 * 뉴스 좋아요 토글 Hook
 */
export function useToggleNewsLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsId: string) => userActivityService.toggleNewsLike(newsId),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: userActivityKeys.likedNews() });
      queryClient.invalidateQueries({ queryKey: userActivityKeys.context() });
    },
  });
}

/**
 * 뉴스 즐겨찾기 토글 Hook
 */
export function useToggleNewsFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsId: string) => userActivityService.toggleNewsFavorite(newsId),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: userActivityKeys.favoriteNews() });
      queryClient.invalidateQueries({ queryKey: userActivityKeys.context() });
    },
  });
}

/**
 * 사용자 컨텍스트 조회 Hook
 */
export function useUserContext() {
  return useQuery({
    queryKey: userActivityKeys.context(),
    queryFn: () => userActivityService.getUserContext(),
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 좋아요한 뉴스 목록 조회 Hook
 */
export function useLikedNews(limit: number = 20) {
  return useQuery<string[], Error>({
    queryKey: [...userActivityKeys.likedNews(), limit],
    queryFn: () => userActivityService.getLikedNews(limit),
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 즐겨찾기한 뉴스 목록 조회 Hook
 */
export function useFavoriteNews(limit: number = 20) {
  return useQuery<string[], Error>({
    queryKey: [...userActivityKeys.favoriteNews(), limit],
    queryFn: () => userActivityService.getFavoriteNews(limit),
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}

