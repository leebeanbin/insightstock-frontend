/**
 * Note Repository
 * 노트 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import type { Note } from '../types';

export interface NoteListResponse {
  notes: Note[];
  total: number;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  newsId?: string;
  scrapedContent?: string;
  sourceUrl?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export class NoteRepository extends BaseRepository<Note> {
  protected basePath = '/notes';

  /**
   * 노트 목록 조회
   * @param newsId (optional) 특정 뉴스의 노트만 조회
   */
  async findMany(params?: {
    limit?: number;
    offset?: number;
    newsId?: string;
  }): Promise<NoteListResponse> {
    try {
      const fullPath = this.getPath('');
      const response = await (await import('../api-client')).default.get(fullPath, { params });

      // 백엔드 응답: { success: true, data: { notes: Note[], total: number }, meta: {...} }
      return {
        notes: response.data.data.notes,
        total: response.data.data.total || response.data.meta?.total || 0,
      };
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  }

  /**
   * 특정 노트 조회
   */
  async findById(noteId: string): Promise<Note> {
    try {
      return await this.get<Note>(`/${noteId}`);
    } catch (error) {
      console.error(`Failed to fetch note ${noteId}:`, error);
      throw error;
    }
  }

  /**
   * 노트 생성
   */
  async create(input: CreateNoteInput): Promise<Note> {
    try {
      return await this.post<Note>('', input);
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  }

  /**
   * 노트 수정
   */
  async update(noteId: string, input: UpdateNoteInput): Promise<Note> {
    try {
      return await this.patch<Note>(`/${noteId}`, input);
    } catch (error) {
      console.error(`Failed to update note ${noteId}:`, error);
      throw error;
    }
  }

  /**
   * 노트 삭제
   */
  async remove(noteId: string): Promise<void> {
    try {
      await this.delete<void>(`/${noteId}`);
    } catch (error) {
      console.error(`Failed to delete note ${noteId}:`, error);
      throw error;
    }
  }
}
