import { ChartPeriod } from './LightweightStockChart';

export type MinuteType = '1분' | '5분' | '15분' | '30분';

// 시간 포맷터 (기간에 따라 다르게) - 다양한 증권 앱 스타일 참고
export const getTimeFormatter = (period: ChartPeriod, minuteType?: MinuteType) => {
  return (time: number) => {
    const date = new Date(time * 1000);
    
    // 분봉 모드: 시간:분 형식
    if (minuteType) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // 1일: 시간 단위로 표시 (09:00, 10:00 형식)
    if (period === '1d') {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // 1주: 요일과 날짜 (월 1/15 형식)
    if (period === '1w') {
      const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      const monthDay = date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      return `${weekday} ${monthDay}`;
    }
    
    // 1개월: 월/일 형식 (1/15)
    if (period === '1m') {
      return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
    }
    
    // 3개월: 월/일 형식 (1/15)
    if (period === '3m') {
      return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
    }
    
    // 6개월: 월/일 형식 (1/15)
    if (period === '6m') {
      return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
    }
    
    // 1년: 년/월 형식 (2024/1)
    if (period === '1y') {
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric' });
    }
    
    // 기본: 월/일 형식
    return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  };
};

