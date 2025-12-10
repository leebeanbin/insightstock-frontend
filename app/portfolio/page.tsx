'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolios, usePortfolioAnalysis, useDeletePortfolio } from '@/lib/hooks/use-portfolio';
import { toast } from 'sonner';
import { PageLayout } from '@/components/common/PageLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PortfolioPageHeader } from '@/components/portfolio/PortfolioPageHeader';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { PortfolioList } from '@/components/portfolio/PortfolioList';
import { SectorAllocation } from '@/components/portfolio/SectorAllocation';
import { RiskAnalysis } from '@/components/portfolio/RiskAnalysis';
import { AddPortfolioModal } from '@/components/portfolio/AddPortfolioModal';
import { EditPortfolioModal } from '@/components/portfolio/EditPortfolioModal';
import { PortfolioItem } from '@/lib/types/api/portfolio.types';
import { trackView } from '@/lib/utils/trackView';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function PortfolioPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'profit' | 'profitRate' | 'currentValue'>('currentValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);

  // 포트폴리오 데이터 조회
  const { data: portfolioData, isLoading, error } = usePortfolios({
    sortBy,
    sortOrder,
  });

  // AI 리스크 분석 조회
  const { data: analysisData, isLoading: isAnalysisLoading } = usePortfolioAnalysis();

  const deleteMutation = useDeletePortfolio();

  // 히스토리 자동 기록 (포트폴리오 페이지 조회)
  useEffect(() => {
    trackView({});
  }, []);

  const handleDelete = async (id: string, stockName: string) => {
    if (!confirm(`"${stockName}"${t('portfolio.removeConfirm')}`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t('portfolio.removed'));
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleMutationError } = await import('@/lib/utils/error-handler');
      handleMutationError(
        error,
        'Failed to delete portfolio',
        t('portfolio.removeFailed')
      );
    }
  };

  const handleEdit = (portfolio: PortfolioItem) => {
    setSelectedPortfolio(portfolio);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message={t('portfolio.loading')} />
      </PageLayout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          message={error.message}
          onRetry={() => router.refresh()}
        />
      </PageLayout>
    );
  }

  const { portfolios = [], summary } = portfolioData || {};
  const { currentValue = 0 } = summary || {};

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <PortfolioPageHeader onAddClick={handleAdd} />

        {summary && (
          <PortfolioSummary summary={summary} portfolios={portfolios} />
        )}

        <PortfolioList
          portfolios={portfolios}
          currentValue={currentValue}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectorAllocation sectors={analysisData?.diversification?.sectors} />
          <RiskAnalysis risks={analysisData?.risks} isLoading={isAnalysisLoading} />
        </div>
      </div>

      {/* Modals */}
      <AddPortfolioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditPortfolioModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPortfolio(null);
        }}
        portfolio={selectedPortfolio}
      />
    </PageLayout>
  );
}

