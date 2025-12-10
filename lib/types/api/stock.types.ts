/**
 * Stock API Types
 * 종목 관련 타입 정의
 */

import { Stock } from '@/lib/types';

export interface StockDetail extends Stock {
  description?: string;
  recentNews?: Array<{
    id: string;
    title: string;
    publishedAt: string;
  }>;
  updatedAt: string;
  chartData?: Array<{
    time: string;
    value: number;
    volume: number;
  }>;
}

export interface StockListResponse {
  stocks: Stock[];
  total: number;
  limit: number;
  offset: number;
}

export interface StockPriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changeRate: number;
}

export interface StockPricesResponse {
  prices: StockPriceData[];
  meta: {
    period: string;
    interval: string;
    dataPoints: number;
  };
}

export interface StockSearchResponse {
  results: Stock[];
}

