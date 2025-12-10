'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSendMessageStream } from '@/lib/hooks/use-chat';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { sizes } from '@/lib/design-tokens';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: string;
  question: string;
  relatedStocks?: string[];
}

export function LearningModal({ isOpen, onClose, concept, question, relatedStocks = [] }: LearningModalProps) {
  // useLanguage는 클라이언트에서만 사용
  let t: (key: string) => string = (key: string) => key;
  try {
    const { useLanguage: useLang } = require('@/lib/contexts/LanguageContext');
    const langContext = useLang();
    t = langContext.t;
  } catch (e) {
    // 기본값 사용
  }

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId] = useState(() => `learning-${Date.now()}`);
  const { sendMessage, streamingMessage, isStreaming } = useSendMessageStream();

  // 초기 질문 설정
  useEffect(() => {
    if (isOpen && question && messages.length === 0) {
      setInputMessage(question);
    }
  }, [isOpen, question, messages.length]);

  // 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInputMessage(question);
    }
  }, [isOpen, question]);

  // 스트리밍 메시지 업데이트
  useEffect(() => {
    if (streamingMessage) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          // 마지막 메시지가 assistant면 내용 업데이트
          return prev.slice(0, -1).concat([{ role: 'assistant', content: streamingMessage }]);
        } else {
          // 새로운 assistant 메시지 추가
          return [...prev, { role: 'assistant', content: streamingMessage }];
        }
      });
    }
  }, [streamingMessage]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // 챗봇 API 호출
      await sendMessage({
        conversationId,
        message: userMessage,
      });
      
      // 스트리밍이 완료되면 메시지가 이미 업데이트됨
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-4xl h-[80vh]',
        'bg-background-card rounded-2xl shadow-2xl',
        'flex flex-col overflow-hidden',
        'border border-border-default',
        'animate-in fade-in zoom-in-95 duration-200'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-6',
          'border-b border-border-default',
          'bg-gradient-to-r from-primary-50/50 to-background-card',
          'dark:from-primary-900/20 dark:to-background-card'
        )}>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary mb-1">{concept}</h2>
            <p className="text-sm text-text-secondary">
              {t('education.qa')} • {relatedStocks.length > 0 && `${relatedStocks.join(', ')} 관련`}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-background-hover',
              'text-text-tertiary hover:text-text-primary',
              'transition-colors'
            )}
          >
            <X size={sizes.icon.px.lg} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                'w-16 h-16 rounded-2xl mb-4',
                'bg-gradient-to-br from-[var(--brand-main)] to-[var(--brand-purple)]',
                'dark:from-[var(--brand-purple)] dark:to-[var(--brand-light-purple)]',
                'flex items-center justify-center'
              )}>
                <MessageSquare size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {concept}에 대해 학습해보세요
              </h3>
              <p className="text-sm text-text-secondary max-w-md">
                질문을 입력하면 AI가 답변을 생성합니다. 대화를 통해 개념을 더 깊이 이해할 수 있습니다.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    'break-words',
                    message.role === 'user'
                      ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] text-white'
                      : 'bg-background-subtle text-text-primary border border-border-default'
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isStreaming && !streamingMessage && (
            <div className="flex justify-start">
              <div className="bg-background-subtle rounded-2xl px-4 py-3 border border-border-default">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={cn(
          'p-4 border-t border-border-default',
          'bg-background-subtle'
        )}>
          <div className="flex items-center gap-3">
            <Input
              placeholder={t('education.question.placeholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1"
              disabled={isStreaming}
            />
            <Button
              variant="primary"
              size="medium"
              icon={Send}
              onClick={handleSend}
              disabled={!inputMessage.trim() || isStreaming}
            >
              {t('common.submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

