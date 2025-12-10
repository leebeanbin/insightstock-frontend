# 📚 InsightStock 문서

프론트엔드 프로젝트 문서 모음

---

## 📄 문서 목록

### [⚡ QUICK-START.md](./QUICK-START.md)
5분 안에 개발 환경 설정 및 실행하기

**내용:**
- 설치 및 실행 방법
- 프로젝트 구조 설명
- 개발 명령어
- Kindle-style 하이라이팅 구현 설명
- 트러블슈팅 가이드

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local

# 3. 개발 서버 실행
pnpm dev
```

자세한 내용은 [QUICK-START.md](./QUICK-START.md)를 참조하세요.

---

## 📊 프로젝트 상태

### ✅ 완료된 기능
- **Dashboard**: 사용자 대시보드 및 통계
- **News & Feed**: 뉴스 피드, AI 분석, Kindle-style 텍스트 하이라이팅
- **Education (Notes)**: 노트 관리, 뉴스 스크랩, 하이라이트 저장

### 🚧 개발 진행 중
- Portfolio: 포트폴리오 관리
- Chat: AI 챗봇
- Stocks: 주식 검색 및 분석
- Learning: 학습 추천

---

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Build Tool**: Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: React Query
- **UI Components**: shadcn/ui + Radix UI

---

## 📖 추가 리소스

- **프로젝트 README**: [../README.md](../README.md)
- **아키텍처**: [../lib/ARCHITECTURE.md](../lib/ARCHITECTURE.md)

---

## 🆘 도움이 필요하신가요?

1. [QUICK-START.md](./QUICK-START.md)의 트러블슈팅 섹션 확인
2. TypeScript 타입 에러는 `pnpm type-check`로 확인
3. 린트 에러는 `pnpm lint --fix`로 자동 수정

---

**Happy Coding!** 🚀
