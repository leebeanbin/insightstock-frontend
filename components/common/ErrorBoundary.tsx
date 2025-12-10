/**
 * ErrorBoundary Component
 * React Error Boundary 컴포넌트
 * 애플리케이션 레벨 에러 처리
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Note: Error boundaries are class components and cannot use hooks
// Translation is handled by ErrorState component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 백엔드로 에러 로깅 (비동기로 처리하여 에러 발생 시에도 안전)
    if (typeof window !== 'undefined') {
      import('@/lib/utils/backend-logger').then(({ backendLogger }) => {
        backendLogger.error('ErrorBoundary caught an error', error, {
          metadata: {
            componentStack: errorInfo.componentStack,
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack,
          },
        });
      }).catch(() => {
        // 백엔드 로거 로드 실패 시 콘솔에만 출력
        if (process.env.NODE_ENV === 'development') {
          console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // ErrorState 컴포넌트가 이미 번역을 처리하므로 기본값만 전달
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <ErrorState
            message={this.state.error?.message}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

