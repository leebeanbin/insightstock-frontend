/**
 * ChatInput Component
 * 채팅 입력창 컴포넌트
 */

'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder,
}: ChatInputProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;

    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border-default)] bg-white dark:bg-gray-900 p-4 shrink-0">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('chat.inputPlaceholder')}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 min-h-[56px] max-h-32 px-4 py-3 rounded-xl border',
            'text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-main)]/20 dark:focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-main)] dark:focus:border-[var(--brand-purple)]',
            'disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed',
            'resize-none overflow-y-auto transition-all duration-200'
          )}
          style={{
            height: 'auto',
            minHeight: '56px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          icon={Send}
          size="large"
          className={cn(
            'h-[56px] px-6',
            'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)]',
            'hover:bg-[var(--brand-purple)] dark:hover:bg-[var(--brand-light-purple)]'
          )}
        >
          {t('chat.send')}
        </Button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
        {t('chat.sendPrompt')}
      </p>
    </div>
  );
}

