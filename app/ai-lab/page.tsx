/**
 * AI Lab Page
 * AI Investment Assistant 메인 페이지
 * 대화 목록 + 채팅 인터페이스 (Toss 스타일)
 */

'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationList } from '@/components/chat/ConversationList';
import { useCreateConversation } from '@/lib/hooks/use-conversations';
import { PageLayout } from '@/components/common/PageLayout';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AILabPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const createMutation = useCreateConversation();

  const handleCreateNew = async () => {
    try {
      const conversation = await createMutation.mutateAsync({
        title: '새 대화',
      });
      setSelectedConversationId(conversation.id);
      toast.success('새 대화가 시작되었습니다.');
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('대화 생성에 실패했습니다.');
    }
  };

  return (
    <PageLayout>
      <div className="flex h-full overflow-hidden bg-[var(--background-page)]">
        {/* 사이드바 - 대화 목록 */}
        <div className="w-80 flex-shrink-0 border-r border-[var(--border-default)] bg-white dark:bg-gray-900">
          <ConversationList
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
            onCreateNew={handleCreateNew}
          />
        </div>

        {/* 메인 영역 - 채팅 인터페이스 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedConversationId ? (
            <ChatInterface conversationId={selectedConversationId} onCreateNew={handleCreateNew} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
              <div className="text-center max-w-md px-6">
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                  'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20'
                )}>
                  <MessageSquare size={32} className="text-[var(--brand-main)] dark:text-[var(--brand-purple)]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  AI Investment Assistant
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  대화를 선택하거나 새 대화를 시작하여
                  <br />
                  투자에 대해 질문해보세요.
                </p>
                <button
                  onClick={handleCreateNew}
                  disabled={createMutation.isPending}
                  className={cn(
                    'px-6 py-3 rounded-xl font-semibold transition-all duration-200',
                    'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
                    'text-white',
                    'hover:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)]',
                    'hover:shadow-md active:shadow-sm',
                    'hover:scale-[0.98] active:scale-[0.96]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {createMutation.isPending ? '생성 중...' : '새 대화 시작'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

