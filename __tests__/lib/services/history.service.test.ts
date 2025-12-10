/**
 * History Service Tests
 * 히스토리 서비스 비즈니스 로직 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistoryService } from '@/lib/services/history.service';
import { HistoryRepository } from '@/lib/repositories/history.repository';
import { HistoryItem } from '@/lib/types/api/history.types';

describe('HistoryService', () => {
  let service: HistoryService;
  let mockRepository: HistoryRepository;

  beforeEach(() => {
    // Mock Repository 생성
    mockRepository = {
      create: vi.fn(),
      findMany: vi.fn(),
      findById: vi.fn(),
      findRecent: vi.fn(),
      delete: vi.fn(),
    } as unknown as HistoryRepository;

    service = new HistoryService(mockRepository);
  });

  describe('addHistory', () => {
    it('should add history with valid stockId', async () => {
      const mockHistory: HistoryItem = {
        id: 'history-1',
        stock: {
          id: 'stock-1',
          code: '005930',
          name: '삼성전자',
          currentPrice: 55000,
        },
        viewedAt: new Date().toISOString(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockHistory);

      const result = await service.addHistory('stock-1');

      expect(result).toEqual(mockHistory);
      expect(mockRepository.create).toHaveBeenCalledWith('stock-1');
    });

    it('should throw error when stockId is empty', async () => {
      await expect(service.addHistory('')).rejects.toThrow(
        'Stock ID is required'
      );
    });
  });

  describe('getHistory', () => {
    it('should return history list with default params', async () => {
      const mockResponse = {
        history: [
          {
            id: 'history-1',
            stock: {
              id: 'stock-1',
              code: '005930',
              name: '삼성전자',
              currentPrice: 55000,
            },
            viewedAt: new Date().toISOString(),
          },
        ],
        total: 1,
      };

      vi.mocked(mockRepository.findMany).mockResolvedValue(mockResponse);

      const result = await service.getHistory();

      expect(result).toEqual(mockResponse);
      expect(mockRepository.findMany).toHaveBeenCalledWith({
        limit: 50,
        offset: 0,
      });
    });

    it('should return history list with custom params', async () => {
      const mockResponse = {
        history: [],
        total: 0,
      };

      vi.mocked(mockRepository.findMany).mockResolvedValue(mockResponse);

      const result = await service.getHistory({ limit: 20, offset: 10 });

      expect(result).toEqual(mockResponse);
      expect(mockRepository.findMany).toHaveBeenCalledWith({
        limit: 20,
        offset: 10,
      });
    });
  });

  describe('deleteHistory', () => {
    it('should delete history with valid id', async () => {
      const mockResponse = { message: 'History deleted successfully' };

      vi.mocked(mockRepository.delete).mockResolvedValue(mockResponse);

      const result = await service.deleteHistory('history-1');

      expect(result).toEqual(mockResponse);
      expect(mockRepository.delete).toHaveBeenCalledWith('history-1');
    });

    it('should throw error when id is empty', async () => {
      await expect(service.deleteHistory('')).rejects.toThrow(
        'History ID is required'
      );
    });
  });

  describe('clearHistory', () => {
    it('should throw error (not implemented)', async () => {
      await expect(service.clearHistory()).rejects.toThrow(
        'Clear all history is not implemented yet'
      );
    });
  });
});

