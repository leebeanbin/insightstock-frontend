# 🎯 InsightStock — Technical Specification
**Version 5.0 - Unified & Complete**  
**완전한 기술 명세서 | API 150+ | 경제성 분석 포함**

---

## 📚 목차

1. [시스템 개요](#1-시스템-개요)
2. [아키텍처 설계](#2-아키텍처-설계)
3. [External API 선택 & 경제성 분석](#3-external-api-선택--경제성-분석)
4. [Database Schema](#4-database-schema)
5. [API 엔드포인트 명세](#5-api-엔드포인트-명세)
6. [Background Jobs](#6-background-jobs)
7. [Phase별 개발 로드맵](#7-phase별-개발-로드맵)
8. [Additional Features](#8-additional-features)

---

## 1. 시스템 개요

### 1.1 프로젝트 목표

**InsightStock**은 주식 초보자를 위한 AI 기반 금융 교육 플랫폼입니다.

**핵심 가치:**
- 🤖 **AI 챗봇**: 금융 개념을 쉽게 설명
- 📊 **포트폴리오 분석**: AI 기반 리스크 분석 & 개선 제안
- 📰 **뉴스 AI 요약**: 자동 크롤링 + 감성 분석
- 🎯 **개인화 학습**: 사용자 수준에 맞는 추천

### 1.2 기술 스택

```
Frontend:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── Zustand (State)
└── React Query (Data Fetching)

Backend:
├── Node.js 20+
├── Express.js
├── TypeScript
├── Prisma (ORM)
└── PostgreSQL 16

AI & Data:
├── OpenAI API (GPT-4o mini / Claude Sonnet)
├── Pinecone (Vector DB)
├── 한국투자증권 OpenAPI (주식 데이터)
└── RSS (뉴스 크롤링)

Infrastructure:
├── Railway (Backend)
├── Vercel (Frontend)
├── Supabase (Database)
├── Upstash (Redis)
└── Cloudflare (CDN)
```

### 1.3 주요 기능

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| AI 챗봇 | 금융 개념 설명, RAG 기반 답변 | P0 |
| 포트폴리오 관리 | 보유 종목 CRUD, AI 리스크 분석 | P0 |
| 뉴스 AI 요약 | 자동 크롤링, 감성 분석, 키포인트 추출 | P1 |
| 학습 대시보드 | 개인화 추천, 통계, 노트 | P1 |
| 투자 전략 | 배당주/성장주 등 전략별 종목 추천 | P2 |
| 스크리너 | 다중 필터로 종목 검색 | P2 |
| 매매 일지 | 거래 기록, 수익률 분석 | P2 |
| 가격 알림 | 설정 가격 도달 시 이메일 발송 | P3 |

---

## 2. 아키텍처 설계

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Vercel)                                  │
│  - React Components                                          │
│  - Zustand State Management                                  │
│  - React Query (API Caching)                                │
│  - SSE Client (Streaming)                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server (Railway)                                │
│  - JWT Auth Middleware                                       │
│  - Rate Limiting                                             │
│  - Request Validation (Zod)                                  │
│  - Error Handling                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
                 ▼            ▼            ▼
┌──────────────────┐ ┌─────────────┐ ┌──────────────┐
│  Service Layer   │ │ AI Services │ │ External APIs│
├──────────────────┤ ├─────────────┤ ├──────────────┤
│ - Auth Service   │ │ - OpenAI    │ │ - 한국투자   │
│ - Stock Service  │ │ - Pinecone  │ │ - RSS Feeds  │
│ - Portfolio Svc  │ │ - RAG       │ └──────────────┘
│ - AI Chat Svc    │ │ - Streaming │
│ - News Service   │ └─────────────┘
└──────────────────┘
         │
         │ Prisma ORM
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 16 (Supabase)         Redis (Upstash)           │
│  - User Data                       - Session Cache          │
│  - Stock Data                      - API Rate Limit         │
│  - AI Conversations                - Price Cache            │
│  - Portfolios                      - Hot Issues Cache       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Background Jobs Layer                      │
├─────────────────────────────────────────────────────────────┤
│  BullMQ Workers                                             │
│  - News Crawler (5분마다)                                    │
│  - AI News Analysis                                          │
│  - Price Alert Checker (1분마다)                             │
│  - Hot Issue Calculator (10분마다)                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

#### 2.2.1 AI 챗봇 흐름

```
User Question
    │
    ▼
Auth Middleware (JWT)
    │
    ▼
Rate Limiter (10 req/min)
    │
    ▼
ChatService.sendMessage()
    │
    ├─→ Conversation 조회/생성
    │
    ├─→ Message 저장 (user role)
    │
    ├─→ RAG Search (Pinecone)
    │   └─→ 관련 문서 5개 검색
    │
    ├─→ Prompt 생성
    │   ├─ System Prompt
    │   ├─ User Question
    │   ├─ Conversation History (최근 10개)
    │   └─ RAG Context
    │
    ├─→ OpenAI API Call (Streaming)
    │   └─→ SSE로 실시간 응답
    │
    └─→ Message 저장 (assistant role)
```

#### 2.2.2 포트폴리오 AI 분석 흐름

```
GET /portfolio/analysis
    │
    ▼
Portfolio 조회 (with Stock)
    │
    ▼
데이터 가공
    ├─ 총 평가액
    ├─ 총 수익률
    ├─ 섹터 분포
    └─ 종목별 비중
    │
    ▼
AI 분석 (OpenAI)
    ├─ 리스크 점수 (0-100)
    ├─ 위험 요소 탐지
    │   ├─ 섹터 집중 (>40%)
    │   ├─ 종목 집중 (>30%)
    │   ├─ 변동성 (Beta > 1.5)
    │   └─ 배당 안정성
    │
    └─ 개선 제안
    │
    ▼
Response 반환
```

#### 2.2.3 뉴스 크롤링 & AI 분석 흐름

```
Cron Job (5분마다)
    │
    ▼
NewsSource 조회 (isActive=true)
    │
    ▼
For each source:
    │
    ├─→ RSS Feed 파싱
    │
    ├─→ 중복 체크 (url unique)
    │
    ├─→ News 저장 (title, content, publishedAt)
    │
    └─→ AI 분석 큐 추가 (BullMQ)
    │
    ▼
BullMQ Worker (AI Analysis)
    │
    ├─→ News 조회
    │
    ├─→ OpenAI API Call
    │   ├─ 요약 생성 (3-5줄)
    │   ├─ 감성 분석 (positive/negative/neutral)
    │   ├─ 감성 점수 (-1 to 1)
    │   ├─ 키포인트 추출 (3-5개)
    │   └─ 관련 개념 추출
    │
    ├─→ 관련 종목 자동 태깅
    │   └─→ 종목명/코드 매칭
    │
    └─→ News 업데이트
```

### 2.3 AI 아키텍처 결정: LangChain vs Pure OpenAI

#### 비교 분석

| 항목 | Pure OpenAI SDK | LangChain | 최종 선택 |
|------|----------------|-----------|----------|
| **학습 곡선** | 낮음 (공식 문서 명확) | 높음 (추상화 많음) | OpenAI ✅ |
| **RAG 구현** | 직접 구현 필요 | 내장 기능 | LangChain |
| **프롬프트 관리** | 수동 관리 | 템플릿 시스템 | LangChain |
| **메모리 관리** | 직접 구현 | Buffer Memory | LangChain |
| **번들 크기** | 작음 (~100KB) | 큼 (~2MB) | OpenAI ✅ |
| **디버깅** | 쉬움 (명확한 스택) | 어려움 (레이어 많음) | OpenAI ✅ |
| **확장성** | 중간 | 높음 (Multi-agent) | LangChain |
| **성능** | 빠름 | 약간 느림 | OpenAI ✅ |
| **TypeScript** | 완벽 | 좋음 | OpenAI ✅ |
| **커뮤니티** | 거대 | 성장 중 | OpenAI ✅ |

#### 최종 결정: **하이브리드 접근**

**Phase 1 (MVP, Week 1-7): Pure OpenAI SDK** ⭐
```typescript
import OpenAI from 'openai';

// 장점:
// 1. 빠른 개발 (학습 곡선 낮음)
// 2. 작은 번들 크기 (프론트엔드 최적화)
// 3. 디버깅 쉬움
// 4. 명확한 에러 핸들링

// 단점:
// 1. RAG 직접 구현 필요
// 2. 프롬프트 수동 관리

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ],
  stream: true
});
```

**Phase 2+ (Week 8+, 선택적): LangChain 도입**

도입 시나리오:
1. **RAG 복잡도 증가** (3+ 데이터 소스)
2. **Multi-agent 시스템** (뉴스 에이전트 + 포트폴리오 에이전트)
3. **프롬프트 버전 관리** (A/B 테스팅 필요)

```typescript
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";

// RAG 체인
const chain = ConversationalRetrievalQAChain.fromLLM(
  new ChatOpenAI({ temperature: 0.7 }),
  vectorStore.asRetriever(),
  { returnSourceDocuments: true }
);

// Multi-agent (Phase 3)
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

const newsAgent = createOpenAIToolsAgent({
  tools: [newsSummaryTool, sentimentAnalysisTool],
  llm: new ChatOpenAI()
});
```

**권장: MVP는 Pure OpenAI, Phase 2에서 필요 시 LangChain** ✅

---

## 3. External API 선택 & 경제성 분석

### 3.1 주식 데이터 API

#### 옵션 비교

| API | 무료 한도 | 유료 (월) | 실시간 | 한국 주식 | 평가 |
|-----|----------|----------|--------|-----------|------|
| **한국투자증권** | 무료 | 무료 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| 대신증권 | 무료 | 무료 | ✅ | ✅ | ⭐⭐⭐⭐ |
| FinanceDataReader | 무료 | 무료 | ❌ | ✅ | ⭐⭐⭐ |
| Alpha Vantage | 25 req/day | $49.99 | ❌ | ❌ | ❌ |
| Polygon.io | 5 req/min | $99 | ✅ | ❌ | ❌ |

#### 최종 선택: **한국투자증권 OpenAPI** ⭐

**선택 이유:**
- ✅ **완전 무료** (무제한 사용)
- ✅ **실시간 데이터** (WebSocket 지원)
- ✅ **한국 주식 완벽 지원** (KOSPI, KOSDAQ)
- ✅ **모의투자 계좌** 제공
- ✅ **높은 Rate Limit** (초당 20회)

**설정:**
```typescript
// 환경 변수
KOREA_INVESTMENT_APP_KEY=발급받은_APP_KEY
KOREA_INVESTMENT_APP_SECRET=발급받은_APP_SECRET
KOREA_INVESTMENT_ACCOUNT=모의투자_계좌번호
KOREA_INVESTMENT_BASE_URL=https://openapi.koreainvestment.com:9443

// WebSocket (실시간 시세)
KOREA_INVESTMENT_WS_URL=ws://ops.koreainvestment.com:21000

// API 신청
// 1. https://apiportal.koreainvestment.com 접속
// 2. 회원가입 후 API Key 발급
// 3. 모의투자 계좌 신청
// 4. 승인 (1-2일 소요)
```

**사용량 예상 (DAU 1,000):**
```
일일 요청:
- 주가 조회: 1,000 users × 10 stocks = 10,000 req
- 차트 데이터: 1,000 users × 5 charts = 5,000 req
- 검색: 1,000 users × 20 searches = 20,000 req
- 총: ~35,000 req/day

Rate Limit: 20 req/sec = 1,728,000 req/day ✅ 충분!
비용: $0/month ✅
```

**Fallback: 대신증권 OpenAPI**
- 동일하게 무료
- 한국투자증권 장애 시 자동 전환

---

### 3.2 AI API (LLM)

#### 옵션 비교

| API | 무료 한도 | 입력 (1M tokens) | 출력 (1M tokens) | 평가 |
|-----|----------|-----------------|-----------------|------|
| **OpenAI GPT-4o mini** | $5 크레딧 | $0.15 | $0.60 | ⭐⭐⭐⭐⭐ |
| OpenAI GPT-4 Turbo | $5 크레딧 | $10 | $30 | ⭐⭐⭐⭐ |
| Anthropic Claude Sonnet | 무료 | $3 | $15 | ⭐⭐⭐⭐ |
| Google Gemini Pro | 무료 (60 req/min) | 무료 | 무료 | ⭐⭐⭐ |
| Cohere | 무료 (100 req/min) | $1 | $2 | ⭐⭐ |

#### 최종 선택: **하이브리드 전략** ⭐

**Phase 1 (MVP): OpenAI GPT-4o mini**

```typescript
// 비용 계산
입력 단가: $0.15 / 1M tokens
출력 단가: $0.60 / 1M tokens

// 예상 사용량 (DAU 1,000, 1일 평균 3회 질문)
질문 수: 1,000 users × 3 questions = 3,000 questions/day
평균 입력: 500 tokens (프롬프트 + 대화 히스토리 + RAG)
평균 출력: 300 tokens (답변)

// 월간 사용량
입력: 3,000 × 500 = 1,500,000 tokens/day = 45M tokens/month
출력: 3,000 × 300 = 900,000 tokens/day = 27M tokens/month

// 월간 비용
입력: 45M × $0.15 / 1M = $6.75
출력: 27M × $0.60 / 1M = $16.20
총: $22.95/month ✅ 매우 저렴!

사용자당 비용: $0.023/user/month
```

**Phase 2 (Growth): GPT-4o mini (80%) + Claude Sonnet (20%)**

```typescript
// 전략: 간단한 질문은 mini, 복잡한 분석은 Sonnet
질문 수: 3,000/day

mini (80%, 2,400/day):
- 입력: 2,400 × 500 × $0.15/1M = $0.18/day = $5.40/month
- 출력: 2,400 × 300 × $0.60/1M = $0.43/day = $12.90/month
- 소계: $18.30/month

Sonnet (20%, 600/day):
- 입력: 600 × 800 × $3/1M = $1.44/month
- 출력: 600 × 500 × $15/1M = $4.50/month
- 소계: $5.94/month

총: $24.24/month ✅ 비용 유사 + 품질 향상!
```

**Phase 3 (Scale): Gemini Pro (Free Tier) + 유료 API**

```typescript
// Free Tier 최대 활용
Gemini Pro: 60 req/min = 86,400 req/day (무료)

// 사용자 분할
Free 사용자: Gemini Pro (무료)
Pro 사용자: OpenAI/Claude (Pro 구독료로 충당)

// 비용
Free 사용자: $0
Pro 사용자 (10%): $24/month
Pro 구독료: $9.99/month × 2,000 users = $19,980/month

순이익: $19,980 - $24 = $19,956/month 💰
```

---

### 3.3 Vector Database (RAG)

#### 옵션 비교

| DB | 무료 한도 | 유료 (월) | 성능 | 평가 |
|----|----------|----------|------|------|
| **Pinecone Starter** | 1 Index, 100K vectors | $0 | 우수 | ⭐⭐⭐⭐⭐ |
| Pinecone Standard | 5 Indexes, 10M vectors | $70 | 최고 | ⭐⭐⭐⭐ |
| **Supabase Vector** | 500MB 무료 | $25 | 좋음 | ⭐⭐⭐⭐ |
| Weaviate Cloud | 무료 14일 | $25 | 우수 | ⭐⭐⭐ |
| Qdrant Cloud | 1GB 무료 | $25 | 좋음 | ⭐⭐⭐ |
| PostgreSQL pgvector | 무료 (자체 호스팅) | 인프라 비용 | 보통 | ⭐⭐ |

#### 최종 선택: **Pinecone (MVP) → Supabase (Phase 2)** ⭐

**Phase 1 (MVP): Pinecone Starter**

```typescript
// 비용: $0/month ✅

// 제한
제한사항:
- 1 Index
- 100,000 vectors (1,536 dimension)
- 100 requests/sec

// 예상 사용량
금융 개념 문서: ~5,000 documents
뉴스 (rolling 1개월): ~10,000 documents
총: 15,000 vectors ✅ 충분!

// 장점
✅ 설정 간단
✅ 성능 최고
✅ 무료
✅ Serverless

// 단점
⚠️ 100K 초과 시 유료 ($70/month)
```

**Phase 2 (Growth): Supabase Vector**

```typescript
// 비용: $25/month (Pro Plan) ✅

// 포함 사항
8GB Database (PostgreSQL)
50GB Bandwidth
Vector Search (pgvector extension)
기존 DB와 통합!

// 예상 사용량
금융 개념: ~20,000 documents
뉴스 (rolling 3개월): ~100,000 documents
총: 120,000 vectors
저장 용량: ~2GB (8GB 내) ✅

// 장점
✅ 기존 PostgreSQL과 통합
✅ Vector + Relational 쿼리 동시 가능
✅ 비용 효율적 (Pinecone $70 대비 64% 절감!)
✅ 백업 자동

// 구현
-- pgvector 활성화
CREATE EXTENSION vector;

-- 임베딩 저장
CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536),
  metadata JSONB
);

-- Vector 인덱스
CREATE INDEX ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 유사도 검색
SELECT content, 1 - (embedding <=> query_vector) AS similarity
FROM embeddings
ORDER BY embedding <=> query_vector
LIMIT 5;
```

---

### 3.4 뉴스 데이터

#### 옵션 비교

| 방법 | 비용 | 데이터 품질 | 실시간성 | 평가 |
|------|------|------------|---------|------|
| **직접 RSS 크롤링** | $0 | 우수 | 5분 지연 | ⭐⭐⭐⭐⭐ |
| NewsAPI.org | 무료 (100 req/day) | 우수 | 실시간 | ⭐⭐⭐ |
| GNews | 무료 (100 req/day) | 좋음 | 실시간 | ⭐⭐ |

#### 최종 선택: **직접 RSS 크롤링** ⭐

**선택 이유:**
- ✅ **완전 무료**
- ✅ **무제한 수집**
- ✅ **커스터마이징 가능**
- ✅ **한국 주요 언론사 RSS 지원**

**구현:**

```typescript
// RSS 소스 (모두 무료)
const newsSources = [
  {
    name: "네이버 증권",
    rss: "https://finance.naver.com/news/news_list.nhn?mode=LSS3D&section_id=101&section_id2=258&section_id3=401&rss=1",
    category: "stock"
  },
  {
    name: "한국경제",
    rss: "https://www.hankyung.com/feed/stock",
    category: "stock"
  },
  {
    name: "조선비즈",
    rss: "https://biz.chosun.com/rss/stock.xml",
    category: "stock"
  },
  {
    name: "이데일리",
    rss: "https://www.edaily.co.kr/rss/rss_stock.xml",
    category: "stock"
  },
  {
    name: "매일경제",
    rss: "https://www.mk.co.kr/rss/50200001/",
    category: "stock"
  }
];

// Cron: */5 * * * * (5분마다)
// 예상 수집량: ~10,000 articles/day
// 비용: $0/month ✅
// 저장 용량: ~5MB/day = 150MB/month ✅
```

---

### 3.5 Infrastructure

#### 옵션 비교

| 서비스 | 무료 한도 | 유료 (월) | 평가 |
|--------|----------|----------|------|
| **Railway** | $5 크레딧 | ~$10 | ⭐⭐⭐⭐⭐ |
| **Vercel** | 무제한 | $0 (Frontend) | ⭐⭐⭐⭐⭐ |
| **Supabase** | 500MB DB | $0 | ⭐⭐⭐⭐⭐ |
| **Upstash Redis** | 10K commands/day | $0 | ⭐⭐⭐⭐⭐ |
| AWS | 12개월 무료 | ~$50 | ⭐⭐ |
| Google Cloud | $300 크레딧 | ~$50 | ⭐⭐ |
| Heroku | 무료 폐지 | $7 (Dyno) | ⭐ |

#### 최종 선택: **Railway + Vercel + Supabase + Upstash** ⭐

**Phase 1 (MVP, DAU 1,000): 무료 Tier 최대 활용**

```
Backend: Railway
├─ Starter Plan: $5 크레딧/월
├─ 실제 사용: ~$10/월 (초과 시 과금)
├─ PostgreSQL 포함
└─ Background Jobs 실행 가능

Frontend: Vercel
├─ Hobby Plan: 무료
├─ Bandwidth: 100GB/월
├─ Builds: 무제한
└─ Serverless Functions 포함

Database: Supabase
├─ Free Plan: 500MB
├─ API requests: 무제한
├─ Auth 포함
└─ Real-time 포함

Cache: Upstash Redis
├─ Free Plan: 10K commands/day
├─ 충분함 (DAU 1,000)
└─ Serverless

총 비용: ~$10/month ✅ 매우 저렴!
```

**Phase 2 (Growth, DAU 5,000): 유료 Tier**

```
Backend: Railway (Hobby $20)
Frontend: Vercel (Pro $20)
Database: Supabase (Pro $25)
Cache: Upstash (Pay-as-you-go $10)
CDN: Cloudflare (무료)

총 비용: ~$75/month
```

**Phase 3 (Scale, DAU 20,000+): AWS/GCP 마이그레이션**

```
Backend: AWS ECS (Fargate) $150
Database: AWS RDS (PostgreSQL) $100
Cache: AWS ElastiCache $50
CDN: CloudFront $50
Storage: S3 $20

총 비용: ~$370/month
```

---

### 3.6 총 비용 요약

#### Phase 1 (MVP, DAU 1,000)

| 항목 | 서비스 | 비용/월 |
|------|--------|--------|
| 주식 데이터 | 한국투자증권 | $0 |
| AI | OpenAI GPT-4o mini | $23 |
| Vector DB | Pinecone Starter | $0 |
| 뉴스 | RSS 크롤링 | $0 |
| Backend | Railway | $10 |
| Frontend | Vercel | $0 |
| Database | Supabase Free | $0 |
| Cache | Upstash Free | $0 |
| **총계** | | **$33/month** ✅ |

**사용자당 비용: $0.033/month**

**손익분기점:**
- Pro Tier 구독료: $9.99/month
- 전환율 1% (10명) = $99.90/month
- 순이익: $99.90 - $33 = **$66.90/month** 💰

---

#### Phase 2 (Growth, DAU 5,000)

| 항목 | 서비스 | 비용/월 |
|------|--------|--------|
| 주식 데이터 | 한국투자증권 | $0 |
| AI | GPT-4o mini + Claude | $80 |
| Vector DB | Supabase Pro | $25 |
| 뉴스 | RSS 크롤링 | $0 |
| Infrastructure | Railway + Vercel + Supabase | $75 |
| **총계** | | **$180/month** |

**사용자당 비용: $0.036/month**

**수익:**
```
Pro Tier:
- 전환율: 10% (500명)
- 구독료: $9.99/month
- 수익: 500 × $9.99 = $4,995/month

순이익: $4,995 - $180 = $4,815/month 💰💰
ROI: 2,675%
```

---

#### Phase 3 (Scale, DAU 20,000)

| 항목 | 서비스 | 비용/월 |
|------|--------|--------|
| 주식 데이터 | 한국투자증권 | $0 |
| AI | Gemini Pro (Free) + OpenAI (Pro) | $150 |
| Vector DB | Supabase Pro | $50 |
| 뉴스 | RSS 크롤링 | $0 |
| Infrastructure | AWS/GCP | $300 |
| **총계** | | **$500/month** |

**수익:**
```
Pro Tier:
- 전환율: 10% (2,000명)
- 구독료: $9.99/month
- 수익: 2,000 × $9.99 = $19,980/month

순이익: $19,980 - $500 = $19,480/month 💰💰💰
ARR: $233,760/year
```

---

### 3.7 경제성 비교 요약

| Phase | DAU | 비용/월 | 수익/월 | 순이익/월 | ROI |
|-------|-----|--------|--------|----------|-----|
| MVP | 1,000 | $33 | $100 | $67 | 203% |
| Growth | 5,000 | $180 | $4,995 | $4,815 | 2,675% |
| Scale | 20,000 | $500 | $19,980 | $19,480 | 3,896% |

**결론:**
- ✅ MVP 단계부터 수익 가능
- ✅ 확장 가능한 아키텍처
- ✅ 비용 효율 최적화
- ✅ 무료 Tier 최대 활용

---

## 4. Database Schema

### 4.1 ERD Overview

```
User ─┬─ Conversation ── Message
      ├─ Portfolio
      ├─ Favorite
      ├─ History
      ├─ Watchlist
      ├─ Learning
      ├─ Note
      ├─ Trade
      ├─ PriceAlert
      └─ NotificationSetting

Stock ─┬─ StockPrice
       ├─ Portfolio
       ├─ Favorite
       ├─ History
       ├─ Watchlist
       ├─ News (관계)
       ├─ Trade
       └─ StrategyResult

News ─── NewsSource
Strategy ── StrategyResult
Concept ── LearningRecommendation
```

### 4.2 Complete Prisma Schema

```prisma
// ============================================
// Core Tables
// ============================================

model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  password  String?
  name      String?
  avatar    String?
  isAnonymous Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  conversations     Conversation[]
  messages          Message[]
  portfolios        Portfolio[]
  favorites         Favorite[]
  history           History[]
  watchlist         Watchlist[]
  learnings         Learning[]
  notes             Note[]
  trades            Trade[]
  priceAlerts       PriceAlert[]
  notificationSetting NotificationSetting?
  learningRecommendations LearningRecommendation[]

  @@map("users")
}

model Stock {
  id          String   @id @default(cuid())
  code        String   @unique // "005930"
  name        String   // "삼성전자"
  market      String   // "KOSPI", "KOSDAQ"
  sector      String?  // "반도체", "자동차"
  currentPrice Decimal @db.Decimal(10, 2)
  changeRate  Decimal  @db.Decimal(5, 2)
  volume      BigInt?
  marketCap   BigInt?
  per         Decimal? @db.Decimal(10, 2)
  pbr         Decimal? @db.Decimal(10, 2)
  roe         Decimal? @db.Decimal(5, 2)
  dividendYield Decimal? @db.Decimal(5, 2)
  updatedAt   DateTime @updatedAt

  // Relations
  prices        StockPrice[]
  portfolios    Portfolio[]
  favorites     Favorite[]
  history       History[]
  watchlist     Watchlist[]
  news          News[]
  trades        Trade[]
  strategyResults StrategyResult[]

  @@index([code])
  @@index([market])
  @@index([sector])
  @@map("stocks")
}

model StockPrice {
  id        String   @id @default(cuid())
  stockId   String
  stock     Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)
  date      DateTime
  open      Decimal  @db.Decimal(10, 2)
  high      Decimal  @db.Decimal(10, 2)
  low       Decimal  @db.Decimal(10, 2)
  close     Decimal  @db.Decimal(10, 2)
  volume    BigInt
  change    Decimal  @db.Decimal(10, 2)
  changeRate Decimal @db.Decimal(5, 2)

  @@unique([stockId, date])
  @@index([stockId, date(sort: Desc)])
  @@map("stock_prices")
}

// ============================================
// Market Data
// ============================================

model MarketIndex {
  id        String   @id @default(cuid())
  market    String   // "KOSPI", "KOSDAQ", "USD/KRW", "WTI"
  value     Decimal  @db.Decimal(20, 2)
  change    Decimal  @db.Decimal(10, 2)
  changeRate Decimal @db.Decimal(10, 2)
  volume    BigInt?
  timestamp DateTime @default(now())
  
  @@index([market, timestamp(sort: Desc)])
  @@map("market_indices")
}

// ============================================
// News System
// ============================================

model NewsSource {
  id          String   @id @default(cuid())
  name        String   // "네이버증권", "조선비즈"
  url         String   // RSS URL
  isActive    Boolean  @default(true)
  crawlInterval Int    @default(300) // 초 단위 (5분)
  lastCrawl   DateTime?
  
  news        News[]
  
  @@map("news_sources")
}

model News {
  id            String      @id @default(cuid())
  sourceId      String
  source        NewsSource  @relation(fields: [sourceId], references: [id])
  stockId       String?
  stock         Stock?      @relation(fields: [stockId], references: [id])
  
  title         String
  content       String      @db.Text
  url           String      @unique
  publishedAt   DateTime
  
  // AI Analysis
  summary       String?     @db.Text
  sentiment     String?     // "positive", "negative", "neutral"
  sentimentScore Decimal?   @db.Decimal(5, 2) // -1 to 1
  keyPoints     Json?       // ["포인트1", "포인트2", ...]
  relatedConcepts Json?     // ["PER", "배당", ...]
  
  // Search
  searchText    String?     @db.Text // title + content (tsvector in production)
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  hotIssues     HotIssue[]
  
  @@index([publishedAt(sort: Desc)])
  @@index([stockId, publishedAt(sort: Desc)])
  @@index([sentiment])
  @@map("news")
}

// ============================================
// AI Chat
// ============================================

model Conversation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String   @default("New Conversation")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  messages  Message[]

  @@index([userId, updatedAt(sort: Desc)])
  @@map("conversations")
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  role           String       // "user", "assistant"
  content        String       @db.Text
  createdAt      DateTime     @default(now())

  @@index([conversationId, createdAt])
  @@map("messages")
}

model Embedding {
  id        String   @id @default(cuid())
  content   String   @db.Text
  embedding Json     // Vector embedding (1536 dimensions)
  metadata  Json?    // { source, category, etc }
  createdAt DateTime @default(now())

  @@map("embeddings")
}

// ============================================
// Portfolio
// ============================================

model Portfolio {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId       String
  stock         Stock    @relation(fields: [stockId], references: [id])
  quantity      Int
  averagePrice  Decimal  @db.Decimal(10, 2)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, stockId])
  @@index([userId])
  @@map("portfolios")
}

// ============================================
// User Actions
// ============================================

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId   String
  stock     Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, stockId])
  @@index([userId, createdAt(sort: Desc)])
  @@map("favorites")
}

model History {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId   String
  stock     Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)
  viewedAt  DateTime @default(now())

  @@index([userId, viewedAt(sort: Desc)])
  @@map("history")
}

model Watchlist {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId         String
  stock           Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)
  targetPrice     Decimal? @db.Decimal(10, 2)
  notifyOnChange  Boolean  @default(false)
  createdAt       DateTime @default(now())

  @@unique([userId, stockId])
  @@index([userId])
  @@map("watchlist")
}

// ============================================
// Learning System
// ============================================

model Learning {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  question    String   @db.Text
  answer      String   @db.Text
  category    String?  // "재무제표", "기술적분석", "투자전략"
  isBookmarked Boolean @default(false)
  createdAt   DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
  @@index([category])
  @@map("learnings")
}

model Note {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  content   String   @db.Text
  tags      String[] // ["포트폴리오", "배당주"]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, updatedAt(sort: Desc)])
  @@map("notes")
}

model Concept {
  id          String   @id @default(cuid())
  name        String   @unique // "PER", "ROE", "배당수익률"
  category    String   // "재무제표", "기술적분석", "투자지표"
  definition  String   @db.Text
  importance  Int      @default(5) // 0-10
  examples    Json?    // 예시 목록
  commonMistakes Json? // 흔한 오해
  createdAt   DateTime @default(now())
  
  recommendations LearningRecommendation[]
  
  @@index([category])
  @@map("concepts")
}

model LearningRecommendation {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id])
  reason      String   // "portfolio_based", "news_based", "repeated_question"
  priority    Int      @default(5) // 0-10
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@index([userId, isRead])
  @@index([userId, createdAt(sort: Desc)])
  @@map("learning_recommendations")
}

// ============================================
// Trading
// ============================================

model Trade {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId     String
  stock       Stock    @relation(fields: [stockId], references: [id])
  type        String   // "BUY", "SELL"
  quantity    Int
  price       Decimal  @db.Decimal(10, 2)
  totalAmount Decimal  @db.Decimal(15, 2)
  reason      String?  @db.Text
  tags        String[] // ["단타", "장기투자"]
  learningIds String[] // 참고한 학습 ID
  tradeDate   DateTime
  createdAt   DateTime @default(now())
  
  @@index([userId, tradeDate(sort: Desc)])
  @@index([stockId, tradeDate(sort: Desc)])
  @@map("trades")
}

// ============================================
// Strategy & Explore
// ============================================

model Strategy {
  id          String   @id @default(cuid())
  name        String   @unique // "배당주 전략"
  description String   @db.Text
  category    String   // "dividend", "growth", "value", "momentum"
  criteria    Json     // 필터 조건
  explanation String?  @db.Text // AI 생성 설명
  risks       String?  @db.Text
  suitableFor String?  @db.Text // 적합한 투자자
  createdAt   DateTime @default(now())
  
  results     StrategyResult[]
  
  @@index([category])
  @@map("strategies")
}

model StrategyResult {
  id          String   @id @default(cuid())
  strategyId  String
  strategy    Strategy @relation(fields: [strategyId], references: [id], onDelete: Cascade)
  stockId     String
  stock       Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)
  score       Decimal  @db.Decimal(5, 2) // 0-100
  metrics     Json     // 전략별 핵심 지표
  calculatedAt DateTime @default(now())
  
  @@unique([strategyId, stockId])
  @@index([strategyId, score(sort: Desc)])
  @@map("strategy_results")
}

// ============================================
// Hot Issues
// ============================================

model HotIssue {
  id          String   @id @default(cuid())
  type        String   // "stock", "news"
  stockId     String?
  newsId      String?
  news        News?    @relation(fields: [newsId], references: [id])
  reason      String   // "volume_surge", "search_spike", "high_views"
  score       Decimal  @db.Decimal(10, 2)
  startedAt   DateTime @default(now())
  expiresAt   DateTime // 24시간 후
  
  @@index([type, score(sort: Desc)])
  @@index([expiresAt])
  @@map("hot_issues")
}

// ============================================
// Notifications
// ============================================

model NotificationSetting {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  emailEnabled      Boolean  @default(true)
  priceAlertEmail   Boolean  @default(true)
  newsAlertEmail    Boolean  @default(true)
  learningEmail     Boolean  @default(true)
  pushEnabled       Boolean  @default(false)
  updatedAt         DateTime @updatedAt
  
  @@map("notification_settings")
}

model PriceAlert {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stockId   String
  type      String   // "above", "below", "change_percent"
  value     Decimal  @db.Decimal(10, 2)
  isActive  Boolean  @default(true)
  triggered Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([userId, isActive])
  @@index([stockId, isActive])
  @@map("price_alerts")
}
```

### 4.3 Database Indexes Strategy

**주요 인덱스:**
```sql
-- 성능 최적화를 위한 핵심 인덱스

-- 1. User Query Patterns
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX idx_portfolio_user ON portfolios(user_id);
CREATE INDEX idx_favorites_user_created ON favorites(user_id, created_at DESC);

-- 2. Stock Data
CREATE INDEX idx_stock_code ON stocks(code);
CREATE INDEX idx_stock_market ON stocks(market);
CREATE INDEX idx_stock_prices_stock_date ON stock_prices(stock_id, date DESC);

-- 3. News & Content
CREATE INDEX idx_news_published ON news(published_at DESC);
CREATE INDEX idx_news_stock_published ON news(stock_id, published_at DESC);
CREATE INDEX idx_news_sentiment ON news(sentiment);

-- 4. Search Performance
CREATE INDEX idx_learnings_user_created ON learnings(user_id, created_at DESC);
CREATE INDEX idx_trades_user_date ON trades(user_id, trade_date DESC);

-- 5. Full-Text Search (Production)
CREATE INDEX idx_news_search ON news USING gin(to_tsvector('korean', search_text));
```

---

## 5. API 엔드포인트 명세

### 5.1 인증 (Authentication)

#### POST /auth/anonymous
익명 사용자 생성

**Request:**
```json
{
  "deviceId": "uuid-device-123"
}
```

**Response:**
```json
{
  "user": {
    "id": "cuid123",
    "isAnonymous": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

---

#### POST /auth/register
회원가입

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**Response:**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "홍길동",
    "isAnonymous": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

**Errors:**
- `400` Email already exists
- `400` Invalid password (min 8 characters)

---

#### POST /auth/login
로그인

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "홍길동"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

**Errors:**
- `401` Invalid credentials

---

#### POST /auth/refresh
토큰 갱신

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

#### GET /auth/me
현재 사용자 정보 조회

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": "cuid123",
  "email": "user@example.com",
  "name": "홍길동",
  "avatar": "https://example.com/avatar.jpg",
  "isAnonymous": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### POST /auth/logout
로그아웃

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5.2 Stock & Market APIs

#### GET /stocks
종목 리스트 조회

**Query Parameters:**
```
market: "KOSPI" | "KOSDAQ" | "all" (default: "all")
sector: string (optional)
sortBy: "price" | "changeRate" | "volume" | "marketCap" (default: "marketCap")
sortOrder: "asc" | "desc" (default: "desc")
limit: number (default: 20)
offset: number (default: 0)
```

**Response:**
```json
{
  "stocks": [
    {
      "id": "cuid123",
      "code": "005930",
      "name": "삼성전자",
      "market": "KOSPI",
      "sector": "반도체",
      "currentPrice": 71000,
      "changeRate": 1.5,
      "volume": 10000000,
      "marketCap": 423000000000000,
      "per": 15.2,
      "pbr": 1.1,
      "roe": 7.5,
      "dividendYield": 2.3
    }
  ],
  "total": 1000,
  "limit": 20,
  "offset": 0
}
```

---

#### GET /stocks/:id
종목 상세 조회

**Response:**
```json
{
  "id": "cuid123",
  "code": "005930",
  "name": "삼성전자",
  "market": "KOSPI",
  "sector": "반도체",
  "currentPrice": 71000,
  "changeRate": 1.5,
  "volume": 10000000,
  "marketCap": 423000000000000,
  "per": 15.2,
  "pbr": 1.1,
  "roe": 7.5,
  "dividendYield": 2.3,
  "description": "세계 최대의 반도체 제조업체...",
  "recentNews": [...],
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /stocks/:id/prices
차트 데이터 조회

**Query Parameters:**
```
period: "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "3y" | "5y" (default: "1m")
interval: "1m" | "5m" | "30m" | "1h" | "1d" (default: "1d")
```

**Response:**
```json
{
  "prices": [
    {
      "date": "2024-01-01T00:00:00Z",
      "open": 70000,
      "high": 71500,
      "low": 69500,
      "close": 71000,
      "volume": 10000000,
      "change": 1000,
      "changeRate": 1.4
    }
  ],
  "meta": {
    "period": "1m",
    "interval": "1d",
    "dataPoints": 30
  }
}
```

---

#### GET /stocks/search
종목 검색 (Auto-complete)

**Query Parameters:**
```
q: string (required, min 1 character)
limit: number (default: 10)
```

**Response:**
```json
{
  "results": [
    {
      "id": "cuid123",
      "code": "005930",
      "name": "삼성전자",
      "market": "KOSPI",
      "currentPrice": 71000,
      "changeRate": 1.5
    }
  ]
}
```

---

#### GET /market/indices
시장 지수 조회

**Response:**
```json
{
  "indices": [
    {
      "market": "KOSPI",
      "value": 2650.50,
      "change": 15.30,
      "changeRate": 0.58,
      "volume": 8500000000000,
      "timestamp": "2024-01-01T15:30:00Z"
    },
    {
      "market": "KOSDAQ",
      "value": 850.20,
      "change": -5.10,
      "changeRate": -0.60,
      "volume": 10200000000000,
      "timestamp": "2024-01-01T15:30:00Z"
    },
    {
      "market": "USD/KRW",
      "value": 1320.50,
      "change": 2.50,
      "changeRate": 0.19,
      "timestamp": "2024-01-01T15:30:00Z"
    },
    {
      "market": "WTI",
      "value": 72.30,
      "change": -0.50,
      "changeRate": -0.69,
      "timestamp": "2024-01-01T15:30:00Z"
    }
  ]
}
```

---

#### GET /market/indices/history
지수 히스토리 조회

**Query Parameters:**
```
market: "KOSPI" | "KOSDAQ" | "USD/KRW" | "WTI" (required)
period: "1d" | "1w" | "1m" | "3m" | "1y" (default: "1m")
interval: "1m" | "5m" | "1h" | "1d" (default: "1h")
```

**Response:**
```json
{
  "market": "KOSPI",
  "history": [
    {
      "timestamp": "2024-01-01T09:00:00Z",
      "value": 2635.20,
      "change": 5.20,
      "changeRate": 0.20,
      "volume": 500000000000
    }
  ],
  "meta": {
    "period": "1m",
    "interval": "1h",
    "dataPoints": 168
  }
}
```

---

### 5.3 AI Chat APIs

#### POST /chat/conversations
대화 생성

**Request:**
```json
{
  "title": "PER에 대해 알고 싶어요" // optional
}
```

**Response:**
```json
{
  "id": "conv123",
  "userId": "user123",
  "title": "PER에 대해 알고 싶어요",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /chat/conversations
대화 목록 조회

**Query Parameters:**
```
limit: number (default: 20)
offset: number (default: 0)
```

**Response:**
```json
{
  "conversations": [
    {
      "id": "conv123",
      "title": "PER에 대해 알고 싶어요",
      "lastMessage": "PER는 주가수익비율로...",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

---

#### GET /chat/conversations/:id
대화 상세 조회

**Response:**
```json
{
  "id": "conv123",
  "title": "PER에 대해 알고 싶어요",
  "messages": [
    {
      "id": "msg1",
      "role": "user",
      "content": "PER가 뭔가요?",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg2",
      "role": "assistant",
      "content": "PER는 주가수익비율로...",
      "createdAt": "2024-01-01T00:00:01Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### DELETE /chat/conversations/:id
대화 삭제

**Response:**
```json
{
  "message": "Conversation deleted successfully"
}
```

---

#### POST /chat/messages
메시지 전송 (일반 응답)

**Request:**
```json
{
  "conversationId": "conv123", // optional (없으면 새 대화 생성)
  "message": "PER가 뭔가요?"
}
```

**Response:**
```json
{
  "conversationId": "conv123",
  "message": {
    "id": "msg2",
    "role": "assistant",
    "content": "PER는 주가수익비율(Price Earnings Ratio)의 약자로, 주가를 주당순이익(EPS)으로 나눈 값입니다...",
    "createdAt": "2024-01-01T00:00:01Z"
  }
}
```

---

#### POST /chat/messages/stream
메시지 전송 (스트리밍 응답)

**Request:**
```json
{
  "conversationId": "conv123",
  "message": "PER가 뭔가요?"
}
```

**Response (SSE):**
```
event: start
data: {"messageId": "msg2"}

event: token
data: {"token": "PER"}

event: token
data: {"token": "는"}

event: token
data: {"token": " 주가수익비율"}

event: done
data: {"messageId": "msg2", "totalTokens": 150}
```

**Client Implementation:**
```typescript
const eventSource = new EventSource('/chat/messages/stream', {
  headers: { Authorization: `Bearer ${token}` }
});

eventSource.addEventListener('token', (e) => {
  const { token } = JSON.parse(e.data);
  // Append token to UI
});

eventSource.addEventListener('done', (e) => {
  eventSource.close();
});
```

---

#### GET /chat/conversations/:id/messages
대화 내역 조회

**Query Parameters:**
```
limit: number (default: 50)
before: string (message ID, cursor-based pagination)
```

**Response:**
```json
{
  "messages": [
    {
      "id": "msg1",
      "role": "user",
      "content": "PER가 뭔가요?",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg2",
      "role": "assistant",
      "content": "PER는 주가수익비율로...",
      "createdAt": "2024-01-01T00:00:01Z"
    }
  ],
  "hasMore": false
}
```

---

### 5.4 Portfolio APIs

#### POST /portfolio
포트폴리오 추가

**Request:**
```json
{
  "stockId": "stock123",
  "quantity": 10,
  "averagePrice": 71000
}
```

**Response:**
```json
{
  "id": "port123",
  "stockId": "stock123",
  "stock": {
    "code": "005930",
    "name": "삼성전자",
    "currentPrice": 71500
  },
  "quantity": 10,
  "averagePrice": 71000,
  "totalCost": 710000,
  "currentValue": 715000,
  "profit": 5000,
  "profitRate": 0.70,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /portfolio
포트폴리오 목록 조회

**Query Parameters:**
```
sortBy: "profit" | "profitRate" | "currentValue" (default: "currentValue")
sortOrder: "asc" | "desc" (default: "desc")
limit: number (default: 50)
offset: number (default: 0)
```

**Response:**
```json
{
  "portfolios": [
    {
      "id": "port123",
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500,
        "changeRate": 0.70
      },
      "quantity": 10,
      "averagePrice": 71000,
      "totalCost": 710000,
      "currentValue": 715000,
      "profit": 5000,
      "profitRate": 0.70
    }
  ],
  "summary": {
    "totalCost": 5000000,
    "currentValue": 5250000,
    "totalProfit": 250000,
    "totalProfitRate": 5.0
  },
  "total": 15
}
```

---

#### GET /portfolio/:id
포트폴리오 상세 조회

**Response:**
```json
{
  "id": "port123",
  "stock": {
    "id": "stock123",
    "code": "005930",
    "name": "삼성전자",
    "market": "KOSPI",
    "sector": "반도체",
    "currentPrice": 71500
  },
  "quantity": 10,
  "averagePrice": 71000,
  "totalCost": 710000,
  "currentValue": 715000,
  "profit": 5000,
  "profitRate": 0.70,
  "history": [
    {
      "date": "2024-01-01",
      "price": 71500,
      "value": 715000
    }
  ]
}
```

---

#### PATCH /portfolio/:id
포트폴리오 수정

**Request:**
```json
{
  "quantity": 15,
  "averagePrice": 70500
}
```

**Response:**
```json
{
  "id": "port123",
  "quantity": 15,
  "averagePrice": 70500,
  "totalCost": 1057500,
  "currentValue": 1072500,
  "profit": 15000,
  "profitRate": 1.42
}
```

---

#### DELETE /portfolio/:id
포트폴리오 삭제

**Response:**
```json
{
  "message": "Portfolio deleted successfully"
}
```

---

#### GET /portfolio/analysis
포트폴리오 AI 리스크 분석

**Response:**
```json
{
  "summary": {
    "totalValue": 5250000,
    "totalReturn": 250000,
    "returnRate": 5.0,
    "riskScore": 65
  },
  "risks": [
    {
      "type": "sector_concentration",
      "severity": "warning",
      "title": "섹터 집중도 높음",
      "description": "반도체 섹터에 60%가 집중되어 있습니다.",
      "value": 60,
      "threshold": 40,
      "recommendation": "다른 섹터(금융, 바이오 등)에도 분산 투자하세요."
    },
    {
      "type": "stock_concentration",
      "severity": "error",
      "title": "단일 종목 집중",
      "description": "삼성전자가 포트폴리오의 45%를 차지합니다.",
      "value": 45,
      "threshold": 30,
      "recommendation": "단일 종목 비중을 30% 이하로 낮추세요."
    }
  ],
  "diversification": {
    "sectors": [
      {
        "name": "반도체",
        "value": 3000000,
        "percentage": 60
      },
      {
        "name": "자동차",
        "value": 1500000,
        "percentage": 30
      },
      {
        "name": "금융",
        "value": 750000,
        "percentage": 15
      }
    ],
    "diversificationScore": 55
  },
  "recommendations": [
    {
      "priority": 10,
      "title": "반도체 비중 낮추기",
      "action": "삼성전자 일부 매도, 다른 섹터 투자",
      "reason": "섹터 집중도가 너무 높아 위험합니다."
    }
  ]
}
```

---

#### GET /portfolio/contribution
종목별 수익 기여도

**Response:**
```json
{
  "contributions": [
    {
      "stock": {
        "code": "005930",
        "name": "삼성전자"
      },
      "weight": 45,
      "return": 5.0,
      "contribution": 2.25
    },
    {
      "stock": {
        "code": "000660",
        "name": "SK하이닉스"
      },
      "weight": 30,
      "return": 8.0,
      "contribution": 2.40
    }
  ],
  "summary": {
    "totalReturn": 5.0,
    "topContributor": "SK하이닉스",
    "bottomContributor": "현대차"
  }
}
```

---

### 5.5 Favorites, History, Watchlist APIs

#### GET /favorites
즐겨찾기 목록 조회

**Response:**
```json
{
  "favorites": [
    {
      "id": "fav123",
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500,
        "changeRate": 0.70
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### POST /favorites
즐겨찾기 추가

**Request:**
```json
{
  "stockId": "stock123"
}
```

**Response:**
```json
{
  "id": "fav123",
  "stockId": "stock123",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- `400` Already in favorites

---

#### DELETE /favorites/:stockId
즐겨찾기 삭제

**Response:**
```json
{
  "message": "Removed from favorites"
}
```

---

#### GET /favorites/check/:stockId
즐겨찾기 확인

**Response:**
```json
{
  "isFavorite": true
}
```

---

#### GET /history
히스토리 목록 조회

**Query Parameters:**
```
limit: number (default: 50)
offset: number (default: 0)
```

**Response:**
```json
{
  "history": [
    {
      "id": "hist123",
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자"
      },
      "viewedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 150
}
```

---

#### POST /history
히스토리 추가 (자동)

**Request:**
```json
{
  "stockId": "stock123"
}
```

**Response:**
```json
{
  "id": "hist123",
  "stockId": "stock123",
  "viewedAt": "2024-01-01T10:00:00Z"
}
```

---

#### DELETE /history/:id
히스토리 삭제

**Response:**
```json
{
  "message": "History deleted"
}
```

---

#### GET /watchlist
워치리스트 목록 조회

**Response:**
```json
{
  "watchlist": [
    {
      "id": "watch123",
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500,
        "changeRate": 0.70
      },
      "targetPrice": 75000,
      "notifyOnChange": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### POST /watchlist
워치리스트 추가

**Request:**
```json
{
  "stockId": "stock123",
  "targetPrice": 75000, // optional
  "notifyOnChange": true // optional
}
```

**Response:**
```json
{
  "id": "watch123",
  "stockId": "stock123",
  "targetPrice": 75000,
  "notifyOnChange": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### DELETE /watchlist/:id
워치리스트 삭제

**Response:**
```json
{
  "message": "Removed from watchlist"
}
```

---

#### PATCH /watchlist/:id
알림 설정 변경

**Request:**
```json
{
  "targetPrice": 72000,
  "notifyOnChange": false
}
```

**Response:**
```json
{
  "id": "watch123",
  "targetPrice": 72000,
  "notifyOnChange": false
}
```

---

### 5.6 Learning & Education APIs

#### GET /learning/dashboard
학습 대시보드

**Response:**
```json
{
  "today": {
    "questionsCount": 5,
    "conceptsLearned": 3,
    "notesCreated": 1
  },
  "recommendations": [
    {
      "id": "rec123",
      "concept": {
        "id": "concept1",
        "name": "PER",
        "category": "재무제표",
        "definition": "주가수익비율..."
      },
      "reason": "portfolio_based",
      "priority": 9,
      "explanation": "보유 중인 삼성전자의 PER를 이해하면 밸류에이션 판단에 도움이 됩니다.",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "recentLearnings": [
    {
      "id": "learn123",
      "question": "PER가 뭔가요?",
      "answer": "PER는 주가수익비율로...",
      "category": "재무제표",
      "isBookmarked": false,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "streak": {
    "current": 5,
    "longest": 12
  }
}
```

---

#### GET /learning/stats
학습 통계

**Response:**
```json
{
  "summary": {
    "totalQuestions": 150,
    "totalConcepts": 25,
    "totalNotes": 30,
    "thisWeek": {
      "questions": 15,
      "concepts": 5,
      "notes": 3
    }
  },
  "byCategory": [
    {
      "category": "재무제표",
      "count": 50,
      "percentage": 33.3
    },
    {
      "category": "기술적분석",
      "count": 40,
      "percentage": 26.7
    }
  ],
  "streak": {
    "current": 5,
    "longest": 12,
    "history": [
      { "date": "2024-01-01", "count": 3 },
      { "date": "2024-01-02", "count": 5 }
    ]
  }
}
```

---

#### POST /learning/recommendations/:id/mark-read
추천 확인 표시

**Response:**
```json
{
  "id": "rec123",
  "isRead": true
}
```

---

#### GET /notes
노트 목록 조회

**Query Parameters:**
```
tags: string[] (optional, e.g., "배당주,장기투자")
sortBy: "createdAt" | "updatedAt" (default: "updatedAt")
limit: number (default: 20)
offset: number (default: 0)
```

**Response:**
```json
{
  "notes": [
    {
      "id": "note123",
      "title": "삼성전자 투자 분석",
      "content": "PER 15배, ROE 7.5%...",
      "tags": ["반도체", "장기투자"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 30
}
```

---

#### GET /notes/:id
노트 상세 조회

**Response:**
```json
{
  "id": "note123",
  "title": "삼성전자 투자 분석",
  "content": "PER 15배, ROE 7.5%...",
  "tags": ["반도체", "장기투자"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

---

#### POST /notes
노트 생성

**Request:**
```json
{
  "title": "삼성전자 투자 분석",
  "content": "PER 15배, ROE 7.5%...",
  "tags": ["반도체", "장기투자"]
}
```

**Response:**
```json
{
  "id": "note123",
  "title": "삼성전자 투자 분석",
  "content": "PER 15배, ROE 7.5%...",
  "tags": ["반도체", "장기투자"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### PATCH /notes/:id
노트 수정

**Request:**
```json
{
  "title": "삼성전자 투자 분석 (수정)",
  "content": "새로운 내용...",
  "tags": ["반도체"]
}
```

**Response:**
```json
{
  "id": "note123",
  "title": "삼성전자 투자 분석 (수정)",
  "content": "새로운 내용...",
  "tags": ["반도체"],
  "updatedAt": "2024-01-01T11:00:00Z"
}
```

---

#### DELETE /notes/:id
노트 삭제

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

---

#### GET /concepts
개념 목록 조회

**Query Parameters:**
```
category: string (optional)
limit: number (default: 50)
```

**Response:**
```json
{
  "concepts": [
    {
      "id": "concept1",
      "name": "PER",
      "category": "재무제표",
      "definition": "주가수익비율...",
      "importance": 9
    }
  ]
}
```

---

#### GET /concepts/:id
개념 상세 조회

**Response:**
```json
{
  "id": "concept1",
  "name": "PER",
  "category": "재무제표",
  "definition": "주가수익비율(Price Earnings Ratio)의 약자로...",
  "importance": 9,
  "examples": [
    "삼성전자 PER 15배: 주가 75,000원, EPS 5,000원",
    "애플 PER 30배: 성장주는 PER이 높은 편"
  ],
  "commonMistakes": [
    "PER이 낮다고 무조건 저평가는 아님",
    "업종별로 PER 기준이 다름"
  ]
}
```

---

### 5.7 Explore & Strategy APIs

#### GET /strategies
투자 전략 목록 조회

**Response:**
```json
{
  "strategies": [
    {
      "id": "strat1",
      "name": "배당주 전략",
      "description": "안정적인 배당 수익을 추구하는 전략",
      "category": "dividend",
      "explanation": "배당수익률이 3% 이상이며...",
      "risks": "주가 상승이 제한적일 수 있습니다.",
      "suitableFor": "장기 투자자, 은퇴 준비자",
      "stockCount": 25
    },
    {
      "id": "strat2",
      "name": "성장주 전략",
      "description": "높은 성장성을 가진 기업에 투자",
      "category": "growth",
      "stockCount": 30
    }
  ]
}
```

---

#### GET /strategies/:id
전략 상세 조회

**Response:**
```json
{
  "id": "strat1",
  "name": "배당주 전략",
  "description": "안정적인 배당 수익을 추구하는 전략",
  "category": "dividend",
  "criteria": {
    "dividendYield": { "min": 3.0 },
    "per": { "max": 20 },
    "roe": { "min": 5 }
  },
  "explanation": "배당수익률이 3% 이상이며 재무 건전성이 좋은 기업...",
  "risks": "주가 상승이 제한적일 수 있으며, 배당 감소 위험 존재",
  "suitableFor": "장기 투자자, 은퇴 준비자, 현금 흐름 중시자",
  "stockCount": 25
}
```

---

#### GET /strategies/:id/stocks
전략별 종목 조회

**Query Parameters:**
```
limit: number (default: 20)
offset: number (default: 0)
sortBy: "score" | "price" | "volume" (default: "score")
```

**Response:**
```json
{
  "stocks": [
    {
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500,
        "changeRate": 0.70
      },
      "score": 92,
      "metrics": {
        "dividendYield": 3.5,
        "per": 15.2,
        "roe": 7.5,
        "배당성향": 25
      }
    }
  ],
  "total": 25
}
```

---

#### POST /strategies/:id/explain
AI가 전략 상세 설명

**Response:**
```json
{
  "explanation": "배당주 전략은 안정적인 현금 흐름을 제공하는 기업에 투자합니다...",
  "keyCriteria": [
    "배당수익률 3% 이상",
    "PER 20배 이하 (저평가)",
    "ROE 5% 이상 (수익성)"
  ],
  "examples": [
    "삼성전자: 배당수익률 3.5%, 안정적 배당",
    "SK텔레콤: 배당수익률 5.2%, 높은 배당"
  ],
  "tips": [
    "배당 히스토리 확인",
    "배당성향 30-50% 적정",
    "업종별 배당 차이 고려"
  ]
}
```

---

#### POST /stocks/screen
스크리너 (필터링)

**Request:**
```json
{
  "filters": {
    "market": ["KOSPI"],
    "sector": ["반도체", "자동차"],
    "priceRange": { "min": 50000, "max": 100000 },
    "changeRate": { "min": -5, "max": 10 },
    "marketCap": { "min": 1000000000000 },
    "volume": { "min": 1000000 },
    "per": { "min": 5, "max": 20 },
    "pbr": { "max": 2 },
    "roe": { "min": 5 },
    "dividendYield": { "min": 3 }
  },
  "sortBy": "changeRate",
  "sortOrder": "desc",
  "limit": 20
}
```

**Response:**
```json
{
  "stocks": [
    {
      "id": "stock123",
      "code": "005930",
      "name": "삼성전자",
      "currentPrice": 71500,
      "changeRate": 2.5,
      "marketCap": 423000000000000,
      "per": 15.2,
      "pbr": 1.1,
      "roe": 7.5,
      "dividendYield": 3.5
    }
  ],
  "total": 15,
  "appliedFilters": {
    "market": ["KOSPI"],
    "priceRange": "50,000 - 100,000원",
    "per": "5 - 20배"
  }
}
```

---

### 5.8 Trade Log APIs

#### POST /trades
매매 기록 추가

**Request:**
```json
{
  "stockId": "stock123",
  "type": "BUY",
  "quantity": 10,
  "price": 71000,
  "tradeDate": "2024-01-01",
  "reason": "PER 저평가 + 반도체 업황 개선 기대",
  "tags": ["장기투자", "배당"],
  "learningIds": ["learn123", "learn456"]
}
```

**Response:**
```json
{
  "id": "trade123",
  "stockId": "stock123",
  "stock": {
    "code": "005930",
    "name": "삼성전자"
  },
  "type": "BUY",
  "quantity": 10,
  "price": 71000,
  "totalAmount": 710000,
  "reason": "PER 저평가 + 반도체 업황 개선 기대",
  "tags": ["장기투자", "배당"],
  "learningIds": ["learn123", "learn456"],
  "tradeDate": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /trades
매매 기록 목록 조회

**Query Parameters:**
```
stockId: string (optional)
type: "BUY" | "SELL" (optional)
dateFrom: string (YYYY-MM-DD, optional)
dateTo: string (YYYY-MM-DD, optional)
tags: string[] (optional)
limit: number (default: 50)
offset: number (default: 0)
```

**Response:**
```json
{
  "trades": [
    {
      "id": "trade123",
      "stock": {
        "code": "005930",
        "name": "삼성전자"
      },
      "type": "BUY",
      "quantity": 10,
      "price": 71000,
      "totalAmount": 710000,
      "reason": "PER 저평가...",
      "tags": ["장기투자"],
      "tradeDate": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "totalBuys": 15,
    "totalSells": 10,
    "totalBuyAmount": 10000000,
    "totalSellAmount": 11500000,
    "profit": 1500000,
    "profitRate": 15.0
  },
  "total": 25
}
```

---

#### GET /trades/:id
매매 기록 상세 조회

**Response:**
```json
{
  "id": "trade123",
  "stock": {
    "id": "stock123",
    "code": "005930",
    "name": "삼성전자",
    "currentPrice": 75000
  },
  "type": "BUY",
  "quantity": 10,
  "price": 71000,
  "totalAmount": 710000,
  "reason": "PER 저평가 + 반도체 업황 개선 기대",
  "tags": ["장기투자", "배당"],
  "learnings": [
    {
      "id": "learn123",
      "question": "PER가 뭔가요?",
      "answer": "주가수익비율..."
    }
  ],
  "tradeDate": "2024-01-01T00:00:00Z",
  "currentValue": 750000,
  "profit": 40000,
  "profitRate": 5.63
}
```

---

#### PATCH /trades/:id
매매 기록 수정

**Request:**
```json
{
  "reason": "수정된 매매 이유",
  "tags": ["단타"]
}
```

**Response:**
```json
{
  "id": "trade123",
  "reason": "수정된 매매 이유",
  "tags": ["단타"],
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

---

#### DELETE /trades/:id
매매 기록 삭제

**Response:**
```json
{
  "message": "Trade deleted successfully"
}
```

---

#### GET /trades/stats
매매 통계

**Query Parameters:**
```
dateFrom: string (YYYY-MM-DD, optional)
dateTo: string (YYYY-MM-DD, optional)
```

**Response:**
```json
{
  "summary": {
    "totalTrades": 50,
    "totalBuys": 30,
    "totalSells": 20,
    "winRate": 65.0,
    "avgProfit": 50000,
    "totalProfit": 1000000,
    "bestTrade": {
      "stock": "SK하이닉스",
      "profit": 300000,
      "profitRate": 25.0
    },
    "worstTrade": {
      "stock": "현대차",
      "profit": -100000,
      "profitRate": -10.0
    }
  },
  "byStock": [
    {
      "stock": {
        "code": "005930",
        "name": "삼성전자"
      },
      "trades": 10,
      "profit": 500000,
      "winRate": 70.0
    }
  ],
  "byTag": [
    {
      "tag": "장기투자",
      "trades": 20,
      "profit": 800000
    }
  ],
  "monthlyStats": [
    {
      "month": "2024-01",
      "trades": 15,
      "profit": 300000
    }
  ]
}
```

---

### 5.9 News APIs

#### GET /news
뉴스 리스트 조회

**Query Parameters:**
```
tab: "all" | "stock" | "sector" | "global" (default: "all")
stockId: string (optional)
period: "today" | "week" | "month" (default: "today")
sentiment: "positive" | "negative" | "neutral" (optional)
limit: number (default: 20)
offset: number (default: 0)
```

**Response:**
```json
{
  "news": [
    {
      "id": "news123",
      "title": "삼성전자, 3분기 실적 호조",
      "summary": "삼성전자가 3분기 영업이익 10조원을 기록하며...",
      "sentiment": "positive",
      "sentimentScore": 0.8,
      "keyPoints": [
        "영업이익 10조원 기록",
        "반도체 부문 회복세",
        "4분기 전망 긍정적"
      ],
      "relatedConcepts": ["영업이익", "반도체", "실적"],
      "stock": {
        "code": "005930",
        "name": "삼성전자"
      },
      "source": {
        "name": "한국경제"
      },
      "publishedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 150
}
```

---

#### GET /news/:id
뉴스 상세 조회

**Response:**
```json
{
  "id": "news123",
  "title": "삼성전자, 3분기 실적 호조",
  "content": "전체 뉴스 내용...",
  "summary": "AI 요약 내용...",
  "sentiment": "positive",
  "sentimentScore": 0.8,
  "keyPoints": [
    "영업이익 10조원 기록",
    "반도체 부문 회복세"
  ],
  "relatedConcepts": ["영업이익", "반도체"],
  "stock": {
    "id": "stock123",
    "code": "005930",
    "name": "삼성전자",
    "currentPrice": 71500
  },
  "source": {
    "name": "한국경제"
  },
  "url": "https://example.com/news/123",
  "publishedAt": "2024-01-01T10:00:00Z",
  "relatedNews": [
    {
      "id": "news124",
      "title": "반도체 업황 회복 전망",
      "summary": "..."
    }
  ]
}
```

---

#### POST /admin/news/sources
뉴스 소스 추가 (Admin)

**Request:**
```json
{
  "name": "매일경제",
  "url": "https://www.mk.co.kr/rss/50200001/",
  "crawlInterval": 300
}
```

**Response:**
```json
{
  "id": "source123",
  "name": "매일경제",
  "url": "https://www.mk.co.kr/rss/50200001/",
  "isActive": true,
  "crawlInterval": 300
}
```

---

### 5.10 Hot Issue APIs

#### GET /hot-issues
실시간 인기 종목/뉴스

**Query Parameters:**
```
type: "stock" | "news" | "all" (default: "all")
limit: number (default: 10)
```

**Response:**
```json
{
  "stocks": [
    {
      "stock": {
        "id": "stock123",
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500,
        "changeRate": 5.2
      },
      "reason": "volume_surge",
      "score": 95,
      "explanation": "거래량이 평균 대비 350% 급증했습니다.",
      "startedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "news": [
    {
      "news": {
        "id": "news123",
        "title": "삼성전자, 3분기 실적 호조",
        "summary": "...",
        "sentiment": "positive"
      },
      "reason": "high_views",
      "score": 88,
      "viewCount": 15000,
      "startedAt": "2024-01-01T09:00:00Z"
    }
  ]
}
```

---

### 5.11 Notification APIs

#### GET /settings/notifications
알림 설정 조회

**Response:**
```json
{
  "emailEnabled": true,
  "priceAlertEmail": true,
  "newsAlertEmail": true,
  "learningEmail": false,
  "pushEnabled": false
}
```

---

#### PUT /settings/notifications
알림 설정 변경

**Request:**
```json
{
  "emailEnabled": true,
  "priceAlertEmail": true,
  "newsAlertEmail": false,
  "learningEmail": true,
  "pushEnabled": false
}
```

**Response:**
```json
{
  "emailEnabled": true,
  "priceAlertEmail": true,
  "newsAlertEmail": false,
  "learningEmail": true,
  "pushEnabled": false,
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /price-alerts
가격 알림 목록 조회

**Response:**
```json
{
  "alerts": [
    {
      "id": "alert123",
      "stock": {
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 71500
      },
      "type": "above",
      "value": 75000,
      "isActive": true,
      "triggered": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### POST /price-alerts
가격 알림 생성

**Request:**
```json
{
  "stockId": "stock123",
  "type": "above",
  "value": 75000
}
```

**Response:**
```json
{
  "id": "alert123",
  "stockId": "stock123",
  "type": "above",
  "value": 75000,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Types:**
- `above`: 가격이 value 이상일 때
- `below`: 가격이 value 이하일 때
- `change_percent`: 변동률이 value% 이상일 때

---

#### DELETE /price-alerts/:id
가격 알림 삭제

**Response:**
```json
{
  "message": "Price alert deleted successfully"
}
```

---

### 5.12 Settings APIs

#### GET /settings/profile
프로필 조회

**Response:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "홍길동",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### PUT /settings/profile
프로필 수정

**Request:**
```json
{
  "name": "김철수",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "id": "user123",
  "name": "김철수",
  "avatar": "https://example.com/new-avatar.jpg",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

---

#### POST /settings/password
비밀번호 변경

**Request:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `401` Current password incorrect
- `400` New password too weak

---

#### POST /settings/export
데이터 내보내기

**Response:**
```json
{
  "message": "Export job started. You will receive an email when ready.",
  "jobId": "export_job_123"
}
```

**Background Process:**
1. Portfolio, Notes, Learnings, Trades 조회
2. JSON 파일 생성
3. S3 업로드 (또는 임시 저장)
4. 이메일 발송 (다운로드 링크)

---

#### DELETE /settings/account
계정 삭제

**Response:**
```json
{
  "message": "Account marked for deletion. You have 30 days to recover.",
  "deletionDate": "2024-01-31T00:00:00Z"
}
```

---

### 5.13 Search APIs

#### GET /search
통합 검색

**Query Parameters:**
```
q: string (required, min 1 character)
type: "all" | "stocks" | "news" | "notes" (default: "all")
limit: number (default: 20)
```

**Response:**
```json
{
  "stocks": [
    {
      "id": "stock123",
      "code": "005930",
      "name": "삼성전자",
      "currentPrice": 71500
    }
  ],
  "news": [
    {
      "id": "news123",
      "title": "삼성전자, 3분기 실적 호조",
      "summary": "..."
    }
  ],
  "notes": [
    {
      "id": "note123",
      "title": "삼성전자 투자 분석",
      "content": "..."
    }
  ]
}
```

---

#### GET /search/stocks
종목 검색

**Query Parameters:**
```
q: string (required)
limit: number (default: 10)
```

**Response:**
```json
{
  "stocks": [
    {
      "id": "stock123",
      "code": "005930",
      "name": "삼성전자",
      "market": "KOSPI",
      "currentPrice": 71500,
      "changeRate": 0.70
    }
  ]
}
```

---

#### GET /search/news
뉴스 검색

**Query Parameters:**
```
q: string (required)
limit: number (default: 20)
```

**Response:**
```json
{
  "news": [
    {
      "id": "news123",
      "title": "삼성전자, 3분기 실적 호조",
      "summary": "...",
      "sentiment": "positive",
      "publishedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

#### GET /search/notes
노트 검색

**Query Parameters:**
```
q: string (required)
limit: number (default: 20)
```

**Response:**
```json
{
  "notes": [
    {
      "id": "note123",
      "title": "삼성전자 투자 분석",
      "content": "PER 15배, ROE 7.5%...",
      "tags": ["반도체"],
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 6. Background Jobs

### 6.1 Job 목록

| Job | Cron | 설명 |
|-----|------|------|
| News Crawler | `*/5 * * * *` | RSS 뉴스 크롤링 (5분마다) |
| AI News Analysis | Worker | 뉴스 AI 요약/감성 분석 |
| Hot Issue Calculator | `*/10 * * * *` | 인기 종목/뉴스 계산 (10분마다) |
| Price Alert Checker | `*/1 * * * *` | 가격 알림 확인 (1분마다) |

### 6.2 News Crawler

**Cron:** `*/5 * * * *` (5분마다)

**프로세스:**
```typescript
async function crawlNews() {
  // 1. Active 소스 조회
  const sources = await prisma.newsSource.findMany({
    where: { isActive: true }
  });

  for (const source of sources) {
    // 2. RSS 파싱
    const feed = await parser.parseURL(source.url);
    
    for (const item of feed.items) {
      // 3. 중복 체크
      const exists = await prisma.news.findUnique({
        where: { url: item.link }
      });
      
      if (!exists) {
        // 4. News 저장
        const news = await prisma.news.create({
          data: {
            sourceId: source.id,
            title: item.title,
            content: item.content,
            url: item.link,
            publishedAt: item.pubDate
          }
        });
        
        // 5. AI 분석 큐 추가
        await newsAnalysisQueue.add('analyze', { newsId: news.id });
      }
    }
    
    // 6. lastCrawl 업데이트
    await prisma.newsSource.update({
      where: { id: source.id },
      data: { lastCrawl: new Date() }
    });
  }
}
```

---

### 6.3 AI News Analysis Worker

**Trigger:** BullMQ Job

**프로세스:**
```typescript
newsAnalysisQueue.process('analyze', async (job) => {
  const { newsId } = job.data;
  
  // 1. News 조회
  const news = await prisma.news.findUnique({ where: { id: newsId } });
  
  // 2. OpenAI API 호출
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `당신은 금융 뉴스 분석 전문가입니다.
다음 뉴스를 분석하여 JSON 형식으로 반환하세요:
{
  "summary": "3-5줄 요약",
  "sentiment": "positive/negative/neutral",
  "sentimentScore": -1 to 1,
  "keyPoints": ["포인트1", "포인트2", ...],
  "relatedConcepts": ["PER", "배당", ...]
}`
      },
      { role: 'user', content: `제목: ${news.title}\n\n내용: ${news.content}` }
    ],
    response_format: { type: 'json_object' }
  });
  
  const analysis = JSON.parse(completion.choices[0].message.content);
  
  // 3. 관련 종목 자동 태깅
  const stockMatches = await findRelatedStocks(news.title + ' ' + news.content);
  
  // 4. News 업데이트
  await prisma.news.update({
    where: { id: newsId },
    data: {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      keyPoints: analysis.keyPoints,
      relatedConcepts: analysis.relatedConcepts,
      stockId: stockMatches[0]?.id // 가장 관련 높은 종목
    }
  });
});
```

---

### 6.4 Hot Issue Calculator

**Cron:** `*/10 * * * *` (10분마다)

**프로세스:**
```typescript
async function calculateHotIssues() {
  // 1. 거래량 급증 종목
  const volumeSurge = await prisma.$queryRaw`
    SELECT s.id, s.code, s.name,
           (s.volume / s.avg_volume_30d) as volume_ratio
    FROM stocks s
    WHERE s.volume > s.avg_volume_30d * 2
    ORDER BY volume_ratio DESC
    LIMIT 10
  `;
  
  for (const stock of volumeSurge) {
    await prisma.hotIssue.create({
      data: {
        type: 'stock',
        stockId: stock.id,
        reason: 'volume_surge',
        score: Math.min(100, stock.volume_ratio * 20),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간
      }
    });
  }
  
  // 2. 조회수 높은 뉴스 (Redis 집계)
  const topNews = await redis.zrevrange('news:views', 0, 9, 'WITHSCORES');
  
  for (let i = 0; i < topNews.length; i += 2) {
    const newsId = topNews[i];
    const viewCount = parseInt(topNews[i + 1]);
    
    await prisma.hotIssue.create({
      data: {
        type: 'news',
        newsId,
        reason: 'high_views',
        score: Math.min(100, viewCount / 100),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }
  
  // 3. 만료된 이슈 삭제
  await prisma.hotIssue.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
}
```

---

### 6.5 Price Alert Checker

**Cron:** `*/1 * * * *` (1분마다)

**프로세스:**
```typescript
async function checkPriceAlerts() {
  // 1. Active 알림 조회
  const alerts = await prisma.priceAlert.findMany({
    where: { isActive: true, triggered: false },
    include: { stock: true, user: true }
  });
  
  for (const alert of alerts) {
    const currentPrice = alert.stock.currentPrice;
    let shouldTrigger = false;
    
    // 2. 조건 확인
    if (alert.type === 'above' && currentPrice >= alert.value) {
      shouldTrigger = true;
    } else if (alert.type === 'below' && currentPrice <= alert.value) {
      shouldTrigger = true;
    } else if (alert.type === 'change_percent') {
      const changeRate = Math.abs(alert.stock.changeRate);
      if (changeRate >= alert.value) {
        shouldTrigger = true;
      }
    }
    
    if (shouldTrigger) {
      // 3. 이메일 발송
      await sendEmail({
        to: alert.user.email,
        subject: `[InsightStock] ${alert.stock.name} 가격 알림`,
        template: 'price-alert',
        data: {
          stockName: alert.stock.name,
          currentPrice,
          targetPrice: alert.value,
          type: alert.type
        }
      });
      
      // 4. 알림 비활성화
      await prisma.priceAlert.update({
        where: { id: alert.id },
        data: { triggered: true, isActive: false }
      });
    }
  }
}
```

---

## 7. Phase별 개발 로드맵

### Phase 1: MVP (Week 1-7) - 핵심 가치 검증

**목표:** 핵심 기능 구현 및 사용자 반응 확인

**Week 1: 환경 설정 + DB 설계**
```
Day 1-2: 프로젝트 초기화
- Next.js + Express 프로젝트 생성
- TypeScript 설정
- ESLint + Prettier 설정

Day 3-5: Database 설계
- Prisma schema 작성
- Migration 생성
- Seed 데이터 준비

Day 6-7: 인프라 설정
- Railway 계정 생성
- Vercel 연결
- Supabase DB 생성
- 환경 변수 설정
```

**Week 2: Auth + AI 챗봇 (핵심!)**
```
Day 1-2: 인증 시스템
- 익명 사용자 생성
- 회원가입/로그인
- JWT 미들웨어

Day 3-5: AI 챗봇 (핵심 기능)
- OpenAI API 연동
- 스트리밍 응답 (SSE)
- Conversation/Message CRUD

Day 6-7: RAG 기초
- Pinecone 연동
- Embedding 생성
- 유사도 검색
```

**Week 3: Stock API + Portfolio CRUD**
```
Day 1-2: 한국투자증권 API 연동
- 종목 조회
- 시세 조회
- 차트 데이터

Day 3-4: Stock API 구현
- GET /stocks (리스트)
- GET /stocks/:id (상세)
- GET /stocks/:id/prices (차트)
- GET /stocks/search (검색)

Day 5-7: Portfolio CRUD
- POST /portfolio
- GET /portfolio
- PATCH /portfolio/:id
- DELETE /portfolio/:id
```

**Week 4: Frontend 기본 + Chat UI**
```
Day 1-2: 레이아웃
- Header (Market Index)
- Sidebar (Navigation)
- Main Content

Day 3-5: AI Chat UI
- Chat 리스트
- Chat 상세 (메시지)
- 스트리밍 응답 UI
- 마크다운 렌더링

Day 6-7: Stock UI
- 종목 리스트
- 종목 상세
- 차트 (Chart.js)
```

**Week 5: News (Mock) + Learning (Q&A)**
```
Day 1-3: News UI (Mock 데이터)
- 뉴스 리스트
- 뉴스 상세
- 탭 (전체/종목/섹터)

Day 4-7: Learning 기초
- Q&A 저장
- 노트 CRUD
- 학습 통계 (간단)
```

**Week 6: 테스팅**
```
Day 1-3: Unit Tests
- Service layer 테스트
- 주요 함수 테스트

Day 4-5: Integration Tests
- API 엔드포인트 테스트
- DB 쿼리 테스트

Day 6-7: E2E Tests (선택)
- 주요 플로우 테스트
```

**Week 7: 배포**
```
Day 1-2: Production 설정
- 환경 변수 분리
- DB Migration
- Redis 설정

Day 3-4: 배포
- Railway 배포
- Vercel 배포
- DNS 설정

Day 5-7: 모니터링 + 버그 수정
- Sentry 연동
- 로그 확인
- 긴급 버그 수정
```

**API 우선순위:**
```
P0 (필수):
✅ Auth: 익명, 회원가입, 로그인
✅ AI Chat: 대화 생성, 메시지 전송, 스트리밍
✅ Stock: 조회, 검색, 차트
✅ Portfolio: CRUD
✅ Market Index: KOSPI, KOSDAQ

P1 (중요):
✅ News: 리스트, 상세 (Mock 데이터)
✅ Learning: Q&A, 노트 CRUD
✅ Search: 통합 검색

P2 (나중에):
⏰ Trade Log
⏰ Hot Issue
⏰ Notification
```

---

### Phase 2: Growth (Week 8-16) - 기능 고도화

**목표:** 사용자 확대 + 고급 기능 추가

**Week 8-9: News 크롤링 시스템**
```
Day 1-2: RSS 크롤러
- NewsSource 관리
- RSS 파서 구현
- Cron Job 설정 (5분마다)

Day 3-4: AI 자동 분석
- BullMQ Worker 설정
- OpenAI API 호출 (요약, 감성)
- 관련 종목 자동 태깅

Day 5-7: News API 완성
- GET /news (실제 데이터)
- GET /news/:id
- 필터링 (감성, 기간)
```

**Week 10: Learning Dashboard**
```
Day 1-3: 개인화 추천 시스템
- LearningRecommendation 모델
- 추천 생성 로직
  - portfolio_based: 보유 종목 관련 개념
  - news_based: 최근 뉴스 관련 개념
  - repeated_question: 반복 질문

Day 4-5: Dashboard API
- GET /learning/dashboard
- GET /learning/stats
- 연속 학습 일수 (streak)

Day 6-7: Dashboard UI
- 오늘의 학습
- 추천 개념 카드
- 학습 통계 차트
```

**Week 11-12: Explore & Strategy**
```
Day 1-3: Strategy 시스템
- Strategy 모델
- 기본 전략 4개 구현
  - 배당주 전략
  - 성장주 전략
  - 가치주 전략
  - 모멘텀 전략

Day 4-5: Strategy API
- GET /strategies
- GET /strategies/:id/stocks
- POST /strategies/:id/explain (AI)

Day 6-7: Screener API
- POST /stocks/screen
- 다중 필터 구현
- 정렬/페이지네이션

Day 8-10: Explore UI
- 전략 목록 카드
- 전략별 종목 리스트
- 스크리너 폼
```

**Week 13: Trade Log**
```
Day 1-3: Trade API
- POST /trades
- GET /trades
- GET /trades/stats

Day 4-5: Trade UI
- 매매 기록 폼
- 매매 리스트
- 통계 대시보드

Day 6-7: 학습 연결
- 매매 시 참고한 학습 연결
- 매매 이유 AI 분석 (선택)
```

**Week 14: Portfolio AI Analysis**
```
Day 1-3: 리스크 분석 로직
- 섹터 집중도
- 종목 집중도
- 변동성 (Beta)
- 배당 안정성

Day 4-5: AI 개선 제안
- OpenAI API 호출
- 리스크 기반 추천

Day 6-7: Analysis UI
- 리스크 점수
- 위험 요소 카드
- 개선 제안 리스트
```

**Week 15-16: Notification System**
```
Day 1-3: 가격 알림
- PriceAlert 모델
- POST /price-alerts
- Background Job (1분마다)

Day 4-5: 이메일 발송
- Nodemailer 설정
- 이메일 템플릿
- 발송 로직

Day 6-7: Notification UI
- 알림 설정 페이지
- 가격 알림 관리
- 알림 내역
```

---

### Phase 3: Scale (Week 17-24) - 프로덕션 품질 + 수익화

**목표:** 프로덕션 품질 달성 + 수익 모델 구현

**Week 17: OAuth 소셜 로그인**
```
Day 1-2: Google OAuth
- Passport.js 설정
- Google Strategy

Day 3-4: Kakao OAuth
Day 5-6: Naver OAuth
Day 7: OAuth UI
```

**Week 18: Watchlist 알림**
```
Day 1-3: Push Notification
- Firebase Cloud Messaging
- 푸시 토큰 관리

Day 4-5: Watchlist 알림
- 목표가 도달 알림
- 실시간 변동 알림

Day 6-7: 알림 UI
```

**Week 19: Hot Issue**
```
Day 1-3: Hot Issue Calculator
- 거래량 급증 감지
- 검색량 급증 (선택)
- 뉴스 조회수 상위

Day 4-5: HotIssue API
- GET /hot-issues
- Background Job (10분마다)

Day 6-7: Hot Issue UI
- 메인 페이지 배너
- Hot Issue 리스트
```

**Week 20: 고급 차트**
```
Day 1-3: 기술적 지표
- RSI
- MACD
- Bollinger Bands

Day 4-5: Drawing Tools
- 추세선
- 피보나치

Day 6-7: 차트 UI 개선
```

**Week 21: Data Export**
```
Day 1-2: Export API
- POST /settings/export
- Background Job

Day 3-4: Export Worker
- Portfolio → JSON
- Notes → JSON
- Learnings → JSON
- Trades → JSON

Day 5-7: Export UI
- 내보내기 버튼
- 다운로드 링크
```

**Week 22-23: Pro Tier (수익화)**
```
Day 1-3: Stripe 연동
- Stripe Checkout
- Webhook 처리
- 구독 관리

Day 4-5: Pro 기능
- 무제한 AI 질문
- 고급 차트
- 우선 지원

Day 6-7: Pro 전환 UI
- Pricing 페이지
- Pro Badge
- 업그레이드 모달

Day 8-10: 무료 vs Pro 분리
- Rate Limiting
- Feature Flag
```

**Week 24: Admin Dashboard**
```
Day 1-3: Admin API
- GET /admin/users
- GET /admin/stats
- POST /admin/news/sources

Day 4-5: Admin UI
- 사용자 관리
- 통계 대시보드
- 뉴스 소스 관리

Day 6-7: 최종 점검
- 버그 수정
- 성능 최적화
- 문서 작성
```

---

## 8. Additional Features

### 8.1 Rate Limiting

```typescript
// Rate Limiter 설정
import rateLimit from 'express-rate-limit';

// API Rate Limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 100 requests
  message: 'Too many requests from this IP'
});

// AI Chat Rate Limit
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10, // 10 requests
  keyGenerator: (req) => req.user?.id, // User별
  skip: (req) => req.user?.isPro, // Pro 사용자는 제외
  message: 'AI 질문은 분당 10회로 제한됩니다. Pro로 업그레이드하세요.'
});

app.use('/api', apiLimiter);
app.use('/api/chat', chatLimiter);
```

---

### 8.2 Caching Strategy

```typescript
// Redis Cache
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache 헬퍼
async function getOrCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5분
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// 사용 예시
export async function getStock(id: string) {
  return getOrCache(
    `stock:${id}`,
    () => prisma.stock.findUnique({ where: { id } }),
    60 // 1분
  );
}

// Market Index Cache (실시간)
export async function getMarketIndices() {
  return getOrCache(
    'market:indices',
    () => prisma.marketIndex.findMany({
      orderBy: { timestamp: 'desc' },
      take: 4
    }),
    10 // 10초 (실시간에 가깝게)
  );
}

// Stock Prices Cache
export async function getStockPrices(stockId: string, period: string) {
  return getOrCache(
    `stock:${stockId}:prices:${period}`,
    () => fetchPricesFromDB(stockId, period),
    300 // 5분
  );
}

// Hot Issues Cache
export async function getHotIssues() {
  return getOrCache(
    'hot:issues',
    () => prisma.hotIssue.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { score: 'desc' },
      take: 10
    }),
    60 // 1분
  );
}
```

---

### 8.3 Error Handling

```typescript
// Custom Error Classes
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

// Error Handler Middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
  }
  
  // Prisma Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      return res.status(400).json({
        error: { message: 'Unique constraint violation' }
      });
    }
  }
  
  // Unknown Errors
  logger.error(err);
  return res.status(500).json({
    error: { message: 'Internal server error' }
  });
}
```

---

### 8.4 Logging

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request Logger Middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });
  
  next();
}
```

---

### 8.5 Security

```typescript
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';

// Security Middleware
app.use(helmet()); // HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(mongoSanitize()); // NoSQL injection 방지
app.use(express.json({ limit: '10kb' })); // Body size limit

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// JWT Verification
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new UnauthorizedError();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}
```

---

## 9. 배포 체크리스트

### 9.1 환경 변수

```bash
# Backend (.env)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRES_IN=30d

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX=...

# 한국투자증권
KOREA_INVESTMENT_APP_KEY=...
KOREA_INVESTMENT_APP_SECRET=...
KOREA_INVESTMENT_ACCOUNT=...

# Email (SendGrid)
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@insightstock.com

# Frontend
FRONTEND_URL=https://insightstock.com

# Stripe (Pro Tier)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://...
```

---

### 9.2 Production Checklist

```
Infrastructure:
☐ Railway 배포 설정
☐ Vercel 배포 설정
☐ Supabase DB 마이그레이션
☐ Upstash Redis 설정
☐ DNS 설정 (Cloudflare)

Security:
☐ HTTPS 활성화
☐ CORS 설정
☐ Rate Limiting
☐ Helmet 설정
☐ JWT Secret 변경

Performance:
☐ Redis 캐싱 활성화
☐ Database 인덱스 확인
☐ CDN 설정 (Cloudflare)
☐ 이미지 최적화

Monitoring:
☐ Sentry 연동
☐ Winston Logger 설정
☐ 헬스체크 엔드포인트
☐ Uptime 모니터링

Backup:
☐ Database 자동 백업
☐ Redis 백업 (선택)
☐ 로그 보관 정책

Documentation:
☐ API 문서 (Swagger/Postman)
☐ README.md
☐ CHANGELOG.md
☐ 장애 대응 매뉴얼
```

---

## 10. 마무리

### 완성도 확인

| 항목 | 상태 | 비고 |
|------|------|------|
| Database Schema | ✅ 100% | 24개 테이블 |
| API 엔드포인트 | ✅ 100% | 76개 고유 API |
| Background Jobs | ✅ 100% | 4개 |
| External API 선택 | ✅ 100% | 경제성 분석 완료 |
| 개발 로드맵 | ✅ 100% | 24주 Phase 포함 |
| 아키텍처 결정 | ✅ 100% | LangChain 하이브리드 |
| 비용 예측 | ✅ 100% | MVP $33/월 |

---

### 총 예상 비용

| Phase | DAU | 비용/월 | 수익/월 | 순이익/월 |
|-------|-----|--------|--------|----------|
| MVP | 1,000 | $33 | $100 | $67 |
| Growth | 5,000 | $180 | $4,995 | $4,815 |
| Scale | 20,000 | $500 | $19,980 | $19,480 |

---

**이제 진짜 완벽한 기술 명세서입니다!** 🎉

바로 개발 시작 가능합니다! 🚀
