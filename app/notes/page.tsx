'use client';

import React, { useState, Suspense } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { Plus, BookOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotes } from '@/lib/hooks/use-notes';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { NoteModal } from '@/components/education/NoteModal';
import Input from '@/components/atoms/Input';

function NotesPageContent() {
  const { t } = useLanguage();
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: notesData, isLoading } = useNotes();

  // HTML과 마크다운을 제거하고 순수 텍스트만 추출
  const stripHtmlAndMarkdown = (html: string): string => {
    const withoutHtml = html.replace(/<[^>]*>/g, '');
    const withoutMarkdown = withoutHtml
      .replace(/[#*`_~\[\]]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();
    return withoutMarkdown;
  };

  // 검색 필터링
  const filteredNotes = notesData?.notes?.filter(note => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      stripHtmlAndMarkdown(note.content).toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }) || [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* 상단 바 */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">내 노트</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  학습 내용을 정리하고 관리하세요
                </p>
              </div>
              <Button
                variant="primary"
                size="medium"
                icon={Plus}
                onClick={() => setIsCreatingNote(true)}
              >
                새 노트
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
          <div className="max-w-7xl mx-auto">
            {/* 검색 바 */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  placeholder="노트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-5/6" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={cn(
                      'bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800',
                      'transition-all duration-200 cursor-pointer text-left',
                      'hover:border-[#4E56C0] dark:hover:border-[#9b5DE0]',
                      'hover:shadow-lg hover:-translate-y-0.5',
                      'active:translate-y-0'
                    )}
                  >
                    <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      <BookOpen size={32} strokeWidth={1.5} className="text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                      {stripHtmlAndMarkdown(note.content).substring(0, 100)}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="primary" size="small">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-16 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {searchQuery ? '검색 결과가 없습니다' : '노트가 없습니다'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                  {searchQuery ? '다른 키워드로 검색해보세요' : '학습한 내용을 노트로 정리해보세요'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    size="medium"
                    icon={Plus}
                    onClick={() => setIsCreatingNote(true)}
                  >
                    새 노트 작성
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 노트 모달 - 새 노트 */}
      {isCreatingNote && (
        <NoteModal
          isOpen={isCreatingNote}
          onClose={() => setIsCreatingNote(false)}
          note={null}
        />
      )}

      {/* 노트 모달 - 기존 노트 */}
      {selectedNoteId && notesData && (
        <NoteModal
          isOpen={!!selectedNoteId}
          onClose={() => setSelectedNoteId(null)}
          note={notesData.notes.find(n => n.id === selectedNoteId) || null}
          onDelete={() => setSelectedNoteId(null)}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4E56C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <NotesPageContent />
    </Suspense>
  );
}
