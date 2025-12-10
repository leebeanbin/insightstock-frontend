/**
 * FloatingChatButton Component
 * 전역 플로팅 AI 챗 버튼 및 윈도우
 * 실무에서 사용하는 챗 플로팅 버튼처럼 우측 하단에 작은 윈도우로 표시
 */

'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Tooltip from '@/components/atoms/Tooltip';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationList } from '@/components/chat/ConversationList';
import { useCreateConversation } from '@/lib/hooks/use-conversations';
import { toast } from 'sonner';

type WindowState = 'closed' | 'minimized' | 'maximized';

export function FloatingChatButton() {
  const { t } = useLanguage();
  const [windowState, setWindowState] = useState<WindowState>('closed');
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const createMutation = useCreateConversation();

  const handleButtonClick = async () => {
    if (windowState === 'closed') {
      // 먼저 챗 윈도우를 열고, 그 다음 대화 생성 시도
      setWindowState('maximized');
      // 대화가 없으면 새로 생성 시도 (실패해도 챗 윈도우는 열려있음)
      if (!selectedConversationId) {
        // 비동기로 처리하되, 실패해도 챗 윈도우는 열린 상태 유지
        handleCreateNew().catch(() => {
          // 에러는 이미 handleCreateNew에서 처리됨
        });
      }
    } else {
      setWindowState('closed');
      // 닫을 때는 대화 ID 유지 (minimize와 동일하게)
    }
  };

  const handleCreateNew = async () => {
    if (createMutation.isPending) return; // 이미 생성 중이면 무시
    
    try {
      const conversation = await createMutation.mutateAsync({
        title: t('chat.newConversation'),
      });
      setSelectedConversationId(conversation.id);
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      const { handleMutationError } = await import('@/lib/utils/error-handler');
      handleMutationError(
        error,
        'Failed to create conversation',
        t('chat.createFailed')
      );
      // 대화 생성 실패해도 빈 챗 인터페이스는 표시 (selectedConversationId는 빈 상태로 유지)
      // 챗 윈도우는 이미 열려있으므로 빈 상태 UI가 표시됨
    }
  };

  const handleMinimize = () => {
    // minimize 시 플로팅 버튼으로 돌아가되 대화 ID는 유지
    setWindowState('closed');
  };

  const handleMaximize = async () => {
    setWindowState('maximized');
    // 대화가 없으면 새로 생성
    if (!selectedConversationId) {
      await handleCreateNew();
    }
  };

  const handleClose = () => {
    setWindowState('closed');
    setSelectedConversationId('');
  };

  // 모바일에서는 전체화면으로 표시
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* 플로팅 버튼 */}
      <Tooltip 
        content={
          windowState === 'closed' 
            ? selectedConversationId 
              ? t('chat.resumeConversation')
              : t('chat.newConversation')
            : t('chat.close')
        } 
        position="left"
      >
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'fixed',
            'w-14 h-14 rounded-full',
            'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
            'text-white',
            'shadow-lg shadow-[var(--brand-main)]/30 dark:shadow-[var(--brand-purple)]/30',
            'hover:shadow-xl hover:shadow-[var(--brand-main)]/40 dark:hover:shadow-[var(--brand-purple)]/40',
            'hover:scale-110 active:scale-95',
            'transition-all duration-300',
            'flex items-center justify-center',
            'group',
            'relative',
            // z-index를 매우 높게 설정
            'z-[9998]',
            // 위치 명확히 지정
            'bottom-6 right-6',
            windowState !== 'closed' && 'opacity-0 pointer-events-none'
          )}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
          }}
          aria-label={windowState === 'closed' ? t('chat.newConversation') : t('chat.close')}
        >
          <MessageSquare 
            size={sizes.icon.px.lg} 
            className={cn(
              'transition-transform duration-300',
              isHovered && 'scale-110'
            )}
          />
          {/* 진행 중인 대화 표시 뱃지 */}
          {windowState === 'closed' && selectedConversationId && (
            <span className={cn(
              'absolute -top-1 -right-1',
              'w-4 h-4 rounded-full',
              'bg-semantic-red dark:bg-semantic-red-light',
              'border-2 border-white dark:border-background-card',
              'animate-pulse'
            )} />
          )}
          {/* 펄스 애니메이션 */}
          {windowState === 'closed' && (
            <span className={cn(
              'absolute inset-0 rounded-full',
              'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
              'animate-ping opacity-20',
              'group-hover:opacity-30'
            )} />
          )}
        </button>
      </Tooltip>

      {/* 챗 윈도우 - windowState가 'closed'가 아니면 항상 표시 */}
      {windowState !== 'closed' && (
        <div
          className={cn(
            'fixed',
            'bg-background-card border border-border-default rounded-[var(--radius-2xl)]',
            'shadow-2xl',
            'flex flex-col',
            'transition-all duration-300',
            'animate-in fade-in slide-in-from-bottom-4',
            // z-index를 매우 높게 설정하여 다른 요소 위에 표시
            'z-[9999]',
            // 모바일: 거의 전체화면
            isMobile
              ? 'inset-4 bottom-20'
              : // 데스크톱: 우측 하단에 고정 (명확하게 우측 하단)
                windowState === 'minimized'
                ? 'bottom-24 right-6 w-80 h-16'
                : 'bottom-24 right-6 w-[680px] h-[700px] max-h-[calc(100vh-120px)]'
          )}
          style={{
            // 인라인 스타일로 위치 명확히 지정
            position: 'fixed',
            right: isMobile ? undefined : '1.5rem',
            bottom: isMobile ? undefined : '6rem',
            // 명시적으로 표시
            display: 'flex',
            visibility: 'visible',
            opacity: 1,
          }}
        >
          {/* 헤더 */}
          <div className={cn(
            'flex items-center justify-between',
            'px-[var(--spacing-4)] py-[var(--spacing-3)]',
            'border-b border-border-default',
            'bg-background-subtle',
            'rounded-t-[var(--radius-2xl)]'
          )}>
            <div className="flex items-center gap-[var(--spacing-2)]">
              <MessageSquare size={sizes.icon.px.md} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
              <h3 className={`text-[var(--font-size-sm)] font-semibold text-text-primary`}>
                {t('chat.title')}
              </h3>
            </div>
            <div className="flex items-center gap-[var(--spacing-1)]">
              {windowState === 'maximized' && !isMobile && (
                <Tooltip content={t('chat.minimize')} position="bottom">
                  <button
                    onClick={handleMinimize}
                    className={cn(
                      'p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]',
                      'hover:bg-background-hover',
                      'text-text-tertiary hover:text-text-primary',
                      'transition-colors'
                    )}
                    aria-label={t('chat.minimize')}
                  >
                    <Minimize2 size={sizes.icon.px.sm} />
                  </button>
                </Tooltip>
              )}
              {windowState === 'minimized' && !isMobile && (
                <Tooltip content={t('chat.maximize')} position="bottom">
                  <button
                    onClick={handleMaximize}
                    className={cn(
                      'p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]',
                      'hover:bg-background-hover',
                      'text-text-tertiary hover:text-text-primary',
                      'transition-colors'
                    )}
                    aria-label={t('chat.maximize')}
                  >
                    <Maximize2 size={sizes.icon.px.sm} />
                  </button>
                </Tooltip>
              )}
              <Tooltip content={t('chat.close')} position="bottom">
                <button
                  onClick={handleClose}
                  className={cn(
                    'p-[var(--spacing-1_5)] rounded-[var(--radius-lg)]',
                    'hover:bg-background-hover',
                    'text-text-tertiary hover:text-text-primary',
                    'transition-colors'
                  )}
                  aria-label={t('chat.close')}
                >
                  <X size={sizes.icon.px.sm} />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* 컨텐츠 */}
          {windowState === 'minimized' ? (
            <div className={cn(
              'flex-1 flex items-center justify-center',
              'px-[var(--spacing-4)] py-[var(--spacing-2)]'
            )}>
              <p className={`text-[var(--font-size-xs)] text-text-tertiary`}>
                {selectedConversationId ? t('chat.conversationActive') : t('chat.noConversation')}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* 대화 목록 (데스크톱만 표시) - 더 좁게 조정 */}
              {!isMobile && (
                <div className="w-[240px] flex-shrink-0 border-r border-border-default overflow-hidden bg-background-subtle">
                  <ConversationList
                    selectedId={selectedConversationId}
                    onSelect={setSelectedConversationId}
                    onCreateNew={handleCreateNew}
                  />
                </div>
              )}

              {/* 채팅 인터페이스 - conversationId가 없어도 기본 UI 표시 */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background-card">
                <ChatInterface 
                  conversationId={selectedConversationId || null}
                  onCreateNew={handleCreateNew}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

