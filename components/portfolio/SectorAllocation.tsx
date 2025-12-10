/**
 * SectorAllocation Component
 * 업종 비중 컴포넌트
 */

'use client';

import Card from '@/components/molecules/Card';
import { PortfolioAnalysisResponse } from '@/lib/types/api/portfolio.types';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface SectorAllocationProps {
  sectors?: PortfolioAnalysisResponse['diversification']['sectors'];
}

export function SectorAllocation({ sectors }: SectorAllocationProps) {
  const { t } = useLanguage();

  if (!sectors || sectors.length === 0) {
    return (
      <Card variant="default">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{t('portfolio.sectorAllocation')}</h3>
        <div className="py-8 text-center text-sm text-gray-500">
          {t('common.noData')}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">{t('portfolio.sectorAllocation')}</h3>
      <div className="space-y-4">
        {sectors.map((sector) => (
          <div key={sector.name} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-gray-700 shrink-0">
              {sector.name}
            </div>
            <div className="flex-1 min-w-0 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${sector.percentage}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-semibold text-gray-900 number shrink-0">
              {sector.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

