/**
 * useChatbotConsent Hook
 * 챗봇 정보 연결 동의 관리 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';

// Query Keys
export const chatbotConsentKeys = {
  all: ['chatbot-consent'] as const,
  status: () => [...chatbotConsentKeys.all, 'status'] as const,
  suggestedQuestions: () => [...chatbotConsentKeys.all, 'suggested-questions'] as const,
};

/**
 * 정보 연결 동의 상태 조회 Hook
 */
export function useChatbotConsentStatus() {
  return useQuery<{ enabled: boolean }, Error>({
    queryKey: chatbotConsentKeys.status(),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: { enabled: boolean } }>(
        '/chat/context-consent'
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

/**
 * 정보 연결 동의 설정 Hook
 */
export function useSetChatbotConsent() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, boolean>({
    mutationFn: async (enabled: boolean) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/chat/context-consent',
        { enabled }
      );
      return response.data;
    },
    onSuccess: () => {
      // 동의 상태 및 추천 질문 무효화
      queryClient.invalidateQueries({ queryKey: chatbotConsentKeys.status() });
      queryClient.invalidateQueries({ queryKey: chatbotConsentKeys.suggestedQuestions() });
    },
  });
}

/**
 * 추천 질문 조회 Hook
 */
export function useSuggestedQuestions() {
  return useQuery<string[], Error>({
    queryKey: chatbotConsentKeys.suggestedQuestions(),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: string[] }>(
        '/chat/suggested-questions'
      );
      return response.data.data;
    },
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}

