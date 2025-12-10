/**
 * i18n Utilities
 * 번역 키를 타입 안전하게 접근하는 헬퍼 함수들
 */

/**
 * 중첩된 번역 키 접근
 * 예: getNestedValue(translation, 'dashboard.categories.popular')
 */
export function getNestedValue(
  obj: any,
  path: string
): string {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // 키가 없으면 경로 자체를 반환
    }
  }

  return typeof value === 'string' ? value : path;
}

