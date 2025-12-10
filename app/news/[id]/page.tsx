/**
 * News Detail Page
 * 뉴스 상세 페이지 - Kindle 스타일 분할 뷰
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useNewsDetail } from '@/lib/hooks/use-news';
import { PageLayout } from '@/components/common/PageLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { NewsWithNotes } from '@/components/news/NewsWithNotes';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  const { t } = useLanguage();

  const { data, isLoading, error } = useNewsDetail(newsId);

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
  if (error && !data) {
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

  // 데이터가 없고 에러도 없는 경우 (초기 로딩)
  if (!data && !error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto p-6">
          <ErrorState
            title={t('news.notFound')}
            message={t('news.notFoundDesc')}
            onRetry={() => router.push('/news')}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* 백엔드 연결 문제 경고 배너 (캐시된 데이터 표시 중) */}
        {error && data && (
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

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={18} />
            {t('common.back')}
          </button>

          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <ExternalLink size={16} />
              {t('news.source')}
            </a>
          )}
        </div>

        {/* Kindle-style Split View */}
        <NewsWithNotes news={data} />
      </div>
    </PageLayout>
  );
}

