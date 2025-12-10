/**
 * StockHoverPreviewContent Component
 * 호버 미리보기 모드에서 표시되는 간단한 차트와 정보 컴포넌트
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange, formatVolume } from '@/lib/formatters';
import { useStockChart } from '@/lib/hooks/use-stocks';
import { useNewsByStock } from '@/lib/hooks/use-news';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react';
import SentimentBadge from '@/components/atoms/SentimentBadge';
import { formatRelativeTime } from '@/lib/formatters';
import Card from '@/components/molecules/Card';

// ApexCharts는 SSR을 지원하지 않으므로 dynamic import
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockHoverPreviewContentProps {
  stock: Stock;
}

export function StockHoverPreviewContent({ stock }: StockHoverPreviewContentProps) {
  const [mounted, setMounted] = useState(false);
  const { chartData, isLoading } = useStockChart(stock.code, '1d'); // 일별 차트
  const { data: newsData } = useNewsByStock(stock.code, { limit: 3 }); // 최근 뉴스 3개

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPositive = (stock.changePercent ?? 0) >= 0;
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const upColor = '#EF4444';
  const downColor = '#3B82F6';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // 간단한 선 차트 데이터 준비
  const lineData = chartData
    .map((item, index) => {
      const value = item.close ?? item.value;
      if (typeof value === 'number' && !isNaN(value) && value > 0) {
        return {
          x: item.time || `T${index + 1}`,
          y: value,
        };
      }
      return null;
    })
    .filter((item): item is { x: string; y: number } => item !== null);

  const chartOptions = {
    chart: {
      type: 'line' as const,
      height: 200,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    colors: [isPositive ? upColor : downColor],
    xaxis: {
      type: 'category' as const,
      labels: {
        show: true,
        style: {
          colors: isDark ? '#9CA3AF' : '#6B7280',
          fontSize: '10px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: isDark ? '#9CA3AF' : '#6B7280',
          fontSize: '10px',
        },
        formatter: (value: number) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value.toString();
        },
      },
    },
    grid: {
      borderColor: isDark ? '#374151' : '#E5E7EB',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      enabled: true,
      theme: isDark ? 'dark' : 'light',
    },
    dataLabels: { enabled: false },
  };

  if (!mounted) {
    return (
      <Card variant="default" className="p-4 border-border-default shadow-sm">
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-gray-400">로딩 중...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* 종목 정보 요약 */}
      <Card variant="default" className="p-4 border-border-default shadow-sm">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {stock.volume && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-0.5">거래량</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatVolume(stock.volume)}</p>
            </div>
          )}
          {stock.marketCap && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-0.5">시가총액</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(stock.marketCap)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* 일별 차트 미리보기 */}
      <Card variant="default" className="p-4 border-border-default shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">일별 차트</p>
        <div style={{ width: '100%', height: '200px' }}>
          {isLoading || lineData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-gray-400">로딩 중...</p>
            </div>
          ) : (
            <Chart
              options={chartOptions}
              series={[{ name: '가격', data: lineData }]}
              type="line"
              height={200}
            />
          )}
        </div>
      </Card>

      {/* 관련 뉴스 */}
      {newsData && newsData.news && newsData.news.length > 0 && (
        <Card variant="default" className="p-4 border-border-default shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={14} className="text-gray-500 dark:text-gray-400" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">관련 뉴스</p>
          </div>
          <div className="space-y-2">
            {newsData.news.slice(0, 3).map((news) => (
              <div
                key={news.id}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/news/${news.id}`, '_blank');
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                    {news.title}
                  </h5>
                  {news.sentiment && (
                    <SentimentBadge sentiment={news.sentiment} size="sm" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{news.source}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(news.publishedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

