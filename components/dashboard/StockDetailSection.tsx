/**
 * StockDetailSection Component
 * 종목 상세 정보 섹션 컴포넌트
 */

'use client';

import { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Stock, ChartData } from '@/lib/types';
import { formatPrice, formatChange, formatVolume, getChangeColorClass, formatRelativeTime } from '@/lib/formatters';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, Newspaper, BookOpen, X, ExternalLink, Sparkles, Info, FileText } from 'lucide-react';
import Badge from '@/components/atoms/Badge';
import SentimentBadge from '@/components/atoms/SentimentBadge';
import Card from '@/components/molecules/Card';
// import StockChart, { ChartPeriod, ChartType } from '@/components/molecules/StockChart';
import dynamic from 'next/dynamic';
import { ChartPeriod } from '@/components/molecules/charts/LightweightStockChart';
import Button from '@/components/atoms/Button';

// LightweightStockChart를 동적으로 로드 (코드 스플리팅)
const LightweightStockChart = dynamic(
  () => import('@/components/molecules/charts/LightweightStockChart').then(mod => ({ default: mod.LightweightStockChart })),
  {
    loading: () => (
      <div className="flex items-center justify-center flex-1">
        <RefreshCw size={sizes.icon.px.xl} className="animate-spin text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
      </div>
    ),
    ssr: false,
  }
);
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes, layout } from '@/lib/design-tokens';
import { useNewsByStock, useNewsDetail } from '@/lib/hooks/use-news';
import { StockHoverPreviewContent } from './StockHoverPreviewContent';
import { TradingActivity } from './TradingActivity';

interface StockDetailSectionProps {
  stock: Stock | null;
  hoveredStock: Stock | null; // 호버된 종목 추가
  chartData: ChartData[];
  isChartLoading: boolean;
  chartPeriod?: ChartPeriod;
  onChartPeriodChange?: (period: ChartPeriod) => void;
}

type DetailTab = 'chart' | 'info' | 'news';

