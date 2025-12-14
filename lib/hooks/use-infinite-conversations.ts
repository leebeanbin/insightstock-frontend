/**
 * useInfiniteConversations Hook
 * 대화 목록 무한 스크롤 Hook
 */

'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { chatService } from '../services';
import { ConversationsListResponse } from '../types/api/chat.types';
import { conversationKeys } from './use-conversations';
import { getCacheConfig } from '../config/cache';

export interface UseInfiniteConversationsParams {
  limit?: number;
  search?: string;
  category?: string;
}

export function useInfiniteConversations(params?: UseInfiniteConversationsParams) {
  const limit = params?.limit || 20;

  return useInfiniteQuery<ConversationsListResponse, Error, InfiniteData<ConversationsListResponse>, readonly unknown[], number>({
    queryKey: conversationKeys.list(params),
    queryFn: ({ pageParam = 0 }) => {
      return chatService.getConversations({
        ...params,
        limit,
        offset: pageParam * limit,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.conversations)) {
        return undefined;
      }
      const totalLoaded = allPages.reduce((sum, page) => {
        return sum + (page?.conversations?.length || 0);
      }, 0);
      const hasMore = lastPage.total > totalLoaded;
      return hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    ...getCacheConfig('chat', 'conversations'),
  });
}

