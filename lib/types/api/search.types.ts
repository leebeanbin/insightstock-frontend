/**
 * Search API Types
 * 검색 관련 타입 정의
 */

import { Stock } from '@/lib/types';
import { News } from './news.types';

export interface SearchResult {
  stocks: Stock[];
  news: News[];
  total: {
    stocks: number;
    news: number;
  };
}

export interface PopularSearchTerm {
  term: string;
  count: number;
  lastSearched: Date | string;
}

