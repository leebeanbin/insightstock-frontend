/**
 * useConversations Hook
 * 대화 목록 관리 (Controller Layer 역할)
 * React Query를 사용한 데이터 페칭 및 캐싱
 * SOLID: Single Responsibility Principle
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services';
import {
  Conversation,
  CreateConversationRequest,
  ConversationsListResponse,
} from '../types/api/chat.types';
import { getCacheConfig } from '../config/cache';

// Query Keys (중앙 관리)
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number; search?: string; category?: string }) =>
    [...conversationKeys.lists(), params] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

/**
 * 대화 목록 조회 Hook
 */
export function useConversations(params?: { limit?: number; offset?: number; search?: string; category?: string }) {
  return useQuery<ConversationsListResponse, Error>({
    queryKey: conversationKeys.list(params),
    queryFn: () => chatService.getConversations(params),
    ...getCacheConfig('chat', 'conversations'),
  });
}

/**
 * 대화 생성 Hook
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationRequest>({
    mutationFn: (data) => chatService.createConversation(data),
    onSuccess: () => {
      // 대화 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

/**
 * 대화 삭제 Hook
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => chatService.deleteConversation(id),
    onSuccess: () => {
      // 대화 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.details() });
    },
  });
}

