/**
 * History Repository
 * 히스토리 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import { HistoryItem, HistoryListResponse, CreateHistoryRequest } from '../types/api/history.types';

export class HistoryRepository extends BaseRepository<HistoryItem> {
  protected basePath = '/history';

  /**
   * 히스토리 목록 조회
   */
  async findMany(params?: {
    limit?: number;
    offset?: number;
  }): Promise<HistoryListResponse> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환하므로
      // 직접 API를 호출하여 meta 정보도 함께 받아야 함
      const fullPath = this.getPath('');
      const response = await (await import('../api-client')).default.get(fullPath, { params });
      
      // 백엔드 응답: { success: true, data: HistoryItem[], meta: {...} }
      return {
        history: response.data.data,
        total: response.data.meta.total,
      };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 히스토리 추가 (자동)
   */
  async create(data: CreateHistoryRequest | string): Promise<HistoryItem> {
    try {
      // 하위 호환성: string인 경우 stockId로 처리
      const requestData = typeof data === 'string' 
        ? { stockId: data } 
        : data;
      
      return await this.post<HistoryItem>('', requestData);
    } catch (error) {
      console.error('API 호출 실패:', error);
      
      // 하위 호환성: string인 경우 stockId로 처리
      const requestData = typeof data === 'string' 
        ? { stockId: data } 
        : data;
      
      if (requestData.stockId) {
        throw new Error('Failed to create history. Please check backend connection.');
      }
      
      // newsId, noteId, conceptId 처리
      return {
        id: `hist_${Date.now()}`,
        type: requestData.newsId ? 'news' : requestData.noteId ? 'note' : 'concept',
        newsId: requestData.newsId,
        noteId: requestData.noteId,
        conceptId: requestData.conceptId,
        viewedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * 최근 히스토리 조회 (중복 방지용)
   * @param data - 조회할 리소스 정보 (stockId, newsId, noteId, conceptId)
   * @param timeWindow - 시간 윈도우 (밀리초)
   */
  async findRecent(
    data: CreateHistoryRequest | string,
    timeWindow: number = 5 * 60 * 1000
  ): Promise<HistoryItem | null> {
    try {
      // 하위 호환성: string인 경우 stockId로 처리
      const requestData = typeof data === 'string' 
        ? { stockId: data } 
        : data;
      
      const params = {
        ...requestData,
        timeWindow,
      };
      const response = await this.get<HistoryItem>('/recent', params);
      // data가 null이면 최근 기록 없음
      if (!response || response === null) {
        return null;
      }
      return response;
    } catch (error: any) {
      // 400, 404 또는 200 응답에서 data가 null인 경우는 정상 (최근 기록 없음)
      if (error?.response?.status === 400 || error?.response?.status === 404 || (error?.response?.status === 200 && error?.response?.data?.data === null)) {
        return null;
      }
      // 다른 에러는 개발 환경에서만 로그 출력
      if (process.env.NODE_ENV === 'development') {
        console.error('History API 호출 실패:', error);
      }
      
      // 하위 호환성: string인 경우 stockId로 처리
      const requestData = typeof data === 'string' 
        ? { stockId: data } 
        : data;
      
      // API 호출 실패 시 null 반환 (최근 기록 없음으로 처리)
      return null;
    }
  }

  /**
   * 히스토리 삭제
   */
  async deleteHistory(id: string): Promise<{ message: string }> {
    try {
      return await this.delete<{ message: string }>(`/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { message: 'History deleted' };
    }
  }
}

