/**
 * Favorites API Types
 * 즐겨찾기 관련 타입 정의
 */

export interface Favorite {
  id: string;
  stock: {
    id: string;
    code: string;
    name: string;
    currentPrice: number;
    changeRate: number;
  };
  createdAt: string;
}

export interface FavoriteListResponse {
  favorites: Favorite[];
  total: number;
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
}

