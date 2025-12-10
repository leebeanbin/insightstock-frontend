/**
 * TradingActivity Component
 * 실시간 체결 내역 및 투자자 동향 섹션 (토스증권 스타일)
 */

'use client';

import React from 'react';
import { Stock } from '@/lib/types';
import { formatPrice, formatChange, formatVolume } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/components/molecules/Card';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TradingActivityProps {
  stock: Stock | null;
}

export function TradingActivity({ stock }: TradingActivityProps) {
  const { t } = useLanguage();

  if (!stock) {
    return null;
  }

  // Mock 실시간 체결 내역 데이터
  const mockTrades = [
    { price: stock.currentPrice, volume: 3, changePercent: stock.changePercent },
    { price: stock.currentPrice - 500, volume: 2, changePercent: stock.changePercent },
    { price: stock.currentPrice - 1000, volume: 1, changePercent: stock.changePercent },
    { price: stock.currentPrice + 500, volume: 5, changePercent: stock.changePercent },
    { price: stock.currentPrice, volume: 2, changePercent: stock.changePercent },
  ];

  // Mock 투자자 동향 데이터
  const mockInvestorTrends = [
    { date: '오늘', individual: 0, foreigner: 210172, institution: 77 },
    { date: '25.12.01', individual: -809317, foreigner: 786681, institution: 17 },
    { date: '25.11.28', individual: 814811, foreigner: -1091850, institution: 278305 },
    { date: '25.11.27', individual: -864347, foreigner: 515564, institution: 402746 },
    { date: '25.11.26', individual: -8518, foreigner: -610850, institution: 574645 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* 실시간 체결 내역 */}
      <Card variant="default" className="p-4 border-border-default shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">시세</h3>
          <div className="flex items-center gap-2">
            <button className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
              실시간
            </button>
            <button className="text-xs px-2 py-1 rounded text-gray-500 dark:text-gray-400">
              일별
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>체결가</div>
            <div>체결량(주)</div>
            <div>등락률</div>
            <div>거래량(주)</div>
          </div>
          {mockTrades.map((trade, index) => {
            const isPositive = trade.changePercent >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            return (
              <div
                key={index}
                className="grid grid-cols-4 gap-2 text-xs py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
              >
                <div className={cn('font-semibold', isPositive ? 'text-red-500' : 'text-blue-500')}>
                  {formatPrice(trade.price)}
                </div>
                <div className="text-gray-700 dark:text-gray-300">{trade.volume}</div>
                <div className={cn('flex items-center gap-1', isPositive ? 'text-red-500' : 'text-blue-500')}>
                  <TrendIcon size={12} strokeWidth={2} />
                  <span className="font-semibold">{formatChange(trade.changePercent)}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  {formatVolume(stock.volume || 0)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 투자자 동향 */}
      <Card variant="default" className="p-4 border-border-default shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">투자자 동향</h3>
        <div className="mb-3 flex items-center gap-4 text-xs">
          <div>
            <span className="text-gray-600 dark:text-gray-400">외국인</span>
            <span className="ml-2 font-bold text-red-500">+21만</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">기관</span>
            <span className="ml-2 font-bold text-red-500">+77,000</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div>일자</div>
            <div>개인</div>
            <div>외국인</div>
            <div>기관</div>
          </div>
          {mockInvestorTrends.map((trend, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 text-xs py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
            >
              <div className="text-gray-700 dark:text-gray-300 font-medium">{trend.date}</div>
              <div className={cn(
                'font-semibold',
                trend.individual >= 0 ? 'text-red-500' : 'text-blue-500'
              )}>
                {trend.individual >= 0 ? '+' : ''}{trend.individual.toLocaleString()}
              </div>
              <div className={cn(
                'font-semibold',
                trend.foreigner >= 0 ? 'text-red-500' : 'text-blue-500'
              )}>
                {trend.foreigner >= 0 ? '+' : ''}{trend.foreigner.toLocaleString()}
              </div>
              <div className={cn(
                'font-semibold',
                trend.institution >= 0 ? 'text-red-500' : 'text-blue-500'
              )}>
                {trend.institution >= 0 ? '+' : ''}{trend.institution.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

