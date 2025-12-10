/**
 * Favorites Service
 * 즐겨찾기 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { FavoritesRepository } from '../repositories/favorites.repository';
import {
  Favorite,
  FavoriteListResponse,
  CheckFavoriteResponse,
} from '../types/api/favorites.types';

export class FavoritesService {
  constructor(private repository: FavoritesRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 즐겨찾기 목록 조회 (비즈니스 로직: 기본값 설정)
   */
  async getFavorites(params?: {
    limit?: number;
    offset?: number;
  }): Promise<FavoriteListResponse> {
    // 비즈니스 로직: 기본값 설정
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    return await this.repository.findMany({ limit, offset });
  }

  /**
   * 즐겨찾기 추가 (비즈니스 로직: 중복 체크)
   */
  async addFavorite(stockId: string): Promise<Favorite> {
    // 비즈니스 로직: 유효성 검증
    if (!stockId) {
      throw new Error('Stock ID is required');
    }

    // 중복 체크
    const isFavorite = await this.repository.check(stockId);
    if (isFavorite.isFavorite) {
      throw new Error('Stock is already in favorites');
    }

    return await this.repository.create(stockId);
  }

  /**
   * 즐겨찾기 삭제
   */
  async removeFavorite(stockId: string): Promise<{ message: string }> {
    // 비즈니스 로직: 유효성 검증
    if (!stockId) {
      throw new Error('Stock ID is required');
    }

    // 존재 확인
    const isFavorite = await this.repository.check(stockId);
    if (!isFavorite.isFavorite) {
      throw new Error('Stock is not in favorites');
    }

    return await this.repository.deleteFavorite(stockId);
  }

  /**
   * 즐겨찾기 확인
   */
  async checkFavorite(stockId: string): Promise<CheckFavoriteResponse> {
    if (!stockId) {
      throw new Error('Stock ID is required');
    }

    return await this.repository.check(stockId);
  }

  /**
   * 즐겨찾기 토글 (추가/삭제)
   */
  async toggleFavorite(stockId: string): Promise<{ isFavorite: boolean; message: string }> {
    const isFavorite = await this.repository.check(stockId);

    if (isFavorite.isFavorite) {
      await this.removeFavorite(stockId);
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      await this.addFavorite(stockId);
      return { isFavorite: true, message: 'Added to favorites' };
    }
  }
}

