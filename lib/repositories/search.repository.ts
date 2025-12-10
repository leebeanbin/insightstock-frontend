/**
 * Search Repository
 * 검색 데이터 접근 계층 (Repository Layer)
 */

import apiClient from '../api-client';
import {
  SearchResult,
  PopularSearchTerm,
} from '../types/api/search.types';
import { Stock } from '../types';
import { News } from '../types/api/news.types';

export class SearchRepository {
  /**
   * 통합 검색
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
    const params = new URLSearchParams({
      q: query,
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.stockLimit && { stockLimit: options.stockLimit.toString() }),
      ...(options?.newsLimit && { newsLimit: options.newsLimit.toString() }),
      ...(options?.includeNews !== undefined && { includeNews: options.includeNews.toString() }),
    });

    const response = await apiClient.get<{ success: boolean; data: SearchResult }>(
      `/search?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Search failed');
    }

    return response.data.data;
  }

  /**
   * 종목 검색
   */
  async searchStocks(query: string, limit: number = 10): Promise<Stock[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });

    const response = await apiClient.get<{ success: boolean; data: Stock[] }>(
      `/search/stocks?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      return [];
    }

    return response.data.data;
  }

  /**
   * 뉴스 검색
   */
  async searchNews(query: string, limit: number = 10): Promise<News[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });

    const response = await apiClient.get<{ success: boolean; data: News[] }>(
      `/search/news?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      return [];
    }

    return response.data.data;
  }

  /**
   * 인기 검색어 조회
   */
  async getPopularSearches(limit: number = 10): Promise<PopularSearchTerm[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const response = await apiClient.get<{ success: boolean; data: PopularSearchTerm[] }>(
        `/search/popular?${params.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error) {
      // 404 또는 다른 에러 발생 시 빈 배열 반환 (fallback 처리)
      console.warn('Failed to fetch popular searches:', error);
      return [];
    }
  }

  /**
   * 자동완성 제안
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });

    const response = await apiClient.get<{ success: boolean; data: string[] }>(
      `/search/suggestions?${params.toString()}`
    );

    if (!response.data.success || !response.data.data) {
      return [];
    }

    return response.data.data;
  }
}

