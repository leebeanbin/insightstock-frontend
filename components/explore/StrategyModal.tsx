'use client';

import React from 'react';
import { X, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatChange, getChangeColorClass } from '@/lib/formatters';
import Button from '../atoms/Button';
import { useRouter } from 'next/navigation';
import { sizes } from '@/lib/design-tokens';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: {
    id: string;
    name: string;
    description: string;
    count: number;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  } | null;
  stocks?: Array<{
    name: string;
    code?: string;
    price: number;
    change: number;
    per: number;
  }>;
}

export function StrategyModal({ isOpen, onClose, strategy, stocks = [] }: StrategyModalProps) {
  const router = useRouter();

  // useLanguage는 클라이언트에서만 사용
  let t: (key: string) => string = (key: string) => key;
  try {
    const { useLanguage: useLang } = require('@/lib/contexts/LanguageContext');
    const langContext = useLang();
    t = langContext.t;
  } catch (e) {
    // 기본값 사용
  }

  if (!isOpen || !strategy) return null;

  const Icon = strategy.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal - 토스 스타일: 하단에서 올라오는 애니메이션, 너비 조정 */}
      <div className={cn(
        'relative w-full max-w-md max-h-[90vh]',
        'bg-background-card rounded-t-3xl sm:rounded-3xl shadow-2xl',
        'flex flex-col overflow-hidden',
        'border border-border-default',
        'animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300',
        'transform-gpu'
      )}>
        {/* Header */}
        <div className={cn(
          'relative p-6 pb-4',
          'bg-gradient-to-br from-[var(--brand-main)] to-[var(--brand-purple)]',
          'dark:from-[var(--brand-purple)] dark:to-[var(--brand-light-purple)]'
        )}>
          <div className="relative flex items-start gap-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl shrink-0',
              'bg-white/20 backdrop-blur-sm',
              'flex items-center justify-center',
              'shadow-lg',
              'text-white'
            )}>
              <Icon size={28} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-2xl font-bold text-white mb-1">{strategy.name}</h2>
              <p className="text-sm text-white/90 leading-relaxed">{strategy.description}</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
                <span className="text-sm font-semibold text-white">{strategy.count}개 종목</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-xl shrink-0',
                'bg-white/20 hover:bg-white/30',
                'text-white',
                'transition-all duration-200',
                'hover:scale-110 active:scale-95'
              )}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Strategy Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">전략 설명</h3>
            <div className={cn(
              'p-4 rounded-xl',
              'bg-background-subtle dark:bg-background-subtle',
              'border border-[var(--brand-light-purple)]/30 dark:border-[var(--brand-purple)]/30'
            )}>
              <p className="text-sm text-text-secondary leading-relaxed">
                {strategy.id === 'dividend' && '배당주 전략은 안정적인 현금 흐름을 추구하는 투자자에게 적합합니다. 배당률이 높고 지속적으로 배당을 지급하는 기업을 선별하여 장기 투자 포트폴리오를 구성합니다.'}
                {strategy.id === 'growth' && '성장주 전략은 높은 성장 잠재력을 가진 기업에 투자하는 방법입니다. 매출 성장률이 높고 시장 점유율을 확대하는 기업을 중심으로 포트폴리오를 구성합니다.'}
                {strategy.id === 'value' && '가치주 전략은 시장에서 저평가된 기업을 찾아 투자하는 방법입니다. PER, PBR 등 밸류에이션 지표가 낮으면서도 안정적인 재무 상태를 가진 기업을 선별합니다.'}
                {strategy.id === 'momentum' && '모멘텀 전략은 최근 상승 추세가 강한 종목에 투자하는 방법입니다. 기술적 분석을 통해 상승 모멘텀이 지속될 것으로 예상되는 종목을 선별합니다.'}
                {strategy.id === 'ai' && 'AI 추천은 당신의 포트폴리오와 투자 성향을 분석하여 최적의 종목을 추천합니다. 머신러닝 알고리즘을 통해 개인화된 투자 전략을 제안합니다.'}
              </p>
            </div>
          </div>

          {/* Recommended Stocks */}
          {stocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary">추천 종목</h3>
              <div className="space-y-2">
                {stocks.map((stock, index) => (
                  <div
                    key={stock.name}
                    onClick={() => {
                      if (stock.code) {
                        router.push(`/stocks/${stock.code}`);
                      }
                      onClose();
                    }}
                    className={cn(
                      'p-4 rounded-xl',
                      'bg-background-subtle hover:bg-background-hover',
                      'border border-border-default hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)]',
                      'cursor-pointer transition-all duration-200',
                      'hover:shadow-md hover:scale-[1.02]',
                      'active:scale-[0.98]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-text-primary">{stock.name}</h4>
                          {stock.code && (
                            <span className="text-xs text-text-tertiary font-mono bg-background-hover px-1.5 py-0.5 rounded">
                              {stock.code}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-text-secondary">
                            PER: <span className="font-semibold text-text-primary">{stock.per}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-lg font-bold text-text-primary number mb-1">
                          {formatPrice(stock.price)}
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {stock.change >= 0 ? (
                            <TrendingUp size={sizes.icon.px.sm} strokeWidth={2.5} className="text-semantic-red dark:text-semantic-red-light" />
                          ) : (
                            <TrendingDown size={sizes.icon.px.sm} strokeWidth={2.5} className="text-semantic-blue dark:text-accent-blue-light" />
                          )}
                          <span className={cn('text-sm font-semibold number', getChangeColorClass(stock.change))}>
                            {formatChange(stock.change)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Explanation Button */}
          <div className="pt-4 border-t border-border-default">
            <Button
              variant="primary"
              size="large"
              icon={Sparkles}
              iconPosition="left"
              className="w-full"
              onClick={() => {
                router.push(`/chat?strategy=${strategy.id}`);
                onClose();
              }}
            >
              AI에게 전략 설명받기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

