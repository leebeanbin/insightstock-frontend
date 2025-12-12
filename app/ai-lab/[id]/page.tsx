/**
 * Chat Detail Page
 * 특정 대화 상세 페이지
 * URL 파라미터로 conversationId를 받아 표시
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationList } from '@/components/chat/ConversationList';
import { useCreateConversation } from '@/lib/hooks/use-conversations';
import { toast } from 'sonner';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const createMutation = useCreateConversation();

  const handleCreateNew = async () => {
    try {
      const conversation = await createMutation.mutateAsync({
        title: '새 대화',
      });
      router.push(`/ai-lab/${conversation.id}`);
      toast.success('새 대화가 시작되었습니다.');
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('대화 생성에 실패했습니다.');
    }
  };

  const handleSelect = (id: string) => {
    if (id) {
      router.push(`/ai-lab/${id}`);
    } else {
      router.push('/ai-lab');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 - 대화 목록 */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          selectedId={conversationId}
          onSelect={handleSelect}
          onCreateNew={handleCreateNew}
        />
      </div>

      {/* 메인 영역 - 채팅 인터페이스 */}
      <div className="flex-1 flex flex-col">
        {conversationId ? (
          <ChatInterface conversationId={conversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              대화를 선택해주세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

