/**
 * RiskAnalysis Component
 * AI 리스크 분석 컴포넌트
 */

'use client';

import Card from '@/components/molecules/Card';
import { PortfolioAnalysisResponse } from '@/lib/types/api/portfolio.types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface RiskAnalysisProps {
  risks?: PortfolioAnalysisResponse['risks'];
  isLoading?: boolean;
}

export function RiskAnalysis({ risks, isLoading = false }: RiskAnalysisProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card variant="default">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{t('portfolio.riskAnalysis')}</h3>
        <div className="py-8 text-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">{t('portfolio.analyzing')}</p>
        </div>
      </Card>
    );
  }

  if (!risks || risks.length === 0) {
    return (
      <Card variant="default">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{t('portfolio.riskAnalysis')}</h3>
        <div className="py-8 text-center text-sm text-gray-500">
          {t('common.noData')}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">{t('portfolio.riskAnalysis')}</h3>
      <div className="space-y-3">
        {risks.map((risk, index) => {
          const bgColor =
            risk.severity === 'error'
              ? 'bg-[rgba(239,68,68,0.1)] border-semantic-red'
              : risk.severity === 'warning'
              ? 'bg-[rgba(245,158,11,0.1)] border-semantic-yellow'
              : 'bg-[rgba(59,130,246,0.1)] border-blue-500';
          const textColor =
            risk.severity === 'error'
              ? 'text-semantic-red'
              : risk.severity === 'warning'
              ? 'text-semantic-yellow'
              : 'text-blue-600';
          const iconBg =
            risk.severity === 'error'
              ? 'bg-semantic-red'
              : risk.severity === 'warning'
              ? 'bg-semantic-yellow'
              : 'bg-blue-500';

          return (
            <div
              key={index}
              className={cn('flex items-start gap-3 p-4 rounded-lg border', bgColor)}
            >
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5', iconBg)}>
                <span className="text-white text-xs font-bold">
                  {risk.severity === 'error' ? '!' : risk.severity === 'warning' ? '⚠' : 'i'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold mb-1', textColor)}>
                  {risk.title}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  {risk.description}
                </p>
                {risk.recommendation && (
                  <p className="text-xs text-gray-500 italic">
                    💡 {risk.recommendation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

