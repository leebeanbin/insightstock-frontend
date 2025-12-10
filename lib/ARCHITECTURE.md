# 🏗️ InsightStock Frontend Architecture

**3-Layer Architecture + SOLID 원칙 준수**

> **📌 관련 문서**: 
> - [데이터 소스 및 캐싱 전략](../../docs/DATA-SOURCE.md)
> - [기술 명세서](../../docs/TECHNICAL-SPECIFICATION.md)
> - [개발 가이드](../../docs/DEVELOPMENT-GUIDE.md)

---

## 📐 아키텍처 개요

```
┌─────────────────────────────────────────────┐
│  Controller Layer (React Query Hooks)     │
│  - usePortfolios, useChat, useFavorites    │
│  - 상태 관리, 캐싱, 에러 처리               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Service Layer                               │
│  - PortfolioService, ChatService             │
│  - 비즈니스 로직, 유효성 검증                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Repository Layer                            │
│  - PortfolioRepository, ChatRepository      │
│  - API 호출, 데이터 접근                     │
└─────────────────────────────────────────────┘
```

---

## 📁 디렉토리 구조

```
lib/
├── types/
│   ├── api/                    # API 타입 정의
│   │   ├── chat.types.ts
│   │   ├── portfolio.types.ts
│   │   ├── favorites.types.ts
│   │   ├── history.types.ts
│   │   ├── news.types.ts
│   │   ├── stock.types.ts
│   │   └── index.ts
│   └── types.ts                # 공통 타입
│
├── repositories/               # Repository Layer
│   ├── base.repository.ts      # Base 클래스
│   ├── chat.repository.ts
│   ├── portfolio.repository.ts
│   ├── favorites.repository.ts
│   ├── history.repository.ts
│   ├── news.repository.ts
│   └── stock.repository.ts
│
├── services/                   # Service Layer
│   ├── chat.service.ts
│   ├── portfolio.service.ts
│   ├── favorites.service.ts
│   ├── history.service.ts
│   ├── news.service.ts
│   ├── stock.service.ts
│   └── index.ts                # 통합 export
│
├── hooks/                      # Controller Layer (React Query)
│   ├── use-conversations.ts
│   ├── use-chat.ts
│   ├── use-portfolio.ts
│   ├── use-favorites.ts
│   ├── use-history.ts
│   ├── use-news.ts
│   └── use-stocks.ts
│
├── api-client.ts               # Axios 클라이언트
├── mock-data/                  # Mock 데이터
└── utils/                      # 유틸리티 함수
```

---

## 🔧 SOLID 원칙 적용

### 1. Single Responsibility Principle (단일 책임 원칙)

각 클래스는 하나의 책임만 가집니다:

- **Repository**: 데이터 접근만 담당
- **Service**: 비즈니스 로직만 담당
- **Hooks**: 상태 관리만 담당

### 2. Open/Closed Principle (개방/폐쇄 원칙)

`BaseRepository`를 상속하여 확장 가능:

```typescript
export class ChatRepository extends BaseRepository<Conversation> {
  // 새로운 Repository는 BaseRepository를 상속하여 확장
}
```

### 3. Liskov Substitution Principle (리스코프 치환 원칙)

모든 Repository는 `BaseRepository`를 대체 가능:

```typescript
const repository: BaseRepository<Conversation> = new ChatRepository();
```

### 4. Interface Segregation Principle (인터페이스 분리 원칙)

필요한 타입만 import:

```typescript
import { PortfolioItem } from '../types/api/portfolio.types';
```

### 5. Dependency Inversion Principle (의존성 역전 원칙)

Service가 Repository 인터페이스에 의존 (의존성 주입):

```typescript
export class PortfolioService {
  constructor(private repository: PortfolioRepository) {
    // Repository를 주입받음
  }
}
```

---

## 💡 사용 예시

### 예시 1: 포트폴리오 목록 조회

```typescript
// 컴포넌트에서
import { usePortfolios } from '@/lib/hooks/use-portfolio';

function PortfolioList() {
  const { data, isLoading, error } = usePortfolios({
    sortBy: 'profit',
    sortOrder: 'desc',
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.portfolios.map((portfolio) => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
      ))}
    </div>
  );
}
```

### 예시 2: 포트폴리오 추가

```typescript
import { useCreatePortfolio } from '@/lib/hooks/use-portfolio';
import { toast } from 'sonner';

function AddPortfolioForm() {
  const createMutation = useCreatePortfolio();

  const handleSubmit = async (data: CreatePortfolioRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('포트폴리오가 추가되었습니다.');
    } catch (error) {
      toast.error('포트폴리오 추가에 실패했습니다.');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 예시 3: Service 직접 사용 (비권장, 특수한 경우만)

```typescript
import { portfolioService } from '@/lib/services';

// 서버 컴포넌트나 API Route에서 사용
async function getServerSideProps() {
  const portfolios = await portfolioService.getPortfolios();
  return { props: { portfolios } };
}
```

---

## 🔄 데이터 흐름

```
1. 컴포넌트
   ↓ usePortfolios()
2. React Query Hook (Controller)
   ↓ portfolioService.getPortfolios()
3. Service Layer
   ↓ repository.findMany()
4. Repository Layer
   ↓ apiClient.get()
5. API Client
   ↓ HTTP Request
6. Backend API
```

---

## ✅ 장점

1. **테스트 용이성**: 각 레이어를 독립적으로 테스트 가능
2. **유지보수성**: 변경 사항이 한 레이어에만 영향
3. **재사용성**: Service를 여러 곳에서 재사용 가능
4. **타입 안정성**: TypeScript로 타입 보장
5. **캐싱**: React Query로 자동 캐싱 및 동기화

---

## 📚 참고 문서

- [DEVELOPMENT-GUIDE.md](../docs/DEVELOPMENT-GUIDE.md) - 개발 가이드
- [TECHNICAL-SPECIFICATION.md](../docs/TECHNICAL-SPECIFICATION.md) - 기술 명세서
- [DEVELOPMENT-TODO.md](../docs/DEVELOPMENT-TODO.md) - 개발 TODO

