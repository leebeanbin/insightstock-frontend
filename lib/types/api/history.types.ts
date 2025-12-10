/**
 * History API Types
 * 히스토리 관련 타입 정의
 */

export interface HistoryItem {
  id: string;
  stock?: {
    id: string;
    code: string;
    name: string;
    currentPrice: number;
  };
  newsId?: string;
  noteId?: string;
  conceptId?: string;
  type: 'view' | 'search' | 'news' | 'note' | 'concept';
  viewedAt: string;
}

export interface HistoryListResponse {
  history: HistoryItem[];
  total: number;
}

export interface CreateHistoryRequest {
  stockId?: string;
  newsId?: string;
  noteId?: string;
  conceptId?: string;
}

