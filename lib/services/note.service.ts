/**
 * Note Service
 * 노트 비즈니스 로직 계층 (Service Layer)
 * SOLID: Dependency Inversion Principle
 */

import { NoteRepository } from '../repositories/note.repository';
import type { Note } from '../types';

export interface NotesListResponse {
  notes: Note[];
  total: number;
}

export class NoteService {
  constructor(private readonly repository: NoteRepository) {}

  /**
   * 노트 목록 조회
   * @param newsId (optional) 특정 뉴스의 노트만 조회
   */
  async getNotes(limit?: number, offset?: number, newsId?: string): Promise<NotesListResponse> {
    return await this.repository.findMany({ limit, offset, newsId });
  }

  /**
   * 노트 상세 조회
   */
  async getNoteById(noteId: string): Promise<Note> {
    return await this.repository.findById(noteId);
  }

  /**
   * 노트 생성
   */
  async createNote(data: {
    title: string;
    content: string;
    tags?: string[];
    newsId?: string;
    scrapedContent?: string;
    sourceUrl?: string;
  }): Promise<Note> {
    return await this.repository.create(data);
  }

  /**
   * 노트 수정
   */
  async updateNote(noteId: string, data: { title?: string; content?: string; tags?: string[] }): Promise<Note> {
    return await this.repository.update(noteId, data);
  }

  /**
   * 노트 삭제
   */
  async deleteNote(noteId: string): Promise<void> {
    return await this.repository.remove(noteId);
  }
}

// Singleton instance
const noteRepository = new NoteRepository();
export const noteService = new NoteService(noteRepository);
