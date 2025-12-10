'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/use-notes';
import { NewsDetailResponse } from '@/lib/types/api/news.types';
import { Note } from '@/lib/types';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { NoteModal } from '@/components/education/NoteModal';
import { TextSelectionPopover } from '@/components/molecules/TextSelectionPopover';
import { ContextMenu } from '@/components/molecules/ContextMenu';
import { Sparkles, BookOpen, Plus, Edit3, Calendar, Tag } from 'lucide-react';
import SentimentBadge from '@/components/atoms/SentimentBadge';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface NewsWithNotesProps {
  news: NewsDetailResponse;
}

/**
 * Kindle 스타일 뉴스 상세 + 노트 분할 뷰
 * Left: 뉴스 콘텐츠
 * Right: 해당 뉴스의 노트 목록
 */
export function NewsWithNotes({ news }: NewsWithNotesProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 텍스트 선택 관련 상태
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [noteSelectedText, setNoteSelectedText] = useState<string>(''); // 노트 생성 시 전달할 선택 텍스트
  // 하이라이트 정보를 하나의 객체로 관리
  const [highlightInfo, setHighlightInfo] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // HTML과 마크다운을 제거하고 순수 텍스트만 추출하는 함수
  const stripHtmlAndMarkdown = (html: string): string => {
    // HTML 태그 제거
    const withoutHtml = html.replace(/<[^>]*>/g, '');
    // 마크다운 문법 제거 (#, *, `, [], etc.)
    const withoutMarkdown = withoutHtml
      .replace(/[#*`_~\[\]]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지
      .replace(/\[.*?\]\(.*?\)/g, '') // 링크
      .trim();
    return withoutMarkdown;
  };

  // 하이라이팅된 콘텐츠를 렌더링하는 함수
  const renderHighlightedContent = (content: string, notes: Note[] | undefined) => {
    console.log('=== renderHighlightedContent 호출 ===');
    console.log('notes:', notes);
    console.log('content length:', content.length);

    if (!notes || notes.length === 0) {
      console.log('노트가 없음');
      return content;
    }

    // 각 노트의 하이라이트 정보 상세 출력
    notes.forEach((note, idx) => {
      console.log(`Note ${idx}:`, {
        id: note.id,
        title: note.title,
        highlightStart: note.highlightStart,
        highlightEnd: note.highlightEnd,
      });
    });

    // 하이라이트 정보 수집 (highlightStart와 highlightEnd가 있는 노트만)
    const highlights = notes
      .filter(note =>
        note.highlightStart !== undefined &&
        note.highlightEnd !== undefined &&
        note.highlightStart >= 0 &&
        note.highlightEnd > note.highlightStart
      )
      .map(note => ({
        start: note.highlightStart!,
        end: note.highlightEnd!,
        noteId: note.id,
      }))
      .sort((a, b) => a.start - b.start); // 시작 위치 기준 정렬

    console.log('highlights:', highlights);

    if (highlights.length === 0) {
      console.log('하이라이트 정보가 없는 노트들');
      return content;
    }

    // 텍스트를 조각으로 나누어 하이라이트 적용
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let partIndex = 0;

    highlights.forEach((highlight) => {
      // 하이라이트 이전의 일반 텍스트 (줄바꿈 처리)
      if (highlight.start > lastIndex) {
        const textBefore = content.substring(lastIndex, highlight.start);
        const lines = textBefore.split('\n');
        lines.forEach((line, lineIdx) => {
          parts.push(
            <React.Fragment key={`text-${partIndex}-${lineIdx}`}>
              {line}
              {lineIdx < lines.length - 1 && <br />}
            </React.Fragment>
          );
        });
        partIndex++;
      }

      // 하이라이트된 텍스트 (줄바꿈 처리)
      const highlightedText = content.substring(highlight.start, highlight.end);
      const highlightLines = highlightedText.split('\n');

      parts.push(
        <mark
          key={`highlight-${highlight.noteId}`}
          className="bg-yellow-200 dark:bg-yellow-900/40 px-1 py-0.5 rounded cursor-pointer transition-colors hover:bg-yellow-300 dark:hover:bg-yellow-900/60"
          data-note-id={highlight.noteId}
          onClick={() => {
            // 하이라이트 클릭 시 해당 노트 열기
            const note = notes.find(n => n.id === highlight.noteId);
            if (note) {
              setSelectedNote(note);
              setShowNoteModal(true);
            }
          }}
        >
          {highlightLines.map((line, lineIdx) => (
            <React.Fragment key={`hl-line-${lineIdx}`}>
              {line}
              {lineIdx < highlightLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </mark>
      );

      lastIndex = Math.max(lastIndex, highlight.end);
      partIndex++;
    });

    // 마지막 하이라이트 이후의 텍스트 (줄바꿈 처리)
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      const lines = textAfter.split('\n');
      lines.forEach((line, lineIdx) => {
        parts.push(
          <React.Fragment key={`text-end-${lineIdx}`}>
            {line}
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      });
    }

    return <>{parts}</>;
  };

  // 이 뉴스의 노트 목록 가져오기
  const { data: notesData, isLoading: notesLoading, error: notesError } = useNotes(
    undefined,
    undefined,
    news.id
  );

  // 텍스트 선택 핸들러
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setSelectedText('');
        setSelectionPosition(null);
        return;
      }

      const selectedText = selection.toString().trim();
      if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(selectedText);
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      } else {
        setSelectedText('');
        setSelectionPosition(null);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleClick = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim().length === 0) {
          setSelectedText('');
          setSelectionPosition(null);
          setContextMenuPosition(null);
        }
      }, 100);
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('mouseup', handleTextSelection);
      contentRef.current.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', handleClick);
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('mouseup', handleTextSelection);
        contentRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('click', handleClick);
    };
  }, [news]);

  const handleNoteCreate = (text: string) => {
    // 선택한 텍스트의 오프셋 계산
    const start = news.content.indexOf(text);
    const end = start !== -1 ? start + text.length : -1;

    console.log('=== handleNoteCreate ===');
    console.log('선택한 텍스트:', text);
    console.log('뉴스 콘텐츠:', news.content);
    console.log('계산된 start:', start);
    console.log('계산된 end:', end);

    // 하이라이트 정보를 객체로 설정 (한 번에)
    if (start !== -1 && end > start) {
      setHighlightInfo({ start, end });
      console.log('✅ highlightInfo 설정:', { start, end });
    } else {
      setHighlightInfo(null);
      console.log('⚠️ 하이라이트 정보 없음 (텍스트를 찾을 수 없음)');
    }

    // 모달 열기
    setSelectedNote(null);
    setNoteSelectedText(text);
    setShowNoteModal(true);

    // 선택 해제
    setSelectedText('');
    setSelectionPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleChatAsk = (text: string) => {
    router.push(`/chat?question=${encodeURIComponent(text)}`);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setHighlightInfo(null); // 일반 노트 생성 시에는 하이라이트 없음
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setHighlightInfo(null); // 기존 노트 수정 시에는 하이라이트 없음
    setShowNoteModal(true);
  };

  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedNote(null);
  };

  // 스크롤 인디케이터 상태
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 가능 여부 확인
  useEffect(() => {
    const checkScrollable = () => {
      if (contentScrollRef.current) {
        const { scrollHeight, clientHeight } = contentScrollRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [news.content]);

  // 스크롤 인디케이터 자동 숨김
  useEffect(() => {
    const handleScroll = () => {
      if (contentScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentScrollRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
        setShowScrollIndicator(!isNearBottom);
      }
    };

    const scrollElement = contentScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [news.content]);

  // 텍스트 영역에서 스크롤 휠 이벤트를 전체 콘텐츠 영역으로 전달
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 텍스트 영역 내에서 스크롤 휠 이벤트가 발생했을 때
      if (contentRef.current && contentRef.current.contains(e.target as Node)) {
        // 전체 콘텐츠 영역이 스크롤 가능한 경우
        if (contentScrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentScrollRef.current;
          const canScrollDown = scrollTop < scrollHeight - clientHeight;
          const canScrollUp = scrollTop > 0;

          // 스크롤이 가능한 방향이면 기본 동작을 막고 전체 영역을 스크롤
          if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
            e.preventDefault();
            contentScrollRef.current.scrollBy({
              top: e.deltaY,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    const textElement = contentRef.current;
    if (textElement) {
      textElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => textElement.removeEventListener('wheel', handleWheel);
    }
  }, [news.content]);

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Left Panel - News Content */}
      <div ref={contentScrollRef} className="flex-[3] overflow-y-auto pr-4 space-y-6 relative scroll-smooth">
        {/* News Header */}
        <Card variant="default" className="p-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {news.title || t('news.noTitle')}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              {news.source && (
                <>
                  <span className="font-medium">{news.source}</span>
                  <span>·</span>
                </>
              )}
              <span>{formatRelativeTime(news.publishedAt)}</span>
              {news.aiAnalysis?.sentiment && (
                <>
                  <span>·</span>
                  <SentimentBadge sentiment={news.aiAnalysis.sentiment} />
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Summary */}
        {news.summary && (
          <Card
            variant="default"
            className="p-6 bg-primary-50 dark:bg-gray-800 border-primary-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-primary-900 dark:text-gray-100 mb-2">
                  {t('news.aiSummary')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {news.summary}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Thumbnail Image */}
        {news.thumbnailUrl && (
          <Card variant="default" className="p-0 overflow-hidden mb-6">
            <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={news.thumbnailUrl}
                alt={news.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 숨김
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </Card>
        )}

        {/* Content */}
        {news.content ? (
          <Card variant="default" className="p-8 relative">
            <div
              ref={contentRef}
              className="prose max-w-none select-text news-content-selectable"
              style={{
                // 텍스트 영역 자체는 스크롤 불가능하게 설정
                overflow: 'visible',
                // 마우스 휠 이벤트를 전체 영역으로 전달하기 위한 스타일
                pointerEvents: 'auto'
              }}
            >
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {renderHighlightedContent(news.content, notesData?.notes)}
              </div>
            </div>
            <style jsx>{`
              .news-content-selectable::selection {
                background-color: rgba(254, 240, 138, 0.5);
                color: inherit;
              }
              .news-content-selectable ::-moz-selection {
                background-color: rgba(254, 240, 138, 0.5);
                color: inherit;
              }
            `}</style>
            {/* 스크롤 인디케이터 - 하단에 표시 */}
            {showScrollIndicator && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10 pointer-events-none">
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium bg-white/80 dark:bg-gray-900/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  아래로 스크롤하여 더 보기
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </Card>
        ) : (
          <Card variant="default" className="p-8">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">콘텐츠가 없습니다</p>
            </div>
          </Card>
        )}

        {/* AI Analysis */}
        {news.aiAnalysis && (
          <Card variant="default" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('news.aiAnalysis')}
              </h3>
            </div>

            <div className="space-y-6">
              {/* Key Points */}
              {news.aiAnalysis.keyPoints && news.aiAnalysis.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {t('news.keyIssues')}
                  </h4>
                  <ul className="space-y-2">
                    {news.aiAnalysis.keyPoints.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 mt-2 shrink-0" />
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Concepts */}
              {news.aiAnalysis.relatedConcepts &&
                news.aiAnalysis.relatedConcepts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {t('news.relatedConcepts')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {news.aiAnalysis.relatedConcepts.map((concept) => (
                        <Badge key={concept} variant="primary" dot>
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </Card>
        )}
      </div>

      {/* Right Panel - Notes */}
      <div className="flex-[2] overflow-y-auto space-y-4 border-l border-gray-200 dark:border-gray-700 pl-4">
        {/* Notes Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 pb-4 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('education.myNotes')}
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('news.notesCount', { count: String(notesData?.total || 0) })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {t('news.dragToCreateNote')}
          </p>
        </div>

        {/* Notes List */}
        {notesLoading && (
          <div className="flex justify-center py-12">
            <LoadingState message="노트 불러오는 중..." />
          </div>
        )}

        {notesError && (
          <ErrorState
            message={notesError.message}
            onRetry={() => window.location.reload()}
          />
        )}

        {!notesLoading && !notesError && (
          <>
            {notesData?.notes && notesData.notes.length > 0 ? (
              <div className="space-y-3">
                {notesData.notes.map((note) => (
                  <Card
                    key={note.id}
                    variant="default"
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600',
                      'group'
                    )}
                    onClick={() => handleEditNote(note)}
                  >
                    <div className="space-y-3">
                      {/* Note Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                          {note.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      {/* Note Content Preview */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {stripHtmlAndMarkdown(note.content)}
                      </p>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag size={14} className="text-gray-400" />
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="default">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Note Footer */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Calendar size={12} />
                        <span>{formatRelativeTime(note.updatedAt)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="default" className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <BookOpen size={32} className="text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {t('news.noNotesYet')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('news.dragToCreateNoteDesc')}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* 텍스트 선택 팝오버 */}
      {selectedText && selectionPosition && (
        <TextSelectionPopover
          selectedText={selectedText}
          position={selectionPosition}
          onClose={() => {
            setSelectedText('');
            setSelectionPosition(null);
            window.getSelection()?.removeAllRanges();
          }}
          onNoteCreate={handleNoteCreate}
          onChatAsk={handleChatAsk}
        />
      )}

      {/* 컨텍스트 메뉴 */}
      {contextMenuPosition && selectedText && (
        <ContextMenu
          position={contextMenuPosition}
          selectedText={selectedText}
          onClose={() => {
            setContextMenuPosition(null);
            setSelectedText('');
          }}
          onNoteCreate={handleNoteCreate}
          onChatAsk={handleChatAsk}
        />
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={showNoteModal}
        onClose={() => {
          handleCloseModal();
          setNoteSelectedText(''); // 모달 닫을 때 선택 텍스트 초기화
          setHighlightInfo(null); // 하이라이트 정보 초기화
        }}
        note={selectedNote}
        newsId={news.id}
        newsTitle={news.title}
        newsContent={news.content}
        newsUrl={news.url}
        selectedText={noteSelectedText} // 선택한 텍스트 전달
        highlightStart={highlightInfo?.start} // 하이라이팅 시작 오프셋
        highlightEnd={highlightInfo?.end} // 하이라이팅 끝 오프셋
      />
    </div>
  );
}
