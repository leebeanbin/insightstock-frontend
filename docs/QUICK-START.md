# ⚡ Quick Start

InsightStock 프론트엔드를 5분 안에 실행하기

---

## 📋 사전 요구사항

- **Node.js** 20.x 이상
- **pnpm** 8.x 이상
- **백엔드 API** 실행 중 (http://localhost:3001)

---

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# 백엔드 API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# WebSocket URL (선택)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### 3. 개발 서버 실행

```bash
# Turbopack으로 개발 서버 시작
pnpm dev
```

브라우저에서 http://localhost:3000 열기

---

## 📁 프로젝트 구조

```
insightstock-frontend/
├── app/                    # Next.js 16 App Router
│   ├── dashboard/         # 대시보드 페이지 ✅
│   ├── news/              # 뉴스 피드 & 하이라이팅 ✅
│   ├── education/         # 노트 관리 ✅
│   ├── portfolio/         # 포트폴리오 🚧
│   ├── chat/              # AI 챗봇 🚧
│   └── stocks/            # 주식 정보 🚧
│
├── components/            # React 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── news/             # 뉴스 컴포넌트
│   ├── education/        # 노트 컴포넌트
│   └── common/           # 공통 컴포넌트
│
├── lib/                  # 유틸리티 & 비즈니스 로직
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # API 서비스 레이어
│   ├── types/           # TypeScript 타입
│   └── utils/           # 유틸리티 함수
│
└── docs/                # 프로젝트 문서

✅ = 완료  🚧 = 개발 중
```

---

## 🎯 주요 기능

### ✅ 완료된 기능

#### 1. Dashboard
- 사용자 대시보드
- 주요 지표 표시
- 최근 활동 피드

#### 2. News & Feed
- 뉴스 목록 (무한 스크롤)
- 뉴스 상세 보기
- AI 분석 및 요약
- **Kindle-style 텍스트 하이라이팅** ⭐

#### 3. Education (Notes)
- 노트 생성/수정/삭제
- 뉴스에서 텍스트 선택하여 노트 생성
- 하이라이트 저장 및 표시
- 태그 기반 분류

### 🚧 개발 진행 중

- Portfolio (포트폴리오 관리)
- Chat (AI 챗봇)
- Stocks (주식 검색 및 분석)
- Learning (학습 추천)

---

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 코드 린팅
pnpm lint

# 타입 체크
pnpm type-check

# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e
```

---

## 🎨 주요 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Build Tool**: Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 🔑 핵심 구현: Kindle-style 텍스트 하이라이팅

### 작동 방식

1. 뉴스 기사에서 텍스트 드래그
2. 팝업에서 "노트 만들기" 클릭
3. 선택한 텍스트로 노트 생성
4. 텍스트 위치가 문자 오프셋으로 저장됨
5. 페이지 새로고침 후에도 하이라이트 유지

### 구현 파일

- `components/news/NewsWithNotes.tsx` - 하이라이트 렌더링
- `components/education/NoteModal.tsx` - 노트 생성
- `lib/types.ts` - Note 인터페이스 (highlightStart, highlightEnd)

### 주요 버그 수정

**문제**: `highlightStart: 0`이 `undefined`로 처리됨

**원인**: JavaScript falsy 값 처리
```typescript
// ❌ 잘못된 방법
highlightStart || undefined  // 0 || undefined → undefined

// ✅ 올바른 방법
highlightStart ?? undefined  // 0 ?? undefined → 0
```

**해결**: Nullish coalescing operator (`??`) 사용

---

## 🐛 트러블슈팅

### 개발 서버가 시작되지 않을 때

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules .next
pnpm install

# 포트 확인 (3000번 포트가 사용 중인지)
lsof -i :3000

# 다른 포트로 실행
pnpm dev -- -p 3001
```

### API 연결 오류

1. 백엔드 서버가 실행 중인지 확인
2. `.env.local` 파일의 `NEXT_PUBLIC_API_URL` 확인
3. CORS 설정 확인 (백엔드)

### 빌드 오류

```bash
# 타입 에러 확인
pnpm type-check

# 린트 에러 수정
pnpm lint --fix

# 캐시 삭제
rm -rf .next
pnpm build
```

---

## 📚 다음 단계

### 새 페이지 추가하기

```bash
# 1. app/ 디렉토리에 새 폴더 생성
mkdir app/my-page

# 2. page.tsx 파일 생성
touch app/my-page/page.tsx

# 3. 컴포넌트 작성
# app/my-page/page.tsx
```

### 새 API 훅 추가하기

```typescript
// lib/hooks/use-my-data.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const response = await apiClient.get('/api/my-data');
      return response.data;
    },
  });
}
```

### 새 컴포넌트 추가하기

```typescript
// components/my-component/MyComponent.tsx
export function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
    </div>
  );
}
```

---

## 🆘 도움말

- **프로젝트 README**: 전체 프로젝트 개요
- **코드 문제**: TypeScript 타입 에러 확인
- **API 이슈**: 백엔드 서버 로그 확인
- **스타일 문제**: Tailwind CSS 문서 참조

---

**Happy Coding!** 🚀
