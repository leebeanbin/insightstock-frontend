# FinFolio Frontend

AI 기반 금융 학습 플랫폼 프론트엔드 - Next.js 16 with Turbopack

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)

---

## 🔗 관련 레포

| 레포 | 역할 | 기술 스택 |
|------|------|-----------|
| [insightstock-backend](https://github.com/leebeanbin/insightstock-backend) | API 서버 | Node.js · Fastify · PostgreSQL |
| [insightstock-ai-service](https://github.com/leebeanbin/insightstock-ai-service) | AI 인사이트 마이크로서비스 | Python · FastAPI · Multi-LLM |

> 이 프론트엔드를 실행하려면 **insightstock-backend**가 먼저 실행 중이어야 합니다.

---

## 🚀 프로젝트 상태

### ✅ 완료된 기능
- **Dashboard**: 사용자 대시보드, 주요 지표, 최근 활동
- **News & Feed**: 뉴스 피드, AI 분석, **Kindle-style 텍스트 하이라이팅** ⭐
- **Education (Notes)**: 노트 관리, 뉴스 스크랩, 태그 시스템, 하이라이트 저장

### 🚧 개발 진행 중
- **Portfolio**: 포트폴리오 관리 및 성과 추적
- **Chat**: AI 챗봇 기반 학습 지원
- **Stocks**: 주식 검색, 상세 정보, 차트 분석
- **Learning**: 학습 추천 및 진행 상황

---

## 📋 빠른 시작

### 사전 요구사항

- **Node.js** 20.x 이상
- **pnpm** 8.x 이상
- **백엔드 API** 실행 중 (http://localhost:3001)

### 옵션 1: 자동 설정 스크립트 (권장)

**전체 프로젝트 설정을 위한 대화형 설정 스크립트를 제공합니다:**

```bash
# 루트 디렉토리에서 전체 프로젝트 설정
cd /Users/leejungbin/Downloads
bash setup-finfolio.sh
```

또는 프론트엔드만 설정:

```bash
# 프론트엔드 디렉토리에서
bash setup.sh
```

**설정 스크립트가 자동으로 체크하는 항목:**
1. ✅ Node.js 설치 확인
2. ✅ pnpm 설치 확인
3. ✅ 의존성 설치 (node_modules)
4. ✅ 환경 변수 파일 (.env.local)
5. ✅ 백엔드 연결 테스트

각 단계마다 이미 완료되었는지 확인하고, 필요한 경우에만 실행 여부를 물어봅니다.

---

### 옵션 2: 수동 설정

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local

# 3. 개발 서버 실행 (Turbopack)
pnpm dev
```

브라우저에서 http://localhost:3000 열기

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

---

## 🛠️ 기술 스택

### Core
- **Framework**: Next.js 16 (App Router)
- **Build Tool**: Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x

### State & Data
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod

### UI & Design
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Typography**: Pretendard (한글), Inter (영문)

---

## 📁 프로젝트 구조

```
finfolio-frontend/
├── app/                    # Next.js 16 App Router
│   ├── dashboard/         # 대시보드 페이지 ✅
│   ├── news/              # 뉴스 피드 & 하이라이팅 ✅
│   ├── education/         # 노트 관리 ✅
│   ├── portfolio/         # 포트폴리오 🚧
│   ├── chat/              # AI 챗봇 🚧
│   ├── stocks/            # 주식 정보 🚧
│   └── layout.tsx         # 루트 레이아웃
│
├── components/            # React 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── news/             # 뉴스 컴포넌트 (하이라이팅)
│   ├── education/        # 노트 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
│
├── lib/                  # 유틸리티 & 비즈니스 로직
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # API 서비스 레이어
│   ├── repositories/    # 데이터 액세스 레이어
│   ├── types/           # TypeScript 타입
│   ├── utils/           # 유틸리티 함수
│   └── contexts/        # React Context
│
└── docs/                # 프로젝트 문서

✅ = 완료  🚧 = 개발 중
```

---

## 🏗️ 아키텍처

**3-Layer Architecture**

```
Controller Layer (React Query Hooks)
    ↓
Service Layer (비즈니스 로직)
    ↓
Repository Layer (데이터 접근)
```

### 사용 예시

```typescript
// React Query Hook 사용
import { useNotes, useCreateNote } from '@/lib/hooks/use-notes';

function NoteList() {
  const { data: notes, isLoading } = useNotes();
  const createMutation = useCreateNote();

  // ...
}
```

자세한 내용은 [lib/ARCHITECTURE.md](./lib/ARCHITECTURE.md)를 참조하세요.

---

## ⭐ 핵심 기능: Kindle-style 텍스트 하이라이팅

뉴스 기사에서 텍스트를 선택하면 영구적으로 하이라이트되는 기능

### 작동 방식

1. 뉴스 기사에서 텍스트 드래그
2. 팝업에서 "노트 만들기" 클릭
3. 선택한 텍스트로 노트 생성
4. 텍스트 위치가 **문자 오프셋**으로 저장됨 (`highlightStart`, `highlightEnd`)
5. 페이지 새로고침 후에도 하이라이트 유지 ✨

### 구현 세부사항

**관련 파일:**
- `components/news/NewsWithNotes.tsx` - 하이라이트 렌더링
- `components/education/NoteModal.tsx` - 노트 생성
- `lib/types.ts` - Note 인터페이스

**데이터베이스 스키마:**
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  highlightStart?: number;  // 시작 문자 오프셋
  highlightEnd?: number;    // 종료 문자 오프셋
  newsId?: string;
  // ...
}
```

### 주요 버그 수정

**문제**: `highlightStart: 0`이 백엔드에서 `undefined`로 처리됨

**원인**: JavaScript의 falsy 값 처리
```typescript
// ❌ 잘못된 방법
highlightStart || undefined  // 0 || undefined → undefined

// ✅ 올바른 방법
highlightStart ?? undefined  // 0 ?? undefined → 0
```

**해결**: Nullish coalescing operator (`??`) 사용
- 프론트엔드: `NewsWithNotes.tsx`, `NoteModal.tsx`
- 백엔드: `NoteService.ts` (4곳 수정)

---

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: `#16A362` (브랜드 컬러)
- **Semantic**: Red, Blue, Yellow, Green
- **Neutral**: Gray Scale (50-900)

### 타이포그래피

- **한글**: Pretendard (400, 600, 700)
- **영문/숫자**: Inter (400, 600, 700)

### 간격 시스템

8px 배수 기반:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px


---

## 🛠️ 개발 명령어

```bash
# 개발
pnpm dev              # 개발 서버 실행 (Turbopack)
pnpm dev:turbo        # Turbopack 명시적 사용

# 빌드
pnpm build            # 프로덕션 빌드
pnpm start            # 프로덕션 서버 실행

# 코드 품질
pnpm lint             # ESLint 실행
pnpm lint:fix         # ESLint 자동 수정
pnpm type-check       # TypeScript 타입 체크

# 테스트
pnpm test             # 단위 테스트 (Vitest)
pnpm test:watch       # 테스트 watch 모드
pnpm test:e2e         # E2E 테스트 (Playwright)

# 의존성
pnpm install          # 의존성 설치
pnpm clean            # 캐시 및 빌드 삭제
```

---

## 📚 문서

- **[Quick Start](./docs/QUICK-START.md)** - 5분 안에 시작하기
- **[Architecture](./lib/ARCHITECTURE.md)** - 아키텍처 설명
- **[Docs](./docs/README.md)** - 전체 문서 목록

---

## 🐛 트러블슈팅

### 개발 서버가 시작되지 않을 때

```bash
# 캐시 삭제 및 재설치
rm -rf node_modules .next
pnpm install

# 포트 확인
lsof -i :3000

# 다른 포트로 실행
pnpm dev -- -p 3001
```

### API 연결 오류

1. 백엔드 서버 실행 확인: `curl http://localhost:3001/health`
2. `.env.local` 파일의 `NEXT_PUBLIC_API_URL` 확인
3. CORS 설정 확인 (백엔드)

### 빌드 오류

```bash
# 타입 체크
pnpm type-check

# 린트 수정
pnpm lint:fix

# 캐시 삭제 후 빌드
rm -rf .next && pnpm build
```

자세한 내용은 [docs/QUICK-START.md](./docs/QUICK-START.md)의 트러블슈팅 섹션을 참조하세요.

---

## 🚀 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/leebeanbin/insightstock-frontend)

**사전 준비**: `insightstock-backend`와 `insightstock-ai-service`가 먼저 실행 중이어야 합니다.

1. Vercel 대시보드에서 이 레포지토리 연결
2. 환경 변수 설정:

   | 변수 | 예시 | 설명 |
   |------|------|------|
   | `NEXT_PUBLIC_API_URL` | `https://api.your-domain.com` | 백엔드 API 서버 URL |
   | `NEXT_PUBLIC_WS_URL` | `wss://api.your-domain.com` | WebSocket URL (선택) |
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL 연결 문자열 |

3. Deploy 클릭

### 로컬 프로덕션 빌드

```bash
# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

---

## 🤝 기여

Private 프로젝트

---

## 📄 라이선스

Private Project

---

**Built with ❤️ by leebeanbin**
