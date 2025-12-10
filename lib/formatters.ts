/**
 * 숫자 포맷팅 유틸리티 함수
 * 디자인 가이드에 따라 Tabular Numbers 사용
 */

/**
 * 가격 포맷팅 (천 단위 콤마)
 * @example formatPrice(190000) => "190,000원"
 * @example formatPrice(190000, 'USD') => "$190,000"
 */
export function formatPrice(price: number | string | undefined | null, currency: 'KRW' | 'USD' = 'KRW'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const safePrice = numPrice ?? 0;
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safePrice);
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safePrice);
}

/**
 * 등락률 포맷팅 (소수점 2자리 + 부호)
 * @example formatChange(0.0325) => "+3.25%"
 */
export function formatChange(change: number | string | undefined | null): string {
  if (change === undefined || change === null) {
    return '0.00%';
  }
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  if (isNaN(numChange)) {
    return '0.00%';
  }
  const sign = numChange >= 0 ? '+' : '';
  return `${sign}${numChange.toFixed(2)}%`;
}

/**
 * 퍼센트 포맷팅 (소수점 2자리 + 부호)
 * @example formatPercent(5.25) => "+5.25%"
 * @example formatPercent(-3.5) => "-3.50%"
 */
export function formatPercent(value: number | string | undefined | null): string {
  if (value === undefined || value === null) {
    return '0.00%';
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '0.00%';
  }
  const sign = numValue >= 0 ? '+' : '';
  return `${sign}${numValue.toFixed(2)}%`;
}

/**
 * 거래량 포맷팅 (억 단위)
 * @example formatVolume(125000000) => "1.25억"
 */
export function formatVolume(volume: number | string | undefined | null): string {
  const numVolume = typeof volume === 'string' ? parseFloat(volume) : volume;
  const safeVolume = numVolume ?? 0;
  if (safeVolume >= 100000000) {
    return `${(safeVolume / 100000000).toFixed(2)}억`;
  }
  if (safeVolume >= 10000) {
    return `${(safeVolume / 10000).toFixed(2)}만`;
  }
  return new Intl.NumberFormat('ko-KR').format(safeVolume);
}

/**
 * 시가총액 포맷팅
 * @example formatMarketCap(5000000000000) => "5조"
 */
export function formatMarketCap(marketCap: number | undefined | null): string {
  const safeCap = marketCap ?? 0;
  if (safeCap >= 1000000000000) {
    return `${(safeCap / 1000000000000).toFixed(1)}조`;
  }
  if (safeCap >= 100000000) {
    return `${(safeCap / 100000000).toFixed(1)}억`;
  }
  return formatPrice(safeCap);
}

/**
 * 날짜 포맷팅 (상대 시간)
 * @example formatRelativeTime(new Date()) => "방금 전"
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) => "1시간 전"
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  // 유효하지 않은 날짜 처리
  if (!date) return '날짜 없음';
  
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  // 유효한 날짜인지 확인
  if (isNaN(dateObj.getTime())) {
    return '날짜 없음';
  }
  
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  
  // 미래 날짜 처리
  if (diff < 0) {
    return '방금 전';
  }
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * 숫자에 색상 클래스 반환 (상승/하락)
 */
export function getChangeColorClass(change: number | string | undefined | null): string {
  if (change === undefined || change === null) return 'text-gray-600';
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  if (isNaN(numChange)) return 'text-gray-600';
  if (numChange > 0) return 'text-semantic-red';
  if (numChange < 0) return 'text-semantic-blue';
  return 'text-gray-600';
}

