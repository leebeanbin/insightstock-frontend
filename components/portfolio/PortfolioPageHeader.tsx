/**
 * PortfolioPageHeader Component
 * 포트폴리오 페이지 헤더 컴포넌트
 */

'use client';

import { Plus } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface PortfolioPageHeaderProps {
  onAddClick: () => void;
}

export function PortfolioPageHeader({ onAddClick }: PortfolioPageHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('portfolio.title')}</h1>
        <p className="text-xs text-gray-600 mt-0.5">{t('portfolio.subtitle')}</p>
      </div>
      <Button
        icon={Plus}
        onClick={() => {
          // TODO: AddPortfolioModal 열기
          onAddClick();
        }}
      >
        {t('portfolio.addStock')}
      </Button>
    </div>
  );
}

