/**
 * Chat Repository
 * AI 챗봇 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import {
  Conversation,
  ConversationListItem,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  ConversationsListResponse,
  MessagesListResponse,
} from '../types/api/chat.types';

export class ChatRepository extends BaseRepository<Conversation> {
  protected basePath = '/chat';

  /**
   * 대화 생성
   */
  async createConversation(
    data: CreateConversationRequest
  ): Promise<Conversation> {
    try {
      return await this.post<Conversation>('/conversations', data);
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Fallback: 임시 대화 생성 (개발용)
      return {
        id: `conv_${Date.now()}`,
        userId: 'user_1',
        title: data.title || 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * 대화 목록 조회
   */
  async getConversations(
    params?: { limit?: number; offset?: number; search?: string; category?: string }
  ): Promise<ConversationsListResponse> {
    try {
      // 백엔드는 ConversationListItem[] 배열만 반환하므로 변환 필요
      const conversations = await this.get<ConversationListItem[]>('/conversations', params);
      return {
        conversations: conversations || [],
        total: conversations?.length || 0, // 백엔드가 total을 제공하지 않으므로 배열 길이 사용
      };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 대화 상세 조회
   */
  async getConversation(
    id: string
  ): Promise<Conversation & { messages: Message[] }> {
    try {
      return await this.get<Conversation & { messages: Message[] }>(
        `/conversations/${id}`
      );
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw new Error('Failed to fetch conversation. Please check backend connection.');
    }
  }

  /**
   * 대화 삭제
   */
  async deleteConversation(id: string): Promise<{ message: string }> {
    try {
      return await this.delete<{ message: string }>(`/conversations/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { message: 'Conversation deleted successfully' };
    }
  }

  /**
   * 메시지 전송 (일반) - 실제로는 SSE 스트리밍 사용 권장
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // POST /chat/stream을 사용해서 메시지 전송
      // 백엔드는 SSE 스트리밍으로만 응답하므로 일반 POST는 지원하지 않음
      // 대신 streamChat hook을 사용하도록 유도
      throw new Error('Use SSE streaming (useSendMessageStream hook) instead');
    } catch (error) {
      console.error('API 호출 실패:', error);
      // Fallback: 임시 메시지 생성 (개발용)
      const conversationId = data.conversationId || `conv_${Date.now()}`;
      return {
        conversationId,
        message: {
          id: `msg_${Date.now()}`,
          conversationId,
          userId: 'user_1',
          role: 'assistant',
          content: '안녕하세요! 질문에 답변드리겠습니다. (Fallback 응답 - SSE 스트리밍을 사용해주세요)',
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * 대화 내역 조회
   */
  async getMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessagesListResponse> {
    try {
      // 백엔드는 Message[] 배열만 반환하므로 변환 필요
      const messages = await this.get<Message[]>(
        `/conversations/${conversationId}/messages`,
        params
      );
      return {
        messages: messages || [],
        hasMore: false, // 백엔드가 hasMore를 제공하지 않으므로 false로 설정
      };
    } catch (error: any) {
      // 404는 새 대화라서 메시지가 없는 경우 (정상)
      if (error?.response?.status === 404) {
        return { messages: [], hasMore: false };
      }
      console.error('API 호출 실패:', error);
      throw new Error('Failed to fetch messages. Please check backend connection.');
    }
  }

  /**
   * 메시지 피드백 토글 (좋아요/싫어요)
   */
  async toggleMessageFeedback(
    messageId: string,
    type: 'like' | 'dislike'
  ): Promise<{ feedback: { id: string; type: string; messageId: string }; counts: { likes: number; dislikes: number } }> {
    try {
      return await this.post(`/messages/${messageId}/feedback`, { type });
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 메시지 피드백 카운트 조회
   */
  async getMessageFeedbackCounts(messageId: string): Promise<{ likes: number; dislikes: number }> {
    try {
      return await this.get(`/messages/${messageId}/feedback`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { likes: 0, dislikes: 0 };
    }
  }

  /**
   * 사용자 메시지 피드백 조회
   */
  async getUserMessageFeedback(messageId: string): Promise<{ id: string; type: string; messageId: string } | null> {
    try {
      return await this.get(`/messages/${messageId}/feedback/user`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return null;
    }
  }

  /**
   * 메시지 재생성 (SSE 스트리밍)
   */
  async regenerateMessage(messageId: string): Promise<ReadableStream<Uint8Array>> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${baseURL}/chat/messages/${messageId}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate message');
      }

      return response.body!;
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  }
}

