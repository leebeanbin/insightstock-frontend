/**
 * SearchResults Component
 * 통합 검색 결과 UI 컴포넌트
 * 종목, 뉴스, 노트 등 통합 검색 결과 표시
 */

'use client';

import { formatPrice, formatChange, formatRelativeTime, getChangeColorClass } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes } from '@/lib/design-tokens';

interface SearchResultsProps {
  results: {
    stocks?: Array<{
      id: string;
      code: string;
      name: string;
      currentPrice: number;
      changeRate: number;
    }>;
    news?: Array<{
      id: string;
      title: string;
      summary: string;
      publishedAt: string;
      source: string;
    }>;
    notes?: Array<{
      id: string;
      title: string;
      content: string;
      updatedAt: string;
    }>;
  };
  isLoading?: boolean;
  query?: string;
}

export function SearchResults({
  results,
  isLoading = false,
  query,
}: SearchResultsProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">{t('common.searching')}</p>
      </div>
    );
  }

  const hasResults =
    (results.stocks && results.stocks.length > 0) ||
    (results.news && results.news.length > 0) ||
    (results.notes && results.notes.length > 0);

  if (!hasResults) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-medium text-gray-900 mb-1">
          {t('common.noResults')}
        </p>
        <p className="text-sm text-gray-500">
          {query ? `"${query}"에 대한 검색 결과가 없습니다.` : t('common.tryDifferentSearch')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 종목 검색 결과 */}
      {results.stocks && results.stocks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('stock.title')} ({results.stocks.length})
          </h2>
          <div className="space-y-2">
            {results.stocks.map((stock) => {
              const isPositive = stock.changeRate >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;

              return (
                <Link
                  key={stock.id}
                  href={`/stocks/${stock.code}`}
                  className="block p-4 rounded-xl border-2 border-gray-100 hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)] hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-gray-900">
                          {stock.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {stock.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(stock.currentPrice)}
                        </span>
                        <div className="flex items-center gap-1">
                          <TrendIcon
                            size={sizes.icon.px.sm}
                            className={cn(
                              isPositive
                                ? 'text-semantic-red'
                                : 'text-semantic-blue'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-semibold',
                              getChangeColorClass(stock.changeRate)
                            )}
                          >
                            {formatChange(stock.changeRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 뉴스 검색 결과 */}
      {results.news && results.news.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={18} />
            {t('news.title')} ({results.news.length})
          </h2>
          <div className="space-y-3">
            {results.news.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="block p-4 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {news.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(news.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 노트 검색 결과 */}
      {results.notes && results.notes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} />
            {t('education.notes')} ({results.notes.length})
          </h2>
          <div className="space-y-3">
            {results.notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block p-4 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {note.content}
                </p>
                <div className="text-xs text-gray-400">
                  {formatRelativeTime(note.updatedAt)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

