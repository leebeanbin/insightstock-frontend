/**
 * 캐싱 전략 설정
 * 데이터 타입별로 적절한 캐시 시간을 설정
 */

// 캐시 시간 상수 (밀리초)
export const CACHE_TIMES = {
  // 실시간 데이터 (자주 변경)
  REALTIME: 10 * 1000, // 10초 - 실시간 주가, 시장 지수
  
  // 단기 캐시 (자주 변경되지만 너무 자주 갱신할 필요 없음)
  SHORT: 30 * 1000, // 30초 - 차트 데이터, 실시간 검색
  
  // 중기 캐시 (가끔 변경)
  MEDIUM: 60 * 1000, // 1분 - 종목 목록, 종목 상세, 포트폴리오
  
  // 장기 캐시 (드물게 변경)
  LONG: 5 * 60 * 1000, // 5분 - 뉴스 목록, 뉴스 상세
  
  // 매우 장기 캐시 (거의 변경 안됨)
  VERY_LONG: 10 * 60 * 1000, // 10분 - 뉴스 상세, AI 분석
  
  // 정적 데이터 (거의 변경 안됨)
  STATIC: 30 * 60 * 1000, // 30분 - 카테고리 목록, 설정
} as const;

/**
 * 데이터 타입별 캐시 시간 매핑
 */
export const CACHE_STRATEGY = {
  // 주식 관련
  stock: {
    list: CACHE_TIMES.MEDIUM, // 종목 목록: 1분
    detail: CACHE_TIMES.MEDIUM, // 종목 상세: 1분
    price: CACHE_TIMES.REALTIME, // 실시간 주가: 10초
    chart: CACHE_TIMES.SHORT, // 차트 데이터: 30초
    search: CACHE_TIMES.SHORT, // 검색 결과: 30초
  },
  
  // 시장 데이터
  market: {
    summary: CACHE_TIMES.REALTIME, // 시장 요약: 10초
    index: CACHE_TIMES.REALTIME, // 시장 지수: 10초
  },
  
  // 뉴스
  news: {
    list: CACHE_TIMES.VERY_LONG * 2, // 뉴스 목록: 20분 (백엔드 문제 시에도 오래 보이도록)
    detail: CACHE_TIMES.VERY_LONG * 3, // 뉴스 상세: 30분 (백엔드 문제 시에도 오래 보이도록)
    related: CACHE_TIMES.VERY_LONG * 2, // 관련 뉴스: 20분
  },
  
  // 포트폴리오
  portfolio: {
    list: CACHE_TIMES.MEDIUM, // 포트폴리오 목록: 1분
    detail: CACHE_TIMES.MEDIUM, // 포트폴리오 상세: 1분
    analysis: CACHE_TIMES.LONG, // 리스크 분석: 5분
  },
  
  // 즐겨찾기
  favorites: {
    list: CACHE_TIMES.MEDIUM, // 즐겨찾기 목록: 1분
    check: CACHE_TIMES.SHORT, // 즐겨찾기 확인: 30초
  },
  
  // 히스토리
  history: {
    list: CACHE_TIMES.SHORT, // 히스토리 목록: 30초
  },
  
  // 채팅
  chat: {
    conversations: CACHE_TIMES.MEDIUM, // 대화 목록: 1분
    messages: CACHE_TIMES.SHORT, // 메시지: 30초
    consent: CACHE_TIMES.STATIC, // 챗봇 동의: 30분
  },
  
  // 학습
  learning: {
    today: CACHE_TIMES.STATIC, // 오늘의 학습: 30분
  },
  
  // 사용자 활동
  userActivity: {
    context: CACHE_TIMES.MEDIUM, // 사용자 컨텍스트: 1분
    read: CACHE_TIMES.SHORT, // 읽은 뉴스: 30초
    liked: CACHE_TIMES.SHORT, // 좋아요: 30초
    favorites: CACHE_TIMES.SHORT, // 즐겨찾기: 30초
  },
} as const;

/**
 * React Query 설정 헬퍼
 */
export function getCacheConfig(type: keyof typeof CACHE_STRATEGY, subType: string) {
  const strategy = CACHE_STRATEGY[type];
  if (!strategy) {
    return { staleTime: CACHE_TIMES.MEDIUM };
  }
  
  const staleTime = (strategy as any)[subType] || CACHE_TIMES.MEDIUM;
  
  return {
    staleTime,
    gcTime: staleTime * 2, // garbage collection time은 staleTime의 2배
    refetchOnWindowFocus: type === 'stock' && subType === 'price', // 실시간 주가만 포커스 시 refetch
    refetchOnReconnect: true, // 네트워크 재연결 시 refetch
  };
}

