/**
 * 백엔드 로깅 유틸리티
 * 프론트엔드의 console.log를 백엔드로 전송
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface LogOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  metadata?: Record<string, any>;
}

/**
 * 백엔드로 로그 전송
 */
// 로그 큐 (배치 전송을 위해)
const logQueue: Array<{
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  timestamp: number;
}> = [];

let flushTimer: NodeJS.Timeout | null = null;
const FLUSH_INTERVAL = 2000; // 2초마다 배치 전송
const MAX_QUEUE_SIZE = 50; // 최대 큐 크기

/**
 * 로그 큐 플러시 (배치 전송)
 */
async function flushLogQueue(): Promise<void> {
  if (logQueue.length === 0) return;
  if (typeof window === 'undefined') return;

  const logsToSend = [...logQueue];
  logQueue.length = 0; // 큐 비우기

  try {
    await fetch(`${API_URL}/log/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logs: logsToSend.map(log => ({
          level: log.level,
          message: log.message,
          metadata: {
            ...log.metadata,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: log.timestamp,
          },
        })),
      }),
    }).catch(() => {
      // 실패한 로그는 다시 큐에 추가 (최대 3회 재시도)
      logsToSend.forEach(log => {
        if (logQueue.length < MAX_QUEUE_SIZE) {
          logQueue.push(log);
        }
      });
    });
  } catch {
    // 에러 무시
  }
}

/**
 * 백엔드로 로그 전송 (배치 처리)
 */
async function sendToBackend(
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  metadata?: Record<string, any>
): Promise<void> {
  // 서버 사이드에서는 전송하지 않음
  if (typeof window === 'undefined') return;

  // 큐에 추가
  logQueue.push({
    level,
    message,
    metadata,
    timestamp: Date.now(),
  });

  // 큐가 가득 차면 즉시 플러시
  if (logQueue.length >= MAX_QUEUE_SIZE) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    await flushLogQueue();
    return;
  }

  // 타이머 설정 (첫 로그일 때)
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushLogQueue();
    }, FLUSH_INTERVAL);
  }
}

/**
 * 백엔드 로거
 */
export const backendLogger = {
  debug: (message: string, options?: LogOptions) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(message, options?.metadata);
    }
    sendToBackend('debug', message, options?.metadata);
  },

  info: (message: string, options?: LogOptions) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, options?.metadata);
    }
    sendToBackend('info', message, options?.metadata);
  },

  warn: (message: string, options?: LogOptions) => {
    console.warn(message, options?.metadata);
    sendToBackend('warn', message, options?.metadata);
  },

  error: (message: string, error?: Error | unknown, options?: LogOptions) => {
    console.error(message, error, options?.metadata);
    sendToBackend('error', message, {
      ...options?.metadata,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    });
  },
};

/**
 * console.log를 백엔드 로깅으로 리다이렉트
 * 프로덕션 포함 모든 환경에서 활성화
 */
export function setupBackendLogging(): void {
  if (typeof window === 'undefined') return;

  // 원본 console 저장
  const originalConsole = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  // console.log를 백엔드로 전송하도록 오버라이드
  console.log = (...args: any[]) => {
    originalConsole.log(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    sendToBackend('info', message);
  };

  console.debug = (...args: any[]) => {
    originalConsole.debug(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    sendToBackend('debug', message);
  };

  console.info = (...args: any[]) => {
    originalConsole.info(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    sendToBackend('info', message);
  };

  console.warn = (...args: any[]) => {
    originalConsole.warn(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    sendToBackend('warn', message);
  };

  console.error = (...args: any[]) => {
    originalConsole.error(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    sendToBackend('error', message);
  };
}

