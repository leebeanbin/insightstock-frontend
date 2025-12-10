/**
 * ErrorState Component
 * 공통 에러 상태 컴포넌트
 */

'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useLanguage();

  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title || t('common.error')}</h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-md">{message || t('common.unexpectedError')}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}

