/**
 * News Repository
 * 뉴스 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import { News, NewsListResponse, NewsDetailResponse } from '../types/api/news.types';

export class NewsRepository extends BaseRepository<News> {
  protected basePath = '/news';

  /**
   * 뉴스 목록 조회
   */
  async findMany(params?: {
    limit?: number;
    offset?: number;
    stockId?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
  }): Promise<NewsListResponse> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환하므로
      // 직접 API를 호출하여 meta 정보도 함께 받아야 함
      const fullPath = this.getPath('');
      const response = await (await import('../api-client')).default.get(fullPath, { params });
      
      // 백엔드 응답: { success: true, data: News[], meta: {...} }
      return {
        news: response.data.data,
        total: response.data.meta.total,
      };
    } catch (error) {
      // 에러는 React Query가 처리하도록 throw
      // keepPreviousData 옵션으로 캐시된 데이터가 자동으로 표시됨
      throw error;
    }
  }

  /**
   * 뉴스 상세 조회
   */
  async findById(id: string): Promise<NewsDetailResponse> {
    try {
      // 백엔드 응답 형식: { success: true, data: NewsDetailResponse }
      const response = await this.get<{
        success: boolean;
        data: NewsDetailResponse;
      }>(`/${id}`);
      
      // data 필드에서 실제 뉴스 데이터 추출
      const newsData = response.data || response as any;
      
      // content가 없는 경우를 대비한 처리
      if (!newsData.content && newsData.summary) {
        newsData.content = newsData.summary;
      }
      
      return newsData;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw new Error('Failed to fetch news. Please check backend connection.');
    }
  }
}

