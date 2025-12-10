/**
 * Chat Page
 * AI 챗봇 메인 페이지
 * 대화 목록 + 채팅 인터페이스
 */

'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationList } from '@/components/chat/ConversationList';
import { useCreateConversation } from '@/lib/hooks/use-conversations';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
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
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 - 대화 목록 */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          onCreateNew={handleCreateNew}
        />
      </div>

      {/* 메인 영역 - 채팅 인터페이스 */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatInterface conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                AI 투자 도우미
              </h2>
              <p className="text-gray-500 mb-6">
                대화를 선택하거나 새 대화를 시작하여
                <br />
                투자에 대해 질문해보세요.
              </p>
              <button
                onClick={handleCreateNew}
                disabled={createMutation.isPending}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? '생성 중...' : '새 대화 시작'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

