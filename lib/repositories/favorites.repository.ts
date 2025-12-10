/**
 * Favorites Repository
 * 즐겨찾기 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import {
  Favorite,
  FavoriteListResponse,
  CheckFavoriteResponse,
} from '../types/api/favorites.types';

export class FavoritesRepository extends BaseRepository<Favorite> {
  protected basePath = '/favorites';

  /**
   * 즐겨찾기 목록 조회
   * 백엔드 응답: { success: true, data: FavoriteResponseDto[] }
   */
  async findMany(params?: {
    limit?: number;
    offset?: number;
  }): Promise<FavoriteListResponse> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환
      const favorites = await this.get<Favorite[]>('', params);
      return {
        favorites: favorites || [],
        total: (favorites || []).length,
      };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 즐겨찾기 추가
   * 백엔드 응답: { success: true, data: FavoriteResponseDto }
   */
  async create(stockId: string): Promise<Favorite> {
    try {
      // BaseRepository.post()가 이미 response.data.data를 반환
      const favorite = await this.post<Favorite>('', { stockId });
      return favorite;
    } catch (error: any) {
      console.error('API 호출 실패:', error);
      // Conflict 에러는 이미 추가된 것으로 간주
      if (error?.response?.status === 409) {
        throw new Error('Stock is already in favorites');
      }
      throw new Error('Failed to add favorite. Please check backend connection.');
    }
  }

  /**
   * 즐겨찾기 삭제
   * 백엔드는 favorite의 id를 요구하므로, stockId로 favorite를 찾아서 id를 가져와야 함
   * 순환 참조를 피하기 위해 직접 API를 호출하여 목록을 가져옴
   */
  async deleteFavorite(stockId: string): Promise<{ message: string }> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환
      const favorites = await this.get<Favorite[]>('');
      // stockId가 UUID인지 code인지 확인하여 매칭
      const favorite = favorites.find(f => 
        f.stock?.id === stockId || 
        f.stock?.code === stockId
      );
      
      if (!favorite) {
        // 이미 삭제된 경우 성공으로 처리
        return { message: 'Removed from favorites' };
      }

      // favorite의 id로 삭제
      const deleteResponse = await this.delete<{ message?: string }>(`/${favorite.id}`);
      // 백엔드 응답 형식에 맞게 처리
      if (typeof deleteResponse === 'object' && 'message' in deleteResponse) {
        return { message: deleteResponse.message || 'Removed from favorites' };
      }
      return { message: 'Removed from favorites' };
    } catch (error: any) {
      // 404 에러는 이미 삭제된 것으로 간주
      if (error?.response?.status === 404) {
        return { message: 'Removed from favorites' };
      }
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 즐겨찾기 확인
   * 백엔드 응답: { success: true, data: { isFavorited } }
   */
  async check(stockId: string): Promise<CheckFavoriteResponse> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환
      const result = await this.get<{ isFavorited: boolean }>(`/check/${stockId}`);
      return { isFavorite: result?.isFavorited ?? false };
    } catch (error) {
      console.error('API 호출 실패:', error);
      // API 호출 실패 시 false 반환
      return { isFavorite: false };
    }
  }
}
