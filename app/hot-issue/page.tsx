'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import NewsCard from '@/components/molecules/NewsCard';
import { formatPrice, formatChange, formatRelativeTime, getChangeColorClass } from '@/lib/formatters';
import { News, Stock } from '@/lib/types';
import { TrendingUp, TrendingDown, Flame, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// Mock data
const mockHotStocks: Stock[] = [
  {
    id: '1',
    code: '005930',
    name: '삼성전자',
    market: 'KOSPI',
    sector: 'IT',
    currentPrice: 65000,
    change: 1625,
    changePercent: 2.56,
    volume: 12500000,
    marketCap: 388000000000000,
  },
  {
    id: '2',
    code: '000660',
    name: 'SK하이닉스',
    market: 'KOSPI',
    sector: 'IT',
    currentPrice: 142000,
    change: -2100,
    changePercent: -1.46,
    volume: 3200000,
    marketCap: 102000000000000,
  },
  {
    id: '3',
    code: '035420',
    name: 'NAVER',
    market: 'KOSPI',
    sector: 'IT',
    currentPrice: 198500,
    change: 3500,
    changePercent: 1.79,
    volume: 850000,
    marketCap: 32000000000000,
  },
];

const mockHotNews: News[] = [
  {
    id: '1',
    title: '삼성전자, 4분기 실적 전망 상향 조정',
    content: '삼성전자가 4분기 실적 전망을 상향 조정했다고 발표했습니다...',
    summary: '삼성전자 4분기 실적 전망 상향 조정',
    url: '#',
    source: '한국경제',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    stockIds: ['005930'],
  },
  {
    id: '2',
    title: 'SK하이닉스, HBM 생산량 확대 계획 발표',
    content: 'SK하이닉스가 HBM 생산량을 확대한다고 발표했습니다...',
    summary: 'SK하이닉스 HBM 생산량 확대',
    url: '#',
    source: '매일경제',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    stockIds: ['000660'],
  },
  {
    id: '3',
    title: 'NAVER, 클라우드 사업 확장 발표',
    content: 'NAVER가 클라우드 사업을 확장한다고 발표했습니다...',
    summary: 'NAVER 클라우드 사업 확장',
    url: '#',
    source: '조선일보',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    stockIds: ['035420'],
  },
];

export default function HotIssuePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stocks' | 'news'>('stocks');
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                <Flame size={24} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('hotIssue.title')}</h1>
                <p className="text-base text-gray-600 mt-1">{t('hotIssue.subtitle')}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border-2 border-gray-100">
              <button
                onClick={() => setActiveTab('stocks')}
                className={cn(
                  'px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap',
                  activeTab === 'stocks'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                )}
              >
                {t('hotIssue.popularStocks')}
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={cn(
                  'px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap',
                  activeTab === 'news'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                )}
              >
                {t('hotIssue.popularNews')}
              </button>
            </div>

            {/* Content */}
            {activeTab === 'stocks' && (
              <div className="space-y-4">
                {mockHotStocks.map((stock, index) => {
                  const isPositive = stock.changePercent >= 0;
                  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                  return (
                    <Card
                      key={stock.id}
                      variant="default"
                      className="p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        // 대시보드로 이동하고 해당 종목 선택
                        router.push(`/dashboard?stock=${stock.code}`);
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-bold text-primary-600">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-3">
                              <h3 className="text-xl font-bold text-gray-900">{stock.name}</h3>
                              <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg font-semibold">
                                {stock.code}
                              </span>
                              <Badge variant="primary">{stock.sector}</Badge>
                            </div>
                            <div className="flex items-baseline gap-4">
                              <span className="text-2xl font-bold text-gray-900 number">
                                {formatPrice(stock.currentPrice)}
                              </span>
                              <div className="flex items-center gap-2">
                                <TrendIcon
                                  size={18}
                                  strokeWidth={2.5}
                                  className={isPositive ? 'text-semantic-red' : 'text-semantic-blue'}
                                />
                                <span className={cn('text-lg font-bold number', getChangeColorClass(stock.changePercent))}>
                                  {formatChange(stock.changePercent)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <TrendingUpIcon size={14} strokeWidth={2} />
                              <span>{t('stock.volume')} {stock.volume.toLocaleString('ko-KR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeTab === 'news' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockHotNews.map((news) => (
                  <NewsCard 
                    key={news.id} 
                    news={news} 
                    onClick={() => router.push(`/news/${news.id}`)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

