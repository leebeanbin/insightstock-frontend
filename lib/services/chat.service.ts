/**
 * Chat Service
 * AI 챗봇 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { ChatRepository } from '../repositories/chat.repository';
import {
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  ConversationsListResponse,
  MessagesListResponse,
} from '../types/api/chat.types';

export class ChatService {
  constructor(private repository: ChatRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 대화 생성 (비즈니스 로직 포함)
   */
  async createConversation(
    data: CreateConversationRequest
  ): Promise<Conversation> {
    // 비즈니스 로직: 제목이 없으면 기본값 설정
    const title = data.title || 'New Conversation';
    
    return await this.repository.createConversation({ title });
  }

  /**
   * 대화 목록 조회 (비즈니스 로직: 정렬, 필터링 등)
   */
  async getConversations(
    params?: { limit?: number; offset?: number; search?: string; category?: string }
  ): Promise<ConversationsListResponse> {
    // 비즈니스 로직: 기본값 설정
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;

    return await this.repository.getConversations({ limit, offset, search: params?.search, category: params?.category });
  }

  /**
   * 대화 상세 조회
   */
  async getConversation(
    id: string
  ): Promise<Conversation & { messages: Message[] }> {
    // 비즈니스 로직: 유효성 검증 등
    if (!id) {
      throw new Error('Conversation ID is required');
    }

    return await this.repository.getConversation(id);
  }

  /**
   * 대화 삭제
   */
  async deleteConversation(id: string): Promise<{ message: string }> {
    // 비즈니스 로직: 권한 확인 등
    if (!id) {
      throw new Error('Conversation ID is required');
    }

    return await this.repository.deleteConversation(id);
  }

  /**
   * 메시지 전송 (비즈니스 로직: 대화 생성 또는 기존 대화 사용)
   */
  async sendMessage(
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    // 비즈니스 로직: 메시지 유효성 검증
    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    // 대화 ID가 없으면 새 대화 생성
    if (!data.conversationId) {
      const conversation = await this.createConversation({
        title: data.message.substring(0, 50), // 첫 50자로 제목 생성
      });
      data.conversationId = conversation.id;
    }

    return await this.repository.sendMessage(data);
  }

  /**
   * 대화 내역 조회
   */
  async getMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessagesListResponse> {
    // 비즈니스 로직: 기본값 설정
    const limit = params?.limit || 50;

    return await this.repository.getMessages(conversationId, { limit, before: params?.before });
  }

  /**
   * 메시지 피드백 토글
   */
  async toggleMessageFeedback(
    messageId: string,
    type: 'like' | 'dislike'
  ): Promise<{ feedback: { id: string; type: string; messageId: string }; counts: { likes: number; dislikes: number } }> {
    if (!messageId) {
      throw new Error('Message ID is required');
    }

    return await this.repository.toggleMessageFeedback(messageId, type);
  }

  /**
   * 메시지 피드백 카운트 조회
   */
  async getMessageFeedbackCounts(messageId: string): Promise<{ likes: number; dislikes: number }> {
    if (!messageId) {
      throw new Error('Message ID is required');
    }

    return await this.repository.getMessageFeedbackCounts(messageId);
  }

  /**
   * 사용자 메시지 피드백 조회
   */
  async getUserMessageFeedback(messageId: string): Promise<{ id: string; type: string; messageId: string } | null> {
    if (!messageId) {
      throw new Error('Message ID is required');
    }

    return await this.repository.getUserMessageFeedback(messageId);
  }

  /**
   * 메시지 재생성 (SSE 스트리밍)
   */
  async regenerateMessage(messageId: string): Promise<ReadableStream<Uint8Array>> {
    if (!messageId) {
      throw new Error('Message ID is required');
    }

    return await this.repository.regenerateMessage(messageId);
  }
}

