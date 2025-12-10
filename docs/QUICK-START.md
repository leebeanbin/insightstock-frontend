# ⚡ InsightStock — Quick Start Guide
**5분 안에 개발 시작하기**

---

## 🎯 이 가이드의 목적

"지금 당장 무엇을 해야 하나요?" → 이 문서가 답입니다.

---

## 📚 문서 구조 한눈에 보기

```
📦 InsightStock Documentation Package
│
├── 📘 README.md                          ← 전체 문서 가이드
├── ⚡ QUICK-START.md                     ← 이 문서 (시작점)
├── 🎯 DEVELOPMENT-TODO.md                ← 일별 체크리스트 (35일)
│
├── 📋 기획 문서
│   └── PROJECT-MVP.md                    (PM, 디자이너용)
│
├── 🔧 기술 문서
│   ├── technical-spec-v2.md             (DB 스키마, API 명세)
│   └── features-summary.md              (추가 기능 설명)
│
└── 💎 고급 개발 가이드
    ├── advanced-dev-guide.md            (AI 챗봇, CRUD, 최적화)
    └── advanced-dev-guide-part2.md      (에러 처리, 테스팅)
```

---

## 🚀 3가지 시작 방법

### 방법 1: 순서대로 따라하기 (추천) ⭐

```
Day 1부터 차근차근 진행하고 싶다면:
→ DEVELOPMENT-TODO.md 열기
→ Day 1 체크리스트 완료
→ Day 2 체크리스트 완료
→ ...
```

**장점:** 놓치는 것 없이 체계적  
**소요 시간:** 7주 (35일)

---

### 방법 2: 핵심 기능만 빠르게 (MVP)

```
1주일 안에 프로토타입 만들고 싶다면:

Day 1-2:  환경 설정 + DB
Day 3-4:  Fastify + Auth
Day 5-7:  AI 챗봇 (핵심!)
```

**집중할 문서:**
- `DEVELOPMENT-TODO.md` (Day 1-10만)
- `advanced-dev-guide.md` Section 1 (AI 챗봇)

**건너뛸 수 있는 것:**
- Portfolio, Favorites, History
- 테스팅 (나중에)
- 배포 (로컬만)

---

### 방법 3: 특정 기능만 구현

#### AI 챗봇만 만들고 싶다면:
1. `DEVELOPMENT-TODO.md` Day 1-5 (환경 설정)
2. `advanced-dev-guide.md` Section 1 (AI 챗봇)
3. 코드 복사 → 붙여넣기 → 실행

#### Portfolio CRUD만 만들고 싶다면:
1. `DEVELOPMENT-TODO.md` Day 1-5 (환경 설정)
2. `advanced-dev-guide.md` Section 2 (CRUD 패턴)
3. `advanced-dev-guide-part2.md` Section 8 (완전한 예시)

#### 검색 기능만 만들고 싶다면:
1. `features-summary.md` 검색 섹션
2. `advanced-dev-guide.md` Section 4 (Prisma 최적화)

---

## 🎬 지금 바로 시작하기

### 1단계: 환경 확인 (5분)

```bash
# 필수 도구 설치 확인
node --version   # v20.x.x
pnpm --version   # 8.x.x 이상
docker --version # 24.x.x 이상

# 모두 설치되어 있지 않다면?
# → DEVELOPMENT-TODO.md Day 1 참조
```

---

### 2단계: 프로젝트 생성 (10분)

```bash
# 1. 루트 디렉토리 생성
mkdir insightstock && cd insightstock

# 2. Backend 생성
mkdir backend && cd backend
pnpm init
cd ..

# 3. Frontend 생성 (Next.js)
npx create-next-app@latest frontend

# 4. Docker 실행 (PostgreSQL + Redis)
# → DEVELOPMENT-TODO.md Day 1 docker-compose.yml 복사
docker-compose up -d
```

---

### 3단계: 첫 번째 API 만들기 (15분)

```bash
cd backend

# 1. 패키지 설치
pnpm add fastify @fastify/cors @fastify/jwt prisma @prisma/client zod
pnpm add -D typescript @types/node tsx

# 2. TypeScript 초기화
npx tsc --init

# 3. Prisma 초기화
npx prisma init

# 4. 기본 파일 구조
mkdir -p src/{routes,services,lib,dto,errors}
touch src/index.ts src/app.ts .env

# 5. app.ts 작성
# → DEVELOPMENT-TODO.md Day 6 참조 (복사 붙여넣기)

# 6. index.ts 작성
# → DEVELOPMENT-TODO.md Day 6 참조

# 7. 실행
pnpm add -D tsx
pnpm dev

# 8. 확인
# → http://localhost:3001/health
```

