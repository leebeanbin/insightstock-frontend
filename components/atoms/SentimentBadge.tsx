/**
 * SentimentBadge Component
 * 뉴스 감성 배지 컴포넌트 (긍정/부정/중립)
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface SentimentBadgeProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  className?: string;
  size?: 'sm' | 'md';
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  className,
  size = 'sm',
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
  };

  const sentimentStyles = {
    positive: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    negative: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  const labels = {
    positive: '긍정',
    negative: '부정',
    neutral: '중립',
  };

  return (
    <div
      className={cn(
        'rounded-full font-semibold',
        sizeStyles[size],
        sentimentStyles[sentiment],
        className
      )}
    >
      {labels[sentiment]}
    </div>
  );
};

export default SentimentBadge;

