/**
 * 증시 API 클라이언트
 * 한국투자증권 Open API 또는 공개 API 사용
 */

export interface MarketData {
  kospi: {
    price: number;
    change: number;
    changePercent: number;
  };
  kosdaq: {
    price: number;
    change: number;
    changePercent: number;
  };
  usdKrw: {
    price: number;
    change: number;
    changePercent: number;
  };
}

/**
 * 증시 데이터 조회
 * 
 * 실제 API 연동 옵션:
 * 1. 한국투자증권 Open API (https://apiportal.koreainvestment.com/)
 * 2. Alpha Vantage (https://www.alphavantage.co/)
 * 3. Yahoo Finance API (비공식)
 * 4. 자체 백엔드 API
 * 
 * 현재는 Mock 데이터 반환 (실제 API 연동 시 아래 코드 교체)
 */
export async function fetchMarketData(): Promise<MarketData> {
  try {
    // 백엔드 API 사용 시도
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/market`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }

    // Fallback: Mock 데이터
    throw new Error('Backend API failed, using fallback');
  } catch {
    // 백엔드 서버가 없을 때는 조용히 fallback 사용 (개발 환경에서만 디버그 로그)
    if (process.env.NODE_ENV === 'development') {
      console.debug('Backend unavailable, using fallback market data');
    }
    // Fallback: Mock 데이터 반환
    const baseKospi = 2650.5;
    const baseKosdaq = 875.2;
    const baseUsdKrw = 1335.5;
    
    const kospiVariation = (Math.random() - 0.5) * 5;
    const kosdaqVariation = (Math.random() - 0.5) * 3;
    const usdKrwVariation = (Math.random() - 0.5) * 2;
    
    const kospiPrice = baseKospi + kospiVariation;
    const kosdaqPrice = baseKosdaq + kosdaqVariation;
    const usdKrwPrice = baseUsdKrw + usdKrwVariation;
    
    const kospiChange = kospiVariation;
    const kosdaqChange = kosdaqVariation;
    const usdKrwChange = usdKrwVariation;
    
    return {
      kospi: {
        price: Number(kospiPrice.toFixed(2)),
        change: Number(kospiChange.toFixed(2)),
        changePercent: Number(((kospiChange / baseKospi) * 100).toFixed(2)),
      },
      kosdaq: {
        price: Number(kosdaqPrice.toFixed(2)),
        change: Number(kosdaqChange.toFixed(2)),
        changePercent: Number(((kosdaqChange / baseKosdaq) * 100).toFixed(2)),
      },
      usdKrw: {
        price: Number(usdKrwPrice.toFixed(2)),
        change: Number(usdKrwChange.toFixed(2)),
        changePercent: Number(((usdKrwChange / baseUsdKrw) * 100).toFixed(2)),
      },
    };
  }
}

/**
 * 실시간 증시 데이터 구독 (WebSocket)
 * WebSocket 연결로 실시간 데이터 수신
 */
export function subscribeMarketData(
  callback: (data: MarketData) => void
): () => void {
  // 클라이언트 사이드에서만 WebSocket 사용
  if (typeof window === 'undefined') {
    // SSR 환경에서는 Polling 방식 사용
    fetchMarketData().then(callback).catch(() => {});
    const interval = setInterval(() => {
      fetchMarketData().then(callback).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const wsBase = baseURL.replace(/\/api\/?$/, '').replace(/^http/, 'ws');
  const wsUrl = `${wsBase}/api/market/stream`;
  
  let ws: WebSocket;
  let pollingInterval: NodeJS.Timeout | null = null;
  let hasFallenBackToPolling = false;
  
  const startPolling = () => {
    if (hasFallenBackToPolling) return;
    hasFallenBackToPolling = true;
    
    fetchMarketData().then(callback).catch(() => {});
    pollingInterval = setInterval(() => {
      fetchMarketData().then(callback).catch(() => {});
    }, 10000);
  };
  
  try {
    ws = new WebSocket(wsUrl);
    
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.close();
        startPolling();
      }
    }, 3000);
    
    ws.onopen = () => {
      clearTimeout(connectionTimeout);
      console.debug('Market WebSocket connected');
      ws.send(JSON.stringify({ action: 'subscribe', channels: ['kospi', 'kosdaq', 'usdKrw'] }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // 구독 확인 메시지는 무시
        if (data.type === 'subscribed') {
          console.debug('Market WebSocket subscribed:', data.channels);
          return;
        }
        // MarketData 형식인지 확인
        if (data.kospi && data.kosdaq && data.usdKrw) {
          callback(data as MarketData);
        }
      } catch (error) {
        console.debug('WebSocket parse error:', error);
      }
    };
    
    ws.onerror = () => {
      if (!hasFallenBackToPolling) startPolling();
    };
    
    ws.onclose = (event) => {
      clearTimeout(connectionTimeout);
      if (event.code !== 1000 && !hasFallenBackToPolling) {
        startPolling();
      }
    };
    
    return () => {
      clearTimeout(connectionTimeout);
      if (pollingInterval) clearInterval(pollingInterval);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'Unmounted');
      }
    };
  } catch {
    startPolling();
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }
}
