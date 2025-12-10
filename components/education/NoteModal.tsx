'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note } from '@/lib/types';
import { useUpdateNote, useCreateNote, useDeleteNote } from '@/lib/hooks/use-notes';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

// Notion 에디터 동적 import (SSR 방지)
const NotionEditor = dynamic(
  () => import('./NotionEditor'),
  { ssr: false }
);

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onDelete?: () => void;
  newsId?: string;
  newsTitle?: string;
  newsContent?: string;
  newsUrl?: string;
  selectedText?: string; // 드래그(선택)한 텍스트
  highlightStart?: number; // 하이라이팅 시작 오프셋
  highlightEnd?: number; // 하이라이팅 끝 오프셋
  embedded?: boolean; // 분할 레이아웃 모드
}

export function NoteModal({
  isOpen,
  onClose,
  note,
  onDelete,
  newsId,
  newsTitle,
  newsContent,
  newsUrl,
  selectedText,
  highlightStart,
  highlightEnd,
  embedded = false,
}: NoteModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  useEffect(() => {
    // 모달이 열릴 때만 초기화 (중복 실행 방지)
    if (!isOpen) return;
    
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else if (newsTitle) {
      // 뉴스 스크랩 모드
      setTitle(newsTitle);
      
      // 선택한 텍스트가 있으면 하이라이팅하여 표시
      if (selectedText && selectedText.trim()) {
        // HTML 이스케이프 함수
        const escapeHtml = (text: string) => {
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        };
        
        const escapedSelectedText = escapeHtml(selectedText);
        const escapedNewsContent = newsContent ? escapeHtml(newsContent) : '';
        const escapedNewsTitle = escapeHtml(newsTitle);
        const escapedNewsUrl = newsUrl ? escapeHtml(newsUrl) : '';
        
        // TipTap Highlight extension이 <mark> 태그를 지원하므로 HTML 형식으로 하이라이팅된 텍스트 생성
        setContent(
          `<h3>${escapedNewsTitle}</h3>` +
          `<blockquote>` +
          `<p><mark data-color="#fef08a" style="background: rgb(254 240 138); padding: 0.125rem 0.25rem; border-radius: 0.25rem;">${escapedSelectedText}</mark></p>` +
          `</blockquote>`
        );
      } else {
        // 선택한 텍스트가 없으면 전체 뉴스 내용 표시
        setContent(
          newsContent
            ? `## ${newsTitle}\n\n${newsContent}\n\n${newsUrl ? `[원문 보기](${newsUrl})` : ''}`
            : `## ${newsTitle}\n\n${newsUrl ? `[원문 보기](${newsUrl})` : ''}`
        );
      }
      setTags(['뉴스', '스크랩']);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [isOpen, note, newsTitle, newsContent, newsUrl, selectedText]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    // 새 노트 생성 (뉴스 스크랩 또는 일반 생성)
    if (!note) {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        tags,
        newsId: newsId,
        scrapedContent: selectedText || newsContent, // 선택한 텍스트 또는 전체 내용
        sourceUrl: newsUrl,
        highlightStart: highlightStart,  // props에서 직접 참조
        highlightEnd: highlightEnd,      // props에서 직접 참조
      };

      console.log('=== NoteModal.handleSave 전체 디버깅 ===');
      console.log('1. Props 값:');
      console.log('   - highlightStart prop:', highlightStart);
      console.log('   - highlightEnd prop:', highlightEnd);
      console.log('   - selectedText prop:', selectedText);
      console.log('   - newsId prop:', newsId);
      console.log('2. noteData 객체:', JSON.stringify(noteData, null, 2));
      console.log('3. typeof highlightStart:', typeof highlightStart);
      console.log('4. typeof highlightEnd:', typeof highlightEnd);

      // 백엔드로 전송하기 전 마지막 확인
      console.log('5. 백엔드로 전송될 실제 데이터:');
      console.table({
        title: noteData.title,
        tags: noteData.tags?.join(', '),
        newsId: noteData.newsId,
        highlightStart: noteData.highlightStart,
        highlightEnd: noteData.highlightEnd,
      });

      createNote(
        noteData,
        {
          onSuccess: () => {
            toast.success(t('education.noteCreated'));
            onClose();
          },
          onError: async (error: unknown) => {
            // 공통 에러 핸들러 사용
            const { handleMutationError } = await import('@/lib/utils/error-handler');
            handleMutationError(
              error,
              'Failed to create note',
              t('common.error')
            );
          },
        }
      );
      return;
    }

    // 기존 노트 수정
    updateNote(
      {
        noteId: note.id,
        data: { title: title.trim(), content: content.trim(), tags },
      },
      {
        onSuccess: () => {
          toast.success(t('common.save'));
          onClose();
        },
        onError: async (error: unknown) => {
          // 공통 에러 핸들러 사용
          const { handleMutationError } = await import('@/lib/utils/error-handler');
          handleMutationError(
            error,
            'Failed to update note',
            t('common.error')
          );
        },
      }
    );
  };

  const handleDelete = () => {
    if (!note) return;

    if (confirm(t('education.deleteNoteConfirm'))) {
      deleteNote(note.id, {
        onSuccess: () => {
          onClose();
          onDelete?.();
        },
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 뉴스 스크랩 모드일 때는 note가 없어도 표시
  if (!isOpen || (!note && !newsTitle && !embedded)) return null;

  const modalContent = (
    <div className={cn(
      embedded ? 'h-full flex flex-col' : 'relative w-full max-w-5xl',
      embedded ? '' : 'max-h-[92vh]',
      'bg-white dark:bg-gray-900',
      'rounded-2xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]',
      'flex flex-col overflow-hidden',
      'border border-gray-200/60 dark:border-gray-700/50',
      embedded ? '' : 'animate-in fade-in zoom-in-95 duration-300'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-8 py-5',
        'border-b border-gray-200/60 dark:border-gray-700/50',
        'bg-white dark:bg-gray-900'
      )}>
        <div className="flex items-center gap-4">
          <div className="relative p-2.5 bg-primary-500 dark:bg-primary-400 rounded-xl shadow-lg shadow-primary-500/25">
            <BookOpen size={22} className="text-white dark:text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {note ? t('education.editNote') : newsTitle ? t('education.scrapNews') : t('education.createNote')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {note ? 'Update your thoughts and insights' : 'Capture your knowledge'}
            </p>
          </div>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all hover:scale-105 active:scale-95"
            aria-label={t('aria.close')}
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              {t('education.noteTitle')}
              <span className="text-xs font-normal text-gray-400">Required</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('education.notePlaceholder')}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            />
          </div>

          {/* Content - Notion 에디터 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              {t('education.noteContent')}
              <span className="text-xs font-normal text-gray-400">Required</span>
            </label>
            <NotionEditor
              initialValue={content}
              onChange={(value) => setContent(value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('education.noteTags')}
              <span className="text-xs font-normal text-gray-400 ml-2">Optional</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t('education.tagPlaceholder')}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold border border-primary-200 dark:border-primary-700/50 hover:shadow-md transition-all duration-200"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-700/50 text-primary-600 dark:text-primary-400 transition-all duration-200 hover:scale-110 active:scale-90"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-200/60 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        {note ? (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <Trash2 size={18} />
            {t('common.delete')}
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || isUpdating || isCreating}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/40 active:scale-95"
          >
            <Save size={18} />
            {isCreating ? t('common.adding') : note ? t('common.save') : t('education.createNote')}
          </button>
        </div>
      </div>
    </div>
  );

  // 분할 레이아웃 모드
  if (embedded) {
    return modalContent;
  }

  // 일반 모달 모드
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      {modalContent}
    </div>
  );
}

