/**
 * Portfolio Service Tests
 * 포트폴리오 서비스 비즈니스 로직 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortfolioService } from '@/lib/services/portfolio.service';
import { PortfolioRepository } from '@/lib/repositories/portfolio.repository';
import {
  PortfolioItem,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from '@/lib/types/api/portfolio.types';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockRepository: PortfolioRepository;

  beforeEach(() => {
    // Mock Repository 생성
    mockRepository = {
      create: vi.fn(),
      findMany: vi.fn(),
      findById: vi.fn(),
      findByStockId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getAnalysis: vi.fn(),
    } as unknown as PortfolioRepository;

    service = new PortfolioService(mockRepository);
  });

  describe('createPortfolio', () => {
    it('should create portfolio with valid data', async () => {
      const request: CreatePortfolioRequest = {
        stockId: 'stock-1',
        quantity: 10,
        averagePrice: 50000,
      };

      const mockPortfolio: PortfolioItem = {
        id: 'portfolio-1',
        stock: {
          id: 'stock-1',
          code: '005930',
          name: '삼성전자',
          currentPrice: 55000,
          changeRate: 5.0,
        },
        quantity: 10,
        averagePrice: 50000,
        totalCost: 500000,
        currentValue: 550000,
        profit: 50000,
        profitRate: 10.0,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockPortfolio);

      const result = await service.createPortfolio(request);

      expect(result).toEqual(mockPortfolio);
      expect(mockRepository.create).toHaveBeenCalledWith(request);
    });

    it('should throw error when quantity is zero or negative', async () => {
      const request: CreatePortfolioRequest = {
        stockId: 'stock-1',
        quantity: 0,
        averagePrice: 50000,
      };

      await expect(service.createPortfolio(request)).rejects.toThrow(
        'Quantity must be greater than 0'
      );
    });

    it('should throw error when averagePrice is zero or negative', async () => {
      const request: CreatePortfolioRequest = {
        stockId: 'stock-1',
        quantity: 10,
        averagePrice: -1000,
      };

      await expect(service.createPortfolio(request)).rejects.toThrow(
        'Average price must be greater than 0'
      );
    });
  });

  describe('getPortfolio', () => {
    it('should return portfolio when found', async () => {
      const mockPortfolio: PortfolioItem = {
        id: 'portfolio-1',
        stock: {
          id: 'stock-1',
          code: '005930',
          name: '삼성전자',
          currentPrice: 55000,
          changeRate: 5.0,
        },
        quantity: 10,
        averagePrice: 50000,
        totalCost: 500000,
        currentValue: 550000,
        profit: 50000,
        profitRate: 10.0,
        createdAt: new Date().toISOString(),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockPortfolio);

      const result = await service.getPortfolio('portfolio-1');

      expect(result).toEqual(mockPortfolio);
      expect(mockRepository.findById).toHaveBeenCalledWith('portfolio-1');
    });

    it('should throw error when portfolio not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.getPortfolio('non-existent')).rejects.toThrow(
        'Portfolio not found'
      );
    });

    it('should throw error when id is empty', async () => {
      await expect(service.getPortfolio('')).rejects.toThrow(
        'Portfolio ID is required'
      );
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio with valid data', async () => {
      const existingPortfolio: PortfolioItem = {
        id: 'portfolio-1',
        stock: {
          id: 'stock-1',
          code: '005930',
          name: '삼성전자',
          currentPrice: 55000,
          changeRate: 5.0,
        },
        quantity: 10,
        averagePrice: 50000,
        totalCost: 500000,
        currentValue: 550000,
        profit: 50000,
        profitRate: 10.0,
        createdAt: new Date().toISOString(),
      };

      const updateData: UpdatePortfolioRequest = {
        quantity: 20,
        averagePrice: 52000,
      };

      const updatedPortfolio: PortfolioItem = {
        ...existingPortfolio,
        quantity: 20,
        averagePrice: 52000,
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingPortfolio);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedPortfolio);

      const result = await service.updatePortfolio('portfolio-1', updateData);

      expect(result).toEqual(updatedPortfolio);
      expect(mockRepository.update).toHaveBeenCalledWith('portfolio-1', updateData);
    });

    it('should throw error when quantity is zero or negative', async () => {
      const updateData: UpdatePortfolioRequest = {
        quantity: 0,
      };

      await expect(
        service.updatePortfolio('portfolio-1', updateData)
      ).rejects.toThrow('Quantity must be greater than 0');
    });
  });

  describe('calculateProfitRate', () => {
    it('should calculate profit rate correctly', () => {
      const result = service.calculateProfitRate(55000, 50000);
      expect(result).toBe(10); // (55000 - 50000) / 50000 * 100 = 10%
    });

    it('should return 0 when averagePrice is 0', () => {
      const result = service.calculateProfitRate(55000, 0);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalValue', () => {
    it('should calculate total value correctly', () => {
      const portfolios: PortfolioItem[] = [
        {
          id: 'portfolio-1',
          stock: {
            id: 'stock-1',
            code: '005930',
            name: '삼성전자',
            currentPrice: 55000,
            changeRate: 5.0,
          },
          quantity: 10,
          averagePrice: 50000,
          totalCost: 500000,
          currentValue: 550000,
          profit: 50000,
          profitRate: 10.0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'portfolio-2',
          stock: {
            id: 'stock-2',
            code: '000660',
            name: 'SK하이닉스',
            currentPrice: 120000,
            changeRate: -2.0,
          },
          quantity: 5,
          averagePrice: 130000,
          totalCost: 650000,
          currentValue: 600000,
          profit: -50000,
          profitRate: -7.69,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = service.calculateTotalValue(portfolios);

      expect(result.totalCost).toBe(1150000); // 500000 + 650000
      expect(result.currentValue).toBe(1150000); // 550000 + 600000
      expect(result.totalProfit).toBe(0); // 1150000 - 1150000
      expect(result.totalProfitRate).toBe(0);
    });
  });
});

