/**
 * KRX(한국거래소) 데이터 API
 *
 * 전략: 검색 중심 + 카테고리 탭 하이브리드
 * - 기본: 인기 종목 20개만 표시 (빠른 로딩)
 * - 검색: 실시간 자동완성 검색
 * - 탭: 테마별/섹터별 종목 로딩
 */

import { Stock } from '@/lib/types';

// ===== 인기 종목 (기본 표시) =====
export const POPULAR_STOCKS: Record<string, { code: string; name: string; market: string; sector: string }[]> = {
  '인기': [
    { code: '005930', name: '삼성전자', market: 'KOSPI', sector: 'IT' },
    { code: '000660', name: 'SK하이닉스', market: 'KOSPI', sector: 'IT' },
    { code: '373220', name: 'LG에너지솔루션', market: 'KOSPI', sector: '2차전지' },
    { code: '207940', name: '삼성바이오로직스', market: 'KOSPI', sector: '바이오' },
    { code: '005380', name: '현대차', market: 'KOSPI', sector: '자동차' },
    { code: '000270', name: '기아', market: 'KOSPI', sector: '자동차' },
    { code: '035420', name: 'NAVER', market: 'KOSPI', sector: 'IT' },
    { code: '035720', name: '카카오', market: 'KOSPI', sector: 'IT' },
    { code: '051910', name: 'LG화학', market: 'KOSPI', sector: '화학' },
    { code: '006400', name: '삼성SDI', market: 'KOSPI', sector: '2차전지' },
    { code: '034730', name: 'SK', market: 'KOSPI', sector: 'IT' },
    { code: '036570', name: '엔씨소프트', market: 'KOSPI', sector: 'IT' },
    { code: '105560', name: 'KB금융', market: 'KOSPI', sector: '금융' },
    { code: '055550', name: '신한지주', market: 'KOSPI', sector: '금융' },
    { code: '086790', name: '하나금융지주', market: 'KOSPI', sector: '금융' },
    { code: '068270', name: '셀트리온', market: 'KOSPI', sector: '바이오' },
    { code: '003550', name: 'LG', market: 'KOSPI', sector: '지주' },
    { code: '012330', name: '현대모비스', market: 'KOSPI', sector: '자동차부품' },
    { code: '352820', name: '하이브', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '259960', name: '크래프톤', market: 'KOSPI', sector: '게임' },
    { code: '247540', name: '에코프로비엠', market: 'KOSDAQ', sector: '2차전지' },
    { code: '086520', name: '에코프로', market: 'KOSDAQ', sector: '2차전지' },
    { code: '003670', name: '포스코퓨처엠', market: 'KOSPI', sector: '2차전지' },
    { code: '302440', name: 'SK바이오사이언스', market: 'KOSPI', sector: '바이오' },
    { code: '091990', name: '셀트리온헬스케어', market: 'KOSDAQ', sector: '바이오' },
    { code: '145020', name: '휴젤', market: 'KOSDAQ', sector: '바이오' },
    { code: '316140', name: '우리금융지주', market: 'KOSPI', sector: '금융' },
    { code: '024110', name: '기업은행', market: 'KOSPI', sector: '금융' },
    { code: '018880', name: '한온시스템', market: 'KOSPI', sector: '자동차부품' },
    { code: '161390', name: '한국타이어앤테크놀로지', market: 'KOSPI', sector: '자동차부품' },
    { code: '041510', name: 'SM', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '122870', name: 'YG엔터테인먼트', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '035900', name: 'JYP엔터테인먼트', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '034120', name: 'CJ ENM', market: 'KOSPI', sector: '미디어' },
    { code: '263750', name: '펄어비스', market: 'KOSPI', sector: '게임' },
  ],
  '2차전지': [
    { code: '373220', name: 'LG에너지솔루션', market: 'KOSPI', sector: '2차전지' },
    { code: '006400', name: '삼성SDI', market: 'KOSPI', sector: '2차전지' },
    { code: '247540', name: '에코프로비엠', market: 'KOSDAQ', sector: '2차전지' },
    { code: '086520', name: '에코프로', market: 'KOSDAQ', sector: '2차전지' },
    { code: '051910', name: 'LG화학', market: 'KOSPI', sector: '2차전지' },
    { code: '003670', name: '포스코퓨처엠', market: 'KOSPI', sector: '2차전지' },
  ],
  'IT/반도체': [
    { code: '005930', name: '삼성전자', market: 'KOSPI', sector: 'IT' },
    { code: '000660', name: 'SK하이닉스', market: 'KOSPI', sector: 'IT' },
    { code: '035420', name: 'NAVER', market: 'KOSPI', sector: 'IT' },
    { code: '035720', name: '카카오', market: 'KOSPI', sector: 'IT' },
    { code: '034730', name: 'SK', market: 'KOSPI', sector: 'IT' },
    { code: '036570', name: '엔씨소프트', market: 'KOSPI', sector: 'IT' },
    { code: '259960', name: '크래프톤', market: 'KOSPI', sector: '게임' },
    { code: '263750', name: '펄어비스', market: 'KOSPI', sector: '게임' },
  ],
  '바이오': [
    { code: '207940', name: '삼성바이오로직스', market: 'KOSPI', sector: '바이오' },
    { code: '068270', name: '셀트리온', market: 'KOSPI', sector: '바이오' },
    { code: '302440', name: 'SK바이오사이언스', market: 'KOSPI', sector: '바이오' },
    { code: '091990', name: '셀트리온헬스케어', market: 'KOSDAQ', sector: '바이오' },
    { code: '145020', name: '휴젤', market: 'KOSDAQ', sector: '바이오' },
  ],
  '금융': [
    { code: '105560', name: 'KB금융', market: 'KOSPI', sector: '금융' },
    { code: '055550', name: '신한지주', market: 'KOSPI', sector: '금융' },
    { code: '086790', name: '하나금융지주', market: 'KOSPI', sector: '금융' },
    { code: '316140', name: '우리금융지주', market: 'KOSPI', sector: '금융' },
    { code: '024110', name: '기업은행', market: 'KOSPI', sector: '금융' },
    { code: '003550', name: 'LG', market: 'KOSPI', sector: '지주' },
  ],
  '자동차': [
    { code: '005380', name: '현대차', market: 'KOSPI', sector: '자동차' },
    { code: '000270', name: '기아', market: 'KOSPI', sector: '자동차' },
    { code: '012330', name: '현대모비스', market: 'KOSPI', sector: '자동차부품' },
    { code: '018880', name: '한온시스템', market: 'KOSPI', sector: '자동차부품' },
    { code: '161390', name: '한국타이어앤테크놀로지', market: 'KOSPI', sector: '자동차부품' },
  ],
  '엔터/미디어': [
    { code: '352820', name: '하이브', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '041510', name: 'SM', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '122870', name: 'YG엔터테인먼트', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '035900', name: 'JYP엔터테인먼트', market: 'KOSPI', sector: '엔터테인먼트' },
    { code: '034120', name: 'CJ ENM', market: 'KOSPI', sector: '미디어' },
  ],
};

