/**
 * History Service
 * 히스토리 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { HistoryRepository } from '../repositories/history.repository';
import { HistoryItem, HistoryListResponse, CreateHistoryRequest } from '../types/api/history.types';

export class HistoryService {
  constructor(private repository: HistoryRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 히스토리 목록 조회 (비즈니스 로직: 기본값 설정)
   */
  async getHistory(params?: {
    limit?: number;
    offset?: number;
  }): Promise<HistoryListResponse> {
    // 비즈니스 로직: 기본값 설정
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    return await this.repository.findMany({ limit, offset });
  }

  /**
   * 히스토리 추가 (비즈니스 로직: 자동 기록, 중복 방지)
   * @param data - stockId, newsId, noteId, conceptId 중 하나 이상 필요
   */
  async addHistory(data: CreateHistoryRequest | string): Promise<HistoryItem> {
    // 하위 호환성: string인 경우 stockId로 처리
    const requestData = typeof data === 'string' 
      ? { stockId: data } 
      : data;
    
    // 비즈니스 로직: 유효성 검증
    if (!requestData.stockId && !requestData.newsId && !requestData.noteId && !requestData.conceptId) {
      throw new Error('At least one of stockId, newsId, noteId, or conceptId is required');
    }

    // 중복 방지 로직: 같은 리소스를 5분 이내에 여러 번 기록하지 않음
    const recentHistory = await this.repository.findRecent(requestData, 5 * 60 * 1000); // 5분
    if (recentHistory) {
      // 기존 기록 반환 (새로 생성하지 않음)
      return recentHistory;
    }

    return await this.repository.create(requestData);
  }

  /**
   * 히스토리 삭제
   */
  async deleteHistory(id: string): Promise<{ message: string }> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('History ID is required');
    }

    return await this.repository.deleteHistory(id);
  }

}

