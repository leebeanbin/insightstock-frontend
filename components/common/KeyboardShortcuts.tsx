/**
 * KeyboardShortcuts Component
 * 전역 키보드 단축키 컴포넌트
 */

'use client';

import { useEffect, useState } from 'react';
import { useGlobalKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';

export function KeyboardShortcuts() {
  const [mounted, setMounted] = useState(false);
  useGlobalKeyboardShortcuts();

  // SSR 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  // 이벤트 리스너 설정
  useEffect(() => {
    if (!mounted) return;

    // 다크 모드 토글 이벤트 리스너
    const handleToggleTheme = () => {
      // ThemeToggle 버튼 찾기
      const themeToggleButton = document.querySelector<HTMLButtonElement>(
        'button[aria-label*="테마"], button[aria-label*="Theme"], button[aria-label*="다크"], button[aria-label*="Dark"], button[aria-label*="라이트"], button[aria-label*="Light"]'
      );
      if (themeToggleButton) {
        themeToggleButton.click();
      }
    };

    // 새 노트 생성 이벤트 리스너
    const handleCreateNote = () => {
      // 노트 생성 버튼 찾기
      const createNoteButton = document.querySelector<HTMLButtonElement>(
        'button[aria-label*="노트"], button[aria-label*="Note"], button:has-text("새 노트"), button:has-text("Create Note")'
      );
      if (createNoteButton) {
        createNoteButton.click();
      }
    };

    // 새 대화 생성 이벤트 리스너
    const handleCreateChat = () => {
      // 대화 생성 버튼 찾기
      const createChatButton = document.querySelector<HTMLButtonElement>(
        'button:has-text("새 대화"), button:has-text("New Conversation")'
      );
      if (createChatButton) {
        createChatButton.click();
      }
    };

    window.addEventListener('shortcut:toggle-theme', handleToggleTheme);
    window.addEventListener('shortcut:create-note', handleCreateNote);
    window.addEventListener('shortcut:create-chat', handleCreateChat);

    return () => {
      window.removeEventListener('shortcut:toggle-theme', handleToggleTheme);
      window.removeEventListener('shortcut:create-note', handleCreateNote);
      window.removeEventListener('shortcut:create-chat', handleCreateChat);
    };
  }, [mounted]);

  return null; // UI가 없는 컴포넌트
}
