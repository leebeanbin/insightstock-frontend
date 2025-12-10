/**
 * 공통 타입 정의
 */

export interface Stock {
  id: string;
  code: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'ETF' | 'INDEX';
  sector?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  currency?: 'KRW' | 'USD';
}

export interface StockPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  time: string;
  value: number; // close price (하위 호환성)
  volume?: number;
  // OHLC 데이터 (캔들스틱 차트용)
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  url: string;
  source: string;
  publishedAt: Date;
  thumbnailUrl?: string;
  stockIds?: string[];
  aiAnalysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    keyPoints: string[];
    relatedConcepts: string[];
  };
}

export interface AISummary {
  onelineSummary: string;
  keyIssues: string[];
  priceAnalysis: string;
  riskSummary: string;
  learningCta?: string;
}

export interface Learning {
  id: string;
  concept: string;
  question: string;
  answer: string;
  relatedStocks?: string[];
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  newsId?: string;           // 연결된 뉴스 ID
  scrapedContent?: string;   // 원본 뉴스 내용
  sourceUrl?: string;        // 원본 뉴스 URL
  highlightStart?: number;   // 하이라이팅 시작 오프셋
  highlightEnd?: number;     // 하이라이팅 끝 오프셋
  chartData?: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PortfolioStock {
  stockId: string;
  stockName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  return: number;
  returnPercent: number;
  weight: number;
}

export interface Portfolio {
  id: string;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  todayReturn: number;
  todayReturnPercent: number;
  stocks: PortfolioStock[];
  sectorAllocation: Record<string, number>;
}

export interface MarketSummary {
  kospi: {
    price: number;
    change: number;
    changePercent: number;
  };
  kosdaq: {
    price: number;
    change: number;
    changePercent: number;
  };
  usdKrw: {
    price: number;
    change: number;
    changePercent: number;
  };
}