// 카테고리 목록
export const STOCK_CATEGORIES = Object.keys(POPULAR_STOCKS);

// 기본 가격 데이터 (API 실패 시 폴백용)
const BASE_PRICES: Record<string, number> = {
  '005930': 71000, '000660': 178000, '373220': 370000, '207940': 780000,
  '005380': 210000, '000270': 95000, '035420': 180000, '035720': 42000,
  '051910': 350000, '006400': 350000, '247540': 95000, '086520': 65000,
  '003670': 280000, '068270': 175000, '302440': 65000, '091990': 72000,
  '145020': 165000, '105560': 82000, '055550': 52000, '086790': 62000,
  '316140': 15000, '024110': 14000, '003550': 78000, '012330': 240000,
  '018880': 7500, '161390': 40000, '352820': 250000, '041510': 85000,
  '122870': 42000, '035900': 65000, '034730': 170000, '036570': 195000,
  '259960': 230000, '263750': 38000, '034120': 72000,
};

/**
 * 카테고리별 종목 목록 가져오기 (시세 포함)
 */
export async function fetchStocksByCategory(category: string): Promise<Stock[]> {
  const stockList = POPULAR_STOCKS[category] || POPULAR_STOCKS['인기'];

  // 병렬로 시세 조회
  const stocksWithPrice = await Promise.all(
    stockList.map(async (stock, index) => {
      const priceData = await fetchStockPriceSafe(stock.code);
      // 백엔드 API에서 실제 stock ID를 가져오기 시도
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${baseURL}/stocks/${stock.code}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 60 }, // 60초 캐시
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.id) {
            return {
              id: result.data.id, // 백엔드에서 가져온 실제 UUID
              code: stock.code,
              name: stock.name,
              market: stock.market as 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'ETF' | 'INDEX',
              sector: stock.sector,
              ...priceData,
            };
          }
        }
      } catch (error) {
        // API 호출 실패 시 stock.code를 ID로 사용
      }
      
      // API 호출 실패 시 stock.code를 ID로 사용 (백엔드가 code로도 조회 가능)
      return {
        id: stock.code, // stock.code를 ID로 사용 (백엔드가 code로도 조회 가능)
        code: stock.code,
        name: stock.name,
        market: stock.market as 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'ETF' | 'INDEX',
        sector: stock.sector,
        ...priceData,
      };
    })
  );

  return stocksWithPrice;
}

/**
 * 안전한 시세 조회 (백엔드 API 사용, 실패 시 Mock 데이터 반환)
 */
