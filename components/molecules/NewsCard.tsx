'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Card from './Card';
import Badge from '../atoms/Badge';
import { formatRelativeTime } from '@/lib/formatters';
import { News } from '@/lib/types';
import { useToggleNewsLike, useToggleNewsFavorite, useLikedNews, useFavoriteNews } from '@/lib/hooks/use-user-activity';
import { useNotes } from '@/lib/hooks/use-notes';
import { Heart, Star, BookOpen, FileCheck } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { spacing, typography, borderRadius, sizes } from '@/lib/design-tokens';
import Tooltip from '@/components/atoms/Tooltip';
import { TextSelectionPopover } from './TextSelectionPopover';
import { ContextMenu } from './ContextMenu';

export interface NewsCardProps {
  news: News;
  onClick?: () => void;
  className?: string;
}

const NewsCard = ({ news, onClick, className }: NewsCardProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { mutate: toggleLike, isPending: isLiking } = useToggleNewsLike();
  const { mutate: toggleFavorite, isPending: isFavoriting } = useToggleNewsFavorite();
  const { data: likedNews = [] } = useLikedNews();
  const { data: favoriteNews = [] } = useFavoriteNews();
  const { data: notesData } = useNotes();

  const isLiked = Array.isArray(likedNews) && likedNews.includes(news.id);
  const isFavorite = Array.isArray(favoriteNews) && favoriteNews.includes(news.id);

  // 이 뉴스에 연결된 노트 개수 확인
  const notesCount = notesData?.notes?.filter(note => note.newsId === news.id).length || 0;
  const hasNotes = notesCount > 0;
  
  // 텍스트 선택 관련 상태
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(news.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(news.id);
  };

  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 노트 페이지로 이동하여 분할 레이아웃으로 노트 생성
    router.push(`/education?newsId=${news.id}&tab=notes`);
  };

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
      // 외부 클릭 시 선택 해제
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim().length === 0) {
          setSelectedText('');
          setSelectionPosition(null);
          setContextMenuPosition(null);
        }
      }, 100);
    };

    if (cardRef.current) {
      cardRef.current.addEventListener('mouseup', handleTextSelection);
      cardRef.current.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', handleClick);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mouseup', handleTextSelection);
        cardRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleNoteCreate = (text: string) => {
    // 선택한 텍스트와 함께 노트 생성
    router.push(`/education?newsId=${news.id}&tab=notes&selectedText=${encodeURIComponent(text)}`);
  };

  const handleChatAsk = (text: string) => {
    // 선택한 텍스트와 함께 챗봇 열기
    // TODO: 챗봇 플로팅 버튼에 메시지 전달
    router.push(`/chat?question=${encodeURIComponent(text)}`);
  };

  return (
    <>
      <div ref={cardRef} className="w-full h-full">
        <Card
          variant="default"
          onClick={onClick}
          className={cn(
            'w-full h-full overflow-hidden flex flex-col relative',
            'hover:border-[var(--brand-light-purple)] transition-all duration-200',
            'hover:scale-[0.98] active:scale-[0.96]',
            'hover:shadow-md active:shadow-sm',
            'select-text', // 텍스트 선택 가능하도록
            className
          )}
        >
      {/* Thumbnail */}
      <div className={`relative w-full h-[200px] bg-gray-100 rounded-t-[${borderRadius.xl}] overflow-hidden mb-[var(--spacing-4)] group`}>
        {news.thumbnailUrl ? (
          <img
            src={news.thumbnailUrl}
            alt={news.title}
            className="w-full h-full object-cover rounded-t-[var(--radius-xl)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-[var(--radius-xl)]">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-400"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
        
        {/* Action Buttons - 툴팁 추가 */}
        <div className={`absolute top-[var(--spacing-2)] right-[var(--spacing-2)] flex gap-[var(--spacing-2)] opacity-0 group-hover:opacity-100 transition-opacity`}>
          <Tooltip content={t('education.createNoteFromNews')} position="left">
            <button
              onClick={handleNoteClick}
              className={cn(
                `p-[var(--spacing-2)] rounded-full bg-white/90 backdrop-blur-sm shadow-sm`,
                'hover:bg-white transition-colors'
              )}
            >
              <BookOpen
                size={sizes.icon.px.md}
                className="text-gray-600"
              />
            </button>
          </Tooltip>
          <Tooltip content={isLiked ? t('news.unlike') : t('news.like')} position="left">
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className={cn(
                `p-[var(--spacing-2)] rounded-full bg-white/90 backdrop-blur-sm shadow-sm`,
                'hover:bg-white transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isLiked && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20'
              )}
            >
              <Heart
                size={sizes.icon.px.md}
                className={cn(
                  isLiked ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : 'text-gray-600'
                )}
              />
            </button>
          </Tooltip>
          <Tooltip content={isFavorite ? t('favorites.removeFavorite') : t('favorites.addFavorite')} position="left">
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              className={cn(
                `p-[var(--spacing-2)] rounded-full bg-white/90 backdrop-blur-sm shadow-sm`,
                'hover:bg-white transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isFavorite && 'bg-[var(--brand-light-purple)]/20 dark:bg-[var(--brand-purple)]/20'
              )}
            >
              <Star
                size={16}
                className={cn(
                  isFavorite ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]' : 'text-gray-600'
                )}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col space-y-2">
        {/* Title with Note Badge */}
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-lg font-semibold text-gray-900 line-clamp-2 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)] transition-colors cursor-pointer leading-snug">
            {news.title}
          </h3>
          {hasNotes && (
            <Tooltip content={`${notesCount}개의 노트`} position="left">
              <div className="flex-shrink-0">
                <Badge variant="primary" size="small">
                  <FileCheck size={12} className="mr-1" />
                  {notesCount}
                </Badge>
              </div>
            </Tooltip>
          )}
        </div>

        {/* Summary */}
        {news.summary && (
          <p className={`text-[var(--font-size-sm)] text-gray-700 line-clamp-1 flex-shrink-0`}>
            {news.summary}
          </p>
        )}

        {/* Meta */}
        <div className={`flex items-center gap-[var(--spacing-2)] text-[var(--font-size-xs)] text-gray-600 flex-shrink-0`}>
          <span>{news.source}</span>
          <span className={`w-[var(--spacing-1)] h-[var(--spacing-1)] rounded-full bg-gray-400`} />
          <span>{formatRelativeTime(news.publishedAt)}</span>
        </div>

        {/* Tags */}
        {news.stockIds && news.stockIds.length > 0 && (
          <div className={`flex flex-wrap gap-[var(--spacing-2)] pt-[var(--spacing-2)] mt-auto`}>
            {news.stockIds.slice(0, 3).map((stockId) => (
              <Badge key={stockId} variant="primary" dot>
                {stockId}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
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
    {contextMenuPosition && (
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
    </>
  );
};

export default NewsCard;

