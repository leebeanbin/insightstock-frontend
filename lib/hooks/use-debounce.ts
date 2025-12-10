/**
 * useDebounce Hook
 * 입력값 디바운싱을 위한 커스텀 훅
 * 검색어 입력 시 API 호출 최적화
 */

import { useState, useEffect } from 'react';

/**
 * 값 디바운싱 Hook
 * @param value - 디바운싱할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