**성공 화면:**
```json
{"status":"ok","timestamp":"..."}
```

---

### 4단계: AI 챗봇 구현 (1-2일)

```bash
# 1. OpenAI API 키 발급
# → https://platform.openai.com/api-keys

# 2. .env 설정
OPENAI_API_KEY=sk-proj-...

# 3. AIChatService 작성
# → advanced-dev-guide.md Section 1.4 전체 복사

# 4. Chat Routes 작성
# → advanced-dev-guide.md Section 1.3

# 5. 테스트
curl -X POST http://localhost:3001/v1/chat/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"...","content":"PER이 뭔가요?"}'
```

---

## 📖 문서 읽는 순서

### 처음 시작하는 개발자

```
1. ⚡ QUICK-START.md (이 문서)           ← 지금 여기
2. 🎯 DEVELOPMENT-TODO.md (Day 1-5)     ← 환경 설정
3. 📘 advanced-dev-guide.md (Section 1) ← AI 챗봇
4. 🎯 DEVELOPMENT-TODO.md (Day 6-10)    ← 따라하기
```

### 경험 있는 개발자

```
1. 📋 technical-spec-v2.md              ← 전체 스펙 파악
2. 💎 advanced-dev-guide.md (전체)      ← 아키텍처 이해
3. 🎯 DEVELOPMENT-TODO.md               ← 필요한 부분만
4. 💻 바로 개발 시작
```

### 특정 기능 담당자

```
AI 챗봇 담당:
→ advanced-dev-guide.md Section 1

Portfolio 담당:
→ advanced-dev-guide.md Section 2
→ advanced-dev-guide-part2.md Section 8

검색 담당:
→ features-summary.md
→ advanced-dev-guide.md Section 4

테스팅 담당:
→ advanced-dev-guide-part2.md Section 7
```

---

## ⚠️ 자주 하는 실수

### ❌ 실수 1: 문서를 순서대로 안 읽음
```
기획 문서부터 읽지 마세요!
→ 개발자는 DEVELOPMENT-TODO.md부터 시작
```

### ❌ 실수 2: 환경 설정을 건너뜀
```
Docker 없이 진행하면 나중에 문제 발생
→ Day 1-2는 반드시 완료
```

### ❌ 실수 3: 코드를 이해하려고 함
```
처음에는 복사-붙여넣기로 시작
→ 동작 확인 후 천천히 이해
```

### ❌ 실수 4: 테스팅을 나중으로 미룸
```
기능 구현과 동시에 테스트 작성
→ 버그를 조기에 발견
```

### ❌ 실수 5: AI 챗봇을 Phase 2로 미룸
```
AI 챗봇이 MVP의 핵심입니다!
→ Week 2에 반드시 구현
```

---

## 🎯 첫 주 목표

### Day 1-2: 환경 설정
- [ ] Node.js, Docker 설치
- [ ] PostgreSQL + Redis 실행 확인
- [ ] 프로젝트 구조 생성

### Day 3-4: 데이터베이스
- [ ] Prisma 스키마 작성 (300줄)
- [ ] 마이그레이션 실행
- [ ] Prisma Studio 확인

### Day 5: 백엔드 기본
- [ ] Fastify 앱 실행
- [ ] /health 엔드포인트 확인
- [ ] Redis 연결 확인

**검증:**
```bash
# 모두 OK가 나와야 Week 2로 진행 가능
curl http://localhost:3001/health
redis-cli ping
npx prisma studio
```

---

## 💡 빠른 팁

### Prisma Schema 작성 시간 절약
```bash
# 문서에서 전체 스키마 복사 (300줄)
# → advanced-dev-guide.md Section 1.2
# 복사 → prisma/schema.prisma에 붙여넣기
# → npx prisma migrate dev
```

### OpenAI API 비용 절약
```typescript
// 캐싱 필수!
await cached('ai:qa:${hash(question)}', 86400, async () => {
  return await openai.chat.completions.create(...)
})
```

