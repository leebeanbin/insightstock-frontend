/**
 * Chat API Types
 * AI 챗봇 관련 타입 정의
 */

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListItem {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  sources?: string[];
}

export interface CreateConversationRequest {
  title?: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface SendMessageResponse {
  conversationId: string;
  message: Message;
}

export interface ConversationsListResponse {
  conversations: ConversationListItem[];
  total: number;
}

export interface MessagesListResponse {
  messages: Message[];
  hasMore: boolean;
}

