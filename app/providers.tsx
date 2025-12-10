'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { KeyboardShortcuts } from '@/components/common/KeyboardShortcuts';
import { CACHE_TIMES } from '@/lib/config/cache';
import { setupBackendLogging } from '@/lib/utils/backend-logger';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 기본 캐시 시간: 중간 값 (1분)
        staleTime: CACHE_TIMES.MEDIUM,
        // Garbage Collection 시간: staleTime의 3배 (메모리 최적화)
        gcTime: CACHE_TIMES.MEDIUM * 3,
        // 포커스 시 refetch 비활성화 (성능 최적화)
        refetchOnWindowFocus: false,
        // 마운트 시 stale한 데이터만 refetch
        refetchOnMount: 'always',
        // 네트워크 재연결 시 refetch
        refetchOnReconnect: true,
        // 실패 시 재시도: 1회
        retry: 1,
        // 지수 백오프 재시도 지연
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // 네트워크 모드: online일 때만 실행
        networkMode: 'online',
      },
      mutations: {
        // Mutation 재시도: 1회
        retry: 1,
        retryDelay: 1000,
        // Mutation 네트워크 모드
        networkMode: 'online',
      },
    },
  }));

  // 백엔드 로깅 초기화
  useEffect(() => {
    setupBackendLogging();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <KeyboardShortcuts />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
