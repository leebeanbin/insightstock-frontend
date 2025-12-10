/**
 * HistoryItem Component
 * 개별 히스토리 아이템 컴포넌트
 */

'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import { formatPrice, formatChange, formatRelativeTime, getChangeColorClass } from '@/lib/formatters';
import { Clock, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HistoryItem as HistoryItemType } from '@/lib/types/api/history.types';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { sizes } from '@/lib/design-tokens';

interface HistoryItemProps {
  item: HistoryItemType;
  onClick?: () => void;
}

export function HistoryItem({ item, onClick }: HistoryItemProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // stock이 없는 경우 (newsId, noteId, conceptId인 경우) 처리
  if (!item.stock) {
    const typeLabel = item.type === 'news' ? t('history.typeNews') : item.type === 'note' ? t('history.typeNote') : t('history.typeConcept');
    return (
      <Card
        variant="default"
        className="p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{typeLabel} {t('history.viewed')}</h3>
              <Badge variant="primary">{typeLabel}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Clock size={sizes.icon.px.sm} strokeWidth={2} />
              <span>{formatRelativeTime(item.viewedAt)}</span>
            </div>
          </div>
          <ExternalLink size={sizes.icon.px.lg} strokeWidth={2} className="text-gray-400 shrink-0" />
        </div>
      </Card>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 동작: 종목 상세 페이지로 이동
      if (item.stock?.code) {
        router.push(`/stocks/${item.stock.code}`);
      }
    }
  };

  return (
    <Card
      variant="default"
      className="p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{item.stock.name}</h3>
            <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg font-semibold">
              {item.stock.code}
            </span>
            <Badge variant="primary">{t('history.viewed')}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-gray-900 number">
              {formatPrice(item.stock.currentPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <Clock size={sizes.icon.px.sm} strokeWidth={2} />
            <span>{formatRelativeTime(new Date(item.viewedAt))}</span>
          </div>
        </div>
        <ExternalLink size={20} strokeWidth={2} className="text-gray-400 shrink-0" />
      </div>
    </Card>
  );
}

