import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotesListResponse } from '../services/note.service';
import type { Note } from '../types';
import { getCacheConfig } from '../config/cache';

import { noteService } from '../services/note.service';

// Query Keys
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (limit?: number, offset?: number, newsId?: string) =>
    [...noteKeys.lists(), limit, offset, newsId] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

/**
 * 노트 목록 조회
 * @param newsId (optional) 특정 뉴스의 노트만 조회
 */
export function useNotes(limit?: number, offset?: number, newsId?: string) {
  return useQuery<NotesListResponse>({
    queryKey: noteKeys.list(limit, offset, newsId),
    queryFn: () => noteService.getNotes(limit, offset, newsId),
    ...getCacheConfig('learning', 'today'), // 노트는 학습 관련이므로 같은 캐시 전략 사용
  });
}

/**
 * 노트 상세 조회
 */
export function useNote(noteId: string) {
  return useQuery<Note>({
    queryKey: noteKeys.detail(noteId),
    queryFn: () => noteService.getNoteById(noteId),
    enabled: !!noteId,
    ...getCacheConfig('learning', 'today'),
  });
}

/**
 * 노트 생성
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      tags?: string[];
      newsId?: string;
      scrapedContent?: string;
      sourceUrl?: string;
    }) => noteService.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * 노트 수정
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      data,
    }: {
      noteId: string;
      data: { title?: string; content?: string; tags?: string[] };
    }) => noteService.updateNote(noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(variables.noteId) });
    },
  });
}

/**
 * 노트 삭제
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => noteService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

