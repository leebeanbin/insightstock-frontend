# 데이터 소스 및 캐싱 전략

## Prisma 데이터 소스

### 백엔드 (insightstock-backend)
- **위치**: `/insightstock-backend/prisma/seed.ts`
- **역할**: Prisma 데이터베이스에 Mock 주식 데이터를 시드(seed)합니다
- **실행 방법**:
  ```bash
  cd insightstock-backend
  pnpm db:seed
  ```
- **데이터**: 36개의 인기 종목 데이터 (삼성전자, SK하이닉스 등)

### 프론트엔드 (insightstock-frontend)
- **위치**: `/insightstock-frontend/lib/api/krx.ts`
- **역할**: 백엔드 API 호출 실패 시 Fallback으로 사용되는 Mock 데이터
- **데이터**: `POPULAR_STOCKS`, `BASE_PRICES` 상수

## 데이터 흐름

### 정상 흐름 (백엔드 실행 시)
1. 프론트엔드 → 백엔드 API (`http://localhost:3001/api/stocks/:code`)
2. 백엔드 → Prisma DB에서 데이터 조회
3. Prisma DB에 없으면 → Naver API 호출 (현재 주석 처리됨)
4. 백엔드 → 프론트엔드로 데이터 반환

### Fallback 흐름 (백엔드 미실행 시)
1. 프론트엔드 → 백엔드 API 호출 시도
2. API 호출 실패 → `lib/api/krx.ts`의 Mock 데이터 사용
3. `BASE_PRICES`를 기반으로 랜덤 변동 생성

## 캐싱 전략

### 캐시 시간 설정 (`lib/config/cache.ts`)

| 데이터 타입 | 캐시 시간 | 설명 |
|------------|---------|------|
| **실시간 데이터** | 10초 | 실시간 주가, 시장 지수 |
| **단기 캐시** | 30초 | 차트 데이터, 실시간 검색, 히스토리 |
| **중기 캐시** | 1분 | 종목 목록, 종목 상세, 포트폴리오, 즐겨찾기, 대화 목록 |
| **장기 캐시** | 5분 | 뉴스 목록, 포트폴리오 분석 |
| **매우 장기 캐시** | 10분 | 뉴스 상세, AI 분석 |

### React Query 캐싱 설정

```typescript
// 예시: 종목 목록 조회
useQuery({
  queryKey: stockKeys.list(params),
  queryFn: () => stockService.getStocks(params),
  ...getCacheConfig('stock', 'list'), // 1분 캐시
});
```

### 캐시 무효화 전략

- **Mutation 후**: 관련 쿼리 자동 무효화
- **Window Focus**: 실시간 주가만 포커스 시 refetch
- **Network Reconnect**: 모든 쿼리 재연결 시 refetch

## Next.js 캐싱

### fetch 캐싱 (`lib/api/krx.ts`)
```typescript
fetch(`${baseURL}/stocks/${code}`, {
  next: { revalidate: 10 }, // 10초 캐시 (실시간 주가)
});
```

## 주의사항

1. **백엔드 미실행 시**: Mock 데이터가 표시되므로 실제 주가와 다를 수 있습니다
2. **Prisma 시드 필요**: 백엔드에서 `pnpm db:seed` 실행 후 실제 데이터 사용 가능
3. **캐시 시간 조정**: `lib/config/cache.ts`에서 데이터 타입별 캐시 시간 수정 가능

