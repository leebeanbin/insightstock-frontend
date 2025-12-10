/**
 * News Service
 * 뉴스 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { NewsRepository } from '../repositories/news.repository';
import {
  News,
  NewsListResponse,
  NewsDetailResponse,
} from '../types/api/news.types';

export class NewsService {
  constructor(private repository: NewsRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 뉴스 목록 조회 (비즈니스 로직: 필터링, 정렬)
   */
  async getNews(params?: {
    limit?: number;
    offset?: number;
    stockId?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }): Promise<NewsListResponse> {
    // 비즈니스 로직: 기본값 설정
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;

    return await this.repository.findMany({
      limit,
      offset,
      stockId: params?.stockId,
      sentiment: params?.sentiment,
    });
  }

  /**
   * 뉴스 상세 조회
   */
  async getNewsDetail(id: string): Promise<NewsDetailResponse> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('News ID is required');
    }

    const news = await this.repository.findById(id);
    if (!news) {
      throw new Error('News not found');
    }

    return news;
  }

  /**
   * 종목별 뉴스 조회 (비즈니스 로직)
   */
  async getNewsByStock(
    stockId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<NewsListResponse> {
    if (!stockId) {
      throw new Error('Stock ID is required');
    }

    return await this.getNews({
      ...params,
      stockId,
    });
  }

  /**
   * 감성별 뉴스 조회 (비즈니스 로직)
   */
  async getNewsBySentiment(
    sentiment: 'positive' | 'negative' | 'neutral',
    params?: { limit?: number; offset?: number }
  ): Promise<NewsListResponse> {
    return await this.getNews({
      ...params,
      sentiment,
    });
  }
}

