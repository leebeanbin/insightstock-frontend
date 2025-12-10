/**
 * useKeyboardShortcuts Hook
 * 키보드 단축키 관리 Hook
 */

'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (e: KeyboardEvent) => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      shortcuts.forEach((shortcut) => {
        const { key, ctrl, meta, shift, alt, handler } = shortcut;

        // 키 매칭
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();

        // Modifier 키 매칭
        const ctrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey;
        const metaMatch = meta ? e.metaKey : !e.metaKey;
        const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
        const altMatch = alt ? e.altKey : !e.altKey;

        // Ctrl 또는 Meta 중 하나만 체크 (플랫폼 호환성)
        const modifierMatch = ctrl || meta
          ? (ctrl && e.ctrlKey) || (meta && e.metaKey)
          : !e.ctrlKey && !e.metaKey;

        if (
          keyMatch &&
          modifierMatch &&
          shiftMatch &&
          altMatch &&
          !e.repeat // 키 반복 방지
        ) {
          // 입력 필드에 포커스가 있으면 기본 동작 방지하지 않음
          const target = e.target as HTMLElement;
          const isInputField =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

          if (!isInputField || key === 'k') {
            // 검색 단축키는 입력 필드에서도 동작
            e.preventDefault();
            handler(e);
          }
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * 전역 키보드 단축키 설정
 * ThemeContext를 직접 사용할 수 없으므로 이벤트 기반으로 처리
 */
export function useGlobalKeyboardShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      meta: true,
      handler: () => {
        // 검색 모달 열기 또는 포커스
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"][placeholder*="검색"], input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="종목명"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: '검색',
    },
    {
      key: 'n',
      ctrl: true,
      meta: true,
      handler: () => {
        // 새 노트 생성 - 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('shortcut:create-note'));
      },
      description: '새 노트',
    },
    {
      key: 'n',
      ctrl: true,
      meta: true,
      shift: true,
      handler: () => {
        // 새 대화 생성 - 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('shortcut:create-chat'));
      },
      description: '새 대화',
    },
    {
      key: 'd',
      ctrl: true,
      meta: true,
      shift: true,
      handler: () => {
        // 다크 모드 토글 - 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('shortcut:toggle-theme'));
      },
      description: '다크 모드 토글',
    },
  ];

  useKeyboardShortcuts(shortcuts, true);
}

