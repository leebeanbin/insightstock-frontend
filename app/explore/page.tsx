'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StrategyModal } from '@/components/explore/StrategyModal';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useCreateConversation } from '@/lib/hooks/use-conversations';

// 전략 데이터는 컴포넌트 내부에서 번역 키로 생성

const mockStocks = [
  { name: '삼성전자', code: '005930', price: 65000, change: 2.56, per: 15.2 },
  { name: 'SK하이닉스', code: '000660', price: 142000, change: -1.46, per: 8.5 },
  { name: 'NAVER', code: '035420', price: 198500, change: 1.79, per: 22.3 },
];

export default function ExplorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const createConversation = useCreateConversation();

  // 전략 목록 생성 (번역 키 사용)
  const strategiesList = [
    {
      id: 'dividend',
      nameKey: 'explore.strategy.dividend',
      descriptionKey: 'explore.strategy.dividendDescription',
      count: 12,
      icon: TrendingUp,
    },
    {
      id: 'growth',
      nameKey: 'explore.strategy.growth',
      descriptionKey: 'explore.strategy.growthDescription',
      count: 8,
      icon: TrendingUp,
    },
    {
      id: 'value',
      nameKey: 'explore.strategy.value',
      descriptionKey: 'explore.strategy.valueDescription',
      count: 15,
      icon: TrendingDown,
    },
    {
      id: 'momentum',
      nameKey: 'explore.strategy.momentum',
      descriptionKey: 'explore.strategy.momentumDescription',
      count: 10,
      icon: TrendingUp,
    },
    {
      id: 'ai',
      nameKey: 'explore.strategy.ai',
      descriptionKey: 'explore.strategy.aiDescription',
      count: 5,
      icon: Sparkles,
    },
  ];

  const selectedStrategy = selectedStrategyId ? strategiesList.find(s => s.id === selectedStrategyId) : null;

  // 전략 선택 시 대화 생성
  useEffect(() => {
    if (selectedStrategyId && !conversationId && selectedStrategy) {
      createConversation.mutate(
        { title: `${t(selectedStrategy.nameKey)} 전략 분석` },
        {
          onSuccess: (data) => {
            console.log('Conversation created:', data);
            setConversationId(data.id);
          },
          onError: (error) => {
            console.error('Failed to create conversation:', error);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStrategyId, conversationId, selectedStrategy]);

  return (
    <div className="flex h-screen bg-background-page transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">{t('explore.strategyExploration')}</h1>
              <p className="text-sm text-text-secondary">{t('explore.strategyDescription')}</p>
            </div>

            {/* Strategy Cards - 그리드 레이아웃으로 변경 */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">{t('explore.strategySelection')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {strategiesList.map((strategy) => {
                  const Icon = strategy.icon;
                  const isSelected = selectedStrategyId === strategy.id;
                  
                  return (
                    <Card
                      key={strategy.id}
                      variant={isSelected ? 'selected' : 'default'}
                      onClick={() => setSelectedStrategyId(strategy.id)}
                      className={cn(
                        'cursor-pointer transition-all duration-300',
                        'hover:scale-105 hover:shadow-xl',
                        'active:scale-95'
                      )}
                    >
                      <div className="flex flex-col items-center text-center gap-3 p-4">
                        <div className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center',
                          'transition-all duration-300',
                          isSelected 
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-lg shadow-primary-500/30' 
                            : 'bg-primary-100 dark:bg-primary-900/30'
                        )}>
                          <Icon 
                            size={28} 
                            strokeWidth={2}
                            className={isSelected ? 'text-white' : 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]'}
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className={cn(
                            'text-base font-semibold mb-1',
                            isSelected 
                              ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)] font-semibold' 
                              : 'text-text-primary'
                          )}>
                            {t(strategy.nameKey)}
                          </h3>
                          <p className="text-xs text-text-secondary mb-2 line-clamp-2 leading-relaxed">
                            {t(strategy.descriptionKey)}
                          </p>
                          <Badge 
                            variant={isSelected ? 'primary' : 'default'}
                            className="text-xs"
                          >
                            {strategy.count}{t('explore.stocksCount')}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Strategy Exploration 영역 - 전략 선택 시 채팅 인터페이스 표시 */}
            {selectedStrategyId && selectedStrategy && conversationId ? (
              <div className="mt-8">
                <Card variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {t(selectedStrategy.nameKey)} - AI 분석
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {t(selectedStrategy.descriptionKey)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStrategyId(null);
                        setConversationId('');
                      }}
                      className="text-sm text-text-tertiary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-background-hover"
                    >
                      {t('common.close')}
                    </button>
                  </div>
                  {/* 채팅 인터페이스 임베드 */}
                  <div className="h-[600px] border border-border-default rounded-lg overflow-hidden bg-background-card">
                    <ChatInterface 
                      conversationId={conversationId || null}
                      onCreateNew={async () => {
                        if (!conversationId && selectedStrategy) {
                          try {
                            const data = await createConversation.mutateAsync({
                              title: `${t(selectedStrategy.nameKey)} 전략 분석`,
                            });
                            setConversationId(data.id);
                          } catch (error) {
                            console.error('Failed to create conversation:', error);
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
              </div>
            ) : selectedStrategyId && selectedStrategy ? (
              <div className="mt-8">
                <Card variant="default" className="p-6">
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-[var(--brand-main)] dark:border-[var(--brand-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-text-secondary">{t('chat.creating')}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card variant="default" className="py-16">
                <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center px-6">
                  <div className={cn(
                    'w-20 h-20 rounded-2xl mb-6',
                    'bg-primary-100 dark:bg-primary-900/30',
                    'flex items-center justify-center'
                  )}>
                    <Filter size={40} strokeWidth={2} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{t('explore.selectStrategy')}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                    {t('explore.selectStrategyDescription')}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Strategy Modal 제거 - 대신 Strategy Exploration 영역에서 채팅 표시 */}
    </div>
  );
}