function StockDetailSectionComponent({
  stock,
  hoveredStock,
  chartData,
  isChartLoading,
  chartPeriod = '1m',
  onChartPeriodChange,
}: StockDetailSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<DetailTab>('chart');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  
  // 표시할 종목 결정: 선택된 종목이 있으면 선택된 종목, 없으면 호버된 종목
  const displayStock = stock || hoveredStock;
  
  // 종목별 뉴스 조회
  const { data: newsData, isLoading: isNewsLoading } = useNewsByStock(
    displayStock?.code || null,
    { limit: 10 }
  );
  
  // 선택된 뉴스 상세 조회
  const { data: selectedNews, isLoading: isNewsDetailLoading } = useNewsDetail(
    selectedNewsId,
    { enabled: !!selectedNewsId }
  );

  // 호버된 종목이 있으면 미리보기 모드, 없고 선택된 종목도 없으면 빈 상태
  if (!displayStock) {
    return (
      <div className="flex-1 min-w-0 bg-white overflow-y-auto flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={32} strokeWidth={2} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-text-primary mb-2">
            {t('dashboard.selectStock')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-text-secondary leading-relaxed">
            {t('dashboard.selectStockDescription')}
          </p>
        </div>
      </div>
    );
  }

  // 호버 미리보기 모드인지 확인
  const isPreviewMode = !!hoveredStock && !stock;

  return (
    <div className="flex-1 min-w-0 bg-background-page overflow-y-auto">
      <div className="h-full flex flex-col">
        <div className="p-4 space-y-3 flex-1 overflow-y-auto min-h-0">
          {/* Stock Header */}
          <Card variant="default" className={cn(
            "p-4 bg-background-card border-border-default shadow-sm",
            isPreviewMode && "border-2 border-[var(--brand-main)] dark:border-[var(--brand-purple)]"
          )}>
            {/* 미리보기 모드 표시 */}
            {isPreviewMode && (
              <div className="mb-3 px-3 py-2 bg-[var(--brand-light-purple)]/10 dark:bg-[var(--brand-purple)]/10 rounded-lg border border-[var(--brand-main)]/20 dark:border-[var(--brand-purple)]/20">
                <p className="text-xs font-medium text-[var(--brand-main)] dark:text-[var(--brand-purple)]">
                  미리보기 모드 - 클릭하여 상세 정보 보기
                </p>
              </div>
            )}
            
            {/* 탭 네비게이션 (토스증권 스타일) - 미리보기 모드에서는 숨김 */}
            {!isPreviewMode && (
              <div className="flex items-center gap-1 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedTab('chart')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                  selectedTab === 'chart'
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] border-[var(--brand-main)] dark:border-[var(--brand-purple)]'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span>차트·호가</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedTab('info')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                  selectedTab === 'info'
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] border-[var(--brand-main)] dark:border-[var(--brand-purple)]'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span>종목정보</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedTab('news')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                  selectedTab === 'news'
                    ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] border-[var(--brand-main)] dark:border-[var(--brand-purple)]'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  <Newspaper size={16} />
                  <span>뉴스·공시</span>
                </div>
              </button>
            </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                  {displayStock.name}
                </h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                    {displayStock.code}
                  </span>
                  <span className="text-xs text-text-tertiary">{displayStock.market}</span>
                  <span className="text-xs text-text-disabled">·</span>
                  <span className="text-xs text-text-tertiary">{displayStock.sector}</span>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-3 pb-3 border-b border-border-default">
              <span className="text-2xl font-bold text-text-primary number">
                {formatPrice(displayStock.currentPrice)}
              </span>
              <div className="flex items-center gap-1.5">
                {(displayStock.changePercent ?? 0) >= 0 ? (
                  <TrendingUp size={sizes.icon.px.lg} strokeWidth={2.5} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                ) : (
                  <TrendingDown size={sizes.icon.px.lg} strokeWidth={2.5} className="text-[var(--brand-light-purple)] dark:text-[var(--brand-light-purple)]" />
                )}
                <span className={cn('text-lg font-bold number', getChangeColorClass(displayStock.changePercent))}>
                  {formatChange(displayStock.changePercent)}
                </span>
                <Badge variant={(displayStock.changePercent ?? 0) >= 0 ? 'error' : 'default'} dot>
                  {(displayStock.changePercent ?? 0) >= 0 ? t('stock.rising') : t('stock.falling')}
                </Badge>
              </div>
            </div>
            {displayStock.volume && (
              <p className="text-xs text-gray-600 dark:text-text-secondary mt-2 font-medium">
                {t('stock.volume')} {formatVolume(displayStock.volume)}
              </p>
            )}
          </Card>

          {/* 탭별 콘텐츠 */}
          {(!isPreviewMode && selectedTab === 'chart') && (
            <div className="relative" style={{ zIndex: 1 }}>
              <Card variant="default" className="p-2 border-border-default shadow-sm w-full overflow-visible flex flex-col h-[600px] max-h-[600px]">
                <div className="w-full flex-1 flex flex-col min-w-0 overflow-visible min-h-0 relative">
                {isChartLoading ? (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <RefreshCw size={sizes.icon.px.xl} className="animate-spin text-[var(--brand-main)] dark:text-[var(--brand-purple)] mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-400 dark:text-text-tertiary">{t('common.loading')}</p>
                    </div>
                  </div>
                ) : chartData.length > 0 ? (
                  <LightweightStockChart
                    data={chartData}
                    isPositive={(displayStock.changePercent ?? 0) >= 0}
                    period={chartPeriod}
                    onPeriodChange={onChartPeriodChange}
                    stockCode={displayStock.code}
                    className="flex-1"
                  />
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-sm font-medium text-gray-400 dark:text-text-tertiary">{t('common.noData')}</p>
                  </div>
                )}
                </div>
              </Card>
            </div>
          )}

          {/* 미리보기 모드: 간단한 차트와 정보만 표시 */}
          {isPreviewMode && (
            <StockHoverPreviewContent stock={displayStock} />
          )}

          {selectedTab === 'info' && displayStock && (
            <Card variant="default" className="p-6 border-border-default shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">종목 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">종목명</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{displayStock.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">종목코드</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-mono">{displayStock.code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">시장</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{displayStock.market}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">섹터</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{displayStock.sector}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">현재가</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatPrice(displayStock.currentPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">등락률</p>
                    <p className={cn('text-sm font-semibold', getChangeColorClass(displayStock.changePercent))}>
                      {formatChange(displayStock.changePercent)}
                    </p>
                  </div>
                  {displayStock.volume && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">거래량</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatVolume(displayStock.volume)}</p>
                    </div>
                  )}
                  {displayStock.marketCap && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">시가총액</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatPrice(displayStock.marketCap)}</p>
                    </div>
                  )}
                </div>
              </div>
              {(displayStock as any).description && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">종목 설명</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{(displayStock as any).description}</p>
                </div>
              )}
            </Card>
          )}

          {selectedTab === 'news' && (
            <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-text-primary mb-3">{t('news.relatedNews')}</h3>
            {isNewsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw size={sizes.icon.px.md} className="animate-spin text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
              </div>
            ) : newsData && newsData.news && newsData.news.length > 0 ? (
              <div className="flex gap-4">
                {/* 왼쪽: 뉴스 탭 목록 */}
                <div className="w-64 shrink-0 flex flex-col gap-2">
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-2">
                    {newsData.news.map((news) => (
                      <button
                        key={news.id}
                        onClick={() => setSelectedNewsId(news.id)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-left transition-all border-2',
                          selectedNewsId === news.id
                            ? 'bg-[var(--brand-main)] text-white dark:bg-[var(--brand-purple)] border-[var(--brand-main)] dark:border-[var(--brand-purple)] shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)] hover:shadow-sm'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={cn(
                            'text-sm font-semibold line-clamp-2 flex-1',
                            selectedNewsId === news.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                          )}>
                            {news.title}
                          </h4>
                          {news.sentiment && (
                            <SentimentBadge 
                              sentiment={news.sentiment} 
                              className={cn(
                                'shrink-0',
                                selectedNewsId === news.id && 'opacity-90'
                              )} 
                            />
                          )}
                        </div>
                        <div className={cn(
                          'flex items-center gap-1.5 text-xs mt-1',
                          selectedNewsId === news.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        )}>
                          <span>{news.source}</span>
                          <span>·</span>
                          <span>{formatRelativeTime(news.publishedAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 오른쪽: 선택된 뉴스 상세 내용 */}
                <div className="flex-1 min-w-0">
                  {selectedNewsId ? (
                    <Card variant="default" className="p-6 h-full">
                      {isNewsDetailLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <RefreshCw size={sizes.icon.px.md} className="animate-spin text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                        </div>
                      ) : selectedNews ? (
                        <div className="space-y-4">
                          {/* 뉴스 헤더 */}
                          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                {selectedNews.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                                <span className="font-medium">{selectedNews.source}</span>
                                <span>·</span>
                                <span>{formatRelativeTime(selectedNews.publishedAt)}</span>
                                {selectedNews.sentiment && (
                                  <>
                                    <span>·</span>
                                    <SentimentBadge sentiment={selectedNews.sentiment} />
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedNewsId(null)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
                            >
                              <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                          
                          {/* AI 요약 */}
                          {selectedNews.summary && (
                            <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-4 border border-primary-200 dark:border-gray-700">
                              <div className="flex items-start gap-3">
                                <Sparkles size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <h5 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-2">
                                    {t('news.aiSummary')}
                                  </h5>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedNews.summary}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 뉴스 내용 */}
                          {selectedNews.content && (
                            <div className="prose prose-sm max-w-none">
                              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {selectedNews.content}
                              </div>
                            </div>
                          )}
                          
                          {/* 액션 버튼 */}
                          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              variant="secondary"
                              size="medium"
                              icon={BookOpen}
                              onClick={() => {
                                router.push(`/education?newsId=${selectedNews.id}&tab=notes`);
                              }}
                            >
                              노트 만들기
                            </Button>
                            {selectedNews.url && (
                              <a
                                href={selectedNews.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                              >
                                <ExternalLink size={16} />
                                원문 보기
                              </a>
                            )}
                            <Button
                              variant="secondary"
                              size="medium"
                              onClick={() => {
                                router.push(`/news/${selectedNews.id}`);
                              }}
                            >
                              전체 보기
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            뉴스를 불러올 수 없습니다
                          </p>
                        </div>
                      )}
                    </Card>
                  ) : (
                    <Card variant="default" className="p-12 h-full flex items-center justify-center">
                      <div className="text-center">
                        <Newspaper size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          왼쪽에서 뉴스를 선택하세요
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card variant="default" className="p-6">
                <div className="text-center py-4">
                  <Newspaper size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('news.quiet')}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {t('news.noRelatedNews', { stockName: displayStock.name })}
                  </p>
                </div>
              </Card>
            )}
            </div>
          )}

          {/* 실시간 체결 내역 및 투자자 동향 (차트 탭에서만 표시) */}
          {!isPreviewMode && selectedTab === 'chart' && (
            <TradingActivity stock={displayStock} />
          )}
        </div>
      </div>
    </div>
  );
}

// memo로 감싸서 불필요한 리렌더링 방지
export const StockDetailSection = memo(StockDetailSectionComponent);

