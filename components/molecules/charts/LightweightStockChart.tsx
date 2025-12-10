'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createChart, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries, AreaSeries } from 'lightweight-charts';
import { ChartData } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useChartSettings } from './useChartSettings';
import { getTimeFormatter, MinuteType } from './useChartTimeFormatter';

export type { MinuteType };

export type ChartPeriod = '1d' | '1w' | '1m' | '3m' | '6m' | '1y';
export type ChartType = 'candle' | 'line' | 'area';

export interface LightweightStockChartProps {
  data: ChartData[];
  isPositive?: boolean;
  className?: string;
  period?: ChartPeriod;
  onPeriodChange?: (period: ChartPeriod) => void;
  stockCode?: string;
}

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: '1d', label: '1일' },
  { value: '1w', label: '1주' },
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
];

const MINUTE_OPTIONS: MinuteType[] = ['1분', '5분', '15분', '30분'];

// 이동평균 계산
const calculateMA = (data: { time: number; close?: number; value?: number }[], period: number) => {
  const result: { time: number; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      const val = data[i - j].close ?? data[i - j].value ?? 0;
      sum += val;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
};

// RSI 계산
const calculateRSI = (data: { time: number; close: number }[], period: number = 14): { time: number; value: number }[] => {
  const result: { time: number; value: number }[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    result.push({ time: data[i + 1].time, value: rsi });
  }

  return result;
};

// MACD 계산
const calculateMACD = (data: { time: number; close: number }[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): { macdLine: { time: number; value: number }[]; signalLine: { time: number; value: number }[]; histogram: { time: number; value: number }[] } => {
  const fastMA = calculateMA(data, fastPeriod);
  const slowMA = calculateMA(data, slowPeriod);
  
  const macdLine: { time: number; value: number }[] = [];
  const signalLine: { time: number; value: number }[] = [];
  const histogram: { time: number; value: number }[] = [];

  // MACD 라인 계산
  const slowMap = new Map(slowMA.map(item => [item.time, item.value]));
  fastMA.forEach(fast => {
    const slow = slowMap.get(fast.time);
    if (slow !== undefined) {
      macdLine.push({ time: fast.time, value: fast.value - slow });
    }
  });

  // Signal 라인 계산 (MACD의 이동평균)
  const signal = calculateMA(macdLine, signalPeriod);
  signalLine.push(...signal);

  // Histogram 계산
  const signalMap = new Map(signalLine.map(item => [item.time, item.value]));
  macdLine.forEach(macd => {
    const signal = signalMap.get(macd.time);
    if (signal !== undefined) {
      histogram.push({ time: macd.time, value: macd.value - signal });
    }
  });

  return { macdLine, signalLine, histogram };
};

// MinuteType은 useChartTimeFormatter에서 export됨

export const LightweightStockChart: React.FC<LightweightStockChartProps> = ({
  data,
  isPositive = true,
  className,
  period = '1m',
  onPeriodChange,
  stockCode,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const mainSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const maSeriesRefs = useRef<{ [key: string]: any }>({});
  const indicatorSeriesRefs = useRef<{ [key: string]: any }>({});
  const drawingLinesRef = useRef<any[]>([]);
  const isDrawingRef = useRef(false);
  const drawingStartRef = useRef<{ x: number; y: number } | null>(null);
  const drawingTypeRef = useRef<'trend' | 'horizontal' | 'fibonacci' | 'rectangle' | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(period);
  const [hoveredData, setHoveredData] = useState<{ open: number; high: number; low: number; close: number } | null>(null);
  const [showMA, setShowMA] = useState({ ma5: true, ma20: true, ma60: true, ma120: true });
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);
  const [minuteType, setMinuteType] = useState<MinuteType>('1분');
  const [isMinuteMode, setIsMinuteMode] = useState(false);
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('candle');
  const [showSettings, setShowSettings] = useState(false);
  
  // 다크모드 감지 (useState로 안정화)
  const [isDark, setIsDark] = useState(() => 
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
  const { chartSettings, setChartSettings } = useChartSettings(chartRef, isDark);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'trend' | 'horizontal' | 'fibonacci' | 'rectangle' | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareStockCode, setCompareStockCode] = useState('');
  const [indicators, setIndicators] = useState<{ type: 'RSI' | 'MACD'; visible: boolean }[]>([]);
  const [showOrderBook, setShowOrderBook] = useState(false);
  const [drawingShapes, setDrawingShapes] = useState<any[]>([]);

  const upColor = '#EF4444';
  const downColor = '#3B82F6';

  // 날짜 범위 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) return data;
    
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime() + 86400000; // 하루 추가
    
    return data.filter(item => {
      if (!item.time) return false;
      const itemTime = new Date(item.time).getTime();
      return itemTime >= start && itemTime <= end;
    });
  }, [data, dateRange]);

  // 데이터 변환: ChartData[] -> Lightweight Charts 형식
  const chartData = useMemo(() => {
    const sourceData = filteredData.length > 0 ? filteredData : data;
    if (!sourceData || sourceData.length === 0) return { candleData: [], volumeData: [], maData: {}, indicatorData: {} };

    // 1일 차트에서 현재 시간 이후 데이터 제외
    const now = Math.floor(Date.now() / 1000); // 현재 시간 (Unix timestamp)
    const isOneDayChart = selectedPeriod === '1d';
    
    // 현재 시간 이전 데이터만 필터링
    const validData = isOneDayChart 
      ? sourceData.filter(item => {
          if (!item.time) return false;
          const itemTime = typeof item.time === 'number' ? item.time : (typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : 0);
          return itemTime <= now;
        })
      : sourceData;

    const candleData: { time: number; open: number; high: number; low: number; close: number }[] = [];
    const volumeData: { time: number; value: number; color: string }[] = [];
    const closeData: { time: number; close: number }[] = [];

    // 1일 차트일 때 각 시간대별 누적 거래량 계산
    if (isOneDayChart && validData.length > 0) {
      // 시간대별로 그룹화하고 각 시간대부터 현재까지의 누적 거래량 계산
      const timeGroupedData: Map<number, { items: typeof validData; cumulativeVolume: number }> = new Map();
      
      // 먼저 모든 데이터를 시간대별로 그룹화
      validData.forEach((item) => {
        if (item.open != null && item.high != null && item.low != null && item.close != null) {
          let time: number | null = null;
          
          if (item.time) {
            const date = new Date(item.time);
            if (!isNaN(date.getTime())) {
              time = Math.floor(date.getTime() / 1000);
            }
          }
          
          if (time === null || isNaN(time)) {
            return; // 시간이 없으면 스킵
          }
          
          // 시간대별 그룹화 (시간을 시간 단위로 반올림)
          const hourTime = Math.floor(time / 3600) * 3600; // 시간 단위로 반올림
          
          if (!timeGroupedData.has(hourTime)) {
            timeGroupedData.set(hourTime, { items: [], cumulativeVolume: 0 });
          }
          
          const group = timeGroupedData.get(hourTime)!;
          group.items.push(item);
        }
      });
      
      // 각 시간대별로 그 시간대부터 현재까지의 누적 거래량 계산
      const sortedTimes = Array.from(timeGroupedData.keys()).sort((a, b) => a - b);
      
      sortedTimes.forEach((hourTime, hourIndex) => {
        const group = timeGroupedData.get(hourTime)!;
        
        // 이 시간대부터 현재 시간까지의 모든 거래량 누적
        let cumulativeVolume = 0;
        for (let i = hourIndex; i < sortedTimes.length; i++) {
          const currentHourTime = sortedTimes[i];
          const currentGroup = timeGroupedData.get(currentHourTime)!;
          currentGroup.items.forEach(item => {
            const volume = item.volume || 0;
            if (typeof volume === 'number' && !isNaN(volume) && volume > 0) {
              cumulativeVolume += volume;
            }
          });
        }
        
        // 해당 시간대의 첫 번째 아이템을 대표로 사용
        const representativeItem = group.items[0];
        if (representativeItem && representativeItem.open != null && representativeItem.high != null && 
            representativeItem.low != null && representativeItem.close != null) {
          const open = Number(representativeItem.open);
          const high = Number(representativeItem.high);
          const low = Number(representativeItem.low);
          const close = Number(representativeItem.close);
          
          candleData.push({ time: hourTime, open, high, low, close });
          closeData.push({ time: hourTime, close });
          
          if (cumulativeVolume > 0) {
            volumeData.push({
              time: hourTime,
              value: cumulativeVolume,
              color: close >= open ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)',
            });
          }
        }
      });
    } else {
      // 일반 차트 (1일이 아닌 경우)
      validData.forEach((item, index) => {
        if (item.open != null && item.high != null && item.low != null && item.close != null) {
          const open = Number(item.open);
          const high = Number(item.high);
          const low = Number(item.low);
          const close = Number(item.close);

          if (!isNaN(open) && open > 0 && !isNaN(high) && high > 0 && !isNaN(low) && low > 0 && !isNaN(close) && close > 0) {
            let time: number | null = null;
            
            if (item.time) {
              const date = new Date(item.time);
              if (!isNaN(date.getTime())) {
                time = Math.floor(date.getTime() / 1000);
              }
            }
            
            if (time === null || isNaN(time)) {
              const now = Math.floor(Date.now() / 1000);
              const interval = isMinuteMode ? (minuteType === '1분' ? 60 : minuteType === '5분' ? 300 : minuteType === '15분' ? 900 : 1800) : 86400;
              time = now - (validData.length - index - 1) * interval;
            }

            if (time !== null && !isNaN(time) && time > 0) {
              candleData.push({ time, open, high, low, close });
              closeData.push({ time, close });

              const volume = item.volume || 0;
              if (typeof volume === 'number' && !isNaN(volume) && volume > 0) {
                volumeData.push({
                  time,
                  value: volume,
                  color: close >= open ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                });
              }
            }
          }
        }
      });
    }

    candleData.sort((a, b) => a.time - b.time);
    volumeData.sort((a, b) => a.time - b.time);
    closeData.sort((a, b) => a.time - b.time);

    const maData = {
      ma5: calculateMA(closeData, 5),
      ma20: calculateMA(closeData, 20),
      ma60: calculateMA(closeData, 60),
      ma120: calculateMA(closeData, 120),
    };

    const indicatorData: { [key: string]: any } = {};
    indicators.forEach(ind => {
      if (ind.type === 'RSI' && ind.visible) {
        indicatorData.RSI = calculateRSI(closeData);
      } else if (ind.type === 'MACD' && ind.visible) {
        indicatorData.MACD = calculateMACD(closeData);
      }
    });

    return { candleData, volumeData, maData, indicatorData };
  }, [filteredData, data, isMinuteMode, minuteType, indicators, selectedPeriod]);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current || chartData.candleData.length === 0) return;

    const container = chartContainerRef.current;
    // 실제 컨테이너 크기 가져오기 (부모의 높이에 맞춤)
    const containerWidth = container.clientWidth || container.offsetWidth || 800;
    const containerHeight = container.clientHeight || container.offsetHeight || 500;
    
    const chart = createChart(container, {
      width: containerWidth,
      height: containerHeight,
      layout: {
        background: { color: isDark ? '#1F2937' : '#ffffff' },
        textColor: isDark ? '#F3F4F6' : '#333',
        fontFamily: "'Pretendard', -apple-system, sans-serif",
      },
      grid: {
        vertLines: { 
          color: isDark ? '#374151' : '#f0f0f0',
          visible: chartSettings.showGrid,
        },
        horzLines: { 
          color: isDark ? '#374151' : '#f0f0f0',
          visible: chartSettings.showGrid,
        },
      },
      crosshair: {
        mode: chartSettings.showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
        vertLine: {
          color: isDark ? '#9ca3af' : '#9ca3af',
          width: 1,
          style: 2,
          labelBackgroundColor: isDark ? '#6b7280' : '#6b7280',
          labelVisible: chartSettings.showCrosshair,
        },
        horzLine: {
          color: isDark ? '#9ca3af' : '#9ca3af',
          width: 1,
          style: 2,
          labelBackgroundColor: isDark ? '#6b7280' : '#6b7280',
          labelVisible: chartSettings.showCrosshair,
        },
      },
      localization: {
        priceFormatter: (price: number) => formatPrice(price),
        timeFormatter: (time: any) => {
          const timeNum = typeof time === 'number' ? time : (typeof time === 'string' ? parseInt(time) : 0);
          if (timeNum === 0) return '';
          return getTimeFormatter(selectedPeriod, isMinuteMode ? minuteType : undefined)(timeNum);
        },
      },
      rightPriceScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
        scaleMargins: { top: 0.05, bottom: 0.15 },
        entireTextOnly: false,
        autoScale: true,
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
        timeVisible: true,
        secondsVisible: selectedPeriod === '1d' || isMinuteMode,
        rightOffset: 10,
        barSpacing: 8,
        fixLeftEdge: true, // 왼쪽 끝 고정 (데이터 범위를 넘어가지 않도록)
        fixRightEdge: true, // 오른쪽 끝 고정 (데이터 범위를 넘어가지 않도록)
        visible: true,
        tickMarkFormatter: (time: any) => {
          const timeNum = typeof time === 'number' ? time : (typeof time === 'string' ? parseInt(time) : 0);
          if (timeNum === 0) return '';
          return getTimeFormatter(selectedPeriod, isMinuteMode ? minuteType : undefined)(timeNum);
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // 메인 시리즈 생성 (차트 타입에 따라)
    let mainSeries: any;
    if (chartType === 'candle') {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: upColor,
        downColor: downColor,
        borderUpColor: upColor,
        borderDownColor: downColor,
        wickUpColor: upColor,
        wickDownColor: downColor,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: { type: 'price', precision: 0, minMove: 1 },
      });
      mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close })));
    } else if (chartType === 'line') {
      mainSeries = chart.addSeries(LineSeries, {
        color: upColor,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: { type: 'price', precision: 0, minMove: 1 },
      });
      mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, value: c.close })));
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, {
        lineColor: upColor,
        topColor: `${upColor}40`,
        bottomColor: `${upColor}00`,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: { type: 'price', precision: 0, minMove: 1 },
      });
      mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, value: c.close })));
    }
    mainSeriesRef.current = mainSeries;

    // 거래량 시리즈
    if (chartSettings.showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
        priceLineVisible: false,
        lastValueVisible: false,
      });
      volumeSeries.setData(chartData.volumeData.map(v => ({ time: v.time as any, value: v.value, color: v.color })));
      volumeSeriesRef.current = volumeSeries;

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.75, bottom: 0 },
        visible: true,
        entireTextOnly: false,
      });
    }

    // 이동평균선
    const maColors = {
      ma5: '#10B981',
      ma20: '#EF4444',
      ma60: '#F97316',
      ma120: '#A855F7',
    };

    Object.entries(maColors).forEach(([key, color]) => {
      const maKey = key as 'ma5' | 'ma20' | 'ma60' | 'ma120';
      if ('ma5' in chartData.maData && maKey in chartData.maData) {
        const maData = (chartData.maData as { [k: string]: { time: number; value: number }[] })[maKey];
        if (maData && Array.isArray(maData) && maData.length > 0) {
          const maSeries = chart.addSeries(LineSeries, {
            color,
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: true,
            priceFormat: { type: 'price', precision: 0, minMove: 1 },
          });
          maSeries.setData(maData.map((m: { time: number; value: number }) => ({ time: m.time as any, value: m.value })));
          maSeriesRefs.current[key] = maSeries;
        }
      }
    });

    // 지표 추가
    const indicatorData = chartData.indicatorData as { [key: string]: any };
    if ('RSI' in indicatorData && Array.isArray(indicatorData.RSI)) {
      const rsiSeries = chart.addSeries(LineSeries, {
        color: '#9C27B0',
        lineWidth: 2,
        priceScaleId: 'rsi',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
      rsiSeries.setData(indicatorData.RSI.map((r: { time: number; value: number }) => ({ time: r.time as any, value: r.value })));
      indicatorSeriesRefs.current.RSI = rsiSeries;
      
      chart.priceScale('rsi').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
        visible: true,
      });
    }

    if ('MACD' in indicatorData && indicatorData.MACD && indicatorData.MACD.macdLine) {
      const macdSeries = chart.addSeries(LineSeries, {
        color: '#2196F3',
        lineWidth: 2,
        priceScaleId: 'macd',
        priceFormat: { type: 'price', precision: 0, minMove: 1 },
      });
      macdSeries.setData(indicatorData.MACD.macdLine.map((m: { time: number; value: number }) => ({ time: m.time as any, value: m.value })));
      indicatorSeriesRefs.current.MACD = macdSeries;
      
      chart.priceScale('macd').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
        visible: true,
      });
    }

    // 크로스헤어 이벤트
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData && param.seriesData.size > 0) {
        const mainData = param.seriesData.get(mainSeries) as any;
        if (mainData) {
          if (chartType === 'candle') {
            setHoveredData(mainData);
          } else {
            setHoveredData({ open: mainData.value, high: mainData.value, low: mainData.value, close: mainData.value });
          }
        } else {
          const time = param.time as number;
          const closest = chartData.candleData.find(c => Math.abs(c.time - time) < 86400);
          if (closest) {
            setHoveredData(closest);
          } else {
            setHoveredData(null);
          }
        }
      } else {
        setHoveredData(null);
      }
    });

      // 리사이즈 핸들러
      const handleResize = () => {
        if (chartContainerRef.current && chart && chartRef.current === chart) {
          try {
            const container = chartContainerRef.current;
            const width = container.clientWidth || container.offsetWidth || 800;
            const height = container.clientHeight || container.offsetHeight || 500;
            chart.applyOptions({ width, height });
            setTimeout(() => {
              // 차트가 여전히 유효한지 확인
              if (chartRef.current === chart && chartContainerRef.current) {
                try {
                  chart.timeScale().fitContent();
                } catch (e) {
                  // 차트가 dispose된 경우 무시
                  if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
                    return;
                  }
                  throw e;
                }
              }
            }, 100);
          } catch (e) {
            // 차트가 dispose된 경우 무시
            if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
              return;
            }
            console.error('Chart resize error:', e);
          }
        }
      };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        if (chart && chartRef.current === chart) {
          chart.remove();
        }
      } catch (e) {
        // 이미 dispose된 경우 무시
        if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
          return;
        }
        console.error('Chart cleanup error:', e);
      } finally {
        chartRef.current = null;
        mainSeriesRef.current = null;
        volumeSeriesRef.current = null;
        maSeriesRefs.current = {};
        indicatorSeriesRefs.current = {};
      }
    };
  }, [chartData, isDark, chartSettings, chartType, selectedPeriod, isMinuteMode, minuteType]);

  // 차트 타입 변경 시 시리즈 재생성
  useEffect(() => {
    if (!chartRef.current || !mainSeriesRef.current || chartData.candleData.length === 0) return;

    try {
      // 기존 시리즈 제거
      chartRef.current.removeSeries(mainSeriesRef.current);
      mainSeriesRef.current = null;
    } catch (e) {
      // 차트가 dispose된 경우 무시
      if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
        return;
      }
      console.error('Chart series removal error:', e);
      return;
    }

    // 새 시리즈 생성
    if (!chartRef.current) return;
    
    let mainSeries: any;
    try {
      if (chartType === 'candle') {
        mainSeries = chartRef.current.addSeries(CandlestickSeries, {
          upColor: upColor,
          downColor: downColor,
          borderUpColor: upColor,
          borderDownColor: downColor,
          wickUpColor: upColor,
          wickDownColor: downColor,
          priceLineVisible: false,
          lastValueVisible: true,
          priceFormat: { type: 'price', precision: 0, minMove: 1 },
        });
        mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close })));
      } else if (chartType === 'line') {
        mainSeries = chartRef.current.addSeries(LineSeries, {
          color: upColor,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
          priceFormat: { type: 'price', precision: 0, minMove: 1 },
        });
        mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, value: c.close })));
      } else if (chartType === 'area') {
        mainSeries = chartRef.current.addSeries(AreaSeries, {
          lineColor: upColor,
          topColor: `${upColor}40`,
          bottomColor: `${upColor}00`,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
          priceFormat: { type: 'price', precision: 0, minMove: 1 },
        });
        mainSeries.setData(chartData.candleData.map(c => ({ time: c.time as any, value: c.close })));
      }
      mainSeriesRef.current = mainSeries;
    } catch (e) {
      // 차트가 dispose된 경우 무시
      if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
        return;
      }
      console.error('Chart series creation error:', e);
    }
  }, [chartType, chartData.candleData]);

  // MA 토글
  useEffect(() => {
    Object.entries(showMA).forEach(([key, visible]) => {
      if (maSeriesRefs.current[key]) {
        maSeriesRefs.current[key].applyOptions({ visible });
      }
    });
  }, [showMA]);

  // 거래량 표시/숨김
  useEffect(() => {
    if (!chartRef.current || !mainSeriesRef.current) return;
    
    try {
      const chart = chartRef.current;
      
      // 차트가 dispose되었는지 확인
      if (!chart || typeof chart.removeSeries !== 'function' || typeof chart.addSeries !== 'function') {
        return;
      }
      
      if (chartSettings.showVolume && !volumeSeriesRef.current) {
        // 거래량 데이터가 있는 경우에만 시리즈 생성
        if (chartData.volumeData && chartData.volumeData.length > 0) {
          try {
            const volumeSeries = chart.addSeries(HistogramSeries, {
              priceFormat: { type: 'volume' },
              priceScaleId: 'volume',
              priceLineVisible: false,
              lastValueVisible: false,
            });
            
            volumeSeries.setData(chartData.volumeData.map(v => ({ 
              time: v.time as any, 
              value: v.value, 
              color: v.color 
            })));
            
            volumeSeriesRef.current = volumeSeries;
            
            chart.priceScale('volume').applyOptions({
              scaleMargins: { top: 0.75, bottom: 0 },
              visible: true,
              entireTextOnly: false,
            });
          } catch (e) {
            console.error('Error creating volume series:', e);
            volumeSeriesRef.current = null;
          }
        }
      } else if (!chartSettings.showVolume && volumeSeriesRef.current) {
        // 거래량 시리즈 제거
        try {
          const volumeSeries = volumeSeriesRef.current;
          
          // 시리즈가 유효한지 확인
          if (volumeSeries && typeof volumeSeries.setData === 'function') {
            chart.removeSeries(volumeSeries);
          }
        } catch (e) {
          // dispose된 경우 무시
          if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('undefined'))) {
            // 이미 dispose된 경우이므로 무시
          } else {
            console.error('Error removing volume series:', e);
          }
        } finally {
          volumeSeriesRef.current = null;
        }
      } else if (chartSettings.showVolume && volumeSeriesRef.current && chartData.volumeData && chartData.volumeData.length > 0) {
        // 거래량 데이터 업데이트
        try {
          const volumeSeries = volumeSeriesRef.current;
          
          // 시리즈가 유효한지 확인
          if (volumeSeries && typeof volumeSeries.setData === 'function') {
            volumeSeries.setData(chartData.volumeData.map(v => ({ 
              time: v.time as any, 
              value: v.value, 
              color: v.color 
            })));
          } else {
            // 시리즈가 유효하지 않으면 재생성
            volumeSeriesRef.current = null;
          }
        } catch (e) {
          // dispose된 경우 무시하고 재생성 준비
          if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('undefined'))) {
            volumeSeriesRef.current = null;
          } else {
            console.error('Error updating volume data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Volume series toggle error:', error);
    }
  }, [chartSettings.showVolume, chartData.volumeData]);

  // 차트 설정은 useChartSettings 훅에서 처리됨

  // 데이터 업데이트
  useEffect(() => {
    if (!mainSeriesRef.current) return;
    
    if (chartType === 'candle') {
      mainSeriesRef.current.setData(chartData.candleData);
    } else {
      mainSeriesRef.current.setData(chartData.candleData.map(c => ({ time: c.time, value: c.close })));
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(chartData.volumeData);
    }

    Object.entries(chartData.maData).forEach(([key, maData]) => {
      if (maSeriesRefs.current[key]) {
        maSeriesRefs.current[key].setData(maData);
      }
    });

    if (chartContainerRef.current && chartRef.current) {
      try {
        const container = chartContainerRef.current;
        const width = container.clientWidth || container.offsetWidth || 800;
        const height = container.clientHeight || container.offsetHeight || 500;
        chartRef.current.applyOptions({ width, height });
        setTimeout(() => {
          // 차트가 여전히 유효한지 확인
          if (chartRef.current && chartContainerRef.current) {
            try {
              chartRef.current.timeScale().fitContent();
            } catch (e) {
              // 차트가 dispose된 경우 무시
              if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
                return;
              }
              throw e;
            }
          }
        }, 100);
      } catch (e) {
        // 차트가 dispose된 경우 무시
        if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
          return;
        }
        console.error('Chart update error:', e);
      }
    }
  }, [chartData, chartType]);

  const handlePeriodChange = (newPeriod: ChartPeriod) => {
    setSelectedPeriod(newPeriod);
    setIsMinuteMode(false);
    onPeriodChange?.(newPeriod);
  };

  const handleMinuteChange = (minute: MinuteType) => {
    setMinuteType(minute);
    setIsMinuteMode(true);
    setShowMinuteDropdown(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (chartRef.current && chartData.candleData.length > 0) {
      try {
        const timeScale = chartRef.current.timeScale();
        const currentRange = timeScale.getVisibleLogicalRange();
        const logicalRange = timeScale.getVisibleLogicalRange();
        
        if (currentRange && logicalRange) {
          const rangeSize = currentRange.to - currentRange.from;
          const center = (currentRange.from + currentRange.to) / 2;
          const newSize = direction === 'in' ? rangeSize * 0.7 : rangeSize * 1.3;
          
          // 데이터 범위 확인 (첫 번째와 마지막 데이터의 logical 인덱스)
          const firstLogical = 0;
          const lastLogical = chartData.candleData.length - 1;
          
          // 새로운 범위 계산
          let newFrom = center - newSize / 2;
          let newTo = center + newSize / 2;
          
          // 왼쪽 끝 제한
          if (newFrom < firstLogical) {
            newFrom = firstLogical;
            newTo = newFrom + newSize;
          }
          
          // 오른쪽 끝 제한
          if (newTo > lastLogical) {
            newTo = lastLogical;
            newFrom = newTo - newSize;
          }
          
          // 최소 크기 제한 (너무 작게 축소되지 않도록)
          if (newTo - newFrom < 5) {
            return;
          }
          
          timeScale.setVisibleLogicalRange({
            from: Math.max(firstLogical, newFrom),
            to: Math.min(lastLogical, newTo),
          });
        }
      } catch (e) {
        // 차트가 dispose된 경우 무시
        if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
          return;
        }
        console.error('Chart zoom error:', e);
      }
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      try {
        // fitContent는 자동으로 데이터 범위에 맞춰지므로 안전
        chartRef.current.timeScale().fitContent();
      } catch (e) {
        // 차트가 dispose된 경우 무시
        if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
          return;
        }
        console.error('Chart reset zoom error:', e);
      }
    }
  };

  const handleAddIndicator = (type: 'RSI' | 'MACD') => {
    if (!indicators.find(i => i.type === type)) {
      setIndicators(prev => [...prev, { type, visible: true }]);
    }
  };

  const handleRemoveIndicator = (type: 'RSI' | 'MACD') => {
    setIndicators(prev => prev.filter(i => i.type !== type));
    if (indicatorSeriesRefs.current[type] && chartRef.current) {
      try {
        chartRef.current.removeSeries(indicatorSeriesRefs.current[type]);
        delete indicatorSeriesRefs.current[type];
      } catch (e) {
        // 차트가 dispose된 경우 무시
        if (e instanceof Error && (e.message.includes('disposed') || e.message.includes('Object is disposed'))) {
          return;
        }
        console.error('Chart indicator removal error:', e);
      }
    }
  };

  const handleDrawingToolSelect = (tool: 'trend' | 'horizontal' | 'fibonacci' | 'rectangle') => {
    setDrawingTool(tool);
    drawingTypeRef.current = tool;
    isDrawingRef.current = true;
  };

  // Undo 기능: Cmd+Z 또는 Ctrl+Z로 마지막 그린 요소 삭제
  const handleUndo = useCallback(() => {
    if (!mainSeriesRef.current || drawingShapes.length === 0) return;
    
    try {
      // 마지막으로 그린 요소 가져오기
      const lastShape = drawingShapes[drawingShapes.length - 1];
      
      // 차트에서 제거
      if (Array.isArray(lastShape)) {
        // 사각형이나 피보나치는 배열
        lastShape.forEach((shape: any) => {
          try {
            if (shape && typeof shape !== 'undefined') {
              mainSeriesRef.current.removePriceLine(shape);
            }
          } catch (e) {
            // 이미 제거된 경우 무시
          }
        });
      } else {
        // 단일 라인
        try {
          if (lastShape && typeof lastShape !== 'undefined') {
            mainSeriesRef.current.removePriceLine(lastShape);
          }
        } catch (e) {
          // 이미 제거된 경우 무시
        }
      }
      
      // 상태에서 제거
      setDrawingShapes(prev => prev.slice(0, -1));
    } catch (error) {
      console.error('Error undoing drawing:', error);
    }
  }, [drawingShapes, mainSeriesRef]);

  // 키보드 단축키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z (Mac) 또는 Ctrl+Z (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo]);

  // 그리기 이벤트 핸들러
  useEffect(() => {
    if (!isDrawingMode || !chartRef.current || !drawingTool) return;

    const chart = chartRef.current;
    const container = chartContainerRef.current;
    if (!container) return;

    let startPoint: { x: number; y: number; price?: number; time?: number } | null = null;
    let endPoint: { x: number; y: number; price?: number; time?: number } | null = null;
    let currentShape: any = null;
    let isDrawing = false;
    const currentDrawingTool = drawingTool; // 클로저 문제 해결

    const handleMouseDown = (e: MouseEvent) => {
      // 그리기 모드가 아니거나 도구가 선택되지 않았으면 무시
      if (!isDrawingMode || !currentDrawingTool) {
        console.log('Drawing mode check:', { isDrawingMode, drawingTool: currentDrawingTool });
        return;
      }
      
      console.log('Mouse down in drawing mode');
      
      // 차트 영역 내에서만 작동
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 차트 영역 확인 (툴바, 범례 제외)
      const chartCanvas = container.querySelector('canvas');
      if (!chartCanvas) {
        console.log('No canvas found');
        return;
      }
      
      if (!mainSeriesRef.current) {
        console.log('No main series ref');
        return;
      }
      
      const canvasRect = chartCanvas.getBoundingClientRect();
      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;
      
      // 캔버스 영역 밖이면 무시
      if (canvasX < 0 || canvasX > canvasRect.width || canvasY < 0 || canvasY > canvasRect.height) {
        console.log('Outside canvas area');
        return;
      }
      
      try {
        // 가격 스케일에서 Y 좌표를 가격으로 변환
        const priceScale = mainSeriesRef.current.priceScale();
        const visibleRange = priceScale.getVisibleRange();
        
        console.log('Visible range:', visibleRange);
        console.log('Canvas rect:', { width: canvasRect.width, height: canvasRect.height });
        console.log('Canvas Y:', canvasY);
        
        if (visibleRange && visibleRange.from !== null && visibleRange.to !== null) {
          const canvasHeight = canvasRect.height;
          
          if (canvasHeight > 0) {
            // Lightweight Charts는 from이 최저가, to가 최고가를 반환
            const minPrice = visibleRange.from;
            const maxPrice = visibleRange.to;
            const priceRange = maxPrice - minPrice;
            // Y 좌표를 가격으로 변환 (위에서 아래로 갈수록 가격이 낮아짐)
            // canvasY가 0이면 최고가, canvasHeight이면 최저가
            const normalizedY = canvasY / canvasHeight; // 0 ~ 1
            const price = maxPrice - (normalizedY * priceRange);
            
            console.log('Drawing started:', { 
              price, 
              canvasX, 
              canvasY, 
              canvasHeight,
              priceRange,
              normalizedY,
              visibleRange 
            });
            
            if (!isNaN(price) && isFinite(price)) {
              // 시간 좌표도 저장 (추세선, 사각형, 피보나치용)
              let time: number | null = null;
              try {
                const timeScale = chart.timeScale();
                const logicalX = timeScale.coordinateToLogical(canvasX);
                if (logicalX !== null) {
                  // logicalToTime이 없으므로 logical 인덱스를 사용
                  time = logicalX;
                }
              } catch (e) {
                // 시간 변환 실패 시 무시
              }
              
              startPoint = { x: canvasX, y: canvasY, price: price, time: time || undefined };
              endPoint = null; // 리셋
              isDrawing = true;
              isDrawingRef.current = true;
              drawingStartRef.current = { x: canvasX, y: canvasY };
              
              // 수평선은 즉시 그리기
              if (currentDrawingTool === 'horizontal') {
                currentShape = mainSeriesRef.current.createPriceLine({
                  price: price,
                  color: '#FF9800',
                  lineWidth: 2,
                  lineStyle: 0,
                  axisLabelVisible: true,
                  title: '수평선',
                });
              }
            } else {
              console.error('Invalid price calculated:', price);
            }
          } else {
            console.error('Canvas height is 0');
          }
        } else {
          console.log('No valid visible range:', visibleRange);
        }
      } catch (err) {
        console.error('Drawing mouse down error:', err);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || !startPoint || !currentDrawingTool || !mainSeriesRef.current || !chartRef.current) return;
      
      // 수평선은 이미 그려졌으므로 드래그 불필요
      if (currentDrawingTool === 'horizontal') return;
      
      const container = chartContainerRef.current;
      if (!container) return;
      
      const chartCanvas = container.querySelector('canvas');
      if (!chartCanvas) return;
      
      const canvasRect = chartCanvas.getBoundingClientRect();
      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;
      
      try {
        // 가격 스케일의 visible range를 사용하여 Y 좌표를 가격으로 변환
        const priceScale = mainSeriesRef.current.priceScale();
        const visibleRange = priceScale.getVisibleRange();
        const timeScale = chartRef.current.timeScale();
        
        if (visibleRange && visibleRange.from !== null && visibleRange.to !== null && startPoint.price !== undefined) {
          // 기존 라인 제거
          if (currentShape) {
            try {
              mainSeriesRef.current.removePriceLine(currentShape);
            } catch (e) {
              // 무시
            }
          }
          
          // Y 좌표를 가격으로 변환
          const canvasHeight = canvasRect.height;
          
          if (canvasHeight > 0) {
            const minPrice = visibleRange.from;
            const maxPrice = visibleRange.to;
            const priceRange = maxPrice - minPrice;
            const normalizedY = canvasY / canvasHeight;
            const endPrice = maxPrice - (normalizedY * priceRange);
            
            // 시간 좌표 변환
            let endTime: number | null = null;
            try {
              const logicalX = timeScale.coordinateToLogical(canvasX);
              if (logicalX !== null) {
                endTime = logicalX; // logical 인덱스를 시간으로 사용
              }
            } catch (e) {
              // 시간 변환 실패 시 무시
            }
            
            if (!isNaN(endPrice) && isFinite(endPrice) && startPoint.price !== undefined) {
              // 시작점과 끝점 저장
              endPoint = { x: canvasX, y: canvasY, price: endPrice, time: endTime || undefined };
              
              if (currentDrawingTool === 'trend' && startPoint.time && endTime) {
                // 추세선: 두 점을 연결하는 선
                const avgPrice = (startPoint.price + endPrice) / 2;
                
                // 임시로 평균 가격선을 표시 (실제 추세선은 커스텀 오버레이 필요)
                currentShape = mainSeriesRef.current.createPriceLine({
                  price: avgPrice,
                  color: '#2196F3',
                  lineWidth: 2,
                  lineStyle: 1, // 점선으로 표시하여 임시임을 나타냄
                  axisLabelVisible: true,
                  title: '추세선 (미리보기)',
                });
              } else if (currentDrawingTool === 'rectangle' && startPoint.time && endTime) {
                // 사각형: 두 점으로 사각형 영역 표시
                const topPrice = Math.max(startPoint.price, endPrice);
                const bottomPrice = Math.min(startPoint.price, endPrice);
                
                // 상단과 하단 가격선을 배열로 저장
                currentShape = [
                  mainSeriesRef.current.createPriceLine({
                    price: topPrice,
                    color: '#4CAF50',
                    lineWidth: 2,
                    lineStyle: 0,
                    axisLabelVisible: true,
                    title: '사각형 상단',
                  }),
                  mainSeriesRef.current.createPriceLine({
                    price: bottomPrice,
                    color: '#4CAF50',
                    lineWidth: 2,
                    lineStyle: 0,
                    axisLabelVisible: true,
                    title: '사각형 하단',
                  }),
                ];
              } else if (currentDrawingTool === 'fibonacci' && startPoint.time && endTime) {
                // 피보나치 되돌림: 시작 가격과 끝 가격 사이의 피보나치 비율선
                const highPrice = Math.max(startPoint.price, endPrice);
                const lowPrice = Math.min(startPoint.price, endPrice);
                const priceRange = highPrice - lowPrice;
                
                // 피보나치 비율
                const fibonacciLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
                const fibonacciLines: any[] = [];
                
                fibonacciLevels.forEach((level, index) => {
                  const fibPrice = highPrice - (priceRange * level);
                  fibonacciLines.push(
                    mainSeriesRef.current.createPriceLine({
                      price: fibPrice,
                      color: index === 0 || index === fibonacciLevels.length - 1 ? '#FF5722' : '#9C27B0',
                      lineWidth: index === 0 || index === fibonacciLevels.length - 1 ? 2 : 1,
                      lineStyle: index === 0 || index === fibonacciLevels.length - 1 ? 0 : 2, // 실선/점선
                      axisLabelVisible: true,
                      title: `${(level * 100).toFixed(1)}%`,
                    })
                  );
                });
                
                currentShape = fibonacciLines;
              }
            }
          }
        }
      } catch (err) {
        console.error('Drawing mouse move error:', err);
      }
    };

    const handleMouseUp = () => {
      if (currentShape && startPoint) {
        // 수평선은 이미 완성됨
        if (currentDrawingTool === 'horizontal') {
          setDrawingShapes(prev => [...prev, currentShape]);
        } 
        // 추세선은 마우스 업 시 최종 확정
        else if (currentDrawingTool === 'trend' && endPoint && startPoint.price !== undefined && endPoint.price !== undefined) {
          // 기존 미리보기 라인 제거
          try {
            if (Array.isArray(currentShape)) {
              currentShape.forEach((shape: any) => {
                try {
                  mainSeriesRef.current.removePriceLine(shape);
                } catch (e) {
                  // 무시
                }
              });
            } else {
              mainSeriesRef.current.removePriceLine(currentShape);
            }
          } catch (e) {
            // 무시
          }
          
          // 추세선 최종 확정 (평균 가격선으로 표시)
          const finalPrice = (startPoint.price + endPoint.price) / 2;
          
          const finalShape = mainSeriesRef.current.createPriceLine({
            price: finalPrice,
            color: '#2196F3',
            lineWidth: 2,
            lineStyle: 0, // 실선
            axisLabelVisible: true,
            title: '추세선',
          });
          
          setDrawingShapes(prev => [...prev, finalShape]);
        }
        // 사각형과 피보나치는 이미 완성됨 (배열 전체를 하나의 요소로 저장)
        else if ((currentDrawingTool === 'rectangle' || currentDrawingTool === 'fibonacci') && Array.isArray(currentShape)) {
          setDrawingShapes(prev => [...prev, currentShape]); // 배열 전체를 하나의 요소로 저장
        }
      }
      
      isDrawing = false;
      isDrawingRef.current = false;
      drawingStartRef.current = null;
      startPoint = null;
      endPoint = null;
      currentShape = null;
    };

    // 이벤트 리스너 등록
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawingMode, drawingTool]);

  if (!data || data.length === 0) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)} style={{ minHeight: '400px' }}>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">차트 데이터가 없습니다</p>
          <p className="text-gray-300 text-xs">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const displayData = hoveredData || (chartData.candleData.length > 0 
    ? chartData.candleData[chartData.candleData.length - 1] 
    : null);

  const maColors = {
    ma5: '#10B981',
    ma20: '#EF4444',
    ma60: '#F97316',
    ma120: '#A855F7',
  };

  return (
    <div className={cn('w-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full', className)} style={{ width: '100%', maxWidth: '100%', overflow: 'visible', minHeight: 0, position: 'relative' }}>
      {onPeriodChange && (
        <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-wrap relative" style={{ overflow: 'visible' }}>
          {/* 분봉 드롭다운 */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowMinuteDropdown(!showMinuteDropdown);
                if (!showMinuteDropdown) {
                  setIsMinuteMode(true);
                }
              }}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isMinuteMode
                  ? 'bg-gray-900 text-white dark:bg-gray-800'
                  : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'
              )}
            >
              {minuteType}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            
            {showMinuteDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[100px]">
                {MINUTE_OPTIONS.map(m => (
                  <button
                    key={m}
                    onClick={() => handleMinuteChange(m)}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between',
                      minuteType === m && isMinuteMode ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {m}
                    {minuteType === m && isMinuteMode && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 기간 버튼들 */}
          {PERIOD_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedPeriod === option.value && !isMinuteMode
                  ? 'bg-gray-900 text-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {option.label}
            </button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          {/* 차트 타입 */}
          <div className="relative">
            <button 
              onClick={() => setShowChartTypeMenu(!showChartTypeMenu)}
              className={cn(
                'p-2 rounded-lg transition-all',
                showChartTypeMenu ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
              title="차트 타입"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F23645" strokeWidth="1.5">
                <path d="M9 4v3M9 15v5M7 7h4v8H7zM17 6v4M17 14v4M15 10h4v4h-4z"/>
              </svg>
            </button>
            
            {showChartTypeMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[100] min-w-[140px]" style={{ position: 'absolute' }}>
                {[
                  { type: 'candle' as ChartType, label: '캔들차트', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M9 9h6v6H9z"/>
                    </svg>
                  ) },
                  { type: 'line' as ChartType, label: '라인차트', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 12 7 8 12 16 17 8 21 12"/>
                    </svg>
                  ) },
                  { type: 'area' as ChartType, label: '영역차트', icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3 12 7 8 12 16 17 8 21 12 21 21 3 21"/>
                    </svg>
                  ) },
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setChartType(type);
                      setShowChartTypeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2",
                      chartType === type ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <span className="text-gray-600 dark:text-gray-400">{icon}</span>
                    {label}
                    {chartType === type && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-auto">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 달력 */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowCalendar(!showCalendar);
                setShowSettings(false);
                setShowCompare(false);
              }}
              className={cn(
                'p-2 rounded-lg transition-all',
                showCalendar ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              )}
              title="날짜 선택"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[100]" style={{ position: 'absolute' }}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">날짜 범위 선택</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={dateRange?.start || ''}
                    onChange={(e) => {
                      setDateRange(prev => ({ 
                        start: e.target.value, 
                        end: prev?.end || '' 
                      }));
                    }}
                  />
                  <span className="text-gray-400">~</span>
                  <input 
                    type="date" 
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={dateRange?.end || ''}
                    onChange={(e) => {
                      setDateRange(prev => ({ 
                        start: prev?.start || '', 
                        end: e.target.value 
                      }));
                    }}
                  />
                  <button
                    onClick={() => {
                      if (dateRange?.start && dateRange?.end) {
                        setShowCalendar(false);
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    적용
                  </button>
                  {dateRange && (
                    <button
                      onClick={() => {
                        setDateRange(null);
                        setShowCalendar(false);
                      }}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* 설정 */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowCalendar(false);
                setShowCompare(false);
              }}
              className={cn(
                'p-2 rounded-lg transition-all',
                showSettings ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              )}
              title="차트 설정"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-1.18-2.82H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.82-1.18V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 1.18 2.82H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/>
              </svg>
            </button>
            {showSettings && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[100] min-w-[220px]" style={{ position: 'absolute' }}>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">차트 설정</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="3" x2="21" y2="3"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="21" x2="21" y2="21"/>
                        <line x1="3" y1="3" x2="3" y2="21"/>
                        <line x1="12" y1="3" x2="12" y2="21"/>
                        <line x1="21" y1="3" x2="21" y2="21"/>
                      </svg>
                      <span>그리드 표시</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={chartSettings.showGrid}
                      onChange={(e) => setChartSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600" 
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18"/>
                        <path d="M7 12h10M7 8h10M7 16h6"/>
                      </svg>
                      <span>거래량 표시</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={chartSettings.showVolume}
                      onChange={(e) => setChartSettings(prev => ({ ...prev, showVolume: e.target.checked }))}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600" 
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="2" x2="12" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                      </svg>
                      <span>크로스헤어 표시</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={chartSettings.showCrosshair}
                      onChange={(e) => setChartSettings(prev => ({ ...prev, showCrosshair: e.target.checked }))}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600" 
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          {/* 지표 추가 */}
          <div className="relative">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all"
              title="지표 추가"
              onClick={() => {
                const type = prompt('추가할 지표를 선택하세요:\n1. RSI\n2. MACD');
                if (type === '1') {
                  handleAddIndicator('RSI');
                } else if (type === '2') {
                  handleAddIndicator('MACD');
                }
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
            {indicators.length > 0 && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-[100] min-w-[150px]" style={{ position: 'absolute' }}>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">추가된 지표</p>
                {indicators.map((ind, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                    <span>{ind.type}</span>
                    <button
                      onClick={() => handleRemoveIndicator(ind.type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 그리기 도구 */}
          <button 
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              if (!isDrawingMode) {
                setDrawingTool(null);
              }
            }}
            className={cn(
              'p-2 rounded-lg transition-all',
              isDrawingMode ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            )}
            title="그리기 도구"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>
          
          {/* 비교 */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowCompare(!showCompare);
                setShowCalendar(false);
                setShowSettings(false);
              }}
              className={cn(
                'p-2 rounded-lg transition-all',
                showCompare ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              )}
              title="종목 비교"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </button>
            {showCompare && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[100] min-w-[250px]" style={{ position: 'absolute' }}>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">종목 비교</p>
                <input 
                  type="text" 
                  placeholder="종목 코드 또는 이름 검색"
                  value={compareStockCode}
                  onChange={(e) => setCompareStockCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2"
                />
                <button
                  onClick={() => {
                    if (compareStockCode && stockCode) {
                      // TODO: 백엔드 API 호출하여 비교 종목 데이터 가져오기
                      console.log('비교할 종목:', compareStockCode);
                      setShowCompare(false);
                    }
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  추가
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">비교할 종목을 검색하여 추가하세요</p>
              </div>
            )}
          </div>
          
          <div className="flex-1" />
          
          {/* 줌 컨트롤 */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleZoom('out')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all"
              title="축소"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35M8 11h6"/>
              </svg>
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded transition-all"
              title="리셋"
            >
              리셋
            </button>
            <button
              onClick={() => handleZoom('in')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all"
              title="확대"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
              </svg>
            </button>
          </div>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <button 
            onClick={() => setShowOrderBook(!showOrderBook)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all",
              showOrderBook 
                ? "bg-blue-600 text-white dark:bg-blue-700" 
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            )}
          >
            호가
          </button>
        </div>
      )}

      {/* 그리기 모드 툴바 */}
      {isDrawingMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-700 dark:text-blue-300">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">그리기 모드</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setDrawingTool('trend');
                handleDrawingToolSelect('trend');
              }}
              className={cn(
                "px-3 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
                drawingTool === 'trend' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
              )}
            >
              추세선
            </button>
            <button 
              onClick={() => {
                setDrawingTool('horizontal');
                handleDrawingToolSelect('horizontal');
              }}
              className={cn(
                "px-3 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
                drawingTool === 'horizontal' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
              )}
            >
              수평선
            </button>
            <button 
              onClick={() => {
                setDrawingTool('fibonacci');
                handleDrawingToolSelect('fibonacci');
              }}
              className={cn(
                "px-3 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
                drawingTool === 'fibonacci' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
              )}
            >
              피보나치
            </button>
            <button 
              onClick={() => {
                setDrawingTool('rectangle');
                handleDrawingToolSelect('rectangle');
              }}
              className={cn(
                "px-3 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
                drawingTool === 'rectangle' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
              )}
            >
              사각형
            </button>
          </div>
          <button 
            onClick={() => {
              setIsDrawingMode(false);
              setDrawingTool(null);
            }}
            className="ml-auto text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            완료
          </button>
        </div>
      )}

      {/* 가격 정보 */}
      {displayData && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">시가</span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold text-base">{formatPrice(displayData.open)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">고가</span>
              <span className="text-red-500 font-semibold text-base">{formatPrice(displayData.high)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">저가</span>
              <span className="text-blue-500 font-semibold text-base">{formatPrice(displayData.low)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">종가</span>
              <span className={cn(
                "font-semibold text-base",
                displayData.close >= displayData.open ? "text-red-500" : "text-blue-500"
              )}>
                {formatPrice(displayData.close)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 이동평균선 범례 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex-wrap">
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          onClick={() => setShowMA({ ma5: false, ma20: false, ma60: false, ma120: false })}
          title="모두 숨기기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 14.14 14.14" />
          </svg>
        </button>
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          onClick={() => setShowMA({ ma5: true, ma20: true, ma60: true, ma120: true })}
          title="모두 보기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
        <span className="text-gray-600 dark:text-gray-400 text-sm">이동평균선</span>

        {Object.entries(maColors).map(([key, color]) => {
          const period = parseInt(key.replace('ma', ''));
          return (
            <button
              key={key}
              onClick={() => setShowMA(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-all',
                showMA[key as keyof typeof showMA] ? 'opacity-100' : 'opacity-30 hover:opacity-50'
              )}
              style={{ color }}
            >
              <span className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
              <span className="font-bold">{period}</span>
            </button>
          );
        })}
      </div>

      {/* 호가 패널 */}
      {showOrderBook && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">매도호가</h3>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((level) => (
                  <div key={level} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{level}</span>
                    <span className="text-red-500 font-medium">{formatPrice((displayData?.close || 0) + level * 100)}</span>
                    <span className="text-gray-500 dark:text-gray-500">{Math.floor(Math.random() * 1000) + 100}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">매수호가</h3>
              <div className="space-y-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{level}</span>
                    <span className="text-blue-500 font-medium">{formatPrice((displayData?.close || 0) - level * 100)}</span>
                    <span className="text-gray-500 dark:text-gray-500">{Math.floor(Math.random() * 1000) + 100}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 차트 컨테이너 */}
      <div 
        ref={chartContainerRef} 
        className="w-full flex-1 relative" 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '300px',
          overflow: 'hidden',
          flex: '1 1 auto'
        }} 
      />

      {/* 조작 안내 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M12 3v18"/>
            </svg>
            <span>드래그: 가로/세로 이동</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span>휠: 세로(가격) 확대·축소</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            <span>Shift+휠: 가로(시간) 확대·축소</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>더블클릭: 리셋</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>핀치: 확대·축소</span>
          </div>
          <span className="ml-auto text-gray-400 dark:text-gray-500">Powered by TradingView Lightweight Charts</span>
        </div>
        <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <strong>가로축(시간축)</strong>: {selectedPeriod === '1d' || isMinuteMode ? '시간 단위로 표시됩니다' : '날짜 단위로 표시됩니다'}. 드래그로 시간 범위를 이동하고, Shift+휠로 시간 범위를 확대/축소할 수 있습니다.
        </div>
      </div>
    </div>
  );
};
