'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/common/PageLayout';
import { Stock, AISummary, ChartData } from '@/lib/types';

// AISummaryPanel을 동적으로 로드 (코드 스플리팅)
const AISummaryPanel = dynamic(() => import('@/components/organisms/AISummaryPanel').then(mod => ({ default: mod.default })), {
  ssr: false,
});
import { StockListSection } from '@/components/dashboard/StockListSection';
import { StockDetailSection } from '@/components/dashboard/StockDetailSection';
import { MarketIndices } from '@/components/dashboard/MarketIndices';
import { RecentActivityIcon } from '@/components/dashboard/RecentActivityIcon';
import { generateChartData } from '@/components/molecules/StockChart';
import {
  useStocksByCategory,
  useStockSearch,
  useStockChart,
} from '@/lib/hooks/use-stocks';
import { ChartPeriod } from '@/components/molecules/charts/LightweightStockChart';
import { trackView } from '@/lib/utils/trackView';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// mockAISummary는 번역 키를 사용하여 동적으로 생성

function DashboardContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null); // 호버된 종목 상태 추가
  const [isAILoading, setIsAILoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('1m');

  // AI Summary를 번역 키로 생성
  const mockAISummary: AISummary = useMemo(() => ({
    onelineSummary: t('dashboard.aiSummaryOnelineSummary'),
    keyIssues: [
      t('dashboard.aiSummaryKeyIssue1'),
      t('dashboard.aiSummaryKeyIssue2'),
    ],
    priceAnalysis: t('dashboard.aiSummaryPriceAnalysis'),
    riskSummary: t('dashboard.aiSummaryRiskSummary'),
    learningCta: t('dashboard.aiSummaryLearningCta'),
  }), [t]);

  // 카테고리별 종목 목록
  const {
    stocks,
    isLoading: isStocksLoading,
    category,
    categories,
    changeCategory,
    refetch,
  } = useStocksByCategory('popular');

  // 검색
  const { query: searchQuery, results: searchResults, isSearching, search, clearSearch } = useStockSearch();

  // 차트 데이터
  const { chartData: fetchedChartData, isLoading: isChartLoading } = useStockChart(
    selectedStock?.code || null,
    chartPeriod
  );

  // 표시할 종목 결정: 검색 결과 또는 카테고리 종목 (useMemo로 최적화)
  const displayStocks = useMemo(() => {
    return searchQuery ? searchResults : stocks;
  }, [searchQuery, searchResults, stocks]);

  // handleStockSelect를 useCallback으로 메모이제이션
  const handleStockSelect = useCallback((stock: Stock) => {
    // 이미 선택된 종목을 다시 클릭하면 선택 해제
    if (selectedStock?.code === stock.code) {
      setSelectedStock(null);
      setChartData([]);
      setIsAILoading(false);
      setHoveredStock(null); // 선택 해제 시 호버도 해제
      return;
    }
    
    setSelectedStock(stock);
    setHoveredStock(null); // 선택 시 호버 해제 (선택된 종목이 우선)
    setIsAILoading(true);
    setChartData([]);
    setTimeout(() => setIsAILoading(false), 1000);
    // 히스토리 자동 기록 (stock.code 사용 - 백엔드에서 code로도 조회 가능)
    trackView({ stockId: stock.code });
  }, [selectedStock]);

  // handleStockHover: 선택된 종목이 있을 때는 호버 무시
  const handleStockHover = useCallback((stock: Stock | null) => {
    // 선택된 종목이 있으면 호버 이벤트 무시
    if (selectedStock) {
      return;
    }
    setHoveredStock(stock);
  }, [selectedStock]);

  // URL 파라미터에서 종목 코드 가져오기
  useEffect(() => {
    const stockCode = searchParams.get('stock');
    if (stockCode && stocks.length > 0 && !selectedStock) {
        const stock = stocks.find((s) => s.code === stockCode);
        if (stock) {
          handleStockSelect(stock);
        }
      }
  }, [searchParams, stocks, selectedStock, handleStockSelect]);

  // 차트 데이터 업데이트
  useEffect(() => {
    if (fetchedChartData && fetchedChartData.length > 0) {
      setChartData(fetchedChartData);
    } else if (selectedStock && !isChartLoading) {
      // 로딩 중이 아니고 데이터가 없을 때만 mock 데이터 사용
      const mockData = generateChartData(selectedStock.currentPrice, 30);
      setChartData(mockData);
    } else if (!selectedStock) {
      // 종목이 선택되지 않았을 때 차트 데이터 초기화
      setChartData([]);
    }
  }, [fetchedChartData, selectedStock, isChartLoading]);

  // 대시보드 페이지 조회 기록 (빈 객체는 기록하지 않음 - trackView 내부에서 처리)
  useEffect(() => {
    // 대시보드 자체는 기록하지 않음 (종목 선택 시에만 기록)
  }, []);

  const handleSearchInput = (value: string) => {
    if (value) {
      search(value);
    } else {
      clearSearch();
    }
  };

  const handleSearchClear = () => {
    clearSearch();
  };

  return (
    <PageLayout className="!overflow-hidden" contentClassName="!overflow-hidden" onStockSelect={handleStockSelect}>
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        {/* MarketIndices - 상단 시장 지수 (토스증권 스타일) */}
        <div className="shrink-0">
          <MarketIndices />
        </div>
        

        {/* Main Content - 종목 목록과 상세 정보가 주요 공간 차지 */}
        <div className="flex-1 flex overflow-hidden">
          <StockListSection
            stocks={displayStocks}
            selectedStock={selectedStock}
            categories={categories}
            category={category}
            searchQuery={searchQuery}
            isLoading={isStocksLoading}
            isSearching={isSearching}
            onStockSelect={handleStockSelect}
            onStockHover={handleStockHover} // 호버 이벤트 핸들러 (선택된 종목이 있으면 무시)
            onCategoryChange={changeCategory}
            onSearchChange={handleSearchInput}
            onSearchClear={handleSearchClear}
            onRefetch={refetch}
          />

          <div className="flex-1 flex flex-col overflow-hidden relative">
            <StockDetailSection
              stock={selectedStock}
              hoveredStock={hoveredStock} // 호버된 종목 전달
              chartData={chartData}
              isChartLoading={isChartLoading}
              chartPeriod={chartPeriod}
              onChartPeriodChange={setChartPeriod}
            />
            
            {/* RecentActivity 아이콘을 오른쪽 하단에 고정 */}
            <div className="absolute bottom-4 right-4 z-10">
              <RecentActivityIcon />
            </div>
          </div>
        </div>
      </div>

      <AISummaryPanel summary={selectedStock ? mockAISummary : undefined} isLoading={isAILoading} />
    </PageLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
    </div>
      </PageLayout>
    }>
      <DashboardContent />
    </Suspense>
  );
}
