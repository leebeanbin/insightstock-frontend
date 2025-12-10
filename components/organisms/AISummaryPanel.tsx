'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, X, AlertTriangle, GraduationCap } from 'lucide-react';
import IconButton from '../atoms/IconButton';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import { AISummary } from '@/lib/types';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { layout, sizes } from '@/lib/design-tokens';

export interface AISummaryPanelProps {
  summary?: AISummary;
  isLoading?: boolean;
  onClose?: () => void;
  className?: string;
}

const AISummaryPanel = ({
  summary,
  isLoading = false,
  onClose,
  className,
}: AISummaryPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const handleClose = () => {
    setIsExpanded(false);
    onClose?.();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'fixed bottom-6 right-6 w-10 h-10 rounded-lg',
          'bg-primary-600 text-white',
          'flex items-center justify-center',
          'shadow-lg hover:bg-primary-500 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
          'z-50'
        )}
        aria-label={isExpanded ? t('ai.collapse') : t('ai.expand')}
      >
        <Sparkles size={sizes.icon.px.lg} strokeWidth={1.75} />
      </button>

      {/* Panel */}
      {isExpanded && (
        <div
          className={cn(
            `fixed right-0 top-0 bottom-0 w-[${layout.panel.width}] max-w-[${layout.panel.maxWidth}]`,
            'bg-white border-l border-gray-200',
            'flex flex-col z-40',
            'animate-in slide-in-from-right duration-300',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Sparkles size={sizes.icon.px.lg} strokeWidth={1.75} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('ai.summary')}</h2>
            </div>
            <IconButton
              icon={X}
              size="medium"
              variant="ghost"
              onClick={handleClose}
              aria-label={t('aria.close')}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
                <div className="pt-4">
                  <p className="text-sm text-gray-600">{t('ai.analyzing')}</p>
                </div>
              </div>
            ) : summary ? (
              <div className="space-y-6">
                {/* 한 문장 요약 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {summary.onelineSummary}
                  </h3>
                </div>

                {/* 주요 이슈 */}
                {summary.keyIssues && summary.keyIssues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('ai.keyIssues')}</h4>
                    <ul className="space-y-2">
                      {summary.keyIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 가격 해석 */}
                {summary.priceAnalysis && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('ai.priceInterpretation')}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {summary.priceAnalysis}
                    </p>
                  </div>
                )}

                {/* 리스크 요약 */}
                {summary.riskSummary && (
                  <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-semantic-yellow">
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        size={16}
                        strokeWidth={1.75}
                        className="text-semantic-yellow flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-semantic-yellow flex-1">
                        {summary.riskSummary}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {summary.learningCta && (
                  <Button
                    variant="primary"
                    size="medium"
                    icon={GraduationCap}
                    iconPosition="left"
                    className="w-full"
                  >
                    {summary.learningCta}{t('ai.learnMore')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles size={48} strokeWidth={1.5} className="text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  {t('ai.selectStock')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AISummaryPanel;

