/**
 * Search Service
 * 통합 검색 비즈니스 로직 계층
 */

import { SearchRepository } from '../repositories/search.repository';
import {
  SearchResult,
  PopularSearchTerm,
} from '../types/api/search.types';

export class SearchService {
  constructor(private repository: SearchRepository) {}

  /**
   * 통합 검색 (종목 + 뉴스)
   */
  async search(
    query: string,
    userId?: string,
    options?: {
      limit?: number;
      stockLimit?: number;
      newsLimit?: number;
      includeNews?: boolean;
    }
  ): Promise<SearchResult> {
    if (!query || query.trim().length < 1) {
      return {
        stocks: [],
        news: [],
        total: { stocks: 0, news: 0 },
      };
    }

    return await this.repository.search(query.trim(), userId, options);
  }

  /**
   * 종목 검색
   */
  async searchStocks(query: string, limit: number = 10) {
    if (!query || query.trim().length < 1) {
      return [];
    }

    return await this.repository.searchStocks(query.trim(), limit);
  }

  /**
   * 뉴스 검색
   */
  async searchNews(query: string, limit: number = 10) {
    if (!query || query.trim().length < 1) {
      return [];
    }

    return await this.repository.searchNews(query.trim(), limit);
  }

  /**
   * 인기 검색어 조회
   */
  async getPopularSearches(limit: number = 10): Promise<PopularSearchTerm[]> {
    return await this.repository.getPopularSearches(limit);
  }

  /**
   * 자동완성 제안
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.trim().length < 1) {
      return [];
    }

    return await this.repository.getSuggestions(query.trim(), limit);
  }
}

