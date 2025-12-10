'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Customized,
  ReferenceLine,
} from 'recharts';
import { ChartData } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { CandlestickChart } from './charts/CandlestickChart';
import { BarChart as OHLCBarChart } from './charts/BarChart';

export type ChartPeriod = '1d' | '1w' | '1m' | '3m' | '6m' | '1y';
export type ChartType = 'candlestick' | 'line' | 'bar' | 'area';

export interface StockChartProps {
  data: ChartData[];
  isPositive?: boolean;
  className?: string;
  period?: ChartPeriod;
  onPeriodChange?: (period: ChartPeriod) => void;
  chartType?: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
}

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: '1d', label: '1일' },
  { value: '1w', label: '1주' },
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
];

const CHART_TYPE_OPTIONS: { value: ChartType; label: string; description: string }[] = [
  { value: 'candlestick', label: '캔들차트', description: '시가·고가·저가·종가를 한눈에 보여주는 가장 기본적인 차트' },
  { value: 'line', label: '선차트', description: '주가의 추세를 파악하는 데에 용이한 단순한 형태' },
  { value: 'bar', label: '바차트', description: '고가·저가·종가를 수직선과 수평선으로 표시' },
  { value: 'area', label: '영역차트', description: '선차트의 영역을 채운 형태로 추세를 시각화' },
];

// Mock 차트 데이터 생성 함수 (OHLC 형식)
export function generateChartData(basePrice: number, days: number = 30): ChartData[] {
  const data: ChartData[] = [];
  let currentPrice = basePrice;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 랜덤 변동 (-2% ~ +2%)
    const change = (Math.random() - 0.5) * 0.04;
    const open = currentPrice;
    const close = currentPrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    currentPrice = close;
    
    data.push({
      time: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      value: Math.round(close), // 하위 호환성
      volume: Math.floor(Math.random() * 1000000) + 500000,
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
    });
  }

  return data;
}

// 캔들스틱을 위한 커스텀 렌더러 (Customized 컴포넌트 사용)
const CandlestickRenderer: React.FC<any> = (props: any) => {
  const { xAxisMap, yAxisMap, width, height, data, upColor, downColor } = props;
  
  if (!xAxisMap || !yAxisMap || !width || !height || !data || data.length === 0) {
    return null;
  }

  const priceAxis = yAxisMap.price;
  const xScale = xAxisMap.time?.scale || ((value: any) => {
    const index = data.findIndex((d: any) => d.time === value);
    return index >= 0 ? (index * width) / data.length : 0;
  });
  const yScale = priceAxis?.scale;

  if (!yScale) return null;

  const barWidth = width / data.length;
  const candleWidth = Math.max(barWidth * 0.7, 2); // 최소 2px

  return (
    <g>
      {data.map((entry: any, index: number) => {
        // OHLC 데이터가 없으면 스킵 (undefined 체크)
        if (typeof entry.open !== 'number' || typeof entry.close !== 'number' ||
            typeof entry.high !== 'number' || typeof entry.low !== 'number') {
          return null;
        }

        const isUp = entry.close >= entry.open;
        const color = isUp ? upColor : downColor;
        const x = typeof xScale === 'function' ? xScale(entry.time) : (index * barWidth) + (barWidth / 2);
        const highY = yScale(entry.high);
        const lowY = yScale(entry.low);
        const openY = yScale(entry.open);
        const closeY = yScale(entry.close);
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

        return (
          <g key={`candle-${index}`}>
            {/* 심지 (고가-저가 선) */}
            <line
              x1={x}
              y1={highY}
              x2={x}
              y2={lowY}
              stroke={color}
              strokeWidth={2}
            />
            {/* 몸통 (시가-종가) */}
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={isUp ? 'white' : color}
              stroke={color}
              strokeWidth={2}
              rx={1}
            />
          </g>
        );
      })}
    </g>
  );
};

