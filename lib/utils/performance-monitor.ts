/**
 * Performance Monitor
 * 프론트엔드 성능 메트릭 수집 및 백엔드 전송
 */

import { backendLogger } from './backend-logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 5000; // 5초마다 배치 전송
  private readonly MAX_METRICS = 100;

  /**
   * 성능 메트릭 기록
   */
  record(name: string, duration: number, metadata?: Record<string, any>): void {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    // 최대 개수 초과 시 오래된 메트릭 제거
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // 첫 메트릭일 때 타이머 시작
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.FLUSH_INTERVAL);
    }
  }

  /**
   * 메트릭 배치 전송
   */
  private async flush(): Promise<void> {
    if (this.metrics.length === 0) {
      this.flushTimer = null;
      return;
    }

    const metricsToSend = [...this.metrics];
    this.metrics = [];
    this.flushTimer = null;

    try {
      backendLogger.info('Performance metrics', {
        metadata: {
          metrics: metricsToSend,
          count: metricsToSend.length,
        },
      });
    } catch {
      // 에러 무시
    }
  }

  /**
   * 성능 측정 데코레이터
   */
  measure<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T {
    return ((...args: any[]) => {
      const start = performance.now();
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.finally(() => {
            const duration = performance.now() - start;
            this.record(name, duration);
          });
        } else {
          const duration = performance.now() - start;
          this.record(name, duration);
          return result;
        }
      } catch (error) {
        const duration = performance.now() - start;
        this.record(name, duration, { error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    }) as T;
  }
}

export const performanceMonitor = new PerformanceMonitor();

