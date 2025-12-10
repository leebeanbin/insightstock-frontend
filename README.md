# InsightStock Frontend

AI 기반 금융 학습 플랫폼 프론트엔드

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 📁 프로젝트 구조

```
insightstock-frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # Dashboard 페이지
│   ├── providers.tsx      # React Query Provider
│   └── globals.css        # 전역 스타일 및 디자인 토큰
├── components/            # 컴포넌트 라이브러리
│   ├── atoms/            # 기본 컴포넌트
│   ├── molecules/        # 조합 컴포넌트
│   └── organisms/        # 복합 컴포넌트
└── lib/                  # 핵심 라이브러리
    ├── repositories/     # Repository Layer (데이터 접근)
    ├── services/         # Service Layer (비즈니스 로직)
    ├── hooks/            # Controller Layer (React Query)
    ├── types/            # 타입 정의
    │   └── api/          # API 타입
    ├── api-client.ts     # Axios 클라이언트
    └── mock-data/        # Mock 데이터
```

## 🏗️ 아키텍처

**3-Layer Architecture + SOLID 원칙 준수**

```
Controller Layer (React Query Hooks)
    ↓
Service Layer (비즈니스 로직)
    ↓
Repository Layer (데이터 접근)
```

### 사용 예시

```typescript
// React Query Hook 사용 (권장)
import { usePortfolios, useCreatePortfolio } from '@/lib/hooks/use-portfolio';

function PortfolioList() {
  const { data, isLoading } = usePortfolios();
  const createMutation = useCreatePortfolio();
  // ...
}
```

자세한 내용은 [lib/ARCHITECTURE.md](./lib/ARCHITECTURE.md)를 참조하세요.

## 🎨 디자인 시스템

### 색상

- **Primary**: `#16A362` (브랜드 컬러)
- **Semantic**: Red, Blue, Yellow, Green
- **Neutral**: Gray Scale (50-900)

### 타이포그래피

- **한글**: Pretendard (400, 600, 700)
- **영문/숫자**: Inter (400, 600, 700)

### 간격

8px 배수 기반:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

## 📦 주요 컴포넌트

### Button

```tsx
<Button variant="primary" size="medium">
  버튼
</Button>
```

### Input

```tsx
<Input
  label="검색"
  placeholder="종목명 또는 코드 검색"
  prefix={<SearchIcon />}
/>
```

### Card

```tsx
<Card variant="elevated">
  내용
</Card>
```

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Package Manager**: pnpm

## 🏛️ 아키텍처 원칙

- **3-Layer Architecture**: Repository → Service → Hooks
- **SOLID 원칙**: 모든 원칙 준수
- **Dependency Injection**: Service에 Repository 주입
- **Type Safety**: TypeScript로 타입 보장

## 💾 데이터 소스 및 캐싱

### Prisma 데이터 소스

**백엔드 (insightstock-backend)**
- 위치: `/insightstock-backend/prisma/seed.ts`
- 역할: Prisma 데이터베이스에 Mock 주식 데이터 시드
- 실행: `cd insightstock-backend && pnpm db:seed`
- 데이터: 36개 인기 종목 (삼성전자, SK하이닉스 등)

**프론트엔드 (Fallback)**
- 위치: `/lib/api/krx.ts`
- 역할: 백엔드 API 호출 실패 시 Mock 데이터 사용
- 데이터: `POPULAR_STOCKS`, `BASE_PRICES` 상수

### 데이터 흐름

**정상 흐름 (백엔드 실행 시)**
1. 프론트엔드 → 백엔드 API (`http://localhost:3001/api/stocks/:code`)
2. 백엔드 → Prisma DB 조회
3. Prisma DB 없으면 → Naver API 호출 (현재 주석 처리)
4. 백엔드 → 프론트엔드 데이터 반환

**Fallback 흐름 (백엔드 미실행 시)**
1. 프론트엔드 → 백엔드 API 호출 시도
2. API 실패 → `lib/api/krx.ts` Mock 데이터 사용
3. `BASE_PRICES` 기반 랜덤 변동 생성

### 캐싱 전략

데이터 타입별 캐시 시간이 자동으로 설정됩니다 (`lib/config/cache.ts`):

| 데이터 타입 | 캐시 시간 | 설명 |
|------------|---------|------|
| **실시간 주가** | 10초 | 실시간 주가, 시장 지수 |
| **차트/검색** | 30초 | 차트 데이터, 실시간 검색, 히스토리 |
| **종목 목록/상세** | 1분 | 종목 목록, 종목 상세, 포트폴리오, 즐겨찾기, 대화 목록 |
| **뉴스** | 5분 | 뉴스 목록, 포트폴리오 분석 |
| **뉴스 상세** | 10분 | 뉴스 상세, AI 분석 |

**React Query 캐싱**
```typescript
// 자동으로 적절한 캐시 시간 적용
useQuery({
  queryKey: stockKeys.list(params),
  queryFn: () => stockService.getStocks(params),
  ...getCacheConfig('stock', 'list'), // 1분 캐시
});
```

**캐시 무효화**
- Mutation 후: 관련 쿼리 자동 무효화
- Window Focus: 실시간 주가만 포커스 시 refetch
- Network Reconnect: 모든 쿼리 재연결 시 refetch

자세한 내용은 [docs/DATA-SOURCE.md](./docs/DATA-SOURCE.md)를 참조하세요.

## 📚 참고 문서

### 📖 문서 인덱스
- **[docs/README.md](./docs/README.md)** - 문서 전체 인덱스 및 가이드
- **[docs/DOCUMENTATION-INDEX.md](./docs/DOCUMENTATION-INDEX.md)** - 상세 문서 인덱스

### 🚀 시작하기
- [docs/QUICK-START.md](./docs/QUICK-START.md) - 빠른 시작 가이드 (5분)
- [docs/DEVELOPMENT-TODO.md](./docs/DEVELOPMENT-TODO.md) - 35일 체크리스트

### 🏗️ 아키텍처 및 기술
- [lib/ARCHITECTURE.md](./lib/ARCHITECTURE.md) - 3-Layer 아키텍처 상세 설명
- [docs/DATA-SOURCE.md](./docs/DATA-SOURCE.md) - 데이터 소스 및 캐싱 전략 ⭐
- [docs/TECHNICAL-SPECIFICATION.md](./docs/TECHNICAL-SPECIFICATION.md) - 기술 명세서 (통합)

### 💻 개발 가이드
- [docs/CODE-STANDARDS.md](./docs/CODE-STANDARDS.md) ⭐ - 코드 규칙 및 상태 관리 가이드
- [docs/DEVELOPMENT-GUIDE.md](./docs/DEVELOPMENT-GUIDE.md) - 실전 개발 가이드 (통합)

### 🎨 디자인 및 기획
- [PROJECT-MVP.md](./PROJECT-MVP.md) - MVP 제품 기획서 (PRD)
- [DESIGN-GUIDE.md](./DESIGN-GUIDE.md) - Figma Design System 가이드
