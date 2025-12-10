'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getTranslation, createTranslator, type Language } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [mounted, setMounted] = useState(false);

  // 초기 언어 로드
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      } else {
        // 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) {
          setLanguageState('ko');
        } else {
          setLanguageState('en');
        }
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback((key: string, variables?: Record<string, string>): string => {
    return getTranslation(language, key, variables);
  }, [language]);

  // HTML lang 속성 업데이트
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // 항상 context를 제공하되, mounted 전에는 기본값 사용
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // SSR 또는 Provider 없을 때 기본값 반환 (개발 환경에서만 경고)
    if (process.env.NODE_ENV === 'development') {
      console.warn('useLanguage must be used within a LanguageProvider. Using default values.');
    }
    return {
      language: 'ko' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}

