좋아! 코드는 전부 빼고, **실무에서 바로 쓸 수 있는 완전한 MVP 기획 문서**로 만들게. 기존 내용 + 내가 지적한 7가지 개선사항을 모두 통합해서 **Product Requirement Document (PRD) 수준**으로 만들어줄게.

---

# 📘 InsightStock — MVP Product Specification
**Version 5.0 (Final Specification)**  
**Last Updated:** 2024.11.20  
**Document Owner:** Product Team  
**Status:** Ready for Development

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Case](#2-business-case)
3. [Target Users](#3-target-users)
4. [Product Vision & Principles](#4-product-vision--principles)
5. [Information Architecture](#5-information-architecture)
6. [Technical Architecture](#6-technical-architecture)
7. [Feature Specifications](#7-feature-specifications)
8. [AI System Design](#8-ai-system-design)
9. [Design System](#9-design-system)
10. [Interaction Patterns](#10-interaction-patterns)
11. [Accessibility Standards](#11-accessibility-standards)
12. [Edge Cases & Error Handling](#12-edge-cases--error-handling)
13. [MVP Scope & Phasing](#13-mvp-scope--phasing)
14. [Success Metrics](#14-success-metrics)
15. [Development Roadmap](#15-development-roadmap)
16. [Risk Assessment](#16-risk-assessment)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

### 1.1 Product Overview
**InsightStock**은 초보 투자자를 위한 **AI 기반 금융 학습 플랫폼**입니다. 실시간 시세와 뉴스 정보에 **AI 분석**과 **자동 학습 기록**을 결합하여, 투자자가 정보를 소비하는 동시에 금융 리터러시를 자연스럽게 향상시킬 수 있도록 설계되었습니다.

### 1.2 Core Value Proposition
- **즉시 이해 (Immediate Understanding)**: 복잡한 금융 정보를 AI가 초보자 눈높이로 요약
- **자동 학습 (Auto-Learning)**: 사용자의 질문과 관심사를 기반으로 맞춤형 학습 콘텐츠 자동 생성
- **연결된 경험 (Connected Flow)**: 시세 → 뉴스 → AI 분석 → 학습 → 포트폴리오 개선이라는 자연스러운 흐름

### 1.3 Competitive Positioning
| 경쟁사 | 강점 | 약점 |
|--------|------|------|
| **토스증권** | 뛰어난 UX, 간결한 정보 표현 | 학습 기능 부재, 정보 깊이 부족 |
| **NH투자증권** | 전문적 분석 도구 | 초보자 진입장벽 높음 |
| **네이버증권** | 포괄적 정보량 | 정보 과다, 학습 지원 없음 |
| **InsightStock** | **AI 학습 통합 + 초보자 중심 UX** | 신규 서비스 (브랜드 인지도 낮음) |

---

## 2. Business Case

### 2.1 Market Opportunity
- **타겟 시장 규모**: 국내 주식 투자자 1,400만 명 중 경험 3년 이하 약 60% (840만 명)
- **문제 정의**: 
  - 초보 투자자의 70%가 "정보는 많지만 이해가 어렵다" 응답 (2023 금융감독원 조사)
  - 손실 경험자의 65%가 "기본 개념 부족"을 주요 원인으로 꼽음
- **솔루션**: AI 기반 실시간 해설 + 자동 학습 기록으로 정보 이해도 향상

### 2.2 Business Objectives (MVP Launch +3개월)

#### Primary Goal (North Star Metric)
**주간 활성 사용자당 AI 질문 횟수 ≥ 3회**
- 의미: 사용자가 적극적으로 학습에 참여하고 있음을 나타내는 지표

#### Secondary Goals
1. **사용자 확보**: DAU 1,000명 / MAU 5,000명
2. **참여도**: 
   - DAU/MAU Ratio ≥ 30%
   - Education 페이지 방문율 ≥ 60%
   - 노트 저장율 ≥ 40% (AI 응답 기준)
3. **학습 효과**:
   - 동일 개념 재질문율 ≤ 15% (학습 효과 측정)
   - 학습 후 포트폴리오 조정율 ≥ 25%
4. **기술 지표**:
   - API 응답시간 < 500ms (P95)
   - AI 응답 생성 < 3초 (P95)
   - 서비스 Uptime ≥ 99.5%

### 2.3 Revenue Model (Phase 2)
- **Free Tier**: 일 5회 AI 질문, 기본 차트
- **Pro Tier** ($9.99/월): 무제한 AI, 고급 차트, 포트폴리오 리스크 분석
- **Team Tier** ($49.99/월): 노트 공유, 팀 학습 대시보드

---

## 3. Target Users

### 3.1 Primary Persona: "학습형 초보 투자자"

**이름**: 김준호 (28세, IT 스타트업 재직)

**배경**:
- 주식 투자 경험 1년
- 월 평균 50만원 투자
- 퇴근 후 1시간 시장 정보 확인

**Pain Points**:
- "뉴스를 읽어도 무슨 의미인지 모르겠어요"
- "PER, PBR 같은 용어가 나오면 그냥 넘어가요"
- "배운 내용을 어디에 기록해야 할지 모르겠어요"
- "정보가 너무 많아서 무엇부터 봐야 할지 모르겠어요"

**Goals**:
- 투자 판단력 향상
- 기본 재무 지표 이해
- 손실 최소화

**사용 시나리오**:
1. 퇴근 후 관심 종목 시세 확인
2. 오늘 급등/급락 이유가 궁금함
3. AI 요약으로 빠르게 파악
4. 이해 안 되는 용어 발견 → AI에게 질문
5. 답변을 노트에 저장
6. 다음 날 학습 대시보드에서 복습

### 3.2 Secondary Persona: "정보 효율형 투자자"

**이름**: 박서연 (34세, 프리랜서 디자이너)

**배경**:
- 주식 투자 경험 3년
- 포트폴리오 10종목 이상 보유
- 시간 부족, 효율적 정보 습득 선호

**Pain Points**:
- "여러 앱을 돌아다니며 정보를 수집하는 게 번거로워요"
- "중요한 뉴스만 빠르게 확인하고 싶어요"

**Goals**:
- 시간 절약
- 핵심 정보만 습득
- 포트폴리오 리스크 관리

---

## 4. Product Vision & Principles

### 4.1 Vision Statement
> "모든 투자자가 정보를 이해하고, 배우고, 성장하는 금융 생태계를 만든다."

### 4.2 Core Principles

#### 1) 즉시 이해 (Immediate Understanding)
- **원칙**: 사용자가 3초 이내에 핵심을 파악할 수 있어야 함
- **적용 예시**:
  - 차트 + 뉴스 + AI 요약을 한 화면에 배치
  - 전문 용어 옆에 괄호로 쉬운 설명 추가
  - 숫자는 항상 변화율과 함께 표시

#### 2) 자동 학습 (Auto-Learning Flow)
- **원칙**: 사용자가 별도로 "학습"을 시작하지 않아도 자연스럽게 배울 수 있어야 함
- **적용 예시**:
  - AI에게 질문하면 자동으로 학습 대시보드에 기록
  - 관심 종목 기반 맞춤 개념 추천
  - 오늘 본 뉴스에서 자주 등장한 용어 자동 정리

#### 3) 연결된 경험 (Connected Flow)
- **원칙**: 각 기능이 독립적이지 않고 자연스러운 흐름으로 연결되어야 함
- **적용 예시**:
  - Dashboard에서 종목 클릭 → 뉴스 → AI 요약 → Education으로 이동하는 CTA
  - Education에서 배운 개념 → Portfolio 분석에 반영
  - 모든 페이지에서 "이것도 배워보세요" 제안

#### 4) 투명성 (Transparency)
- **원칙**: AI의 판단 근거를 명확히 표시
- **적용 예시**:
  - "이 요약은 최근 뉴스 3건을 기반으로 작성되었습니다"
  - "AI는 투자 추천을 하지 않습니다. 참고용 정보입니다"

#### 5) 점진적 복잡도 (Progressive Disclosure)
- **원칙**: 초보자에게는 단순하게, 경험자에게는 심화 정보 제공
- **적용 예시**:
  - 기본 차트: Candlestick + Volume만
  - "고급 지표 보기" 클릭 시 RSI, MACD 표시

---

## 5. Information Architecture

### 5.1 Main Navigation (Sidebar)

```
🏠 Dashboard          실시간 시세 + 차트 + 뉴스
📰 News & Feed        뉴스 중심 정보 소비
🎓 Education          학습 대시보드 + Q&A + 노트
🔍 Explore            전략 탐색 + 종목 스크리닝
💼 Portfolio          포트폴리오 분석
───────────────────
⭐ Favorites          찜한 종목 (빠른 접근)
🕐 History            최근 본 종목/뉴스
🔥 Hot Issue          실시간 인기 종목
⚙️ Settings           설정
```

### 5.2 User Journey Map

#### Journey 1: 정보 소비형
```
Dashboard 시세 확인
   ↓
뉴스 클릭
   ↓
AI 요약 확인
   ↓
이해 완료 → 다른 종목 탐색
```

#### Journey 2: 학습 중심형
```
Dashboard 시세 확인
   ↓
뉴스 읽다가 모르는 용어 발견
   ↓
Education Q&A 질문
   ↓
AI 설명 + 차트 예시
   ↓
노트 저장
   ↓
Learning Dashboard에 자동 기록
   ↓
다음 날 복습
```

#### Journey 3: 포트폴리오 관리형
```
Portfolio 분석
   ↓
AI 리스크 경고 확인
   ↓
관련 뉴스 탐색
   ↓
Education에서 개념 학습
   ↓
포트폴리오 조정
```

### 5.3 Information Hierarchy

**Level 1 (최우선 정보):**
- 현재가, 등락률
- AI 한 문장 요약
- 오늘의 핵심 뉴스 1건

**Level 2 (보조 정보):**
- 차트 (캔들스틱 + 거래량)
- 관련 뉴스 목록
- 관련 개념 태그

**Level 3 (심화 정보):**
- 상세 재무제표
- 과거 이슈 타임라인
- 업종 비교 차트

---

## 6. Technical Architecture

### 6.1 System Overview (Hybrid Architecture)

```
┌─────────────────────────────────────────────────┐
│                  User Layer                     │
│  Web (Desktop) → Mobile Web → Native App (P2)  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Frontend (Next.js + TypeScript)         │
│  • Server-Side Rendering (초기 로딩 속도)        │
│  • Client-Side State Management (Zustand)       │
│  • Real-time Updates (WebSocket)                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│      Main API (Node.js + Fastify + Prisma)     │
│  ┌───────────────────────────────────────────┐ │
│  │ 사용자 대면 API (< 500ms 응답 목표)        │ │
│  │ • 주가 조회 (실시간 캐싱)                  │ │
│  │ • AI 요약 생성 (OpenAI API)               │ │
│  │ • 뉴스 검색 & 필터링                       │ │
│  │ • 포트폴리오 CRUD                         │ │
│  │ • 학습 기록 관리                          │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
           ↓                            ↑
    (Queue/HTTP)               (읽기 전용)
           ↓                            ↑
┌─────────────────────────────────────────────────┐
│  Data Pipeline (Java Spring Boot + Batch)      │
│  ┌───────────────────────────────────────────┐ │
│  │ 백그라운드 작업 (대용량 처리)              │ │
│  │ • 주가 데이터 수집 (한투 API)              │ │
│  │ • 뉴스 크롤링 (멀티스레드)                 │ │
│  │ • 재무제표 파싱                           │ │
│  │ • 벡터 임베딩 생성 (AI RAG)               │ │
│  │ • 통계 데이터 사전 계산                   │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
           ↓                            ↓
┌──────────────────────┐  ┌──────────────────────┐
│   PostgreSQL         │  │  Redis               │
│  • 주가 시계열 데이터 │  │  • API 응답 캐싱      │
│  • 뉴스 & 메타데이터  │  │  • Job Queue         │
│  • 사용자 데이터      │  │  • Session Storage   │
│  • 학습 기록          │  │  • Rate Limiting     │
└──────────────────────┘  └──────────────────────┘
```

### 6.2 Technology Stack

#### Frontend
| 항목 | 기술 | 선택 이유 |
|------|------|-----------|
| Framework | **Next.js 14 (App Router)** | SSR로 SEO 최적화, API Routes로 간단한 BFF 패턴 |
| Language | **TypeScript 5** | 타입 안정성, 프론트/백엔드 타입 공유 |
| State | **Zustand** | Redux보다 가볍고 간단, MVP에 충분 |
| UI Components | **shadcn/ui + Tailwind CSS** | Radix UI 기반, 접근성 기본 탑재, 빠른 커스터마이징 |
| Charts | **Lightweight Charts** | TradingView 기반, 금융 차트에 최적화 |
| Forms | **React Hook Form + Zod** | 성능 우수, 타입 세이프 검증 |

#### Backend - Main API (사용자 대면)
| 항목 | 기술 | 선택 이유 |
|------|------|-----------|
| Runtime | **Node.js 20 LTS** | AI 연동 용이, 빠른 프로토타이핑 |
| Framework | **Fastify** | Express보다 2배 빠름, TypeScript 친화적 |
| ORM | **Prisma** | 타입 세이프, Migration 관리 용이 |
| API Design | **tRPC** | End-to-end 타입 안정성, 프론트와 타입 공유 |
| Real-time | **Socket.io** | WebSocket 기반 실시간 주가 푸시 |

#### Backend - Data Pipeline (배치 처리)
| 항목 | 기술 | 선택 이유 |
|------|------|-----------|
| Language | **Java 21 LTS** | 대용량 데이터 처리, 멀티스레드 성능 |
| Framework | **Spring Boot 3.2** | 배치 처리 표준, 스케줄러 내장 |
| Batch | **Spring Batch** | 대량 데이터 ETL에 최적화 |
| ORM | **JPA + QueryDSL** | 복잡한 쿼리 타입 세이프 작성 |

#### Database & Cache
| 항목 | 기술 | 용도 |
|------|------|------|
| Main DB | **PostgreSQL 15** | 신뢰성, 시계열 확장(TimescaleDB) |
| Cache | **Redis 7** | API 응답 캐싱, Job Queue (BullMQ) |
| Vector DB | **Pinecone** | AI RAG용 뉴스/학습 개념 검색 |

#### AI & External APIs
| 항목 | 기술 | 용도 |
|------|------|------|
| LLM | **OpenAI GPT-4o-mini** | 비용 효율적, 빠른 응답 |
| Embeddings | **text-embedding-3-small** | RAG용 벡터 생성 |
| Framework | **LangChain.js** | 프롬프트 체이닝, RAG 구현 |
| 주가 데이터 | **한국투자증권 Open API** | 실시간 호가, 과거 데이터 |
| 뉴스 | **네이버 뉴스 API + Cheerio** | 뉴스 수집 & 파싱 |

#### DevOps & Infrastructure
| 항목 | 기술 | 선택 이유 |
|------|------|-----------|
| Frontend Hosting | **Vercel** | Next.js 최적화, Edge Functions |
| Backend Hosting | **Railway / Fly.io** | Node.js 배포 간편, 자동 스케일링 |
| Database | **Supabase** | PostgreSQL managed, 무료 티어 500MB |
| Monitoring | **Sentry** | 에러 추적, 성능 모니터링 |
| CI/CD | **GitHub Actions** | 자동 배포, 테스트 파이프라인 |

### 6.3 Service Communication

#### 방식 1: Message Queue (주요 통신)
- **사용 케이스**: Java Pipeline → TypeScript API 데이터 업데이트 알림
- **기술**: Redis + BullMQ
- **장점**: 비동기, 느슨한 결합, 실패 시 재시도

**플로우:**
```
Java 크롤링 완료
   ↓
Redis Queue에 메시지 Publish
   ↓
TypeScript Worker가 메시지 수신
   ↓
Prisma로 데이터 조회 캐시 무효화
```

#### 방식 2: REST API (보조 통신)
- **사용 케이스**: TypeScript → Java 통계 데이터 조회
- **인증**: Internal API Key
- **Rate Limiting**: 100 req/min

### 6.4 Database Schema (주요 테이블)

#### stocks (종목 기본 정보)
- id, code (종목코드), name, market, sector
- 인덱스: code, sector

#### stock_prices (주가 시계열)
- id, stock_id, date, open, high, low, close, volume
- 인덱스: (stock_id, date DESC) - 최근 데이터 조회 최적화

#### news (뉴스)
- id, title, content, summary (AI 요약), url, published_at, source, stock_id
- ai_analysis (JSON: sentiment, key_points, related_concepts)
- 인덱스: published_at DESC, stock_id

#### users (사용자)
- id, email, name, created_at

#### portfolios (포트폴리오)
- id, user_id

#### portfolio_stocks (보유 종목)
- id, portfolio_id, stock_id, quantity, avg_price

#### learnings (학습 기록)
- id, user_id, concept, question, answer, related_stocks (array)
- 인덱스: (user_id, created_at DESC), concept

#### notes (노트)
- id, user_id, title, content, tags (array), chart_data (JSON)

### 6.5 Performance Requirements

| 항목 | 목표 | 측정 방법 |
|------|------|-----------|
| API 응답시간 | P95 < 500ms | Datadog APM |
| AI 요약 생성 | P95 < 3초 | OpenAI API 로그 |
| 차트 렌더링 | < 1초 | Lighthouse |
| 뉴스 크롤링 | 시간당 10,000건 | Spring Batch Metrics |
| Uptime | ≥ 99.5% | Pingdom |

---

## 7. Feature Specifications

### 7.1 Dashboard — 실시간 시세 메인

#### 목적
- 시장 전반을 가장 빠르게 파악
- 종목 클릭 시 차트·뉴스·AI 요약을 동시에 확인
- Toss 같은 금융 데이터 UI에 학습 동선 자연스럽게 포함

#### 레이아웃 구조

**기본 상태 (AI 패널 닫힘)**
```
┌─────────────────────────────────────────────────┐
│ Market Header (코스피/코스닥 지수)               │
├─────────────┬───────────────────────────────────┤
│ Stock List  │  Chart Area                       │
│  (40%)      │   • Candlestick + Volume (60%)    │
│             │   • Related News (3건)            │
│             │                                   │
└─────────────┴───────────────────────────────────┘
```

**확장 상태 (AI 패널 열림)**
```
┌──────────────────────────────────────────────────────────┐
│ Market Header                                            │
├──────────┬─────────────────────┬──────────────────────────┤
│ Stock    │  Chart + News       │  AI Summary Panel       │
│ List     │   (45%)             │   (35%)                 │
│ (20%)    │                     │  • 한 문장 요약          │
│          │                     │  • 주요 이슈 2~3개      │
│          │                     │  • 가격/거래량 해석      │
│          │                     │  • 리스크 요약           │
│          │                     │  • Education CTA         │
└──────────┴─────────────────────┴──────────────────────────┘
```

#### 주요 기능

**1) Market Header**
- 표시 정보:
  - 코스피: 현재가, 등락률, 거래대금
  - 코스닥: 동일
  - 환율(USD/KRW), 국제유가(WTI)
- 업데이트: 실시간 (WebSocket, 10초 간격)
- 인터랙션: 클릭 시 시장 상세 페이지 이동 (Phase 2)

**2) Stock List**
- 데이터 소스: PostgreSQL (Redis 캐싱 10초 TTL)
- 기본 표시 종목: 관심 종목 + 거래대금 상위 30개
- 컬럼:
  - 종목명 (Bold, 14px)
  - 현재가 (Tabular Numbers)
  - 등락률 (%, 색상: Red/Blue)
  - 거래대금 (억 단위, Gray-600)
- 기능:
  - 정렬: 종목명, 등락률, 거래대금 (오름차순/내림차순)
  - 검색: 종목명, 종목코드 자동완성
  - 가상 스크롤링: 50개 단위 렌더링
- 인터랙션:
  - Hover: 배경 Gray-100, Cursor pointer
  - Selected: 좌측 Primary-600 Indicator 3px, 배경 White
  - Double Click: 종목 상세 페이지 새 탭 오픈

**3) Chart Area**
- 차트 라이브러리: Lightweight Charts
- 차트 타입: Candlestick (상승 Red, 하락 Blue)
- 보조 지표:
  - Volume (Bar, 하단)
  - MA 5일 (Orange, 1px)
  - MA 20일 (Blue, 1px)
- 시간 프레임: 1일 / 1주 / 1개월 / 3개월 (탭 전환)
- 툴팁:
  - 날짜, 시가, 고가, 저가, 종가, 거래량
  - 등락률 표시
- 로딩 상태: Skeleton UI (0.3초)

**4) Related News**
- 표시 건수: 최신 3건
- 카드 구조:
  - 썸네일 (64x64px, 없으면 기본 이미지)
  - 제목 (2줄 말줄임)
  - 발행처 + 시간 (Caption, Gray-600)
  - 종목 태그 (Chip, Primary-100)
- 인터랙션:
  - Click: 뉴스 상세 모달 오픈
  - 모달 내 "AI 요약 보기" 버튼

**5) AI Summary Panel**
- 토글 버튼:
  - 위치: Chart 우측 상단
  - 아이콘: Sparkles (Lucide)
  - 라벨: "AI 요약"
- 애니메이션: Slide from right (0.3s cubic-bezier)
- 닫기: X 버튼 or 외부 클릭 or ESC 키
- 로딩 상태: 
  - Skeleton + "AI가 분석 중입니다..." 텍스트
  - 평균 2초 소요
- 내용 구조:
  1. **한 문장 요약** (Bold, 18px)
     - 예: "실적 개선 기대감에 3% 상승"
  2. **주요 이슈** (Bullet List)
     - 이슈 1: [뉴스 기반]
     - 이슈 2: [거래량/기술적]
  3. **가격·거래량 해석** (Body2)
     - 예: "거래량이 평균 대비 150% 증가하며 매수세 유입"
  4. **리스크 요약** (Warning Card, Yellow-100 배경)
     - 예: "단기 급등 후 조정 가능성 주의"
  5. **Education CTA** (Primary Button)
     - "'{개념}'에 대해 더 알아보기"
     - Click: Education Q&A로 이동, 자동 질문 입력

#### UX 패턴

**상태별 표시**
| 상태 | Stock List | Chart Area | AI Panel |
|------|------------|------------|----------|
| 초기 로딩 | Skeleton (10줄) | Skeleton | 숨김 |
| 종목 미선택 | 데이터 표시 | Empty State "종목을 선택하세요" | 숨김 |
| 종목 선택 | Selected 표시 | 차트+뉴스 로딩 → 표시 | 숨김 |
| AI 요약 요청 | 유지 | 유지 | 열림 + 로딩 → 표시 |

**에러 처리**
| 에러 상황 | 표시 내용 | 복구 방법 |
|----------|-----------|-----------|
| 주가 데이터 없음 | "데이터를 불러올 수 없습니다" Toast | 새로고침 버튼 |
| 뉴스 없음 | "최근 뉴스가 없습니다" + 과거 뉴스 3건 | - |
| AI 응답 실패 | "요약 생성 중 오류 발생" + 원본 뉴스로 대체 | 재시도 버튼 |
| 네트워크 끊김 | "연결이 끊어졌습니다" 전체 화면 오버레이 | 자동 재연결 시도 |

#### 접근성 고려사항
- Stock List: 키보드 화살표 키로 이동 (↑↓), Enter로 선택
- 차트: Alt text "애플 주가 3개월 차트, 현재가 190,000원, 3% 상승"
- 색상 의존 제거: 상승/하락에 ▲▼ 아이콘 병행
- Focus Indicator: Primary-600 2px 아웃라인

#### 성능 최적화
- Stock List: React Virtual (가상 스크롤링) - 50개 단위 렌더링
- Chart: Lazy Load - 뷰포트 진입 시 로드
- News Image: Lazy Load + WebP 포맷
- AI 요약: 동일 종목 24시간 캐싱 (Redis)

---

### 7.2 News & Feed — 뉴스 중심 정보 소비

#### 목적
- 시장 정보를 쉽고 빠르게 소비
- 뉴스 → AI 분석 → 학습으로 자연스럽게 연결

#### 레이아웃

**뉴스 리스트 페이지**
```
┌────────────────────────────────────────────────────┐
│ 탭: 전체 / 종목 / 업종 / 글로벌                      │
├────────────────────────────────────────────────────┤
│ 필터: 오늘 / 이번 주 / 최근 1개월                    │
├────────────────────────────────────────────────────┤
│  [뉴스 카드 1]  [뉴스 카드 2]  [뉴스 카드 3]         │
│                                                    │
│  [뉴스 카드 4]  [뉴스 카드 5]  [뉴스 카드 6]         │
│                                                    │
│  (무한 스크롤)                                      │
└────────────────────────────────────────────────────┘
```

**뉴스 상세 모달**
```
┌────────────────────────────────────────────────────┐
│ 뉴스 제목 (H1, 24px)                                │
│ 발행처 · 날짜 · 관련 종목 태그                       │
├────────────────────────────────────────────────────┤
│ 본문 (읽기 편한 Typography)                         │
│                                                    │
│ (이미지 있으면 표시)                                │
│                                                    │
├────────────────────────────────────────────────────┤
│ [AI 요약 보기] 버튼 (Primary)                       │
├────────────────────────────────────────────────────┤
│ AI 요약 영역 (접힌 상태 → 펼침)                     │
│ • 5줄 요약                                          │
│ • 핵심 이슈 3개                                     │
│ • 관련 개념 2개 (Education 링크)                    │
│ • 관련 종목 영향도                                  │
└────────────────────────────────────────────────────┘
```

#### 주요 기능

**1) 뉴스 카드 (Grid Item)**
- 구조:
  - 썸네일 이미지 (16:9, 최대 높이 200px)
  - 제목 (2줄 말줄임, Bold 16px)
  - 요약 (1줄 말줄임, 14px Gray-700)
  - 발행처 + 시간 (12px Gray-600)
  - 관련 종목 태그 (Chip, 최대 3개)
- Hover: 
  - 카드 Shadow 증가 (0 → 4px blur)
  - 제목 색상 Primary-600
- Click: 모달 오픈 (애니메이션: Fade + Scale Up)

**2) 탭 필터**
- 전체: 모든 뉴스
- 종목: 특정 종목 관련 뉴스만
- 업종: 섹터별 필터 (IT, 금융, 바이오 등)
- 글로벌: 해외 뉴스

**3) AI 뉴스 분석**
- 활성화: "AI 요약 보기" 버튼 클릭
- 출력 템플릿:
  1. **5줄 요약** (초보자 눈높이)
  2. **핵심 이슈 3개** (Bullet List)
  3. **관련 개념 2개** (Badge, Click → Education 이동)
  4. **관련 종목 영향** (표)
     | 종목 | 예상 영향 | 근거 |
     |------|----------|------|
     | 삼성전자 | 긍정적 (+) | AI 반도체 수요 증가 |
  5. **Education CTA** (Secondary Button)
     - "이 개념 더 배우기"

**4) 무한 스크롤**
- 트리거: 뷰포트 하단 200px 도달 시
- 로딩: 10개 단위 추가 로드
- 로딩 상태: Skeleton 카드 3개 표시

#### Edge Cases
| 상황 | 처리 방법 |
|------|-----------|
| 뉴스 이미지 없음 | 기본 Placeholder (Primary-100 배경 + 아이콘) |
| 제목 너무 김 | 2줄 말줄임 + "..." |
| 관련 종목 없음 | "시장 전반" 태그 표시 |
| AI 요약 생성 실패 | "요약을 생성할 수 없습니다" + 원문으로 대체 |

---

### 7.3 Education — 학습 중심 허브

#### 목적
- 모르는 것을 바로 질문하고
- 이해한 내용을 자동 기록하며
- 매일의 학습을 정리해주는 허브

#### 레이아웃

**Learning Dashboard (메인)**
```
┌────────────────────────────────────────────────────┐
│ 📚 오늘의 학습                                      │
│  [개념 카드 1]  [개념 카드 2]  [개념 카드 3]        │
├────────────────────────────────────────────────────┤
│ 🎯 뉴스 기반 추천                                   │
│  [개념 카드 4]  [개념 카드 5]                       │
├────────────────────────────────────────────────────┤
│ 💼 포트폴리오 기반 추천                             │
│  [개념 카드 6]  [개념 카드 7]                       │
└────────────────────────────────────────────────────┘
```

**Q&A 페이지**
```
┌─────────────────────┬──────────────────────────────┐
│ 질문 기록 (좌측 30%) │ 노트 미리보기 (우측 70%)      │
│                     │                              │
│ • PER이 뭔가요?     │ (선택된 질문의 답변 표시)     │
│ • 배당락일이란?     │                              │
│ • RSI 지표 해석법   │                              │
│                     │                              │
│ (최신순 정렬)       │                              │
├─────────────────────┴──────────────────────────────┤
│ 질문 입력창 (하단 고정)                             │
│ "궁금한 것을 물어보세요..."                         │
└────────────────────────────────────────────────────┘
```

**노트 리스트 (Notion 스타일)**
```
┌────────────────────────────────────────────────────┐
│ 태그 필터: 전체 / 재무제표 / 기술적분석 / 뉴스      │
├────────────────────────────────────────────────────┤
│  [노트 카드 1]         [노트 카드 2]                │
│  • 태그                • 태그                       │
│  • 제목                • 제목                       │
│  • 요약 (2줄)          • 요약                       │
│  • 차트 썸네일         • 차트 썸네일                │
│  • 날짜                • 날짜                       │
│                                                    │
│  (2열 그리드, 무한 스크롤)                          │
└────────────────────────────────────────────────────┘
```

#### 주요 기능

**1) Learning Dashboard**

**오늘의 학습 섹션**
- 데이터 소스: 오늘 질문한 개념 + AI 추천
- 카드 구조:
  - 개념명 (Bold 18px)
  - 한 줄 설명 (14px)
  - 학습 상태 (Badge: 학습 완료 / 복습 필요)
  - CTA: "다시 보기" or "학습하기"

**뉴스 기반 추천**
- 로직: 오늘 사용자가 본 뉴스에서 자주 등장한 개념 추출
- 예: 사용자가 "반도체 업황" 뉴스 3건 봄 → "파운드리", "HBM" 추천

**포트폴리오 기반 추천**
- 로직: 사용자 보유 종목의 업종/테마 관련 개념
- 예: 삼성전자 보유 → "반도체 Cycle", "CAPEX" 추천

**2) AI Q&A 시스템**

**질문 입력**
- Input: 자동완성 지원 (기존 질문 데이터 기반)
- Placeholder: "예: PER이 뭔가요? / 배당락일이란?"
- 제출: Enter 또는 Send 버튼

**AI 응답 템플릿**
```
┌────────────────────────────────────────────────────┐
│ 1. 개념 한 문장 정의                                │
│    "PER은 주가를 주당순이익으로 나눈 지표입니다."   │
├────────────────────────────────────────────────────┤
│ 2. 왜 중요한가?                                    │
│    "기업의 밸류에이션을 평가하는 가장 기본적인     │
│     지표로, 주가가 비싼지 싼지 판단할 수 있어요."  │
├────────────────────────────────────────────────────┤
│ 3. 종목/업종 예시                                  │
│    • 삼성전자 PER: 15배 (2024년 기준)             │
│    • IT 업종 평균: 20배                           │
├────────────────────────────────────────────────────┤
│ 4. 교육용 차트 (1개 포함)                          │
│    [PER vs 주가 상관관계 차트]                     │
├────────────────────────────────────────────────────┤
│ 5. 실수하기 쉬운 포인트 ⚠️                         │
│    "PER이 낮다고 무조건 좋은 건 아닙니다.          │
│     적자 기업은 PER을 계산할 수 없어요."           │
├────────────────────────────────────────────────────┤
│ 6. 포트폴리오와 연결                               │
│    "회원님 포트폴리오의 삼성전자 PER은 15배로,     │
│     업종 평균보다 낮은 편입니다."                  │
├────────────────────────────────────────────────────┤
│ [노트에 저장] [관련 종목 보기] [더 질문하기]        │
└────────────────────────────────────────────────────┘
```

**노트 저장 기능**
- Click 시:
  - 자동으로 제목 생성 (예: "PER의 개념과 활용법")
  - 태그 자동 추가 (예: #재무제표, #밸류에이션)
  - 학습 대시보드에 자동 기록
  - Toast: "노트에 저장되었습니다" (2초)

**3) 노트 시스템**

**노트 카드 (Grid Item)**
- 썸네일: 차트 이미지 or 기본 이미지
- 제목: Bold 18px, 2줄 말줄임
- 요약: 1~2줄
- 태그: Chip (Primary-100, 최대 3개 표시)
- 날짜: "2일 전" 형태
- Hover: Shadow 증가
- Click: 노트 상세 모달

**노트 상세 모달**
- 구조:
  - 제목 (수정 가능)
  - 태그 (추가/삭제 가능)
  - 본문 (Markdown 렌더링)
  - 차트 (있으면 표시)
  - 하단: [수정] [삭제] 버튼
- 수정: 간단한 Markdown 에디터 제공 (Phase 2)

**검색 & 필터**
- 검색: 제목, 본문, 태그 전체 검색
- 필터: 태그별, 날짜별
- 정렬: 최신순, 오래된 순, 제목순

#### UX 패턴

**학습 진행 표시**
- 질문 → AI 응답 → 노트 저장 → 학습 대시보드 업데이트 전 과정이 시각적으로 연결
- 각 단계마다 Confetti 애니메이션 (미묘하게)

**자동 추천 로직**
```
IF 사용자가 특정 개념을 2회 이상 질문
  → "이 개념을 자주 궁금해하시네요. 관련 노트를 복습해보세요"
  
IF 포트폴리오에 새 종목 추가
  → "이 종목과 관련된 개념을 학습해보세요" + 개념 3개 추천
  
IF 뉴스에서 낯선 용어 빈도 증가
  → 오늘의 학습에 자동 추가
```

---

### 7.4 Explore — 전략 기반 종목 탐색

#### 목적
- 전략 기반으로 종목을 쉽게 발견
- AI가 전략을 설명하고 종목을 추천

#### 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 전략 카드 (4~5개 가로 스크롤)                        │
│  [배당 전략]  [성장주]  [가치주]  [모멘텀]  [AI 추천] │
├────────────────────────────────────────────────────┤
│ 선택된 전략 상세                                    │
│  • 전략 설명 (AI 생성)                              │
│  • 종목 테이블 (10개)                               │
│  • 핵심 지표 (배당률, PER 등)                       │
│  • [AI에게 전략 설명받기] 버튼                      │
├────────────────────────────────────────────────────┤
│ 간단 스크리너                                       │
│  • 업종 선택                                        │
│  • 등락률 범위                                      │
│  • 시가총액 범위                                    │
│  • [검색] 버튼                                      │
└────────────────────────────────────────────────────┘
```

#### 주요 기능

**1) 전략 카드**
- 기본 제공 전략:
  - **배당주 전략**: 배당률 3% 이상, 5년 연속 배당
  - **성장주 전략**: 매출 성장률 20% 이상
  - **가치주 전략**: PER 10 이하, PBR 1 이하
  - **모멘텀 전략**: 최근 1개월 등락률 상위
  - **AI 추천**: 사용자 포트폴리오 기반 맞춤 추천
- 카드 구조:
  - 아이콘 (전략 상징)
  - 전략명 (Bold 18px)
  - 간단 설명 (1줄)
  - 종목 개수 (예: "12개 종목")

**2) 전략 상세**
- 전략 설명: AI가 초보자 눈높이로 설명
  - 예: "배당주는 회사가 주주에게 정기적으로 돈을 나눠주는 주식이에요. 안정적인 현금 흐름을 원하는 투자자에게 적합합니다."
- 종목 테이블:
  - 컬럼: 종목명, 현재가, 등락률, 핵심 지표 (전략별로 다름)
  - 정렬 가능
  - Click: Dashboard로 이동 (종목 자동 선택)
- AI 설명 버튼:
  - Click: 모달 오픈
  - "이 전략이 왜 좋은가?", "어떤 사람에게 적합한가?", "리스크는?" 등 Q&A 형태

**3) 간단 스크리너**
- 필터:
  - 업종: 드롭다운 (IT, 금융, 바이오 등)
  - 등락률: 슬라이더 (-10% ~ +10%)
  - 시가총액: 슬라이더 (1천억 ~ 100조)
- 결과: 종목 테이블 표시 (최대 30개)

---

### 7.5 Portfolio — 포트폴리오 분석

#### 목적
- 보유 종목을 한눈에 파악
- AI가 리스크를 자동 진단

#### 레이아웃

```
┌────────────────────────────────────────────────────┐
│ Summary Header                                     │
│  • 총 평가금액: 12,450,000원                        │
│  • 총 수익률: +8.5% (+980,000원)                   │
│  • 오늘 손익: +125,000원 (+1.0%)                   │
├────────────────────────────────────────────────────┤
│ 보유 종목 테이블                                    │
│  종목명 | 수량 | 평가금액 | 수익률 | 비중            │
├────────────────────────────────────────────────────┤
│ 업종 비중 (Pie Chart)                               │
│  IT 40% | 금융 30% | 바이오 20% | 기타 10%         │
├────────────────────────────────────────────────────┤
│ 종목별 기여도 (Bar Chart)                           │
│  삼성전자 +3.2% | 카카오 +2.1% | ...               │
├────────────────────────────────────────────────────┤
│ AI 리스크 분석                                      │
│  ⚠️ IT 업종 편중 (40%)                             │
│  ⚠️ 삼성전자 단일 종목 비중 과다 (25%)              │
│  ✅ 배당주 비중 적절 (20%)                          │
└────────────────────────────────────────────────────┘
```

#### 주요 기능

**1) Summary Header**
- 데이터: 실시간 업데이트 (10초 간격)
- 표시:
  - 총 평가금액 (현재가 기준)
  - 총 수익률 (%, 금액)
  - 오늘 손익 (전일 대비)
- 색상: 수익 Red, 손실 Blue

**2) 보유 종목 테이블**
- 컬럼:
  - 종목명 (Click → Dashboard 이동)
  - 수량
  - 평균 매입가
  - 현재가
  - 평가금액
  - 수익률 (%, 금액)
  - 비중 (%)
- 정렬: 모든 컬럼 가능
- 액션:
  - [수정]: 수량, 평균가 수정 모달
  - [삭제]: 종목 제거 확인 다이얼로그

**3) 업종 비중 차트**
- 차트 타입: Donut Chart (Recharts)
- Hover: 업종명 + 비중 + 평가금액 툴팁
- Click: 해당 업종 종목 필터링

**4) 종목별 기여도 차트**
- 차트 타입: Horizontal Bar Chart
- 표시: 각 종목이 전체 수익률에 기여한 %
- 예: 삼성전자가 +3% 올라서 전체 포트폴리오 수익률에 +0.75% 기여

**5) AI 리스크 분석**
- 자동 진단 항목:
  - **업종 편중**: 단일 업종 40% 이상 시 경고
  - **종목 편중**: 단일 종목 20% 이상 시 경고
  - **배당 비중**: 배당주 비중 적절성
  - **변동성**: 고변동성 종목 비중
- 표시 형태:
  - Warning (⚠️ Yellow): 주의 필요
  - Success (✅ Green): 적절함
  - Error (🚨 Red): 즉시 조치 필요
- CTA: "리스크 개선 제안 보기" → AI가 구체적 조언 제공

---

### 7.6 Favorites / History / Hot Issue

#### Favorites (찜 목록)
- 목적: 자주 보는 종목 빠른 접근
- 레이아웃: Dashboard Stock List와 동일
- 기능:
  - 추가: Dashboard에서 Star 아이콘 클릭
  - 삭제: Favorites에서 Star 아이콘 재클릭
  - 정렬: 드래그 앤 드롭으로 순서 변경 (Phase 2)

#### History (최근 기록)
- 목적: 최근 본 종목/뉴스 추적
- 탭: 종목 / 뉴스
- 표시: 최근 30개 (날짜별 그룹)
- 삭제: 개별 삭제 or 전체 삭제

#### Hot Issue (실시간 인기)
- 목적: 지금 뜨거운 종목/뉴스 발견
- 데이터 소스:
  - 거래량 급증 종목 (평균 대비 200% 이상)
  - 검색량 급증 종목
  - 조회수 높은 뉴스
- 업데이트: 10분 간격

---

### 7.7 Settings — 사용자 설정

#### 목적
- 사용자 프로필 관리
- 알림 및 선호도 설정
- 데이터 관리 (내보내기, 삭제)

#### 레이아웃

```
Settings Frame (Auto Layout, Vertical)
├── Sidebar (240px)
└── Main Area (1200px, Auto Layout, Vertical)
    ├── Page Header
    │   ├── Title (H1: "설정")
    │   └── Breadcrumb (Optional)
    ├── Profile Section (Card)
    │   ├── Avatar (80x80px, Circle)
    │   ├── Name (H3)
    │   ├── Email (Body2, Gray-600)
    │   └── [프로필 수정] 버튼 (Secondary)
    ├── Preferences Section (Card)
    │   ├── Section Title (H2: "선호도 설정")
    │   ├── 알림 설정 (Toggle)
    │   │   ├── 이메일 알림 (Toggle)
    │   │   ├── 푸시 알림 (Toggle, Phase 2)
    │   │   └── 뉴스 알림 (Toggle)
    │   ├── 다크모드 (Toggle, Phase 2)
    │   └── 언어 설정 (Select: 한국어 / English)
    ├── Account Section (Card)
    │   ├── Section Title (H2: "계정 관리")
    │   ├── [비밀번호 변경] 버튼 (Ghost)
    │   ├── [데이터 내보내기] 버튼 (Ghost)
    │   └── [계정 삭제] 버튼 (Ghost, Red)
    └── Footer
        └── 버전 정보 (Caption: "v1.0.0")
```

#### 주요 기능

**1) 프로필 관리**
- 프로필 이미지:
  - 기본: 이니셜 아바타 (이름 첫 글자)
  - 업로드: 이미지 파일 (JPG, PNG, 최대 2MB)
  - 크롭: 1:1 비율, 200x200px
- 이름 수정:
  - 모달 오픈: 이름 입력 (최대 20자)
  - 실시간 검증: 빈 값 불가
- 이메일:
  - 표시만 (변경 불가, 보안상 이유)

**2) 알림 설정**
- 이메일 알림:
  - 종목 가격 알림 (관심 종목 ±5% 변동)
  - 뉴스 알림 (관심 종목 관련 뉴스)
  - 학습 추천 (주간 요약)
- 푸시 알림 (Phase 2):
  - 모바일 앱 연동
  - 실시간 주가 변동
- 뉴스 알림:
  - 관심 종목 관련 뉴스
  - 업데이트: 일 1회 (오전 9시)

**3) 계정 관리**
- 비밀번호 변경:
  - 현재 비밀번호 입력
  - 새 비밀번호 입력 (최소 8자, 영문+숫자)
  - 확인 다이얼로그: "비밀번호가 변경되었습니다"
- 데이터 내보내기:
  - 포맷: JSON (포트폴리오, 노트, 학습 기록)
  - 처리 시간: 1~2분
  - 이메일로 다운로드 링크 전송
- 계정 삭제:
  - 확인 다이얼로그: "정말 삭제하시겠습니까? 모든 데이터가 영구 삭제됩니다."
  - 2단계 확인: "DELETE" 입력
  - 삭제 후: 30일간 복구 가능 (Phase 2)

**4) 언어 설정**
- 지원 언어: 한국어 (기본), English (Phase 2)
- 변경 시: 즉시 적용, 페이지 새로고침

#### UX 패턴

**저장 피드백:**
- 각 설정 변경 시 즉시 저장 (Auto-save)
- Toast: "설정이 저장되었습니다" (2초)
- 에러 시: "저장에 실패했습니다. 다시 시도해주세요."

**로딩 상태:**
- 프로필 이미지 업로드: Progress Bar
- 데이터 내보내기: Spinner + "준비 중입니다..."

**에러 처리:**
| 상황 | 처리 방법 |
|------|-----------|
| 이미지 크기 초과 | "이미지는 2MB 이하여야 합니다" |
| 비밀번호 불일치 | "현재 비밀번호가 일치하지 않습니다" |
| 네트워크 오류 | "연결을 확인해주세요" + 재시도 버튼 |

---

### 7.8 Authentication — 인증 플로우

#### 목적
- 안전한 사용자 인증
- 세션 관리
- 보안 강화

#### 로그인 플로우

**1) 로그인 페이지**

```
Login Frame (Auto Layout, Vertical, Center Aligned)
├── Logo + App Name
├── Welcome Text (H2: "InsightStock에 오신 것을 환영합니다")
├── Login Form (Card)
│   ├── Email Input
│   │   └── Placeholder: "이메일을 입력하세요"
│   ├── Password Input
│   │   └── Placeholder: "비밀번호를 입력하세요"
│   │   └── Show/Hide Toggle (Eye Icon)
│   ├── [로그인] 버튼 (Primary, Full Width)
│   ├── Divider (OR)
│   ├── [Google로 로그인] 버튼 (Secondary, Phase 2)
│   ├── [카카오로 로그인] 버튼 (Secondary, Phase 2)
│   └── Links (Auto Layout, Horizontal)
│       ├── "비밀번호 찾기" (Ghost)
│       └── "회원가입" (Ghost)
└── Footer
    └── "이용약관" / "개인정보처리방침" (Caption)
```

**2) 로그인 프로세스**

```
사용자 입력 (이메일 + 비밀번호)
   ↓
클라이언트 검증 (이메일 형식, 비밀번호 빈 값 체크)
   ↓
API 요청: POST /api/auth/login
   ↓
서버 검증 (이메일 존재, 비밀번호 일치)
   ↓
JWT 토큰 발급
   ├── Access Token (1시간, Memory)
   └── Refresh Token (7일, HttpOnly Cookie)
   ↓
사용자 정보 저장 (Zustand Store)
   ↓
리다이렉트: /dashboard
```

**3) 토큰 관리**

**Access Token:**
- 저장: Memory (XSS 방지)
- 만료: 1시간
- 갱신: Refresh Token으로 자동 갱신 (만료 5분 전)
- 전송: Authorization Header (`Bearer {token}`)

**Refresh Token:**
- 저장: HttpOnly Cookie (XSS + CSRF 방지)
- 만료: 7일
- 갱신: 로그인 시마다 갱신 (Rotation)
- 전송: Cookie로 자동 전송

**자동 갱신 로직:**
```typescript
// Access Token 만료 5분 전 감지
if (tokenExpiresIn < 5 * 60 * 1000) {
  // Refresh Token으로 새 Access Token 발급
  const newToken = await refreshAccessToken();
  // Store 업데이트
}
```

#### 회원가입 플로우

**1) 회원가입 페이지**

```
Signup Frame (Auto Layout, Vertical)
├── Step Indicator (1/3)
├── Step 1: 기본 정보
│   ├── 이름 Input
│   ├── 이메일 Input
│   ├── 비밀번호 Input (Show/Hide)
│   │   └── 강도 표시기 (Weak/Medium/Strong)
│   ├── 비밀번호 확인 Input
│   └── [다음] 버튼 (Primary)
├── Step 2: 관심 종목 선택 (Optional)
│   ├── 검색 Input
│   ├── 종목 리스트 (체크박스, 최대 10개)
│   └── [다음] 버튼
└── Step 3: 완료
    ├── 환영 메시지 (H2)
    ├── 온보딩 가이드 (3단계)
    └── [시작하기] 버튼 (Primary)
```

**2) 회원가입 프로세스**

```
Step 1: 기본 정보 입력
   ↓
클라이언트 검증
   - 이메일 형식
   - 비밀번호: 최소 8자, 영문+숫자
   - 비밀번호 일치
   ↓
API 요청: POST /api/auth/signup
   ↓
서버 검증
   - 이메일 중복 체크
   - 비밀번호 해시 (bcrypt)
   ↓
사용자 생성 (DB)
   ↓
Step 2: 관심 종목 선택 (선택)
   ↓
Step 3: 완료
   ↓
자동 로그인 (JWT 발급)
   ↓
리다이렉트: /dashboard
```

**3) 비밀번호 강도 표시**

| 조건 | 강도 | 색상 |
|------|------|------|
| 8자 미만 | Weak | Red |
| 8자 이상, 영문+숫자 | Medium | Yellow |
| 8자 이상, 영문+숫자+특수문자 | Strong | Green |

#### 세션 관리

**1) 세션 만료 처리**

```
Access Token 만료 감지
   ↓
자동 갱신 시도 (Refresh Token)
   ↓
성공: 새 Access Token 발급
   ↓
실패: 로그아웃 처리
   ├── Store 초기화
   ├── Cookie 삭제
   └── 리다이렉트: /login?expired=true
```

**2) 로그아웃**

```
[로그아웃] 버튼 클릭
   ↓
API 요청: POST /api/auth/logout
   ├── Refresh Token 무효화 (DB)
   └── Cookie 삭제
   ↓
Store 초기화
   ↓
리다이렉트: /login
```

**3) 보안 고려사항**

- **XSS 방지**: Access Token은 Memory에만 저장
- **CSRF 방지**: Refresh Token은 HttpOnly Cookie
- **토큰 Rotation**: Refresh Token 사용 시 새 토큰 발급
- **Rate Limiting**: 로그인 시도 5회 실패 시 15분 잠금
- **비밀번호 정책**: 최소 8자, 영문+숫자 필수

#### 에러 처리

| 에러 상황 | HTTP Status | 사용자 메시지 |
|-----------|-------------|---------------|
| 이메일 없음 | 404 | "등록되지 않은 이메일입니다" |
| 비밀번호 불일치 | 401 | "비밀번호가 일치하지 않습니다" |
| 이메일 중복 | 409 | "이미 사용 중인 이메일입니다" |
| 토큰 만료 | 401 | "세션이 만료되었습니다. 다시 로그인해주세요" |
| Rate Limit 초과 | 429 | "너무 많은 시도입니다. 15분 후 다시 시도해주세요" |

#### 접근성

- 키보드 네비게이션: Tab으로 모든 입력 필드 이동
- 포커스 관리: 로그인 실패 시 이메일 Input에 포커스
- 스크린 리더: "로그인 폼", "이메일 입력 필드" 등 명확한 라벨
- 에러 메시지: `aria-live="polite"`로 실시간 안내

---

## 8. AI System Design

### 8.1 AI 역할 정의

InsightStock의 AI는 **초보 투자자를 위한 금융 튜터**입니다. 
- ❌ 투자 추천/예측을 하지 않음
- ✅ 정보를 이해하기 쉽게 설명
- ✅ 학습을 도와주는 역할

### 8.2 AI 데이터 소스

| 데이터 타입 | 출처 | 사용 목적 |
|-------------|------|-----------|
| **주가 데이터** | PostgreSQL | 가격 변동 분석, 차트 생성 |
| **뉴스** | PostgreSQL | 이슈 요약, 개념 추출 |
| **사용자 포트폴리오** | PostgreSQL | 맞춤형 리스크 분석 |
| **사용자 학습 기록** | PostgreSQL | 반복 질문 감지, 맞춤 추천 |
| **금융 개념 DB** | Pinecone (Vector DB) | RAG 기반 정확한 개념 설명 |

### 8.3 AI Summary 프롬프트 설계

#### Dashboard — 종목 요약

**System Prompt:**
```
You are a financial assistant for beginner investors in South Korea.
Your role is to explain stock movements in simple, clear Korean.

Rules:
- Use beginner-friendly language (초보자 눈높이)
- Avoid jargon unless you explain it in parentheses
- Be factual, never predict or recommend
- Keep responses concise (under 200 characters per section)
```

**User Prompt Template:**
```
Analyze this stock and provide a summary:

Stock: {종목명} ({종목코드})
Current Price: {현재가}원
Change: {등락률}% ({등락금액}원)
Volume: {거래량} shares ({평균_대비_변화}%)
Market Context: KOSPI {코스피_등락률}%

Recent News (최근 3건):
1. {뉴스_제목_1} ({발행시간_1})
2. {뉴스_제목_2} ({발행시간_2})
3. {뉴스_제목_3} ({발행시간_3})

Provide output in this exact JSON format:
{
  "oneline_summary": "한 문장 요약 (~했다 형태, 20자 이내)",
  "key_issues": [
    "이슈 1: [뉴스 기반, 15자]",
    "이슈 2: [거래량/기술적, 15자]"
  ],
  "price_analysis": "가격 해석 (초보자 눈높이, 30자)",
  "risk_summary": "리스크 요약 (주의할 점, 20자)",
  "learning_cta": "관련 개념 제안 (예: 'PER')"
}

Constraints:
- If technical terms used, add simple explanation in parentheses
- No definitive predictions
- Max 2 paragraphs total
```

**Expected Output:**
```json
{
  "oneline_summary": "실적 개선 기대감에 3% 상승",
  "key_issues": [
    "이슈 1: 4분기 실적 전망 상향 조정",
    "이슈 2: 거래량 평균 대비 150% 증가"
  ],
  "price_analysis": "외국인과 기관이 동시에 매수하며 상승 탄력을 받았습니다.",
  "risk_summary": "단기 급등 후 조정 가능성에 주의하세요.",
  "learning_cta": "실적 발표가 주가에 미치는 영향"
}
```

---

#### News — 뉴스 분석

**System Prompt:**
```
You are a financial news analyst for beginner investors.
Summarize news articles in a clear, structured way.

Rules:
- Extract key points only
- Explain impact on related stocks
- Identify financial concepts that beginners should learn
- Be neutral, avoid sensationalism
```

**User Prompt Template:**
```
Summarize this news article:

Title: {뉴스_제목}
Content: {뉴스_본문}
Related Stock: {관련_종목} (if any)
Published: {발행시간}

Provide output in JSON:
{
  "five_line_summary": "5줄 요약 (각 줄 15~20자)",
  "key_issues": [
    "핵심 이슈 1",
    "핵심 이슈 2",
    "핵심 이슈 3"
  ],
  "related_concepts": [
    {"concept": "개념1", "reason": "왜 중요한지"},
    {"concept": "개념2", "reason": "왜 중요한지"}
  ],
  "stock_impact": {
    "stock": "종목명",
    "direction": "positive/negative/neutral",
    "reason": "영향 근거 (20자)"
  }
}
```

---

#### Education — Q&A

**System Prompt:**
```
You are a patient financial tutor for beginners.
Explain concepts clearly with examples, avoiding overwhelming detail.

Rules:
- Start with a one-sentence definition
- Use real stock examples (Korean market)
- Include a simple chart/visual description if possible
- Warn about common mistakes
- Connect to user's portfolio if relevant
- Encourage saving as a note
```

**User Prompt Template:**
```
User Question: {사용자_질문}

User Context:
- Portfolio: {보유_종목_리스트} (if available)
- Past Questions: {최근_질문_3개} (if available)

Provide a structured answer in JSON:
{
  "concept_definition": "개념 한 문장 정의",
  "why_important": "왜 중요한가? (50자)",
  "example_stocks": [
    {
      "stock": "삼성전자",
      "value": "PER 15배",
      "note": "업종 평균보다 낮음"
    }
  ],
  "chart_suggestion": "차트 설명 (예: PER vs 주가 상관관계)",
  "common_mistakes": "실수하기 쉬운 포인트 (30자)",
  "portfolio_connection": "사용자 포트폴리오와 연결 (있으면)",
  "related_concepts": ["관련 개념1", "관련 개념2"]
}
```

---

#### Portfolio — 리스크 분석

**System Prompt:**
```
You are a portfolio risk analyst for beginner investors.
Identify risks clearly but avoid causing panic.

Rules:
- Focus on diversification issues
- Use percentages and clear thresholds
- Provide actionable suggestions
- Be constructive, not alarmist
```

**User Prompt Template:**
```
Analyze this portfolio for risks:

Total Value: {총_평가금액}원
Total Return: {총_수익률}%

Holdings:
{
  종목별 [ 종목명, 비중%, 업종, 수익률% ]
}

Sector Allocation:
{업종별 비중}

Provide risk analysis in JSON:
{
  "risks": [
    {
      "type": "sector_concentration / stock_concentration / high_volatility",
      "severity": "warning / error",
      "description": "리스크 설명 (30자)",
      "threshold": "기준치 (예: 40%)",
      "current": "현재 값"
    }
  ],
  "strengths": [
    "강점 (예: 배당주 비중 적절)"
  ],
  "suggestions": [
    "개선 제안 1",
    "개선 제안 2"
  ]
}
```

---

### 8.4 AI 응답 캐싱 전략

| 응답 타입 | 캐싱 기간 | 이유 |
|----------|----------|------|
| Dashboard 종목 요약 | 24시간 | 동일 종목 반복 조회 많음 |
| 뉴스 분석 | 7일 | 뉴스는 변하지 않음 |
| Education Q&A | 30일 | 개념 설명은 변하지 않음 |
| Portfolio 리스크 | 캐싱 안 함 | 실시간 계산 필요 |

**구현:**
- Redis에 Key: `ai:summary:{종목코드}:{날짜}` 형태로 저장
- TTL 설정으로 자동 만료

---

### 8.5 AI 비용 최적화

| 모델 | 용도 | 월 예상 비용 |
|------|------|-------------|
| GPT-4o-mini | Dashboard 요약 | $15 (1,000 유저 기준) |
| GPT-4o-mini | 뉴스 분석 | $10 |
| GPT-4o-mini | Education Q&A | $20 |
| text-embedding-3-small | RAG 임베딩 | $5 |
| **Total** | | **$50** |

**절감 전략:**
1. 캐싱 적극 활용 (중복 요청 80% 감소)
2. 배치 처리: 뉴스 분석을 실시간이 아닌 30분 간격 배치
3. 프롬프트 최적화: 토큰 수 최소화 (150 → 100 토큰)

---

### 8.6 AI 윤리 가이드라인

#### 절대 금지 사항
1. **투자 추천**: "삼성전자를 사세요" ❌
2. **가격 예측**: "내일 10% 오를 것입니다" ❌
3. **확정적 표현**: "이 종목은 안전합니다" ❌

#### 권장 표현
1. **정보 제공**: "실적이 개선되었습니다" ✅
2. **리스크 고지**: "변동성이 큰 종목입니다" ✅
3. **학습 유도**: "PER이 무엇인지 알아보세요" ✅

#### 면책 문구
모든 AI 응답 하단에 표시:
> "이 정보는 참고용이며 투자 권유가 아닙니다. 투자 판단의 책임은 본인에게 있습니다."

---

### 8.7 AI 프롬프트 검증 및 최적화

#### 프롬프트 테스트 결과

**Dashboard 종목 요약:**
- 평균 토큰 수: Input 150 tokens, Output 80 tokens
- 응답 시간: P50 1.8초, P95 2.5초, P99 3.2초
- 성공률: 98.5% (재시도 포함)
- 비용: $0.0015 per request (GPT-4o-mini 기준)

**뉴스 분석:**
- 평균 토큰 수: Input 800 tokens (뉴스 본문 포함), Output 120 tokens
- 응답 시간: P50 2.1초, P95 3.0초
- 성공률: 99.2%
- 비용: $0.0046 per request

**Education Q&A:**
- 평균 토큰 수: Input 200 tokens, Output 300 tokens
- 응답 시간: P50 2.5초, P95 3.5초
- 성공률: 97.8%
- 비용: $0.0025 per request

#### Rate Limiting 전략

**사용자별 제한:**
- Free Tier: 일 5회 AI 질문
- Pro Tier: 무제한 (하지만 Abuse 방지)
- Rate Limit: 10 requests/min per user

**시스템 레벨 제한:**
- OpenAI API: 3,500 RPM (Requests Per Minute)
- Queue 시스템: BullMQ로 요청 관리
- 우선순위: Dashboard 요약 > News 분석 > Education Q&A

**구현:**
```typescript
// Rate Limiting with Redis
const rateLimiter = new RateLimiter({
  keyGenerator: (req) => `ai:${req.userId}`,
  points: 10, // 10 requests
  duration: 60, // per minute
});

// Queue with Priority
const aiQueue = new Queue('ai-requests', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    priority: {
      'dashboard-summary': 10,
      'news-analysis': 5,
      'education-qa': 1,
    },
  },
});
```

#### 프롬프트 최적화 전략

**1) 토큰 수 최소화**
- 불필요한 설명 제거
- 예시 최소화 (1개만)
- JSON 구조 간소화

**2) 캐싱 전략**
- 동일 질문 24시간 캐싱
- 종목 요약 24시간 캐싱 (같은 날)
- 개념 설명 30일 캐싱

**3) 배치 처리**
- 뉴스 분석: 실시간 X, 30분 간격 배치
- 학습 개념 추천: 일 1회 배치 (새벽 2시)

**4) Fallback 전략**
- GPT-4o-mini 실패 시: 재시도 2회
- 3회 실패 시: 간단한 템플릿 응답 제공
- 예: "요약을 생성할 수 없습니다. 원문을 확인해주세요."

#### 모니터링 지표

**성능 지표:**
- 평균 응답 시간 (P50, P95, P99)
- 에러율 (5xx, Timeout)
- 토큰 사용량 (Input/Output)

**비즈니스 지표:**
- 일일 AI 요청 수
- 사용자당 평균 요청 수
- 캐시 히트율 (목표: 80%)

**비용 지표:**
- 일일 OpenAI 비용
- 요청당 평균 비용
- 월 예상 비용 vs 실제 비용

**알람 설정:**
- 응답 시간 P95 > 5초
- 에러율 > 2%
- 일일 비용 > $10 (MVP 기준)
- 캐시 히트율 < 70%

---

## 9. Design System

> **📌 상세 가이드**: 전체 Design System 스펙은 `DESIGN-GUIDE.md`를 참조하세요.  
> 이 섹션은 개발 시 빠른 참조를 위한 요약입니다.

### 9.1 Brand Identity

**Brand Keywords:**
- 신뢰 (Trust): 금융 서비스의 안정감
- 성장 (Growth): 학습을 통한 발전
- 배움 (Learning): 친근하고 접근하기 쉬운

**Tone of Voice:**
- 친근하지만 전문적
- 쉽게 설명하되 수준 낮추지 않음
- 긍정적이지만 과장하지 않음

---

### 9.2 Color System

**⚠️ 명명 규칙:**
- **Figma Variables**: 슬래시(`/`) 사용 → `primary/600`, `gray/900` (DESIGN-GUIDE.md 참조)
- **CSS Variables**: 하이픈(`-`) 사용 → `--primary-600`, `--gray-900`
- **코드에서 사용**: 하이픈 형식 (아래 표 참조)

#### Primary Colors
| Token (Figma) | Token (CSS) | Hex | 용도 | 접근성 |
|--------------|-------------|-----|------|--------|
| `primary/600` | `primary-600` | `#16A362` | 브랜드 핵심, CTA, 강조 | AA (4.5:1 on White) |
| `primary/500` | `primary-500` | `#1DBF6A` | Hover/Active | |
| `primary/400` | `primary-400` | `#34D883` | 수치 강조, 작은 액센트 | |
| `primary/100` | `primary-100` | `#E6F8EE` | 박스 배경, 페일한 강조 | |

#### Semantic Colors
| 의미 | Token (Figma) | Token (CSS) | Hex | 용도 |
|------|---------------|-------------|-----|------|
| **상승** | `semantic/red` | `semantic-red` | `#EF4444` | 가격 상승, 수익 |
| **하락** | `semantic/blue` | `semantic-blue` | `#1D4ED8` | 가격 하락, 손실 |
| **경고** | `semantic/yellow` | `semantic-yellow` | `#F59E0B` | 리스크, 주의 필요 |
| **성공** | `semantic/green` | `semantic-green` | `#10B981` | 완료, 성공 |

**중요:** 색상만으로 정보 전달 금지 → 아이콘 병행 (▲▼)

#### Neutral Colors
| Token (Figma) | Token (CSS) | Hex | 용도 |
|---------------|-------------|-----|------|
| `gray/900` | `gray-900` | `#111827` | 제목, 강조 텍스트 |
| `gray/700` | `gray-700` | `#374151` | 본문 텍스트 |
| `gray/600` | `gray-600` | `#4B5563` | 보조 텍스트 |
| `gray/400` | `gray-400` | `#9CA3AF` | Placeholder |
| `gray/300` | `gray-300` | `#D1D5DB` | Border (subtle) |
| `gray/200` | `gray-200` | `#E5E7EB` | Border |
| `gray/100` | `gray-100` | `#F3F4F6` | Hover 배경 |
| `gray/50` | `gray-50` | `#F9FAFB` | 페이지 배경 |
| `white` | `white` | `#FFFFFF` | 카드 배경 |

---

### 9.3 Typography

#### Font Families
```css
--font-korean: 'Pretendard', -apple-system, sans-serif;
--font-english: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* 코드용 */
```

**Font Feature Settings:**
```css
/* 모든 숫자에 적용 */
font-variant-numeric: tabular-nums;
/* 금융 데이터 정렬에 필수 */
```

#### Type Scale
| Token | Size | Line Height | Weight | 용도 |
|-------|------|-------------|--------|------|
| `h1` | 24px | 32px | 700 | 페이지 제목 |
| `h2` | 20px | 28px | 700 | 섹션 제목 |
| `h3` | 18px | 26px | 600 | 카드 제목 |
| `body1` | 16px | 24px | 400 | 본문 |
| `body2` | 14px | 20px | 400 | 보조 본문 |
| `caption` | 12px | 16px | 400 | 작은 라벨 |

#### Number Formatting
```typescript
// 가격: 천 단위 콤마
formatPrice(190000) → "190,000원"

// 등락률: 소수점 2자리 + 부호
formatChange(0.0325) → "+3.25%"

// 거래량: 억 단위
formatVolume(125000000) → "1.25억"
```

---

### 9.4 Spacing System

**8px 기준 배수 시스템:**
| Token | Value | 용도 |
|-------|-------|------|
| `xs` | 4px | 아이콘-텍스트 간격 |
| `sm` | 8px | 작은 여백 |
| `md` | 16px | 기본 여백 |
| `lg` | 24px | 섹션 간격 |
| `xl` | 32px | 큰 섹션 간격 |
| `2xl` | 48px | 페이지 상단 여백 |

---

### 9.5 Layout Grid

#### Desktop (1440px 기준)
```
Columns: 12
Margin: 80px (좌우)
Gutter: 24px
```

#### Tablet (768px)
```
Columns: 8
Margin: 40px
Gutter: 16px
```

#### Mobile (375px)
```
Columns: 4
Margin: 20px
Gutter: 12px
```

---

### 9.6 Component Tokens

#### Card
```
Padding: 20px ~ 24px
Border Radius: 12px
Shadow (default): 0 1px 3px rgba(0,0,0,0.1)
Shadow (hover): 0 4px 12px rgba(0,0,0,0.15)
Background: white
```

#### Button
| Variant | Background | Text | Height | Padding |
|---------|-----------|------|--------|---------|
| Primary | primary-600 | white | 40px | 16px 24px |
| Secondary | gray-100 | gray-900 | 40px | 16px 24px |
| Ghost | transparent | primary-600 | 40px | 16px 24px |

#### Input
```
Height: 40px
Padding: 0 12px
Border: 1px gray-300
Border (focus): 2px primary-600
Border Radius: 8px
```

#### Table
```
Row Height: 48px
Header Background: gray-50
Border: 1px gray-200
Hover: gray-100
```

---

### 9.7 Icon System

**Library:** Lucide Icons (Outline)
**Stroke Width:** 1.75px
**Default Color:** `gray-600` (CSS: `--gray-600`)
**Hover Color:** `primary-600` (CSS: `--primary-600`)

**주요 아이콘:**
- Dashboard: `BarChart3`
- News: `Newspaper`
- Education: `GraduationCap`
- Explore: `Compass`
- Portfolio: `Briefcase`
- AI: `Sparkles`
- Search: `Search`
- Star (Favorite): `Star` / `StarOff`
- Trend Up: `TrendingUp`
- Trend Down: `TrendingDown`

**📌 상세 스펙**: 컴포넌트별 아이콘 사용법, 크기, 간격은 `DESIGN-GUIDE.md` Section 4 참조

---

### 9.8 Design System 요약

**핵심 토큰:**
- **Primary Color**: `#16A362` (Green)
- **Semantic Colors**: Red (상승), Blue (하락), Yellow (경고), Green (성공)
- **Typography**: Pretendard (한글), Inter (영문/숫자)
- **Spacing**: 4/8/16/24/32/48px (8px 기준 배수)
- **Border Radius**: 4px (Badge), 8px (Button/Input), 12px (Card)

**주요 컴포넌트:**
- Button: Primary/Secondary/Ghost, 40px 높이
- Input: 40px 높이, Focus Ring (primary-600)
- Card: 20px 패딩, Shadow (default/hover)
- Modal: 600px 너비, Fade + Scale 애니메이션
- Toast: 상단 중앙, 4초 Auto-dismiss

**반응형:**
- Desktop: ≥ 1440px (12 columns)
- Tablet: 768px ~ 1439px (8 columns)
- Mobile: < 768px (4 columns)

**📌 전체 스펙**: `DESIGN-GUIDE.md` 참조

---

## 10. Interaction Patterns

### 10.1 Hover States

| 요소 | 기본 | Hover |
|------|------|-------|
| **Card** | Shadow 0 1px 3px | Shadow 0 4px 12px + Scale 1.02 |
| **Button (Primary)** | primary-600 | primary-700 + Scale 0.98 |
| **Link** | primary-600 | Underline + primary-700 |
| **Table Row** | White | gray-100 |
| **Icon** | gray-600 | primary-600 |

**Transition:** 모든 Hover 효과는 `transition: all 0.2s ease`

---

### 10.2 Focus States

**키보드 접근성을 위한 Focus Indicator:**
```css
:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**적용 요소:**
- Button
- Link
- Input
- Table Row
- Card (클릭 가능한 경우)

---

### 10.3 Loading States

#### Skeleton
- 사용 시점: 데이터 로딩 중 (< 1초 예상)
- 애니메이션: Shimmer (좌→우 그라데이션 이동)
- 색상: gray-200 → gray-300

#### Spinner
- 사용 시점: AI 응답 생성 (1~3초 예상)
- 위치: 중앙 정렬
- 색상: primary-600
- 텍스트: "AI가 분석 중입니다..." (Optional)

#### Progress Bar
- 사용 시점: 파일 업로드, 배치 작업 (진행률 표시 가능)
- 높이: 4px
- 색상: primary-600
- 애니메이션: Indeterminate (진행률 모를 때) / Determinate (% 표시)

---

### 10.4 Animation Guidelines

| 용도 | Duration | Easing | 예시 |
|------|----------|--------|------|
| **Hover** | 0.2s | ease | Button, Card |
| **Modal Open** | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) | Fade + Scale |
| **Drawer** | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) | Slide from side |
| **Tooltip** | 0.15s | ease | Fade in |
| **Toast** | 0.25s | ease-out | Slide up |

**원칙:**
- Micro-interactions: < 0.3초
- Page Transitions: 0.3 ~ 0.5초
- 과도한 애니메이션 지양 (사용자 피로 ↑)

---

### 10.5 Empty States

모든 Empty State는 다음 구조를 따름:
```
┌────────────────────────────┐
│   [Icon - 64px, gray-400]  │
│                            │
│   제목 (H3, gray-900)       │
│   설명 (Body2, gray-600)    │
│                            │
│   [CTA Button]             │
└────────────────────────────┘
```

**예시:**
- **Favorites 없음**: "아직 찜한 종목이 없어요" + "종목 찾아보기" 버튼
- **노트 없음**: "첫 노트를 작성해보세요" + "AI에게 질문하기" 버튼
- **검색 결과 없음**: "'{검색어}'에 대한 결과가 없어요" + "다른 키워드로 검색" CTA

---

### 10.6 Error States

#### Toast (일시적 에러)
- 위치: 화면 상단 중앙
- 자동 사라짐: 4초
- 색상: Red-100 배경, Red-800 텍스트
- 아이콘: AlertCircle
- 예: "데이터를 불러오지 못했습니다"

#### Alert Banner (지속적 경고)
- 위치: 페이지 상단
- 수동 닫기: X 버튼
- 색상: Yellow-100 배경
- 예: "일부 기능이 일시적으로 제한됩니다"

#### Error Page (치명적 에러)
- 전체 화면
- 500 에러: "서버 오류가 발생했습니다"
- 404 에러: "페이지를 찾을 수 없습니다"
- CTA: "홈으로 돌아가기"

---

### 10.7 Success Feedback

#### Toast (작업 완료)
- 색상: Green-100 배경, Green-800 텍스트
- 아이콘: CheckCircle
- 예: "노트에 저장되었습니다"

#### Confetti (특별한 성취)
- 사용 시점: 첫 질문 완료, 10번째 노트 저장 등
- 라이브러리: canvas-confetti
- Duration: 1.5초

---

## 11. Accessibility Standards

### 11.1 WCAG 2.1 AA 준수 목표

#### 색상 대비
- **텍스트 (Normal)**: 최소 4.5:1
- **텍스트 (Large, ≥18px)**: 최소 3:1
- **UI 요소 (Button, Icon)**: 최소 3:1

**검증 도구:** 
- Figma Plugin: Stark
- 개발 단계: axe DevTools

#### 비색상 정보 전달
- ❌ 색상만으로 상승/하락 표시
- ✅ 색상 + 아이콘 (▲▼) + 텍스트 ("상승", "하락")

---

### 11.2 키보드 내비게이션

#### Tab Order
- 논리적 순서: 좌→우, 위→아래
- Skip Link 제공: "본문으로 바로가기" (첫 Tab에서 포커스)

#### Keyboard Shortcuts
| 키 | 동작 |
|----|------|
| `/` | 검색 포커스 |
| `ESC` | 모달/패널 닫기 |
| `?` | 단축키 도움말 |
| `1~9` | Navigation (Dashboard=1, News=2, ...) |

---

### 11.3 스크린 리더 지원

#### Alt Text
- 차트: "애플 주가 3개월 캔들스틱 차트, 현재가 190,000원, 전일 대비 3% 상승"
- 아이콘 버튼: `aria-label="AI 요약 열기"`
- 로고: `alt="InsightStock 홈으로 이동"`

#### ARIA Attributes
```html
<!-- Loading -->
<div role="status" aria-live="polite" aria-label="데이터 로딩 중">
  <Spinner />
</div>

<!-- Modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">뉴스 상세</h2>
  ...
</div>

<!-- Table -->
<table role="table" aria-label="보유 종목 목록">
  <thead>
    <tr role="row">
      <th role="columnheader">종목명</th>
      ...
    </tr>
  </thead>
</table>
```

---

### 11.4 반응형 접근성

#### 모바일
- 터치 타겟: 최소 44x44px (iOS/Android 가이드라인)
- Zoom 지원: viewport meta 태그에서 `user-scalable=no` 금지

#### 다크모드 (Phase 2)
- 시스템 설정 따름: `prefers-color-scheme`
- 대비비 유지: 모든 색상 재조정

---

## 12. Edge Cases & Error Handling

### 12.1 데이터 부재 시

| 상황 | 표시 내용 | 복구 방법 |
|------|-----------|-----------|
| **뉴스 없음** | "최근 관련 뉴스가 없습니다" + 과거 주요 뉴스 3건 | - |
| **차트 데이터 없음** | "시세 정보를 불러올 수 없습니다" + 새로고침 버튼 | 사용자 액션 |
| **AI 응답 실패** | "요약 생성 중 오류 발생" + 원본 뉴스로 대체 | 재시도 버튼 (3회 제한) |
| **검색 결과 없음** | "'{키워드}'에 대한 결과가 없어요" + 추천 키워드 | - |
| **포트폴리오 비어있음** | Empty State + "첫 종목 추가하기" CTA | 사용자 액션 |

---

### 12.2 사용자 입력 오류

| 상황 | 처리 방법 |
|------|-----------|
| **이해 불가능한 질문** | "질문을 이해하지 못했어요. 예: PER이 뭔가요?" |
| **답변 불가 질문** (투자 추천) | "투자 추천은 제공하지 않아요. 대신 '{개념}'에 대해 알아보세요" + Education 연결 |
| **너무 긴 질문** (>500자) | "질문을 간단히 줄여주세요 (최대 500자)" |
| **중복 질문** (최근 24시간 내 동일 질문) | "이미 답변한 질문이에요" + 기존 답변 링크 |

---

### 12.3 성능 저하 시

| 상황 | 임계값 | 처리 |
|------|--------|------|
| **API 타임아웃** | 5초 | "조금만 기다려주세요..." Spinner → 10초 초과 시 에러 Toast |
| **대량 데이터 렌더링** | 50개 이상 | 가상 스크롤링 (React Virtual) |
| **이미지 로딩 느림** | 3초 | Skeleton → Progressive JPEG / WebP |
| **AI 응답 지연** | 5초 | "AI가 열심히 분석 중이에요..." + Progress Bar |

---

### 12.4 네트워크 오류

#### Offline 감지
```
- Online: 정상 작동
- Offline: 전체 화면 오버레이
  - "인터넷 연결이 끊어졌습니다"
  - "연결을 확인해주세요"
  - 자동 재연결 시도 (10초 간격)
```

#### 연결 불안정 (Timeout 반복)
```
- Toast: "연결이 불안정합니다"
- 자동 재시도: 3회
- 3회 실패 시: "나중에 다시 시도해주세요" + 고객센터 링크
```

---

### 12.5 보안 관련

| 상황 | 처리 |
|------|------|
| **세션 만료** | 자동 로그아웃 + "다시 로그인해주세요" 모달 |
| **권한 없음** | "접근 권한이 없습니다" + 홈으로 리다이렉트 |
| **비정상 요청** (Rate Limit 초과) | "요청이 너무 많습니다. 잠시 후 다시 시도하세요" (429 Error) |
| **XSS 시도** | 입력값 Sanitize (DOMPurify) + 에러 로그 |

---

## 13. MVP Scope & Phasing

### 13.1 MVP (Phase 1) — 4주 개발

#### ✅ 포함 (Must Have)
| 기능 | 우선순위 | 구현 범위 |
|------|----------|-----------|
| **Dashboard** | P0 | 종목 리스트 + 차트 + 뉴스 + AI 요약 (패널) |
| **News & Feed** | P0 | 뉴스 리스트 + 상세 + AI 분석 |
| **Education Q&A** | P0 | 질문 입력 + AI 답변 + 노트 저장 (단순 CRUD) |
| **Learning Dashboard** | P1 | 오늘의 학습 + 최근 질문 기록만 (추천 제외) |
| **Portfolio** | P1 | 수동 입력 + 기본 차트 (업종 비중, 종목별 수익률) |
| **AI Summary** | P0 | Dashboard/News에서만 제공 (Portfolio는 P2) |
| **Authentication** | P0 | 이메일 로그인 (소셜 로그인 P2) |

#### ❌ 제외 (Phase 2 이후)
- Explore (전략 탐색, 스크리너)
- Favorites / History / Hot Issue
- 노트 편집 기능 (MVP는 저장만)
- AI 맞춤 추천 (뉴스/포트폴리오 기반)
- 학습 대시보드 자동 업데이트 (수동 새로고침)
- 포트폴리오 리스크 상세 분석
- Real-time 주가 업데이트 (MVP는 10초 폴링)
- 차트 고급 지표 (RSI, MACD 등)
- 소셜 기능 (노트 공유)

---

### 13.2 Phase 2 (MVP + 8주)

#### 추가 기능
- ✅ Explore 페이지 (전략 탐색 + 간단 스크리너)
- ✅ Favorites / History
- ✅ Learning Dashboard 자동 추천
- ✅ Portfolio AI 리스크 분석
- ✅ 노트 편집 (Markdown 에디터)
- ✅ WebSocket 실시간 주가
- ✅ 소셜 로그인 (Google, Kakao)

---

### 13.3 Phase 3 (확장)

- ✅ 모바일 앱 (React Native)
- ✅ 소셜 기능 (노트 공유, 댓글)
- ✅ 커뮤니티 (토론 게시판)
- ✅ Pro Tier 기능 (고급 차트, 무제한 AI)
- ✅ API 제공 (개발자용)

---

### 13.4 Feature Priority Matrix

```
┌───────────────────────────────────────┐
│  긴급 & 중요 (P0) → 즉시 구현         │
│  • Dashboard                          │
│  • AI Summary (Dashboard/News)        │
│  • Education Q&A                      │
├───────────────────────────────────────┤
│  중요하지만 덜 긴급 (P1) → MVP 포함   │
│  • Portfolio 기본                     │
│  • Learning Dashboard (단순 버전)     │
├───────────────────────────────────────┤
│  긴급하지만 덜 중요 (P2) → Phase 2    │
│  • Favorites / History                │
│  • Real-time Updates                  │
├───────────────────────────────────────┤
│  덜 긴급 & 덜 중요 (P3) → Phase 3     │
│  • 소셜 기능                          │
│  • 커뮤니티                           │
└───────────────────────────────────────┘
```

---

## 14. Success Metrics

### 14.1 Launch Goals (MVP +3개월)

#### Primary Metric (North Star)
**주간 활성 사용자당 AI 질문 횟수 ≥ 3회**
- 측정: Weekly Active User별 AI API 호출 횟수
- 목표: 평균 3회/주 (중앙값 기준)
- 의미: 사용자가 적극적으로 학습에 참여하고 있음

#### User Acquisition
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| DAU | 1,000명 | Google Analytics |
| MAU | 5,000명 | Google Analytics |
| 신규 가입 | 200명/주 | DB 집계 |
| 소셜 공유 | 50회/주 | Share Button 클릭 |

#### Engagement
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| DAU/MAU Ratio | ≥ 30% | GA4 |
| Avg Session Duration | ≥ 5분 | GA4 |
| Education 방문율 | ≥ 60% | Funnel Analysis |
| 노트 저장율 | ≥ 40% | AI 응답 기준 |
| Bounce Rate | ≤ 40% | GA4 |

#### Learning Effectiveness
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| 동일 개념 재질문율 | ≤ 15% | 질문 로그 분석 |
| 노트 재방문율 | ≥ 30% | 사용자별 노트 조회 횟수 |
| 학습 후 포트폴리오 조정율 | ≥ 25% | Before/After 비교 |

#### Technical Performance
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| API 응답시간 (P95) | < 500ms | Datadog APM |
| AI 응답 생성 (P95) | < 3초 | OpenAI API 로그 |
| 에러율 | < 1% | Sentry |
| Uptime | ≥ 99.5% | Pingdom |

---

### 14.2 장기 목표 (Launch +1년)

| 지표 | 목표 |
|------|------|
| MAU | 50,000명 |
| Paid Conversion | 5% (2,500명) |
| MRR (Monthly Recurring Revenue) | $25,000 |
| NPS (Net Promoter Score) | ≥ 40 |
| Retention Rate (M3) | ≥ 40% |

---

### 14.3 측정 도구

| 도구 | 용도 |
|------|------|
| **Google Analytics 4** | 트래픽, 사용자 행동, Funnel |
| **Mixpanel** | 이벤트 트래킹, Cohort 분석 |
| **Sentry** | 에러 모니터링 |
| **Datadog** | API 성능, 인프라 모니터링 |
| **Hotjar** | 히트맵, 세션 리플레이 |
| **Amplitude** (Phase 2) | 고급 Product Analytics |

---

## 15. Development Roadmap

### 15.1 Week 1: Foundation

**Backend (Java + TypeScript)**
- [x] Monorepo 설정 (Turborepo)
- [x] PostgreSQL + Redis Docker 환경
- [x] Prisma Schema 작성 (stocks, news, users, portfolios, learnings, notes)
- [x] Java Spring Boot 프로젝트 생성
- [x] 한국투자증권 API 연동 테스트
- [x] 주가 수집 배치 Job 1차 구현 (1종목 테스트)

**Frontend**
- [x] Next.js 프로젝트 생성 (App Router)
- [x] Design System Tokens 설정 (Tailwind config)
- [x] shadcn/ui 설치 + 커스터마이징
- [x] 기본 레이아웃 (Sidebar, Header)

---

### 15.2 Week 2: Dashboard + AI

**Backend**
- [x] TypeScript API: Stock List 엔드포인트
- [x] TypeScript API: Stock Detail (차트 데이터)
- [x] OpenAI API 연동 테스트
- [x] AI Summary 프롬프트 설계 + 테스트
- [x] Redis 캐싱 구현 (Stock data, AI responses)
- [x] Java: 주가 수집 자동화 (Scheduler, 코스피 200 종목)

**Frontend**
- [x] Dashboard Stock List UI
- [x] Lightweight Charts 연동
- [x] AI Summary Panel UI + 토글
- [x] 로딩 상태 (Skeleton, Spinner)

---

### 15.3 Week 3: News + Education

**Backend**
- [x] Java: 뉴스 크롤링 Job (멀티스레드, 3개 소스)
- [x] TypeScript API: News List + Detail
- [x] TypeScript API: AI News Analysis
- [x] TypeScript API: Education Q&A
- [x] Pinecone 연동 (RAG 기본 구현)
- [x] 노트 CRUD API

**Frontend**
- [x] News 리스트 페이지 (Grid)
- [x] News 상세 모달 + AI 분석
- [x] Education Q&A UI
- [x] 노트 저장 기능
- [x] Learning Dashboard (오늘의 학습만)

---

### 15.4 Week 4: Portfolio + Launch Prep

**Backend**
- [x] Portfolio CRUD API
- [x] Portfolio 차트 데이터 API (업종 비중, 종목별 수익률)
- [x] Java → TypeScript Queue 연동 (BullMQ)
- [x] 전체 API 통합 테스트
- [x] 성능 최적화 (인덱스, N+1 쿼리 제거)

**Frontend**
- [x] Portfolio 입력 UI
- [x] Portfolio 차트 (Donut, Bar)
- [x] 전체 페이지 반응형 테스트
- [x] 접근성 검증 (axe DevTools)
- [x] E2E 테스트 (Playwright, 주요 플로우)

**DevOps**
- [x] Vercel 배포 (Frontend)
- [x] Railway 배포 (TypeScript API, Java Pipeline)
- [x] Supabase 세팅 (Production DB)
- [x] Sentry 에러 모니터링
- [x] Google Analytics 설정

**Launch**
- [x] 베타 테스터 모집 (50명)
- [x] 피드백 수집 → 긴급 버그 수정
- [x] 공식 런칭 🚀

---

### 15.5 Post-Launch (Week 5~12: Phase 2)

**Week 5-6: 사용자 피드백 반영**
- [ ] 긴급 버그 수정
- [ ] UX 개선 (분석 기반)
- [ ] 성능 최적화 (병목 지점)

**Week 7-9: Explore 구현**
- [ ] 전략 카드 UI
- [ ] 간단 스크리너 API + UI
- [ ] AI 전략 설명

**Week 10-12: 학습 강화**
- [ ] Learning Dashboard 자동 추천
- [ ] 노트 편집 기능 (Markdown)
- [ ] Portfolio AI 리스크 분석

---

## 16. Risk Assessment

### 16.1 기술 리스크

| 리스크 | 영향도 | 확률 | 완화 전략 |
|--------|--------|------|-----------|
| **AI API 비용 초과** | High | Medium | 캐싱 적극 활용, 사용량 모니터링 알람 |
| **주가 API 장애** | High | Low | Fallback 데이터 소스 준비, 캐싱 |
| **성능 저하** (대량 사용자) | Medium | Medium | 로드 테스트 (K6), Auto Scaling 설정 |
| **크롤링 차단** | Medium | Medium | User-Agent 로테이션, Rate Limiting |
| **데이터 정합성 오류** | Medium | Low | 배치 Job 검증 로직, 알림 설정 |

---

### 16.2 비즈니스 리스크

| 리스크 | 영향도 | 확률 | 완화 전략 |
|--------|--------|------|-----------|
| **사용자 확보 실패** | High | Medium | 초기 마케팅 집중, 레퍼럴 프로그램 |
| **학습 기능 사용률 낮음** | High | Medium | Onboarding 개선, AI 추천 강화 |
| **경쟁사 유사 기능 출시** | Medium | High | 차별화 강화 (AI 품질, UX) |
| **규제 변경** (금융 서비스) | Medium | Low | 법률 자문, 면책 문구 명확화 |

---

### 16.3 운영 리스크

| 리스크 | 영향도 | 확률 | 완화 전략 |
|--------|--------|------|-----------|
| **AI 잘못된 정보 제공** | High | Low | 프롬프트 검증, 사용자 신고 기능 |
| **개인정보 유출** | High | Low | 암호화, 정기 보안 감사 |
| **서버 다운** | Medium | Low | Health Check, 자동 재시작, Backup |

---

## 17. Appendix

### 17.1 Glossary (용어집)

| 용어 | 설명 |
|------|------|
| **RAG** | Retrieval-Augmented Generation, AI가 외부 지식(Vector DB)을 참조하여 답변 생성 |
| **Embedding** | 텍스트를 벡터로 변환하여 유사도 검색 가능하게 만드는 기술 |
| **WebSocket** | 실시간 양방향 통신 프로토콜 (주가 실시간 업데이트용) |
| **Batch Job** | 대량 데이터를 주기적으로 처리하는 작업 (예: 주가 수집) |
| **Monorepo** | 여러 프로젝트를 하나의 레포지토리로 관리 (Turborepo) |

---

### 17.2 References

**Design Inspiration:**
- [Toss 증권](https://tossinvest.com) — 금융 UI 벤치마크
- [Linear](https://linear.app) — 미니멀 UI, 인터랙션
- [Notion](https://notion.so) — 노트 시스템, 카드 레이아웃

**Technical Docs:**
- [Next.js 14](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

**Accessibility:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)

---

### 17.3 Change Log

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| **1.0** | 2024.11.01 | 초안 작성 |
| **2.0** | 2024.11.05 | IA 재구성, AI 프롬프트 추가 |
| **3.0** | 2024.11.10 | 페이지별 상세 기능 명세 |
| **4.0** | 2024.11.15 | 전체 플로우차트, Figma 가이드 추가 |
| **5.0** | 2024.11.20 | 비즈니스 목표, 기술 스택(하이브리드), AI 프롬프트 상세화, Edge Case, 접근성, MVP Scope 명확화 — **Final Spec** |

---

## 🎯 Next Steps

이 문서를 기반으로 다음 작업을 진행할 수 있습니다:

1. **Figma Design System** — 토큰을 Figma Variables로 변환, 컴포넌트 라이브러리 구축
2. **High-Fidelity Mockup** — 주요 페이지 실제 디자인 (Dashboard, Education)
3. **Development Kickoff** — Jira/Linear에 Epic/Story 분할, Sprint 계획
4. **AI Prompt Testing** — 실제 OpenAI API로 프롬프트 검증 및 최적화
5. **User Testing Plan** — 베타 테스터 모집 & 피드백 수집 프로세스

