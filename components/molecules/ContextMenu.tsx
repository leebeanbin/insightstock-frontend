'use client';

import React, { useEffect, useRef } from 'react';
import { BookOpen, MessageSquare, Copy, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContextMenuProps {
  position: { x: number; y: number };
  selectedText?: string;
  onClose: () => void;
  onNoteCreate?: (text: string) => void;
  onChatAsk?: (text: string) => void;
  onCopy?: (text: string) => void;
}

export function ContextMenu({
  position,
  selectedText,
  onClose,
  onNoteCreate,
  onChatAsk,
  onCopy,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // ESC 키로 닫기
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleNoteCreate = () => {
    if (selectedText) {
      onNoteCreate?.(selectedText);
    }
    onClose();
  };

  const handleChatAsk = () => {
    if (selectedText) {
      onChatAsk?.(selectedText);
    }
    onClose();
  };

  const handleCopy = async () => {
    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
        onCopy?.(selectedText);
      } catch (err: unknown) {
        // 클립보드 복사 실패는 조용히 처리 (사용자에게 큰 문제가 아님)
        const { backendLogger } = await import('@/lib/utils/backend-logger');
        backendLogger.warn('Failed to copy text to clipboard', {
          metadata: { error: err instanceof Error ? err.message : String(err) },
        });
      }
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {selectedText && (
        <>
          <button
            onClick={handleNoteCreate}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <BookOpen size={16} />
            <span>노트 만들기</span>
          </button>
          <button
            onClick={handleChatAsk}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <MessageSquare size={16} />
            <span>챗봇에 물어보기</span>
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Copy size={16} />
            <span>복사</span>
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        </>
      )}
      <button
        onClick={onClose}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <X size={16} />
        <span>닫기</span>
      </button>
    </div>
  );
}

