/**
 * Validation Utilities
 * 폼 유효성 검증 공통 유틸리티
 */

/**
 * 숫자 파싱 및 유효성 검증 결과
 */
export interface NumberValidationResult {
  isValid: boolean;
  value: number;
  error?: string;
}

/**
 * 양수 숫자 검증
 * @param value - 검증할 값 (문자열 또는 숫자)
 * @param fieldName - 필드 이름 (에러 메시지용)
 * @param min - 최소값 (기본값: 0)
 * @returns 검증 결과
 */
export function validatePositiveNumber(
  value: string | number | undefined | null,
  fieldName: string,
  min: number = 0
): NumberValidationResult {
  // null/undefined 체크
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      value: 0,
      error: `${fieldName}을(를) 입력해주세요.`,
    };
  }

  // 숫자로 변환
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // NaN 체크
  if (isNaN(numValue)) {
    return {
      isValid: false,
      value: 0,
      error: `${fieldName}은(는) 유효한 숫자여야 합니다.`,
    };
  }

  // 최소값 체크
  if (numValue <= min) {
    return {
      isValid: false,
      value: numValue,
      error: `${fieldName}은(는) ${min}보다 커야 합니다.`,
    };
  }

  return {
    isValid: true,
    value: numValue,
  };
}

/**
 * 포트폴리오 수량 검증
 */
export function validatePortfolioQuantity(
  quantity: string | number | undefined | null
): NumberValidationResult {
  return validatePositiveNumber(quantity, '수량', 0);
}

/**
 * 포트폴리오 평균 매수가 검증
 */
export function validatePortfolioPrice(
  price: string | number | undefined | null
): NumberValidationResult {
  return validatePositiveNumber(price, '평균 매수가', 0);
}

/**
 * 안전한 숫자 파싱
 * @param value - 파싱할 값
 * @param defaultValue - 기본값 (파싱 실패 시)
 * @returns 파싱된 숫자 또는 기본값
 */
export function safeParseFloat(
  value: string | number | undefined | null,
  defaultValue: number = 0
): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? defaultValue : numValue;
}

