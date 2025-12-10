/**
 * Stock Repository
 * 종목 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import { Stock } from '../types';
import {
  StockDetail,
  StockListResponse,
  StockPricesResponse,
  StockSearchResponse,
} from '../types/api/stock.types';
import { POPULAR_STOCKS, fetchStockPriceSafe } from '../api/krx';

export class StockRepository extends BaseRepository<Stock> {
  protected basePath = '/stocks';

  /**
   * 종목 목록 조회
   */
  async findMany(params?: {
    market?: 'KOSPI' | 'KOSDAQ' | 'all';
    sector?: string;
    sortBy?: 'price' | 'changeRate' | 'volume' | 'marketCap';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<StockListResponse> {
    try {
      return await this.get<StockListResponse>('', params);
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Mock: 인기 종목 반환
      const stockList = POPULAR_STOCKS['인기'] || [];
      const stocks = await Promise.all(
        stockList.map(async (stock, index) => {
          const priceData = await fetchStockPriceSafe(stock.code);
          return {
            id: `stock-${index}`,
            ...stock,
            market: stock.market as Stock['market'],
            ...priceData,
            marketCap: priceData.currentPrice * 1000000, // Mock
          };
        })
      );

      return {
        stocks,
        total: stocks.length,
        limit: params?.limit || 20,
        offset: params?.offset || 0,
      };
    }
  }

  /**
   * 종목 상세 조회
   */
  async findById(id: string): Promise<StockDetail> {
    try {
      return await this.get<StockDetail>(`/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Mock: 첫 번째 인기 종목 반환
      const stockList = POPULAR_STOCKS['인기'] || [];
      const stock = stockList[0];
      const priceData = await fetchStockPriceSafe(stock.code);

      return {
        id,
        ...stock,
        ...priceData,
        marketCap: priceData.currentPrice * 1000000,
        description: `${stock.name}에 대한 상세 정보입니다.`,
        recentNews: [],
        updatedAt: new Date().toISOString(),
      } as StockDetail;
    }
  }

  /**
   * 종목 코드로 조회
   */
  async findByCode(
    code: string, 
    options?: { 
      chart?: boolean; 
      period?: number; 
      interval?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<StockDetail | null> {
    try {
      const params: Record<string, string> = {};
      if (options?.chart) {
        params.chart = 'true';
        if (options.period) {
          params.period = options.period.toString();
        }
        if (options.interval) {
          params.interval = options.interval;
        }
        if (options.startDate) {
          params.startDate = options.startDate;
        }
        if (options.endDate) {
          params.endDate = options.endDate;
        }
      }
      // BaseRepository.get()이 이미 response.data.data를 반환
      const stockData = await this.get<any>(`/${code}`, params);
      
      // 백엔드 응답 형식에 맞게 변환
      return {
        id: stockData.id || `stock-${code}`,
        code: stockData.code,
        name: stockData.name,
        market: stockData.market,
        sector: stockData.sector,
        currentPrice: stockData.currentPrice,
        change: stockData.change,
        changePercent: stockData.changePercent,
        changeRate: stockData.changePercent,
        volume: stockData.volume,
        high: stockData.high,
        low: stockData.low,
        open: stockData.open,
        marketCap: stockData.marketCap,
        chartData: stockData.chartData ? stockData.chartData.map((item: any) => ({
          time: item.time,
          value: item.value || item.close, // 하위 호환성
          volume: item.volume,
          // OHLC 데이터 (캔들스틱 차트용)
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close || item.value,
        })) : undefined,
        description: `${stockData.name}에 대한 상세 정보입니다.`,
        recentNews: [],
        updatedAt: new Date().toISOString(),
      } as StockDetail;
    } catch (error) {
      console.error('API 호출 실패:', error);
      const stockList = Object.values(POPULAR_STOCKS).flat();
      const stock = stockList.find((s) => s.code === code);
      if (!stock) return null;

      const priceData = await fetchStockPriceSafe(stock.code);
      return {
        id: `stock-${code}`,
        ...stock,
        ...priceData,
        marketCap: priceData.currentPrice * 1000000,
        description: `${stock.name}에 대한 상세 정보입니다.`,
        recentNews: [],
        updatedAt: new Date().toISOString(),
      } as StockDetail;
    }
  }

  /**
   * 차트 데이터 조회
   */
  async getPrices(
    id: string,
    params?: {
      period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | '3y' | '5y';
      interval?: '1m' | '5m' | '30m' | '1h' | '1d';
    }
  ): Promise<StockPricesResponse> {
    try {
      return await this.get<StockPricesResponse>(`/${id}/prices`, params);
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Mock: 30일치 데이터 생성
      const period = params?.period || '1m';
      const days = period === '1d' ? 1 : period === '1w' ? 7 : period === '1m' ? 30 : 30;
      const prices = [];

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        prices.push({
          date: date.toISOString(),
          open: 70000 + Math.random() * 5000,
          high: 71000 + Math.random() * 5000,
          low: 69000 + Math.random() * 5000,
          close: 70500 + Math.random() * 5000,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          change: (Math.random() - 0.5) * 2000,
          changeRate: (Math.random() - 0.5) * 5,
        });
      }

      return {
        prices,
        meta: {
          period: period,
          interval: params?.interval || '1d',
          dataPoints: prices.length,
        },
      };
    }
  }

  /**
   * 종목 검색 (Auto-complete)
   */
  async search(
    query: string,
    limit: number = 10
  ): Promise<StockSearchResponse> {
    try {
      return await this.get<StockSearchResponse>('/search', { q: query, limit });
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Mock: 로컬 검색
      const allStocks = Object.values(POPULAR_STOCKS).flat();
      const uniqueStocks = allStocks.filter(
        (stock, index, self) => self.findIndex((s) => s.code === stock.code) === index
      );

      const results = uniqueStocks
        .filter(
          (stock) =>
            stock.name.toLowerCase().includes(query.toLowerCase()) ||
            stock.code.includes(query)
        )
        .slice(0, limit)
        .map(async (stock) => {
          const priceData = await fetchStockPriceSafe(stock.code);
          return {
            id: `search-${stock.code}`,
            ...stock,
            market: stock.market as Stock['market'],
            ...priceData,
          };
        });

      return {
        results: await Promise.all(results),
      };
    }
  }
}

