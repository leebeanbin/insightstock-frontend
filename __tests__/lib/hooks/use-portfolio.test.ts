/**
 * usePortfolio Hook Tests
 * 포트폴리오 Hook 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePortfolios, useCreatePortfolio, usePortfolioAnalysis } from '@/lib/hooks/use-portfolio';
import { portfolioService } from '@/lib/services';

// Mock portfolioService
vi.mock('@/lib/services', () => ({
  portfolioService: {
    getPortfolios: vi.fn(),
    getPortfolio: vi.fn(),
    createPortfolio: vi.fn(),
    updatePortfolio: vi.fn(),
    deletePortfolio: vi.fn(),
    getAnalysis: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePortfolio Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePortfolios', () => {
    it('should fetch portfolios', async () => {
      const expectedData = {
        portfolios: [],
        summary: { totalCost: 0, currentValue: 0, totalProfit: 0, totalProfitRate: 0 },
        total: 0,
      };

      vi.mocked(portfolioService.getPortfolios).mockResolvedValue(expectedData);

      const { result } = renderHook(() => usePortfolios(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(expectedData);
      expect(portfolioService.getPortfolios).toHaveBeenCalled();
    });

    it('should fetch portfolios with params', async () => {
      const params = { sortBy: 'profit' as const, sortOrder: 'desc' as const, limit: 10, offset: 0 };
      const expectedData = {
        portfolios: [],
        summary: { totalCost: 0, currentValue: 0, totalProfit: 0, totalProfitRate: 0 },
        total: 0,
      };

      vi.mocked(portfolioService.getPortfolios).mockResolvedValue(expectedData);

      const { result } = renderHook(() => usePortfolios(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(portfolioService.getPortfolios).toHaveBeenCalledWith(params);
    });
  });

  describe('useCreatePortfolio', () => {
    it('should create portfolio', async () => {
      const request = {
        stockId: 'stock-1',
        quantity: 10,
        averagePrice: 50000,
      };

      const expectedResult = {
        id: 'portfolio-1',
        stock: { id: 'stock-1', code: '005930', name: '삼성전자', currentPrice: 55000, changeRate: 5.0 },
        quantity: 10,
        averagePrice: 50000,
        totalCost: 500000,
        currentValue: 550000,
        profit: 50000,
        profitRate: 10.0,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(portfolioService.createPortfolio).mockResolvedValue(expectedResult);

      const { result } = renderHook(() => useCreatePortfolio(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(request);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(portfolioService.createPortfolio).toHaveBeenCalledWith(request);
    });
  });

  describe('usePortfolioAnalysis', () => {
    it('should fetch portfolio analysis', async () => {
      const expectedData = {
        summary: { totalValue: 1000000, totalReturn: 50000, returnRate: 5, riskScore: 65 },
        risks: [],
        diversification: { sectors: [] },
      };

      vi.mocked(portfolioService.getAnalysis).mockResolvedValue(expectedData);

      const { result } = renderHook(() => usePortfolioAnalysis(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(expectedData);
      expect(portfolioService.getAnalysis).toHaveBeenCalled();
    });
  });
});

