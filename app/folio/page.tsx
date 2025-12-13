'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { Send, BookOpen, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTodayRecommendations } from '@/lib/hooks/use-learning';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useSendMessageStream } from '@/lib/hooks/use-chat';
import { useNotes } from '@/lib/hooks/use-notes';
import { NoteModal } from '@/components/education/NoteModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SelectedConcept {
  concept: string;
  description: string;
  difficulty: string;
  relatedStocks: string[];
}

function FolioPageContent() {
  const { t } = useLanguage();

  // 상태 관리
  const [selectedConcept, setSelectedConcept] = useState<SelectedConcept | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId] = useState(() => `learning-${Date.now()}`);

  // 데이터 훅
  const { data: recommendations = [], isLoading: isRecommendationsLoading } = useTodayRecommendations();
  const { data: notesData } = useNotes();
  const { sendMessage, streamingMessage, isStreaming } = useSendMessageStream();

  // 스트리밍 메시지 업데이트
  useEffect(() => {
    if (streamingMessage) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return prev.slice(0, -1).concat([{ role: 'assistant', content: streamingMessage }]);
        } else {
          return [...prev, { role: 'assistant', content: streamingMessage }];
        }
      });
    }
  }, [streamingMessage]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      await sendMessage({
        conversationId,
        message: userMessage,
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    }
  };

  // 개념 선택
  const handleSelectConcept = (concept: any) => {
    setSelectedConcept(concept);
    setMessages([]);
    setInputMessage(`${concept.concept}에 대해 설명해주세요.`);
  };

  // 개념 선택 해제
  const handleDeselectConcept = () => {
    setSelectedConcept(null);
    setMessages([]);
    setInputMessage('');
    setShowNotePanel(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* 토스 스타일: 깔끔한 상단 바 */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedConcept ? (
                  <>
                    <button
                      onClick={handleDeselectConcept}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      개념 선택
                    </button>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedConcept.concept}</h1>
                    <Badge
                      variant={
                        selectedConcept.difficulty === 'beginner' ? 'success' :
                        selectedConcept.difficulty === 'intermediate' ? 'warning' :
                        'error'
                      }
                      size="small"
                      dot
                    >
                      {t(`education.difficulty.${selectedConcept.difficulty}`)}
                    </Badge>
                  </>
                ) : (
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">학습 개념 선택</h1>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  icon={FileText}
                  onClick={() => setShowNotesModal(true)}
                >
                  내 노트 ({notesData?.notes?.length || 0})
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-hidden flex">
          {!selectedConcept ? (
            /* 개념 선택 화면 */
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    오늘의 학습 개념
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    금융 개념을 선택하고 AI와 대화하며 학습해보세요
                  </p>
                </div>

                {isRecommendationsLoading ? (
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
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((rec) => (
                      <button
                        key={rec.concept}
                        onClick={() => handleSelectConcept(rec)}
                        className={cn(
                          'bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800',
                          'transition-all duration-200 cursor-pointer text-left',
                          'hover:border-[#4E56C0] dark:hover:border-[#9b5DE0]',
                          'hover:shadow-lg hover:-translate-y-0.5',
                          'active:translate-y-0'
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{rec.concept}</h3>
                          <Badge
                            variant={
                              rec.difficulty === 'beginner' ? 'success' :
                              rec.difficulty === 'intermediate' ? 'warning' :
                              'error'
                            }
                            size="small"
                            dot
                          >
                            {t(`education.difficulty.${rec.difficulty}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                          {rec.description}
                        </p>
                        {rec.relatedStocks.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                            {rec.relatedStocks.slice(0, 3).map((stock) => (
                              <Badge key={stock} variant="default" size="small">
                                {stock}
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
                    <p className="text-gray-600 dark:text-gray-400">오늘의 학습 개념이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 학습 화면 - 3단 레이아웃 */
            <>
              {/* 메인 학습 영역 */}
              <div className={cn(
                'flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900',
                showNotePanel && 'border-r border-gray-200 dark:border-gray-800'
              )}>
                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-[#4E56C0] to-[#9b5DE0] flex items-center justify-center">
                        <MessageSquare size={32} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedConcept.concept}에 대해 학습해보세요
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
                        질문을 입력하면 AI가 답변을 생성합니다. 대화를 통해 개념을 더 깊이 이해할 수 있습니다.
                      </p>
                      {selectedConcept.relatedStocks.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">관련 종목:</span>
                          {selectedConcept.relatedStocks.map((stock) => (
                            <Badge key={stock} variant="default" size="small">
                              {stock}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                      {messages.map((message, index) => (
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
                                ? 'bg-[#4E56C0] dark:bg-[#9b5DE0] text-white'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                            )}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isStreaming && !streamingMessage && (
                        <div className="flex justify-start">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#4E56C0] dark:bg-[#9b5DE0] rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-[#4E56C0] dark:bg-[#9b5DE0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              <div className="w-2 h-2 bg-[#4E56C0] dark:bg-[#9b5DE0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* 입력 영역 */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <Input
                      placeholder="질문을 입력하세요..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                      disabled={isStreaming}
                    />
                    <Button
                      variant="primary"
                      size="medium"
                      icon={Send}
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isStreaming}
                    >
                      전송
                    </Button>
                    <Button
                      variant="secondary"
                      size="medium"
                      icon={showNotePanel ? ChevronRight : FileText}
                      onClick={() => setShowNotePanel(!showNotePanel)}
                    >
                      {showNotePanel ? '노트 닫기' : '노트'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 노트 패널 */}
              {showNotePanel && (
                <div className="w-96 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">학습 노트</h3>
                      <button
                        onClick={() => setShowNotePanel(false)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        학습한 내용을 노트로 정리해보세요.
                      </p>
                      <Button
                        variant="primary"
                        size="small"
                        className="w-full"
                        onClick={() => {
                          // TODO: 노트 작성 모달 열기
                        }}
                      >
                        새 노트 작성
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 노트 모달 */}
      {showNotesModal && (
        <NoteModal
          isOpen={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          note={null}
        />
      )}
    </div>
  );
}

export default function FolioPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4E56C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <FolioPageContent />
    </Suspense>
  );
}
