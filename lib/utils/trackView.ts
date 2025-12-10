/**
 * trackView Utility
 * 히스토리 자동 기록 헬퍼 함수
 * 페이지 조회 시 자동으로 히스토리에 추가
 */

import { historyService } from '../services';
import { CreateHistoryRequest } from '../types/api/history.types';

export interface TrackViewOptions {
  stockId?: string;
  newsId?: string;
  noteId?: string;
  conceptId?: string;
}

/**
 * 조회 기록 추가
 * @param options - 조회할 리소스 정보
 */
export async function trackView(options: TrackViewOptions): Promise<void> {
  try {
    // 하나 이상의 리소스 ID가 있어야 함
    if (!options.stockId && !options.newsId && !options.noteId && !options.conceptId) {
      return; // 기록할 것이 없으면 조용히 반환
    }

    // 하위 호환성: stockId만 있으면 string으로 전달
    if (options.stockId && !options.newsId && !options.noteId && !options.conceptId) {
      await historyService.addHistory(options.stockId);
      return;
    }

    // 여러 리소스가 있거나 newsId, noteId, conceptId가 있는 경우
    const requestData: CreateHistoryRequest = {
      stockId: options.stockId,
      newsId: options.newsId,
      noteId: options.noteId,
      conceptId: options.conceptId,
    };

    await historyService.addHistory(requestData);
  } catch (error) {
    // 히스토리 기록 실패는 조용히 처리 (사용자 경험에 영향 없음)
    // 백엔드로 로깅 (경고 레벨)
    if (typeof window !== 'undefined') {
      import('@/lib/utils/backend-logger').then(({ backendLogger }) => {
        backendLogger.warn('Failed to track view', {
          metadata: { error: error instanceof Error ? error.message : String(error) },
        });
      }).catch(() => {
        // 로거 로드 실패 시 무시
      });
    }
  }
}