### 개발 속도 향상
```bash
# tsx watch 사용 (자동 재시작)
pnpm add -D tsx
pnpm dev # tsx watch src/index.ts

# Prisma Studio (DB GUI)
npx prisma studio
```

---

## 🆘 도움이 필요할 때

### 에러가 발생하면?
1. `DEVELOPMENT-TODO.md` 검증 섹션 확인
2. `advanced-dev-guide-part2.md` 트러블슈팅 섹션
3. Console 에러 메시지 복사 → 검색

### 코드를 어디서 복사하나?
- Auth: `DEVELOPMENT-TODO.md` Day 7-8
- AI Chat: `advanced-dev-guide.md` Section 1.4
- Portfolio: `advanced-dev-guide-part2.md` Section 8

### 동작하지 않으면?
```bash
# 환경 확인
node --version && docker ps && redis-cli ping

# Prisma 확인
npx prisma validate

# 로그 확인
pnpm dev (콘솔 출력 확인)
```

---

## 🎉 성공 기준

### Week 1 완료 시
- [ ] `curl http://localhost:3001/health` → OK
- [ ] `npx prisma studio` → DB 테이블 보임
- [ ] `redis-cli ping` → PONG

### Week 2 완료 시
- [ ] 회원가입/로그인 성공
- [ ] AI 챗봇 응답 받음
- [ ] PostgreSQL에 대화 저장 확인

### Week 7 완료 시
- [ ] Production 웹사이트 접속
- [ ] 모든 기능 동작
- [ ] 테스트 커버리지 > 80%

---

## 🚦 다음 단계

### 지금 바로:
```bash
# 1. DEVELOPMENT-TODO.md 열기
# 2. Day 1 체크리스트 시작
# 3. 하나씩 체크 ✅
```

### 막혔을 때:
```
1. 해당 Day의 "검증" 섹션 확인
2. 에러 메시지 확인
3. 관련 문서의 상세 섹션 읽기
```

### 완료 후:
```
1. 다음 Day로 진행
2. 주차별 완료 체크리스트 확인
3. Production 배포
```

---

## 📊 예상 시간

| 작업 | 경험자 | 초보자 |
|------|--------|--------|
| **환경 설정** | 2시간 | 1일 |
| **DB 스키마** | 3시간 | 2일 |
| **Auth API** | 4시간 | 2일 |
| **AI 챗봇** | 1일 | 3일 |
| **Portfolio** | 1일 | 2일 |
| **Frontend** | 2일 | 4일 |
| **테스팅** | 2일 | 3일 |
| **배포** | 1일 | 2일 |
| **총계** | **2-3주** | **5-7주** |

---

## 🎓 학습 경로

### 주니어 개발자 (기초부터)
```
Week 1: 환경 + DB (천천히)
Week 2-3: Auth + 기본 CRUD
Week 4-5: AI 챗봇
Week 6-7: Frontend
Week 8-9: 테스팅 + 배포
```

### 미들 개발자 (속도 있게)
```
Week 1: 환경 + DB + Auth
Week 2: AI 챗봇
Week 3: Portfolio + Stock
Week 4: Frontend
Week 5: 테스팅
Week 6-7: 최적화 + 배포
```

### 시니어 개발자 (아키텍처 중심)
```
Day 1-2: 전체 문서 리뷰
Day 3-7: 핵심 기능 구현
Week 2-3: 최적화 + 테스팅
Week 4: 배포 + CI/CD
```

---

## ✅ 최종 체크리스트

개발 시작 전:
- [ ] QUICK-START.md 완독 (이 문서)
- [ ] DEVELOPMENT-TODO.md 훑어보기
- [ ] 필요한 계정 생성 (OpenAI, Pinecone)
- [ ] VS Code + Extensions 설치
- [ ] Docker Desktop 실행

개발 중:
- [ ] 매일 체크리스트 완료
- [ ] 검증 단계 생략 금지
- [ ] Git commit (매일)
- [ ] 에러 즉시 해결

배포 전:
- [ ] 모든 테스트 통과
- [ ] Secret 키 재생성
- [ ] Environment Variables 확인
- [ ] Health Check 엔드포인트 확인

---

**이제 시작하세요!** 🚀

```bash
# 첫 명령어
cd ~/Projects
mkdir insightstock
cd insightstock

# 다음 문서 열기
open DEVELOPMENT-TODO.md
```

**화이팅!** 💪
