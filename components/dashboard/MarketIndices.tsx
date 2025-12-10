/**
 * MarketIndices Component
 * 상단 시장 지수 표시 컴포넌트 (토스증권 스타일)
 */

'use client';

import React, { useEffect, useState, useRef, memo, useMemo, useCallback } from 'react';
import { MarketData } from '@/lib/api/market';
import { subscribeMarketData } from '@/lib/api/market';
import { formatPrice, formatChange } from '@/lib/formatters';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '@/components/atoms/Skeleton';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// 애니메이션 숫자 컴포넌트 (메모이제이션)
const AnimatedNumber = memo(function AnimatedNumber({ value, format }: { value: number; format?: (v: number) => string }) {
  const defaultFormat = useMemo(() => format || ((v: number) => v.toString()), [format]);
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();
    const duration = 500; // 500ms 애니메이션

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // easeOutCubic 이징 함수
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, displayValue]);

  return <>{defaultFormat(displayValue)}</>;
});

export const MarketIndices = memo(function MarketIndices() {
  const { t } = useLanguage();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 3;
  
  // 시장 상태 계산 메모이제이션
  const marketStatus = useMemo(() => {
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const hour = koreaTime.getHours();
    const minute = koreaTime.getMinutes();
    const day = koreaTime.getDay(); // 0 = 일요일, 6 = 토요일

    // 국내 정규장: 평일 09:00 ~ 15:30
    // 국내 애프터마켓: 평일 15:30 ~ 18:00
    // 해외 데이마켓: 평일 23:00 ~ 다음날 06:00 (미국 시장 기준, 한국시간)
    const isWeekday = day >= 1 && day <= 5;
    const isRegularMarket = isWeekday && (hour > 9 || (hour === 9 && minute >= 0)) && (hour < 15 || (hour === 15 && minute <= 30));
    const isAfterMarket = isWeekday && (hour > 15 || (hour === 15 && minute > 30)) && hour < 18;
    const isOverseasDayMarket = isWeekday && (hour >= 23 || hour < 6);

    const status: Array<{ label: string; isActive: boolean; color: string }> = [];
    
    if (isRegularMarket) {
      status.push({ label: t('market.status.regularMarket'), isActive: true, color: 'bg-green-500' });
    } else if (isAfterMarket) {
      status.push({ label: t('market.status.afterMarket'), isActive: true, color: 'bg-green-500' });
    } else if (isOverseasDayMarket) {
      status.push({ label: t('market.status.overseasDayMarket'), isActive: true, color: 'bg-green-500' });
    } else {
      // 장 마감
      status.push({ label: t('market.status.marketClosed'), isActive: false, color: 'bg-gray-400' });
    }

    // 해외 데이마켓은 별도로 표시 (국내 정규장/애프터마켓 시간대가 아닐 때)
    if (isRegularMarket || isAfterMarket) {
      status.push({ label: t('market.status.overseasDayMarket'), isActive: isOverseasDayMarket, color: isOverseasDayMarket ? 'bg-green-500' : 'bg-gray-400' });
    }

    return status;
  }, [t]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeMarketData((data) => {
      setMarketData(data);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 시장 상태는 useMemo로 계산되므로 별도 useEffect 불필요
  // 리렌더링을 위해 1분마다 강제 업데이트 (marketStatus가 useMemo이므로)
  useEffect(() => {
    const interval = setInterval(() => {
      // marketStatus는 useMemo이므로 컴포넌트 리렌더링만 하면 됨
      // forceUpdate 대신 빈 상태 업데이트로 리렌더링 트리거
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 안전하게 데이터 접근 (메모이제이션)
  const kospi = useMemo(() => marketData?.kospi || { price: 0, change: 0, changePercent: 0 }, [marketData?.kospi]);
  const kosdaq = useMemo(() => marketData?.kosdaq || { price: 0, change: 0, changePercent: 0 }, [marketData?.kosdaq]);
  const usdKrw = useMemo(() => marketData?.usdKrw || { price: 1335.25, change: -0.25, changePercent: -0.02 }, [marketData?.usdKrw]);

  // 인덱스 데이터 메모이제이션
  const indices = useMemo(() => {
    if (!marketData) return [];
    return [
    {
      name: t('market.kospi'),
      data: kospi,
      color: (kospi.changePercent ?? 0) >= 0 ? 'text-red-500' : 'text-blue-500',
    },
    {
      name: t('market.kosdaq'),
      data: kosdaq,
      color: (kosdaq.changePercent ?? 0) >= 0 ? 'text-red-500' : 'text-blue-500',
    },
    {
      name: t('market.usdkrw'),
      data: usdKrw,
      color: (usdKrw.changePercent ?? 0) >= 0 ? 'text-red-500' : 'text-blue-500',
    },
    {
      name: t('market.nasdaq'),
      data: (marketData as any).nasdaq || {
        price: 23413.67,
        change: 137.75,
        changePercent: 0.59,
      },
      color: (((marketData as any).nasdaq?.changePercent ?? 0.59) >= 0) ? 'text-red-500' : 'text-blue-500',
    },
    {
      name: t('market.sp500'),
      data: (marketData as any).sp500 || {
        price: 6829.37,
        change: 16.38,
        changePercent: 0.24,
      },
      color: (((marketData as any).sp500?.changePercent ?? 0.24) >= 0) ? 'text-red-500' : 'text-blue-500',
    },
    {
      name: t('market.vix'),
      data: (marketData as any).vix || {
        price: 16.59,
        change: -0.65,
        changePercent: -3.77,
      },
      color: (((marketData as any).vix?.changePercent ?? -3.77) >= 0) ? 'text-red-500' : 'text-blue-500',
    },
    ];
  }, [kospi, kosdaq, usdKrw, marketData, t]);

  const totalPages = useMemo(() => Math.ceil(indices.length / ITEMS_PER_PAGE), [indices.length]);
  const displayedIndices = useMemo(() => indices.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  ), [indices, currentPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  if (isLoading || !marketData) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 왼쪽: 시장 상태 */}
        <div className="flex items-center gap-3 shrink-0">
          {marketStatus.map((status, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                status.color,
                status.isActive && 'animate-pulse'
              )} />
              <span className={cn(
                'text-xs font-semibold transition-colors duration-300',
                status.isActive 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-500 dark:text-gray-500'
              )}>
                {status.label}
              </span>
            </div>
          ))}
          
          {/* 시계를 왼쪽으로 이동 */}
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
            {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* 중앙: 시장 지수 캐러셀 */}
        <div className="flex-1 flex items-center justify-center gap-2 mx-4">
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center gap-6 min-w-0">
            {displayedIndices.map((index) => {
              const changePercent = index.data?.changePercent ?? 0;
              const change = index.data?.change ?? 0;
              const price = index.data?.price ?? 0;
              const isPositive = changePercent >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;
              
              return (
                <div 
                  key={index.name} 
                  className="flex items-center gap-2.5 shrink-0 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {index.name}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                    <AnimatedNumber value={price} format={formatPrice} />
                  </span>
                  <div className={cn(
                    'flex items-center gap-1 shrink-0 transition-colors duration-300',
                    index.color
                  )}>
                    <TrendIcon size={16} strokeWidth={2.5} />
                    <span className="text-sm font-bold tabular-nums">
                      <AnimatedNumber 
                        value={changePercent} 
                        format={formatChange}
                      />
                      {' '}
                      (<AnimatedNumber 
                        value={change} 
                        format={(v) => `${v >= 0 ? '+' : ''}${formatPrice(Math.abs(v))}`}
                      />)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* 오른쪽: 페이지 인디케이터 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                i === currentPage 
                  ? 'bg-primary-600 w-4' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