const StockChart: React.FC<StockChartProps> = ({
  data,
  isPositive = true,
  className,
  period = '1m',
  onPeriodChange,
  chartType = 'candlestick',
  onChartTypeChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(period);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>(chartType);
  const chartRef = useRef<HTMLDivElement>(null);

  // props가 변경되면 상태 업데이트
  useEffect(() => {
    setSelectedPeriod(period);
  }, [period]);

  useEffect(() => {
    setSelectedChartType(chartType);
  }, [chartType]);
  
  // 다크모드 지원 색상 (한국 주식 시장: 상승=빨강, 하락=파랑)
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const upColor = '#EF4444'; // 상승 (빨강)
  const downColor = '#3B82F6'; // 하락 (파랑)
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';

  // OHLC 데이터가 있는지 확인
  const hasOHLC = data.length > 0 && data[0].open !== undefined;
  
  // 캔들스틱 데이터 준비
  const chartData = data.map((item) => {
    const close = item.close ?? item.value;
    const open = item.open ?? item.value;
    const high = item.high ?? item.value;
    const low = item.low ?? item.value;
    const isUp = close >= open;

    return {
      ...item,
      close,
      open,
      high,
      low,
      isUp,
    };
  });

  // Y축 범위 계산
  const allValues = chartData.flatMap(d => {
    const values = [];
    if (typeof d.high === 'number' && !isNaN(d.high)) values.push(d.high);
    if (typeof d.low === 'number' && !isNaN(d.low)) values.push(d.low);
    if (typeof d.open === 'number' && !isNaN(d.open)) values.push(d.open);
    if (typeof d.close === 'number' && !isNaN(d.close)) values.push(d.close);
    return values;
  });
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1; // 10% 패딩
  
  // 캔들스틱/바 차트가 아닐 때는 기존 오버레이 제거
  useEffect(() => {
    if ((selectedChartType !== 'candlestick' && selectedChartType !== 'bar') && chartRef.current) {
      const svgElement = chartRef.current.querySelector('svg');
      if (svgElement) {
        const existingGroup = svgElement.querySelector('g.candlestick-overlay, g.bar-chart-overlay');
        if (existingGroup) {
          existingGroup.remove();
        }
      }
    }
  }, [selectedChartType]);

    const handlePeriodChange = (newPeriod: ChartPeriod) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const handleChartTypeChange = (newType: ChartType) => {
    setSelectedChartType(newType);
    onChartTypeChange?.(newType);
  };

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

  // 차트 타입별 렌더링 함수
  const renderChart = () => {
    if (selectedChartType === 'candlestick' && hasOHLC) {
      // 캔들스틱 차트 - Customized 컴포넌트를 사용하되, 차트가 완전히 렌더링된 후에 호출되도록 함
      // 일단 투명한 Line을 렌더링하여 차트 구조를 유지
      return (
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="value"
          stroke="transparent"
          strokeWidth={0}
          dot={false}
          isAnimationActive={false}
        />
      );
    } else if (selectedChartType === 'line') {
      // 선차트
      return (
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="value"
          stroke={isPositive ? upColor : downColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: isPositive ? upColor : downColor }}
          isAnimationActive={true}
          animationDuration={800}
        />
      );
    } else if (selectedChartType === 'bar' && hasOHLC) {
      // 바차트 - 일단 투명한 Line을 렌더링하여 차트 구조를 유지
      return (
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="value"
          stroke="transparent"
          strokeWidth={0}
          dot={false}
          isAnimationActive={false}
        />
      );
    } else if (selectedChartType === 'area') {
      // 영역차트
      return (
        <Area
          yAxisId="price"
          type="monotone"
          dataKey="value"
          stroke={isPositive ? upColor : downColor}
          fill={isPositive ? upColor : downColor}
          fillOpacity={0.3}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={800}
        />
      );
    } else {
      // 기본: 라인 차트
      return (
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="value"
          stroke={isPositive ? upColor : downColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: isPositive ? upColor : downColor }}
          isAnimationActive={true}
          animationDuration={800}
        />
      );
    }
  };

  return (
    <div className={cn('w-full flex flex-col', className)}>
      {/* 차트 타입 및 기간 선택 */}
      <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        {/* 차트 타입 선택 */}
        {onChartTypeChange && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">차트 타입:</span>
            {CHART_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChartTypeChange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  selectedChartType === option.value
                    ? 'bg-[var(--brand-main)] text-white dark:bg-[var(--brand-purple)]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
                title={option.description}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {/* 기간 선택 버튼 */}
        {onPeriodChange && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">기간:</span>
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePeriodChange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  selectedPeriod === option.value
                    ? 'bg-[var(--brand-main)] text-white dark:bg-[var(--brand-purple)]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 차트 영역 */}
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          overflow: 'auto',
          position: 'relative'
        }}
        className="chart-container"
      >
        <ResponsiveContainer width="100%" height={400} minWidth={Math.max(600, chartData.length * 20)}>
          <ComposedChart
            data={chartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
              stroke={gridColor}
            vertical={false}
              opacity={0.3}
          />
          <XAxis
            dataKey="time"
              type="category"
              stroke={textColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
              tick={{ fill: textColor }}
          />
          <YAxis
              yAxisId="price"
              stroke={textColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={70}
              tick={{ fill: textColor }}
              domain={[minValue - padding, maxValue + padding]}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
          />
          <Tooltip
            contentStyle={{
                backgroundColor: isDark ? '#1F2937' : 'white',
                border: `1px solid ${gridColor}`,
              borderRadius: '8px',
                padding: '12px 16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '13px',
            }}
            labelStyle={{ 
                color: isDark ? '#F3F4F6' : '#374151',
              fontWeight: 600, 
                marginBottom: '8px',
              fontSize: '12px',
            }}
              formatter={(value: number, name: string, props: any) => {
                // OHLC 데이터가 있으면 모두 표시
                if (props.payload && (props.payload.open !== undefined || props.payload.high !== undefined)) {
                  return null; // 커스텀 content에서 처리
                }
                if (name === '거래량') {
                  return [value.toLocaleString(), '거래량'];
                }
                return [formatPrice(value), name];
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  const hasOHLC = data.open !== undefined || data.high !== undefined;
                  
                  return (
                    <div style={{
                      backgroundColor: isDark ? '#1F2937' : 'white',
                      border: `1px solid ${gridColor}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    }}>
                      <div style={{
                        color: isDark ? '#F3F4F6' : '#374151',
                        fontWeight: 600,
                        marginBottom: '8px',
                        fontSize: '12px',
                      }}>
                        날짜: {label}
                      </div>
                      {hasOHLC ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>시가:</span>
                            <span style={{ color: isDark ? '#F3F4F6' : '#374151', fontWeight: 500, fontSize: '12px' }}>
                              {formatPrice(data.open ?? data.value)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>고가:</span>
                            <span style={{ color: upColor, fontWeight: 600, fontSize: '12px' }}>
                              {formatPrice(data.high ?? data.value)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>저가:</span>
                            <span style={{ color: downColor, fontWeight: 600, fontSize: '12px' }}>
                              {formatPrice(data.low ?? data.value)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>종가:</span>
                            <span style={{ 
                              color: (data.close ?? data.value) >= (data.open ?? data.value) ? upColor : downColor, 
              fontWeight: 600,
                              fontSize: '12px' 
                            }}>
                              {formatPrice(data.close ?? data.value)}
                            </span>
                          </div>
                          {data.volume && (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              gap: '16px',
                              marginTop: '4px',
                              paddingTop: '4px',
                              borderTop: `1px solid ${gridColor}`
                            }}>
                              <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>거래량:</span>
                              <span style={{ color: isDark ? '#F3F4F6' : '#374151', fontWeight: 500, fontSize: '12px' }}>
                                {data.volume.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                          <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '11px' }}>가격:</span>
                          <span style={{ color: isDark ? '#F3F4F6' : '#374151', fontWeight: 600, fontSize: '12px' }}>
                            {formatPrice(data.value)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: textColor, strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            
            {/* 차트 타입에 따른 렌더링 */}
            {renderChart()}
            

          </ComposedChart>
        </ResponsiveContainer>
        
        {/* 캔들스틱 차트 오버레이 */}
        {selectedChartType === 'candlestick' && hasOHLC && (
          <CandlestickChart
            data={chartData}
            containerRef={chartRef}
            minValue={minValue}
            maxValue={maxValue}
            padding={padding}
            upColor={upColor}
            downColor={downColor}
          />
        )}
        
        {/* 바 차트 오버레이 */}
        {selectedChartType === 'bar' && hasOHLC && (
          <OHLCBarChart
            data={chartData}
            containerRef={chartRef}
            minValue={minValue}
            maxValue={maxValue}
            padding={padding}
            upColor={upColor}
            downColor={downColor}
          />
        )}
      </div>
    </div>
  );
};

export default StockChart;
