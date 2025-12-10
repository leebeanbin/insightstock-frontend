'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteNews } from '@/lib/hooks/use-infinite-news';
import { News as APINews, NewsListResponse } from '@/lib/types/api/news.types';
import { PageLayout } from '@/components/common/PageLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { NewsFilter, NewsSentimentFilter } from '@/components/news/NewsFilter';
import { NewsList } from '@/components/news/NewsList';
import { MarketIndices } from '@/components/dashboard/MarketIndices';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { usePortfolios } from '@/lib/hooks/use-portfolio';
import { trackView } from '@/lib/utils/trackView';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/components/molecules/Card';
import { Stock } from '@/lib/types';

export default function NewsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [sentiment, setSentiment] = useState<NewsSentimentFilter>('all');

  // 뉴스 데이터 조회 (무한 스크롤)
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNews({
    limit: 20,
    sentiment: sentiment !== 'all' ? sentiment : undefined,
  });

  // 좋아요 및 포트폴리오 종목 조회
  const { data: favoritesData } = useFavorites();
  const { data: portfoliosData } = usePortfolios();

  // 모든 페이지의 뉴스를 하나의 배열로 합치기
  const allNews = useMemo(() => {
    if (!data?.pages) return [];
    return (data.pages as NewsListResponse[]).flatMap((page) => page.news);
  }, [data]);

  // 좋아요와 포트폴리오 종목을 합쳐서 중복 제거 및 타입 변환
  const myStocks = useMemo(() => {
    const stockMap = new Map<string, Stock>();
    
    // 즐겨찾기 종목 추가
    favoritesData?.favorites?.forEach((fav) => {
      if (fav.stock) {
        const key = fav.stock.id || fav.stock.code;
        if (!stockMap.has(key)) {
          // API 타입을 프론트엔드 Stock 타입으로 변환
          stockMap.set(key, {
            id: fav.stock.id,
            code: fav.stock.code,
            name: fav.stock.name,
            market: 'KOSPI' as const, // 기본값, 실제로는 API에서 받아야 함
            currentPrice: fav.stock.currentPrice,
            change: 0, // API에 없으면 0
            changePercent: fav.stock.changeRate || 0, // changeRate를 changePercent로 변환
            volume: 0, // API에 없으면 0
          });
        }
      }
    });
    
    // 포트폴리오 종목 추가 (중복 제거)
    portfoliosData?.portfolios?.forEach((port) => {
      if (port.stock) {
        const key = port.stock.id || port.stock.code;
        if (!stockMap.has(key)) {
          // API 타입을 프론트엔드 Stock 타입으로 변환
          stockMap.set(key, {
            id: port.stock.id,
            code: port.stock.code,
            name: port.stock.name,
            market: 'KOSPI' as const, // 기본값, 실제로는 API에서 받아야 함
            currentPrice: port.stock.currentPrice,
            change: 0, // API에 없으면 0
            changePercent: port.stock.changeRate || 0, // changeRate를 changePercent로 변환
            volume: 0, // API에 없으면 0
          });
        }
      }
    });
    
    return Array.from(stockMap.values());
  }, [favoritesData, portfoliosData]);

  // 캐로셀 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(myStocks.length / ITEMS_PER_PAGE);
  
  // 현재 페이지의 종목들
  const displayStocks = useMemo(() => {
    const start = currentIndex * ITEMS_PER_PAGE;
    return myStocks.slice(start, start + ITEMS_PER_PAGE);
  }, [myStocks, currentIndex]);

  // 자동 캐로셀
  useEffect(() => {
    if (myStocks.length <= ITEMS_PER_PAGE) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000); // 5초마다 자동 넘김

    return () => clearInterval(interval);
  }, [myStocks.length, totalPages]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleNewsClick = (news: APINews) => {
    router.push(`/news/${news.id}`);
  };

  // 히스토리 자동 기록 (뉴스 페이지 조회)
  useEffect(() => {
    trackView({});
  }, []);

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <LoadingState message={t('news.loading')} />
        </div>
      </PageLayout>
    );
  }

  // 에러 상태 (캐시된 데이터가 있으면 표시)
  if (error && (!data || data.pages.length === 0)) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <ErrorState
            message={t('news.error.loadFailed') || '뉴스를 불러오는 중 오류가 발생했습니다. 백엔드가 복구되면 자동으로 갱신됩니다.'}
            onRetry={() => router.refresh()}
          />
        </div>
      </PageLayout>
    );
  }

  // 에러가 있지만 캐시된 데이터가 있는 경우 경고 배너 표시
  const hasCachedData = data && data.pages.length > 0 && allNews.length > 0;

  return (
    <PageLayout>
      <div className="flex flex-col h-full overflow-hidden bg-[var(--background-page)]">
        {/* 시장 지수 - 토스증권 스타일 */}
        <div className="shrink-0">
          <MarketIndices />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* 백엔드 연결 문제 경고 배너 (캐시된 데이터 표시 중) */}
            {error && hasCachedData && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {t('news.warning.cachedData') || '캐시된 데이터를 표시하고 있습니다'}
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      {t('news.warning.backendIssue') || '백엔드 연결에 문제가 있습니다. 백엔드가 복구되면 자동으로 최신 뉴스로 갱신됩니다.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 내 종목 캐로셀 - 토스 스타일 */}
            {myStocks.length > 0 && (
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] dark:text-gray-100">
                    {t('news.myStocks')}
                  </h2>
                  {myStocks.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="p-1.5 rounded-full hover:bg-[var(--background-hover)] dark:hover:bg-gray-800 transition-colors"
                        aria-label="이전"
                      >
                        <ChevronLeft size={18} className="text-[var(--text-secondary)] dark:text-gray-400" />
                      </button>
                      <span className="text-xs text-[var(--text-tertiary)] dark:text-gray-500">
                        {currentIndex + 1} / {totalPages}
                      </span>
                      <button
                        onClick={handleNext}
                        className="p-1.5 rounded-full hover:bg-[var(--background-hover)] dark:hover:bg-gray-800 transition-colors"
                        aria-label="다음"
                      >
                        <ChevronRight size={18} className="text-[var(--text-secondary)] dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative overflow-hidden">
                  <div
                    className="flex gap-3 transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => {
                      const pageStocks = myStocks.slice(
                        pageIndex * ITEMS_PER_PAGE,
                        (pageIndex + 1) * ITEMS_PER_PAGE
                      );
                      return (
                        <div
                          key={pageIndex}
                          className="min-w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
                        >
                          {pageStocks.map((stock) => {
                            const isPositive = (stock.changePercent ?? 0) >= 0;
                            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                            return (
                              <Card
                                key={stock.id}
                                variant="default"
                                onClick={() => router.push(`/dashboard?stock=${stock.code}`)}
                                className="p-4 hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)] transition-all duration-200 cursor-pointer group"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-[var(--text-secondary)] dark:text-gray-400">
                                      {stock.code}
                                    </span>
                                    <TrendIcon
                                      size={14}
                                      className={cn(
                                        isPositive
                                          ? 'text-[var(--semantic-red)]'
                                          : 'text-[var(--semantic-blue)]'
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-gray-100 line-clamp-1">
                                      {stock.name}
                                    </p>
                                    <p className="text-base font-bold text-[var(--text-primary)] dark:text-gray-100 mt-1">
                                      {formatPrice(stock.currentPrice)}
                                    </p>
                                    <p
                                      className={cn(
                                        'text-xs font-medium mt-0.5',
                                        getChangeColorClass(stock.changePercent ?? 0)
                                      )}
                                    >
                                      {formatChange(stock.changePercent ?? 0)}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 캐로셀 인디케이터 */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-200',
                          index === currentIndex
                            ? 'w-6 bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]'
                            : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                        )}
                        aria-label={`페이지 ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 필터 */}
            <div className="sticky top-0 z-10 bg-[var(--background-page)] pt-2 pb-4 -mt-2">
              <NewsFilter
                sentiment={sentiment}
                onSentimentChange={setSentiment}
              />
            </div>

            {/* 뉴스 리스트 */}
            <NewsList
              news={allNews}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage || false}
              onNewsClick={handleNewsClick}
              onLoadMore={() => fetchNextPage()}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

