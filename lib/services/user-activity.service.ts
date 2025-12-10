/**
 * User Activity Service
 * 사용자 활동 추적 서비스 (읽기, 좋아요, 즐겨찾기)
 */

import apiClient from '../api-client';

export interface UserContext {
  readNews: string[];
  likedNews: string[];
  favoriteNews: string[];
  recentStocks: string[];
  learnings: Array<{ concept: string; question: string }>;
  notes: Array<{ title: string; tags: string[] }>;
}

class UserActivityService {
  /**
   * 뉴스 읽기 기록
   */
  async trackNewsRead(newsId: string): Promise<void> {
    try {
      await apiClient.post(`/user-activity/news/${newsId}/read`);
    } catch (error) {
      console.error('Failed to track news read:', error);
      // 읽기 추적 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  }

  /**
   * 뉴스 좋아요 토글
   */
  async toggleNewsLike(newsId: string): Promise<{ isLiked: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { isLiked: boolean } }>(
        `/user-activity/news/${newsId}/like`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to toggle news like:', error);
      throw error;
    }
  }

  /**
   * 뉴스 즐겨찾기 토글
   */
  async toggleNewsFavorite(newsId: string): Promise<{ isFavorite: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { isFavorite: boolean } }>(
        `/user-activity/news/${newsId}/favorite`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to toggle news favorite:', error);
      throw error;
    }
  }

  /**
   * 사용자 컨텍스트 조회 (챗봇용)
   */
  async getUserContext(): Promise<UserContext> {
    try {
      const response = await apiClient.get<{ success: boolean; data: UserContext }>(
        '/user-activity/context'
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get user context:', error);
      return {
        readNews: [],
        likedNews: [],
        favoriteNews: [],
        recentStocks: [],
        learnings: [],
        notes: [],
      };
    }
  }

  /**
   * 읽은 뉴스 목록 조회
   */
  async getReadNews(limit: number = 20): Promise<string[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: string[] }>(
        `/user-activity/news/read?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get read news:', error);
      return [];
    }
  }

  /**
   * 좋아요한 뉴스 목록 조회
   */
  async getLikedNews(limit: number = 20): Promise<string[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: string[] }>(
        `/user-activity/news/liked?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get liked news:', error);
      return [];
    }
  }

  /**
   * 즐겨찾기한 뉴스 목록 조회
   */
  async getFavoriteNews(limit: number = 20): Promise<string[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: string[] }>(
        `/user-activity/news/favorites?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get favorite news:', error);
      return [];
    }
  }
}

export const userActivityService = new UserActivityService();

