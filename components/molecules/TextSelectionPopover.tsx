'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/atoms/Button';

export interface TextSelectionPopoverProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
  onNoteCreate?: (text: string) => void;
  onChatAsk?: (text: string) => void;
}

export function TextSelectionPopover({
  selectedText,
  position,
  onClose,
  onNoteCreate,
  onChatAsk,
}: TextSelectionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // 팝오버가 렌더링될 때 로그
  console.log('📌 TextSelectionPopover 렌더링됨');
  console.log('위치:', position);
  console.log('선택된 텍스트:', selectedText);

  useEffect(() => {
    // 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNoteCreate = () => {
    console.log('🎯 TextSelectionPopover: 노트 만들기 버튼 클릭됨');
    console.log('선택된 텍스트:', selectedText);
    onNoteCreate?.(selectedText);
    onClose();
  };

  const handleChatAsk = () => {
    onChatAsk?.(selectedText);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 50}px`, // 선택 영역 위에 표시
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={handleNoteCreate}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        title="노트 만들기"
      >
        <BookOpen size={16} />
        <span>노트 만들기</span>
      </button>
      <button
        onClick={handleChatAsk}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        title="챗봇에 물어보기"
      >
        <MessageSquare size={16} />
        <span>챗봇에 물어보기</span>
      </button>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
        title="닫기"
      >
        <X size={16} />
      </button>
    </div>
  );
}

