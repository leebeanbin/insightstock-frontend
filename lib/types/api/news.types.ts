/**
 * News API Types
 * 뉴스 관련 타입 정의
 */

export interface News {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  summary?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number;
  keyPoints?: string[];
  relatedStocks?: string[];
  url?: string;
  thumbnailUrl?: string;
}

export interface NewsListResponse {
  news: News[];
  total: number;
}

export interface NewsDetailResponse extends News {
  aiAnalysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    keyPoints: string[];
    relatedConcepts: string[];
  };
}

