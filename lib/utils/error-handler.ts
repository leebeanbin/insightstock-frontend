/**
 * Error Handler Utilities
 * 에러 처리 공통 유틸리티
 */

import { toast } from 'sonner';
import { backendLogger } from './backend-logger';

/**
 * 에러 타입 정의
 */
export interface AppError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: {
        message?: string;
      };
    };
  };
}

/**
 * 에러에서 메시지 추출
 * @param error - 에러 객체
 * @param defaultMessage - 기본 메시지
 * @returns 추출된 에러 메시지
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = '알 수 없는 오류가 발생했습니다.'
): string {
  if (!error) {
    return defaultMessage;
  }

  // Error 객체
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  // Axios 에러
  const axiosError = error as AppError;
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (axiosError?.response?.data?.error?.message) {
    return axiosError.response.data.error.message;
  }
  if (axiosError?.message) {
    return axiosError.message;
  }

  return defaultMessage;
}

/**
 * 에러 처리 및 로깅
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트 (예: 'Failed to create portfolio')
 * @param defaultMessage - 기본 에러 메시지
 * @param options - 추가 옵션
 */
export function handleError(
  error: unknown,
  context: string,
  defaultMessage?: string,
  options?: {
    logToBackend?: boolean;
    showToast?: boolean;
    customHandler?: (error: unknown) => void;
  }
): void {
  const {
    logToBackend = true,
    showToast = true,
    customHandler,
  } = options || {};

  // 커스텀 핸들러가 있으면 먼저 실행
  if (customHandler) {
    customHandler(error);
    return;
  }

  // 백엔드 로깅
  if (logToBackend && typeof window !== 'undefined') {
    backendLogger.error(context, error instanceof Error ? error : new Error(String(error)), {
      metadata: {
        context,
        errorMessage: extractErrorMessage(error, defaultMessage),
      },
    });
  }

  // 콘솔 로깅 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    console.error(context, error);
  }

  // Toast 표시
  if (showToast) {
    const message = defaultMessage
      ? extractErrorMessage(error, defaultMessage)
      : extractErrorMessage(error);
    toast.error(message);
  }
}

/**
 * Mutation 에러 처리 (React Query)
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트
 * @param defaultMessage - 기본 에러 메시지
 * @param customMessages - 특정 에러 메시지 매핑
 */
export function handleMutationError(
  error: unknown,
  context: string,
  defaultMessage: string,
  customMessages?: Record<string, string>
): void {
  const errorMessage = extractErrorMessage(error, defaultMessage);

  // 커스텀 메시지 매핑 확인
  if (customMessages) {
    for (const [key, message] of Object.entries(customMessages)) {
      if (errorMessage.includes(key)) {
        handleError(error, context, message, { showToast: true });
        return;
      }
    }
  }

  // 기본 처리
  handleError(error, context, defaultMessage);
}

