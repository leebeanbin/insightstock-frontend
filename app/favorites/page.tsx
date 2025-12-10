'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { Stock } from '@/lib/types';
import { TrendingUp, TrendingDown, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// Mock data
const mockFavorites: Stock[] = [
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
  {
    id: '5',
    code: '005380',
    name: '현대차',
    market: 'KOSPI',
    sector: '자동차',
    currentPrice: 245000,
    change: 3500,
    changePercent: 1.45,
    volume: 1200000,
    marketCap: 52000000000000,
  },
];

export default function FavoritesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Stock[]>(mockFavorites);

  const handleRemoveFavorite = (stockId: string) => {
    setFavorites(favorites.filter(s => s.id !== stockId));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('favorites.title')}</h1>
              <p className="text-base text-gray-600 mt-1">{t('favorites.subtitle')}</p>
            </div>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
              <Card variant="default" className="py-16">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '400px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Star size={40} strokeWidth={2} style={{ color: '#D1D5DB' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px', textAlign: 'center' }}>{t('favorites.emptyTitle')}</h3>
                  <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.6, textAlign: 'center', maxWidth: '320px' }}>
                    {t('favorites.emptyDescription')}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                  return (
                    <Card
                      key={stock.id}
                      variant="default"
                      className="p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => {
                        // 대시보드로 이동하고 해당 종목 선택
                        router.push(`/dashboard?stock=${stock.code}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                              {stock.name}
                            </h3>
                            <Star size={18} strokeWidth={2} className="text-primary-600 fill-primary-600 shrink-0" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg font-semibold">
                              {stock.code}
                            </span>
                            <Badge variant="default">{stock.sector}</Badge>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(stock.id);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                          aria-label={t('favorites.removeLabel')}
                        >
                          <Trash2 size={18} strokeWidth={2} className="text-gray-400 hover:text-semantic-red" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-bold text-gray-900 number">
                            {formatPrice(stock.currentPrice)}
                          </span>
                          <div className="flex items-center gap-2">
                            <TrendIcon
                              size={16}
                              strokeWidth={2.5}
                              className={isPositive ? 'text-semantic-red' : 'text-semantic-blue'}
                            />
                            <span className={cn('text-base font-bold number', getChangeColorClass(stock.changePercent))}>
                              {formatChange(stock.changePercent)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{stock.market}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-400" />
                          <span>{t('favorites.volume')} {stock.volume.toLocaleString('ko-KR')}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

