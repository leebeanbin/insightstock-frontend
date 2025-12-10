/**
 * Portfolio Repository Tests
 * 포트폴리오 Repository 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortfolioRepository } from '@/lib/repositories/portfolio.repository';
import { PortfolioItem, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/lib/types/api/portfolio.types';
import apiClient from '@/lib/api-client';

// Mock apiClient
vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('PortfolioRepository', () => {
  let repository: PortfolioRepository;

  beforeEach(() => {
    repository = new PortfolioRepository();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a portfolio item', async () => {
      const request: CreatePortfolioRequest = {
        stockId: 'stock-1',
        quantity: 10,
        averagePrice: 50000,
      };

      const expectedResult: PortfolioItem = {
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

      vi.mocked(apiClient.post).mockResolvedValue({ data: expectedResult });

      const result = await repository.create(request);

      expect(result).toEqual(expectedResult);
      expect(apiClient.post).toHaveBeenCalledWith('/portfolio', request);
    });

    it('should use mock data when API fails', async () => {
      const request: CreatePortfolioRequest = {
        stockId: 'stock-1',
        quantity: 10,
        averagePrice: 50000,
      };

      vi.mocked(apiClient.post).mockRejectedValue(new Error('API Error'));

      const result = await repository.create(request);

      expect(result).toBeDefined();
      expect(result.stock.id).toBe('stock-1');
      expect(result.quantity).toBe(10);
      expect(result.averagePrice).toBe(50000);
    });
  });

  describe('findByStockId', () => {
    it('should find portfolio by stockId', async () => {
      const stockId = 'stock-1';
      const expectedResult: PortfolioItem = {
        id: 'portfolio-1',
        stock: { id: stockId, code: '005930', name: '삼성전자', currentPrice: 55000, changeRate: 5.0 },
        quantity: 10,
        averagePrice: 50000,
        totalCost: 500000,
        currentValue: 550000,
        profit: 50000,
        profitRate: 10.0,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: expectedResult });

      const result = await repository.findByStockId(stockId);

      expect(result).toEqual(expectedResult);
      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/stock/stock-1', { params: undefined });
    });

    it('should return null when not found (404)', async () => {
      const stockId = 'non-existent';
      const error = { response: { status: 404 } };
      vi.mocked(apiClient.get).mockRejectedValue(error);

      const result = await repository.findByStockId(stockId);

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should return portfolio list', async () => {
      const params = { sortBy: 'profit', sortOrder: 'desc', limit: 10, offset: 0 };
      const expectedResult = {
        portfolios: [],
        summary: { totalCost: 0, currentValue: 0, totalProfit: 0, totalProfitRate: 0 },
        total: 0,
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: expectedResult });

      const result = await repository.findMany(params);

      expect(result).toEqual(expectedResult);
      expect(apiClient.get).toHaveBeenCalledWith('/portfolio', { params });
    });
  });

  describe('update', () => {
    it('should update portfolio', async () => {
      const id = 'portfolio-1';
      const updateData: UpdatePortfolioRequest = { quantity: 12, averagePrice: 55000 };
      const expectedResult: PortfolioItem = {
        id,
        stock: { id: 'stock-1', code: '005930', name: '삼성전자', currentPrice: 55000, changeRate: 5.0 },
        quantity: 12,
        averagePrice: 55000,
        totalCost: 660000,
        currentValue: 660000,
        profit: 0,
        profitRate: 0,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(apiClient.patch).mockResolvedValue({ data: expectedResult });

      const result = await repository.update(id, updateData);

      expect(result).toEqual(expectedResult);
      expect(apiClient.patch).toHaveBeenCalledWith('/portfolio/portfolio-1', updateData);
    });
  });

  describe('delete', () => {
    it('should delete portfolio', async () => {
      const id = 'portfolio-1';
      const expectedResult = { message: 'Portfolio deleted successfully' };

      vi.mocked(apiClient.delete).mockResolvedValue({ data: expectedResult });

      const result = await repository.delete(id);

      expect(result).toEqual(expectedResult);
      expect(apiClient.delete).toHaveBeenCalledWith('/portfolio/portfolio-1');
    });
  });
});

