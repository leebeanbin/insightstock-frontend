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

        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-1 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 relative',
                    activeTab === tab.id
                      ? 'border-[var(--brand-main)] dark:border-[var(--brand-purple)] text-[var(--brand-main)] dark:text-[var(--brand-purple)] bg-background-hover dark:bg-background-hover font-semibold'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)] hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)]'
                  )}
                >
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'qa' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden grid grid-cols-[320px_1fr] gap-6 p-6">
                  {/* Question History */}
                  <div className="border-r border-gray-200 pr-6 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">{t('education.question.history')}</h3>
                    <div className="space-y-1.5">
                      {[
                        t('education.question.sample.per'),
                        t('education.question.sample.dividend'),
                        t('education.question.sample.rsi'),
                        t('education.question.sample.dividend'),
                        t('education.question.sample.rsi'),
                      ].map((q, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#F0FDF4] hover:text-primary-600 transition-all duration-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer Preview */}
                  <div className="overflow-y-auto pl-6">
                    {answer ? (
                      <div className="space-y-6">
                        <div className="prose max-w-none">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                            {answer.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="text-sm leading-7">
                                {paragraph.trim()}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '400px', width: '100%', padding: '24px' }}>
                          <div style={{ width: '80px', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            <BookOpen size={40} strokeWidth={2} style={{ color: '#D1D5DB' }} />
                          </div>
                          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px', textAlign: 'center' }}>{t('education.question.input')}</h3>
                          <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: 1.6, textAlign: 'center', maxWidth: '320px' }}>
                            {t('education.question.inputDescription')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Input */}
                <div className="border-t border-gray-200 bg-white p-4 shrink-0">
                  <div className="max-w-6xl mx-auto">
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
              <div className="max-w-6xl mx-auto p-6 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-6">{t('education.today')}</h2>
                  {isRecommendationsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} variant="default" className="animate-pulse">
                          <div className="h-6 bg-background-hover rounded mb-2" />
                          <div className="h-4 bg-background-hover rounded mb-4" />
                          <div className="h-6 w-24 bg-background-hover rounded" />
                        </Card>
                      ))}
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendations.map((rec) => (
                      <Card 
                        key={rec.concept} 
                        variant="default"
                        className={cn(
                          'hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)]',
                          'transition-all duration-200 cursor-pointer',
                          'hover:shadow-lg'
                        )}
                        onClick={() => {
                          setSelectedLearning({
                            concept: rec.concept,
                            question: rec.question,
                            relatedStocks: rec.relatedStocks,
                          });
                        }}
                      >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-text-primary">{rec.concept}</h3>
                            <Badge 
                              variant={
                                rec.difficulty === 'beginner' ? 'primary' : 
                                rec.difficulty === 'intermediate' ? 'warning' : 
                                'error'
                              }
                              dot
                            >
                              {t(`education.difficulty.${rec.difficulty}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary mb-4 leading-relaxed">{rec.description}</p>
                          {rec.relatedStocks.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {rec.relatedStocks.slice(0, 3).map((stock) => (
                                <Badge key={stock} variant="default" className="text-xs">
                                  {stock}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-text-secondary">{t('education.noRecommendations')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="h-full flex flex-col">
                {noteViewMode === 'split' ? (
                  // 분할 레이아웃 모드
                  <div className="flex-1 flex overflow-hidden">
                    {/* 왼쪽: 뉴스 */}
                    <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t('education.selectNews')}</h3>
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
                        <Card variant="default" className="p-6">
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedNews.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="font-medium">{selectedNews.source}</span>
                              <span>·</span>
                              <span>{formatRelativeTime(selectedNews.publishedAt)}</span>
                            </div>
                            {selectedNews.summary && (
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 leading-relaxed">{selectedNews.summary}</p>
                              </div>
                            )}
                            <div className="prose max-w-none">
                              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {selectedNews.content}
                              </div>
                            </div>
                            {selectedNews.url && (
                              <a
                                href={selectedNews.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                              >
                                <ExternalLink size={16} />
                                {t('news.source')}
                              </a>
                            )}
                          </div>
                        </Card>
                      ) : (
                        <Card variant="default" className="p-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <BookOpen size={48} className="text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('education.noNewsSelected')}</h3>
                            <p className="text-sm text-gray-600">{t('education.createNoteFromNewsDesc')}</p>
                          </div>
                        </Card>
                      )}
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
                  // 그리드 모드
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{t('education.notes')}</h2>
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
                      <Card key={i} variant="default" className="animate-pulse">
                        <div className="h-32 bg-background-hover rounded-lg mb-3" />
                        <div className="h-6 bg-background-hover rounded mb-2" />
                        <div className="h-4 bg-background-hover rounded mb-3" />
                      </Card>
                    ))}
                  </div>
                ) : notesData && notesData.notes && notesData.notes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesData.notes.map((note) => (
                      <Card 
                        key={note.id} 
                        variant="default" 
                        className="cursor-pointer hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)] transition-all duration-200"
                        onClick={() => {
                          setSelectedNote(note.id);
                          if (note.newsId) {
                            setSelectedNewsId(note.newsId);
                            setNoteViewMode('split');
                          } else {
                            setNoteViewMode('split');
                          }
                        }}
                      >
                        <div className="h-32 bg-background-subtle rounded-lg mb-3 flex items-center justify-center">
                          <BookOpen size={32} strokeWidth={1.5} className="text-text-tertiary" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)] transition-colors line-clamp-1">
                          {note.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2 leading-relaxed">
                          {stripHtmlAndMarkdown(note.content).substring(0, 100)}
                        </p>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {note.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="primary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card variant="default" className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-2xl mb-6 bg-background-subtle flex items-center justify-center">
                        <BookOpen size={40} strokeWidth={2} className="text-text-tertiary" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-3">{t('education.noNotes')}</h3>
                      <p className="text-sm text-text-secondary mb-6 max-w-xs">{t('education.noNotesDescription')}</p>
                      <Button
                        variant="primary"
                        size="medium"
                        icon={Plus}
                        onClick={() => setIsCreatingNote(true)}
                      >
                        {t('education.createNote')}
                      </Button>
                    </div>
                  </Card>
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
