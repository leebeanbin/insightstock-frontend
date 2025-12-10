/**
 * Stock Service
 * 종목 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { StockRepository } from '../repositories/stock.repository';
import { Stock } from '../types';
import {
  StockDetail,
  StockListResponse,
  StockPricesResponse,
  StockSearchResponse,
} from '../types/api/stock.types';

export class StockService {
  constructor(private repository: StockRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 종목 목록 조회 (비즈니스 로직: 기본값 설정, 정렬)
   */
  async getStocks(params?: {
    market?: 'KOSPI' | 'KOSDAQ' | 'all';
    sector?: string;
    sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<StockListResponse> {
    // 비즈니스 로직: 기본값 설정
    const market = params?.market || 'all';
    const sortBy = params?.sortBy || 'marketCap';
    const sortOrder = params?.sortOrder || 'desc';
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;

    return await this.repository.findMany({
      market,
      sector: params?.sector,
      sortBy,
      sortOrder,
      limit,
      offset,
    });
  }

  /**
   * 종목 상세 조회
   */
  async getStock(id: string): Promise<StockDetail> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('Stock ID is required');
    }

    const stock = await this.repository.findById(id);
    if (!stock) {
      throw new Error('Stock not found');
    }

    return stock;
  }

  /**
   * 종목 코드로 조회 (비즈니스 로직)
   */
  async getStockByCode(
    code: string, 
    options?: { 
      chart?: boolean; 
      period?: number;
      interval?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<StockDetail> {
    if (!code) {
      throw new Error('Stock code is required');
    }

    const stock = await this.repository.findByCode(code, options);
    if (!stock) {
      throw new Error(`Stock with code ${code} not found`);
    }

    return stock;
  }

  /**
   * 차트 데이터 조회 (비즈니스 로직: 기본값 설정)
   */
  async getStockPrices(
    id: string,
    params?: {
      period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | '3y' | '5y';
      interval?: '1m' | '5m' | '30m' | '1h' | '1d';
    }
  ): Promise<StockPricesResponse> {
    if (!id) {
      throw new Error('Stock ID is required');
    }

    // 비즈니스 로직: 기본값 설정
    const period = params?.period || '1m';
    const interval = params?.interval || '1d';

    return await this.repository.getPrices(id, { period, interval });
  }

  /**
   * 종목 검색 (비즈니스 로직: 유효성 검증)
   */
  async searchStocks(query: string, limit: number = 10): Promise<StockSearchResponse> {
    // 비즈니스 로직: 유효성 검증
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    if (query.length < 1) {
      throw new Error('Search query must be at least 1 character');
    }

    return await this.repository.search(query.trim(), limit);
  }

  /**
   * 시장별 종목 조회 (비즈니스 로직)
   */
  async getStocksByMarket(
    market: 'KOSPI' | 'KOSDAQ',
    params?: {
      sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ): Promise<StockListResponse> {
    return await this.getStocks({
      ...params,
      market,
    });
  }

  /**
   * 섹터별 종목 조회 (비즈니스 로직)
   */
  async getStocksBySector(
    sector: string,
    params?: {
      sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ): Promise<StockListResponse> {
    if (!sector) {
      throw new Error('Sector is required');
    }

    return await this.getStocks({
      ...params,
      sector,
    });
  }
}

