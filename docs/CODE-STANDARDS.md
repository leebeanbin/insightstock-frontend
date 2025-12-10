# 📋 코드 규칙 및 상태 관리 가이드

> **InsightStock Frontend 프로젝트의 모든 코드 규칙과 상태 관리 방법을 통합한 가이드**

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Last Updated](https://img.shields.io/badge/Last%20Updated-2024-green)

</div>

---

## 📑 목차

| 섹션 | 설명 | 상태 |
|------|------|------|
| [1. 코드 스타일](#1-코드-스타일) | TypeScript, React 코딩 규칙 | ✅ |
| [2. 상태 관리](#2-상태-관리) | React Query, Context, Local State | ✅ |
| [3. 디자인 토큰](#3-디자인-토큰) | Design Tokens 사용법 | ✅ |
| [4. 국제화 (i18n)](#4-국제화-i18n) | 다국어 번역 시스템 | ✅ |
| [5. 컴포넌트 작성](#5-컴포넌트-작성) | 컴포넌트 구조 및 규칙 | ✅ |
| [6. 타입 정의](#6-타입-정의) | TypeScript 타입 규칙 | ✅ |
| [7. API 통신](#7-api-통신) | Repository/Service 패턴 | ✅ |
| [8. 에러 처리](#8-에러-처리) | 에러 핸들링 전략 | ✅ |

---

## 1. 코드 스타일

### 1.1 TypeScript 규칙

#### ✅ 필수 규칙

```typescript
// ✅ 좋은 예: 명시적 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ 나쁜 예: any 사용 금지
function getUser(id: any): any {
  // ...
}
```

#### 타입 정의 위치

```
lib/types/
├── api/              # API 응답 타입
│   ├── portfolio.types.ts
│   ├── chat.types.ts
│   └── index.ts
└── types.ts         # 공통 타입
```

#### 타입 네이밍 규칙

| 패턴 | 예시 | 설명 |
|------|------|------|
| `Interface` | `User`, `PortfolioItem` | 인터페이스는 PascalCase |
| `Type` | `ButtonVariant`, `ApiResponse<T>` | 타입 별칭은 PascalCase |
| `Enum` | `UserRole`, `OrderStatus` | 열거형은 PascalCase |
| `Props` | `ButtonProps`, `CardProps` | Props는 `{Name}Props` |

### 1.2 React 컴포넌트 규칙

#### 컴포넌트 구조

```typescript
// ✅ 표준 구조
'use client';

import React from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ComponentProps {
  title: string;
  className?: string;
}

export function Component({ title, className }: ComponentProps) {
  const { t } = useLanguage();
  
  return (
    <div className={cn('base-styles', className)}>
      <h1>{t('common.title')}</h1>
    </div>
  );
}
```

#### 컴포넌트 네이밍

| 타입 | 규칙 | 예시 |
|------|------|------|
| **Function Component** | PascalCase | `StockList`, `PortfolioCard` |
| **Props Interface** | `{Name}Props` | `StockListProps`, `PortfolioCardProps` |
| **Hook** | `use{Name}` | `usePortfolio`, `useChat` |
| **Service** | `{Name}Service` | `PortfolioService`, `ChatService` |
| **Repository** | `{Name}Repository` | `PortfolioRepository`, `ChatRepository` |

### 1.3 파일 구조 규칙

```
components/
├── atoms/           # 기본 컴포넌트 (Button, Input, Badge)
├── molecules/       # 조합 컴포넌트 (Card, Form, Table)
└── organisms/       # 복합 컴포넌트 (Header, Sidebar, Dashboard)

lib/
├── hooks/           # React Query Hooks
├── services/         # Service Layer
├── repositories/     # Repository Layer
├── types/           # TypeScript 타입
├── contexts/        # React Context
└── utils/           # 유틸리티 함수
```

---

## 2. 상태 관리

### 2.1 상태 관리 전략

| 상태 타입 | 도구 | 사용 시기 | 예시 |
|-----------|------|-----------|------|
| **서버 상태** | React Query | API 데이터 | `usePortfolios()`, `useStocks()` |
| **전역 UI 상태** | Context API | 테마, 언어 | `ThemeContext`, `LanguageContext` |
| **로컬 상태** | `useState` | 컴포넌트 내부 | 폼 입력, 모달 열림/닫힘 |
| **파생 상태** | `useMemo`, `useCallback` | 계산된 값 | 필터링된 목록, 정렬된 데이터 |

### 2.2 React Query 사용법

#### ✅ 표준 패턴

```typescript
// lib/hooks/use-portfolio.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '@/lib/services';
import { portfolioKeys } from '@/lib/hooks/query-keys';
import { getCacheConfig } from '@/lib/config/cache';

// Query Hook
export function usePortfolios(params?: PortfolioListParams) {
  return useQuery({
    queryKey: portfolioKeys.list(params),
    queryFn: () => portfolioService.getPortfolios(params),
    ...getCacheConfig('portfolio', 'list'), // 자동 캐시 설정
  });
}

// Mutation Hook
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePortfolioRequest) => 
      portfolioService.createPortfolio(data),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: portfolioKeys.lists() 
      });
    },
  });
}
```

#### 캐시 전략

| 데이터 타입 | staleTime | gcTime | 설명 |
|------------|-----------|--------|------|
| **실시간 주가** | 10초 | 30초 | 빠른 갱신 필요 |
| **차트/검색** | 30초 | 5분 | 중간 빈도 갱신 |
| **종목 목록** | 1분 | 10분 | 일반적인 데이터 |
| **뉴스** | 5분 | 30분 | 상대적으로 정적 |
| **뉴스 상세** | 10분 | 1시간 | 거의 변하지 않음 |

### 2.3 Context API 사용법

#### ✅ 표준 패턴

```typescript
// lib/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 시스템 테마 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };
    
    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### Context 사용 규칙

1. **필수 Provider 체크**: Context 사용 시 Provider 내부인지 확인
2. **타입 안전성**: `undefined` 체크 후 사용
3. **성능 최적화**: `useMemo`, `useCallback` 활용

---

## 3. 디자인 토큰

### 3.1 Design Tokens 개요

모든 디자인 값(색상, 간격, 타이포그래피 등)은 중앙에서 관리됩니다.

```typescript
// lib/design-tokens/index.ts
export const spacing = {
  0: '0',
  0_5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1_5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  // ...
} as const;

export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    // ...
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
```

### 3.2 CSS 변수 사용법

#### ✅ 권장 방법

```tsx
// CSS 변수를 Tailwind arbitrary value로 사용
<div className="px-[var(--spacing-4)] py-[var(--spacing-2)]">
  <p className="text-[var(--font-size-base)]">Content</p>
</div>
```

#### ❌ 피해야 할 방법

```tsx
// ❌ 동적 템플릿 리터럴 (Tailwind가 파싱하지 못함)
<div className={`px-[${spacing[4]}]`}>

// ❌ 하드코딩된 값
<div className="px-4 py-2">
```

### 3.3 사용 가능한 CSS 변수

| 카테고리 | 변수 패턴 | 예시 |
|----------|-----------|------|
| **Spacing** | `--spacing-{size}` | `--spacing-4`, `--spacing-2_5` |
| **Typography** | `--font-size-{size}` | `--font-size-base`, `--font-size-lg` |
| **Font Weight** | `--font-weight-{weight}` | `--font-weight-semibold` |
| **Border Radius** | `--radius-{size}` | `--radius-lg`, `--radius-xl` |
| **Colors** | `--primary-{shade}`, `--brand-{name}` | `--primary-700`, `--brand-main` |
| **Layout** | `--layout-{name}` | `--layout-sidebar-width` |

### 3.4 색상 시스템

#### Primary Colors (보라색 계열)

```css
--primary-700: #4E56C0;  /* 메인 - 진한 파란색/보라색 */
--primary-600: #9b5DE0;  /* 보라색 */
--primary-500: #D78FEE;  /* 연한 보라색 */
--primary-200: #F7EDFB;  /* 거의 흰색에 가까운 보라색 톤 */
--primary-100: #FBF5FD;  /* 매우 연한 배경용 보라색 */
--primary-50: #FDFBFE;  /* 최소한의 보라색 톤 */
```

#### Brand Colors

```css
--brand-main: #4E56C0;           /* 메인 색상 */
--brand-purple: #9b5DE0;        /* 보라색 */
--brand-light-purple: #D78FEE;  /* 연한 보라색 */
```

#### Semantic Colors

```css
--semantic-red: #EF4444;      /* 상승 (한국 주식 시장) */
--semantic-blue: #3B82F6;     /* 하락 */
--semantic-yellow: #F59E0B;   /* 경고 */
--semantic-green: #10B981;    /* 성공 */
```

---

## 4. 국제화 (i18n)

### 4.1 번역 시스템 구조

```
lib/i18n/
├── translations.ts    # 모든 번역 텍스트
├── index.ts          # 번역 함수
└── utils.ts          # 유틸리티 함수
```

### 4.2 번역 키 사용법

#### ✅ 올바른 사용

```tsx
import { useLanguage } from '@/lib/contexts/LanguageContext';

function Component() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.subtitle')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

#### ❌ 피해야 할 방법

```tsx
// ❌ 하드코딩된 텍스트
<h1>대시보드</h1>

// ❌ 번역 키가 정의되지 않은 경우
<h1>{t('dashboard.unknownKey')}</h1>  // "dashboard.unknownKey"로 표시됨
```

### 4.3 번역 키 네이밍 규칙

| 패턴 | 예시 | 설명 |
|------|------|------|
| `{section}.{key}` | `dashboard.title` | 섹션별 그룹화 |
| `{section}.{sub}.{key}` | `education.question.history` | 중첩 구조 |
| `common.{key}` | `common.loading`, `common.error` | 공통 키 |

### 4.4 지원 언어

| 언어 | 코드 | 상태 |
|------|------|------|
| 한국어 | `ko` | ✅ 완료 |
| 영어 | `en` | ✅ 완료 |

---

## 5. 컴포넌트 작성

### 5.1 컴포넌트 구조

```tsx
'use client';

import React from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

interface ComponentProps {
  title: string;
  variant?: 'default' | 'primary';
  className?: string;
}

export function Component({ 
  title, 
  variant = 'default',
  className 
}: ComponentProps) {
  const { t } = useLanguage();
  
  return (
    <div 
      className={cn(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        className
      )}
    >
      <h1>{title}</h1>
    </div>
  );
}
```

### 5.2 컴포넌트 작성 체크리스트

- [ ] `'use client'` 지시어 추가 (클라이언트 컴포넌트인 경우)
- [ ] Props 인터페이스 정의 (`{Name}Props`)
- [ ] `useLanguage` 훅으로 번역 적용
- [ ] `cn()` 유틸리티로 className 병합
- [ ] CSS 변수 사용 (하드코딩 값 지양)
- [ ] 타입 안전성 보장
- [ ] 접근성 고려 (aria-label 등)

### 5.3 컴포넌트 분류

| 레벨 | 위치 | 예시 | 설명 |
|------|------|------|------|
| **Atoms** | `components/atoms/` | `Button`, `Input`, `Badge` | 기본 UI 요소 |
| **Molecules** | `components/molecules/` | `Card`, `Form`, `NewsCard` | 조합 컴포넌트 |
| **Organisms** | `components/organisms/` | `Header`, `Sidebar`, `Dashboard` | 복합 컴포넌트 |

---

## 6. 타입 정의

### 6.1 API 타입 정의

```typescript
// lib/types/api/portfolio.types.ts
export interface PortfolioItem {
  id: string;
  stock: Stock;
  quantity: number;
  averagePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRequest {
  stockId: string;
  quantity: number;
  averagePrice: number;
}

export interface PortfolioListResponse {
  portfolios: PortfolioItem[];
  summary: PortfolioSummary;
}
```

### 6.2 타입 네이밍 규칙

| 패턴 | 예시 | 설명 |
|------|------|------|
| `{Name}` | `PortfolioItem`, `Stock` | 엔티티 타입 |
| `{Name}Request` | `CreatePortfolioRequest` | API 요청 타입 |
| `{Name}Response` | `PortfolioListResponse` | API 응답 타입 |
| `{Name}Params` | `PortfolioListParams` | 쿼리 파라미터 타입 |

### 6.3 타입 재사용

```typescript
// ✅ 좋은 예: 타입 재사용
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

// ❌ 나쁜 예: 중복 정의
interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

---

## 7. API 통신

### 7.1 3-Layer Architecture

```
Controller Layer (Hooks)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (API Calls)
```

### 7.2 Repository Layer

```typescript
// lib/repositories/portfolio.repository.ts
import { apiClient } from '@/lib/api-client';
import { 
  PortfolioItem, 
  CreatePortfolioRequest 
} from '@/lib/types/api/portfolio.types';

export class PortfolioRepository {
  async getPortfolios(params?: PortfolioListParams): Promise<PortfolioListResponse> {
    const response = await apiClient.get('/api/portfolios', { params });
    return response.data;
  }

  async createPortfolio(data: CreatePortfolioRequest): Promise<PortfolioItem> {
    const response = await apiClient.post('/api/portfolios', data);
    return response.data;
  }
}

export const portfolioRepository = new PortfolioRepository();
```

### 7.3 Service Layer

```typescript
// lib/services/portfolio.service.ts
import { portfolioRepository } from '@/lib/repositories/portfolio.repository';
import { 
  PortfolioItem, 
  CreatePortfolioRequest 
} from '@/lib/types/api/portfolio.types';

export class PortfolioService {
  constructor(
    private repository: PortfolioRepository = portfolioRepository
  ) {}

  async getPortfolios(params?: PortfolioListParams): Promise<PortfolioListResponse> {
    // 비즈니스 로직, 유효성 검증
    if (params?.limit && params.limit > 100) {
      throw new Error('Limit cannot exceed 100');
    }
    
    return this.repository.getPortfolios(params);
  }

  async createPortfolio(data: CreatePortfolioRequest): Promise<PortfolioItem> {
    // 유효성 검증
    if (data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    return this.repository.createPortfolio(data);
  }
}

export const portfolioService = new PortfolioService();
```

### 7.4 Controller Layer (Hooks)

```typescript
// lib/hooks/use-portfolio.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { portfolioService } from '@/lib/services';
import { portfolioKeys } from '@/lib/hooks/query-keys';
import { getCacheConfig } from '@/lib/config/cache';

export function usePortfolios(params?: PortfolioListParams) {
  return useQuery({
    queryKey: portfolioKeys.list(params),
    queryFn: () => portfolioService.getPortfolios(params),
    ...getCacheConfig('portfolio', 'list'),
  });
}

export function useCreatePortfolio() {
  return useMutation({
    mutationFn: (data: CreatePortfolioRequest) => 
      portfolioService.createPortfolio(data),
  });
}
```

---

## 8. 에러 처리

### 8.1 에러 처리 전략

| 에러 타입 | 처리 방법 | 예시 |
|-----------|-----------|------|
| **API 에러** | React Query Error Boundary | `useQuery`의 `error` 상태 |
| **유효성 검증** | Service Layer에서 throw | `throw new Error('Invalid data')` |
| **UI 에러** | ErrorState 컴포넌트 | `<ErrorState message={error.message} />` |
| **전역 에러** | ErrorBoundary | `<ErrorBoundary><App /></ErrorBoundary>` |

### 8.2 에러 컴포넌트

```tsx
// components/common/ErrorState.tsx
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function ErrorState({ 
  message, 
  onRetry 
}: ErrorStateProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      <h3>{t('common.error')}</h3>
      <p>{message || t('common.unexpectedError')}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
```

### 8.3 에러 처리 패턴

```tsx
// ✅ 좋은 예: 에러 상태 처리
function Component() {
  const { data, isLoading, error } = usePortfolios();
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!data) return <EmptyState />;
  
  return <PortfolioList portfolios={data.portfolios} />;
}
```

---

## 📚 관련 문서

- [아키텍처 가이드](../lib/ARCHITECTURE.md) - 3-Layer Architecture 상세
- [디자인 토큰 가이드](../lib/design-tokens/README.md) - Design Tokens 사용법
- [i18n 가이드](../lib/i18n/README.md) - 국제화 시스템
- [개발 가이드](./DEVELOPMENT-GUIDE.md) - 실전 개발 가이드

---

<div align="center">

**마지막 업데이트**: 2024년

[⬆️ 맨 위로](#-코드-규칙-및-상태-관리-가이드)

</div>