export async function fetchStockPriceSafe(code: string): Promise<{
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}> {
  try {
    // 백엔드 API를 통해 네이버 주식 데이터 조회 (CORS 문제 해결)
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/stocks/${code}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 10 }, // 10초 캐시 (실시간 주가)
    });

    if (!response.ok) throw new Error('API failed');

    const result = await response.json();
    
    // 백엔드 응답 형식: { success: true, data: { ... } }
    if (result.success && result.data) {
      const data = result.data;
      return {
        currentPrice: Number(data.currentPrice) || 0,
        change: Number(data.change) || 0,
        changePercent: Number(data.changePercent) || 0,
        volume: Number(data.volume) || 0,
      };
    }

    throw new Error('Invalid response format');
  } catch {
    // Mock 데이터 반환
    const basePrice = BASE_PRICES[code] || 50000;
    const changePercent = (Math.random() - 0.5) * 6; // -3% ~ +3%
    const change = Math.round(basePrice * changePercent / 100);

    return {
      currentPrice: basePrice + change,
      change,
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 500000,
    };
  }
}

/**
 * 종목 검색 (백엔드 API 사용)
 */
export async function searchStocks(query: string): Promise<Stock[]> {
  if (!query || query.length < 1) return [];

  try {
    // 백엔드 API를 통해 검색 (CORS 문제 해결)
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/stocks?search=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Search failed');

    const result = await response.json();
    
    // 백엔드 응답 형식: { success: true, data: [...] }
    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data.map((item: { id?: string; code: string; name: string; market: string; sector?: string; currentPrice?: number; change?: number; changeRate?: number; changePercent?: number; volume?: number }) => ({
        id: item.id || `search-${item.code}`,
        code: item.code,
        name: item.name,
        market: item.market as 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'ETF' | 'INDEX',
        sector: item.sector || '검색결과',
        currentPrice: Number(item.currentPrice) || 0,
        change: Number(item.change) || 0,
        changePercent: Number(item.changeRate || item.changePercent) || 0,
        volume: Number(item.volume) || 0,
      }));
    }

    return localSearch(query);
  } catch {
    return localSearch(query);
  }
}

/**
 * 로컬 검색 (API 실패 시 폴백)
 */
function localSearch(query: string): Stock[] {
  const allStocks = Object.values(POPULAR_STOCKS).flat();
  const uniqueStocks = allStocks.filter(
    (stock, index, self) => self.findIndex((s) => s.code === stock.code) === index
  );

  const results = uniqueStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(query.toLowerCase()) ||
      stock.code.includes(query)
  );

  return results.slice(0, 10).map((stock, index) => {
    const basePrice = BASE_PRICES[stock.code] || 50000;
    const changePercent = (Math.random() - 0.5) * 6;
    const change = Math.round(basePrice * changePercent / 100);

    return {
      id: `local-${index}`,
      code: stock.code,
      name: stock.name,
      market: stock.market as 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'ETF' | 'INDEX',
      sector: stock.sector,
      currentPrice: basePrice + change,
      change,
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 500000,
    };
  });
}

/**
 * 개별 종목 상세 조회 (백엔드 API 사용)
 */
export async function fetchStockDetail(code: string): Promise<{
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  marketCap: number;
} | null> {
  try {
    // 백엔드 API를 통해 네이버 주식 데이터 조회 (CORS 문제 해결)
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/stocks/${code}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('API failed');

    const result = await response.json();
    
    // 백엔드 응답 형식: { success: true, data: { ... } }
    if (result.success && result.data) {
      const data = result.data;
      return {
        currentPrice: Number(data.currentPrice) || 0,
        change: Number(data.change) || 0,
        changePercent: Number(data.changePercent) || 0,
        volume: Number(data.volume) || 0,
        high: Number(data.high) || 0,
        low: Number(data.low) || 0,
        open: Number(data.open) || 0,
        marketCap: Number(data.marketCap) || 0,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 차트 데이터 조회 (백엔드 API 사용)
 */
export async function fetchChartData(
  code: string,
  period: number = 30
): Promise<{ time: string; value: number; volume: number; open?: number; high?: number; low?: number; close?: number }[]> {
  try {
    // 백엔드 API를 통해 차트 데이터 조회 (CORS 문제 해결)
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/stocks/${code}?chart=true&period=${period}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Chart API failed');

    const result = await response.json();

    // 백엔드 응답 형식: { success: true, data: { chartData: [...] } }
    if (result.success && result.data && result.data.chartData) {
      return result.data.chartData.map((item: any) => ({
        time: item.time || '',
        value: Number(item.close || item.value) || 0,
        volume: Number(item.volume) || 0,
        open: Number(item.open) || undefined,
        high: Number(item.high) || undefined,
        low: Number(item.low) || undefined,
        close: Number(item.close || item.value) || 0,
      }));
    }

    return [];
  } catch {
    // Mock 차트 데이터 (OHLC 형식)
    const basePrice = BASE_PRICES[code] || 50000;
    const chartData = [];
    let currentPrice = basePrice;

    for (let i = period; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // 랜덤 변동 (-2% ~ +2%)
      const change = (Math.random() - 0.5) * 0.04;
      const open = currentPrice;
      const close = currentPrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      currentPrice = close;

      chartData.push({
        time: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        value: Math.round(close),
        volume: Math.floor(Math.random() * 5000000) + 500000,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
      });
    }

    return chartData;
  }
}
