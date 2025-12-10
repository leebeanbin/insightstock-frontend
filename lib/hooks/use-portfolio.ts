/**
 * usePortfolio Hook
 * 포트폴리오 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../services';
import {
  PortfolioItem,
  PortfolioListResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  PortfolioAnalysisResponse,
} from '../types/api/portfolio.types';
import { getCacheConfig } from '../config/cache';

// Query Keys (중앙 관리)
export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (params?: {
    sortBy?: 'profit' | 'profitRate' | 'currentValue';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }) => [...portfolioKeys.lists(), params] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (id: string) => [...portfolioKeys.details(), id] as const,
  analysis: () => [...portfolioKeys.all, 'analysis'] as const,
};

/**
 * 포트폴리오 목록 조회 Hook
 */
export function usePortfolios(params?: {
  sortBy?: 'profit' | 'profitRate' | 'currentValue';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) {
  return useQuery<PortfolioListResponse, Error>({
    queryKey: portfolioKeys.list(params),
    queryFn: () => portfolioService.getPortfolios(params),
    ...getCacheConfig('portfolio', 'list'),
  });
}

/**
 * 포트폴리오 상세 조회 Hook
 */
export function usePortfolio(id: string | null) {
  return useQuery<PortfolioItem, Error>({
    queryKey: portfolioKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Portfolio ID is required');
      return portfolioService.getPortfolio(id);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * 포트폴리오 추가 Hook
 */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation<PortfolioItem, Error, CreatePortfolioRequest>({
    mutationFn: (data) => portfolioService.createPortfolio(data),
    onSuccess: (_, variables) => {
      // 포트폴리오 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.analysis() });
      // 포트폴리오 확인 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [...portfolioKeys.all, 'check', variables.stockId] });
    },
  });
}

/**
 * 포트폴리오 수정 Hook
 */
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation<
    PortfolioItem,
    Error,
    { id: string; data: UpdatePortfolioRequest }
  >({
    mutationFn: ({ id, data }) => portfolioService.updatePortfolio(id, data),
    onSuccess: (data) => {
      // 포트폴리오 상세 및 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.analysis() });
    },
  });
}

/**
 * 포트폴리오 삭제 Hook
 */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => portfolioService.deletePortfolio(id),
    onSuccess: () => {
      // 포트폴리오 목록 및 분석 캐시 무효화
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.analysis() });
    },
  });
}

/**
 * 포트폴리오 AI 리스크 분석 Hook
 */
export function usePortfolioAnalysis() {
  return useQuery<PortfolioAnalysisResponse, Error>({
    queryKey: portfolioKeys.analysis(),
    queryFn: () => portfolioService.getAnalysis(),
    ...getCacheConfig('portfolio', 'analysis'),
  });
}

/**
 * 포트폴리오 확인 Hook (stockId로)
 * 404 에러는 정상적인 상황(포트폴리오에 없음)이므로 조용히 처리
 */
export function useCheckPortfolio(stockId: string | null) {
  return useQuery<{ isInPortfolio: boolean }, Error>({
    queryKey: [...portfolioKeys.all, 'check', stockId || ''],
    queryFn: async () => {
      if (!stockId) return { isInPortfolio: false };
      try {
        const portfolio = await portfolioService.getPortfolioByStockId(stockId);
        return { isInPortfolio: !!portfolio };
      } catch (error: any) {
        // 404 에러는 포트폴리오에 없는 것이므로 정상
        if (error?.response?.status === 404) {
          return { isInPortfolio: false };
        }
        // 다른 에러는 그대로 throw
        throw error;
      }
    },
    enabled: !!stockId,
    retry: false, // 404는 재시도 불필요
    ...getCacheConfig('portfolio', 'list'),
  });
}

