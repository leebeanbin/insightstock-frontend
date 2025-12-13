'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Card from '@/components/molecules/Card';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { Send, BookOpen, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTodayRecommendations } from '@/lib/hooks/use-learning';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { LearningModal } from '@/components/education/LearningModal';
import { NoteModal } from '@/components/education/NoteModal';
import { useNotes, useCreateNote } from '@/lib/hooks/use-notes';
import { Plus, X, ExternalLink } from 'lucide-react';
import { useNewsDetail } from '@/lib/hooks/use-news';
import { formatRelativeTime } from '@/lib/formatters';
import { useSearchParams } from 'next/navigation';

function EducationPageContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'qa' | 'notes'>('dashboard');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLearning, setSelectedLearning] = useState<{
    concept: string;
    question: string;
    relatedStocks: string[];
  } | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [noteViewMode, setNoteViewMode] = useState<'grid' | 'split'>('grid');
  const searchParams = useSearchParams();
  const { data: recommendations = [], isLoading: isRecommendationsLoading } = useTodayRecommendations();
  const { data: notesData, isLoading: isNotesLoading } = useNotes();
  const { data: selectedNews, isLoading: isNewsLoading } = useNewsDetail(selectedNewsId || '', {
    enabled: !!selectedNewsId && noteViewMode === 'split',
  });

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

  // URL 파라미터에서 뉴스 ID 확인
  useEffect(() => {
    const newsId = searchParams.get('newsId');
    if (newsId) {
      setSelectedNewsId(newsId);
      setActiveTab('notes');
      setNoteViewMode('split');
      setIsCreatingNote(true);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'dashboard', labelKey: 'education.dashboard' },
    { id: 'qa', labelKey: 'education.qa' },
    { id: 'notes', labelKey: 'education.notes' },
  ];

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAnswer(`
PER은 주가를 주당순이익으로 나눈 지표입니다.

왜 중요한가?
기업의 밸류에이션을 평가하는 가장 기본적인 지표로, 주가가 비싼지 싼지 판단할 수 있어요.

종목/업종 예시:
• 삼성전자 PER: 15배 (2024년 기준)
• IT 업종 평균: 20배

실수하기 쉬운 포인트:
PER이 낮다고 무조건 좋은 건 아닙니다. 적자 기업은 PER을 계산할 수 없어요.
      `);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {/* Tabs - 토스 스타일: 깔끔한 탭바 */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'px-4 py-4 text-sm font-semibold transition-all duration-200 relative',
                      activeTab === tab.id
                        ? 'text-[var(--brand-main)] dark:text-[var(--brand-purple)]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    {t(tab.labelKey)}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'qa' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden grid grid-cols-[280px_1fr] gap-0">
                  {/* Question History - 토스 스타일 */}
                  <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
                    <div className="p-6 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('education.question.history')}</h3>
                      <div className="space-y-1">
                        {[
                          t('education.question.sample.per'),
                          t('education.question.sample.dividend'),
                          t('education.question.sample.rsi'),
                          t('education.question.sample.dividend'),
                          t('education.question.sample.rsi'),
                        ].map((q, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Answer Preview - 토스 스타일 */}
                  <div className="overflow-y-auto bg-gray-50 dark:bg-gray-950">
                    {answer ? (
                      <div className="max-w-3xl mx-auto p-8">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
                              {answer.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-sm leading-7">
                                  {paragraph.trim()}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="primary"
                            size="medium"
                            icon={Save}
                            iconPosition="left"
                          >
                            {t('education.saveNote')}
                          </Button>
                          <Button variant="secondary" size="medium">
                            {t('education.viewStocks')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md p-8">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <BookOpen size={40} strokeWidth={2} className="text-gray-400 dark:text-gray-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('education.question.input')}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('education.question.inputDescription')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Input - 토스 스타일 */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder={t('education.question.placeholder')}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                        className="flex-1 min-w-0"
                      />
                      <Button
                        variant="primary"
                        size="medium"
                        icon={Send}
                        onClick={handleSubmit}
                        disabled={!question.trim() || isLoading}
                        className="shrink-0"
                      >
                        {isLoading ? t('education.question.generating') : t('common.submit')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* 토스 스타일: 섹션 헤더 */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('education.today')}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">오늘 배울 금융 개념을 선택해보세요</p>
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
                        onClick={() => {
                          setSelectedLearning({
                            concept: rec.concept,
                            question: rec.question,
                            relatedStocks: rec.relatedStocks,
                          });
                        }}
                        className={cn(
                          'bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800',
                          'transition-all duration-200 cursor-pointer text-left',
                          'hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)]',
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
                    <p className="text-gray-600 dark:text-gray-400">{t('education.noRecommendations')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="h-full flex flex-col">
                {noteViewMode === 'split' ? (
                  // 분할 레이아웃 모드 - 토스 스타일
                  <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-gray-950">
                    {/* 왼쪽: 뉴스 */}
                    <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-white dark:bg-gray-900">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('education.selectNews')}</h3>
                          <Button
                            variant="secondary"
                            size="small"
                            icon={X}
                            onClick={() => {
                              setNoteViewMode('grid');
                              setSelectedNewsId(null);
                              setIsCreatingNote(false);
                              setSelectedNote(null);
                            }}
                          >
                            {t('common.close')}
                          </Button>
                        </div>
                        {selectedNewsId && selectedNews ? (
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedNews.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{selectedNews.source}</span>
                              <span>·</span>
                              <span>{formatRelativeTime(selectedNews.publishedAt)}</span>
                            </div>
                            {selectedNews.summary && (
                              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedNews.summary}</p>
                              </div>
                            )}
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {selectedNews.content}
                              </div>
                            </div>
                            {selectedNews.url && (
                              <a
                                href={selectedNews.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:opacity-80 font-medium transition-opacity"
                              >
                                <ExternalLink size={16} />
                                {t('news.source')}
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <BookOpen size={32} className="text-gray-400 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('education.noNewsSelected')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('education.createNoteFromNewsDesc')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽: 노트 에디터 */}
                    <div className="w-1/2 overflow-hidden">
                      <NoteModal
                        isOpen={true}
                        onClose={() => {
                          setNoteViewMode('grid');
                          setSelectedNewsId(null);
                          setIsCreatingNote(false);
                        }}
                        note={selectedNote && notesData ? notesData.notes.find(n => n.id === selectedNote) || null : null}
                        newsId={selectedNewsId || undefined}
                        newsTitle={selectedNews?.title}
                        newsContent={selectedNews?.content}
                        newsUrl={selectedNews?.url}
                        embedded={true}
                        onDelete={() => {
                          setNoteViewMode('grid');
                          setSelectedNote(null);
                          setSelectedNewsId(null);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // 그리드 모드 - 토스 스타일
                  <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('education.notes')}</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">학습 내용을 정리하고 기록하세요</p>
                        </div>
                        <Button
                          variant="primary"
                          size="medium"
                          icon={Plus}
                          onClick={() => setIsCreatingNote(true)}
                        >
                          {t('education.createNote')}
                        </Button>
                      </div>
                {isNotesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 animate-pulse">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-3 w-5/6" />
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notesData && notesData.notes && notesData.notes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesData.notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          setSelectedNote(note.id);
                          if (note.newsId) {
                            setSelectedNewsId(note.newsId);
                            setNoteViewMode('split');
                          } else {
                            setNoteViewMode('split');
                          }
                        }}
                        className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-[var(--brand-main)] dark:hover:border-[var(--brand-purple)] transition-all duration-200 cursor-pointer text-left hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
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
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-16 border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-2xl mb-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <BookOpen size={40} strokeWidth={2} className="text-gray-400 dark:text-gray-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('education.noNotes')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">{t('education.noNotesDescription')}</p>
                      <Button
                        variant="primary"
                        size="medium"
                        icon={Plus}
                        onClick={() => setIsCreatingNote(true)}
                      >
                        {t('education.createNote')}
                      </Button>
                    </div>
                  </div>
                )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Learning Modal */}
      {selectedLearning && (
        <LearningModal
          isOpen={!!selectedLearning}
          onClose={() => setSelectedLearning(null)}
          concept={selectedLearning.concept}
          question={selectedLearning.question}
          relatedStocks={selectedLearning.relatedStocks}
        />
      )}

      {/* Note Modal - 기존 노트 편집 */}
      {selectedNote && notesData && (
        <NoteModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          note={notesData.notes.find(n => n.id === selectedNote) || null}
          onDelete={() => setSelectedNote(null)}
        />
      )}

      {/* Note Modal - 새 노트 생성 */}
      {isCreatingNote && (
        <NoteModal
          isOpen={isCreatingNote}
          onClose={() => setIsCreatingNote(false)}
          note={null}
        />
      )}
    </div>
  );
}

export default function EducationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <EducationPageContent />
    </Suspense>
  );
}
