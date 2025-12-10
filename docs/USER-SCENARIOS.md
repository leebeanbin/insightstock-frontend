# 유저 시나리오 및 플로우 다이어그램

## 대시보드 종목 관리 플로우

### 전체 플로우 다이어그램

```mermaid
graph TD
    A[대시보드 진입] --> B[종목 목록 표시]
    B --> C{종목 선택}
    C -->|클릭| D[종목 상세 정보 표시]
    C -->|호버| E[액션 버튼 표시]
    
    E --> F[즐겨찾기 버튼]
    E --> G[포트폴리오 추가 버튼]
    
    F -->|클릭| H{즐겨찾기 상태}
    H -->|미추가| I[즐겨찾기 추가 API]
    H -->|추가됨| J[즐겨찾기 제거 API]
    I --> K[즐겨찾기 페이지로 이동 가능]
    J --> K
    
    G -->|클릭| L{포트폴리오 상태}
    L -->|미추가| M[포트폴리오 추가 API]
    L -->|추가됨| N[포트폴리오 페이지로 이동]
    M --> N
    
    D --> O[AI 요약 표시]
    D --> P[차트 표시]
    D --> Q[뉴스 링크]
    D --> R[학습 콘텐츠 링크]
    
    Q --> S[뉴스 상세 페이지]
    R --> T[교육 페이지]
    K --> U[즐겨찾기 페이지]
    N --> V[포트폴리오 페이지]
    
    S --> W[뉴스 좋아요/즐겨찾기]
    S --> X[관련 종목 링크]
    X --> D
    
    T --> Y[학습 콘텐츠 상세]
    Y --> Z[챗봇 학습 모달]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style D fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style K fill:#C4B5FD,stroke:#A78BFA,color:#000
    style N fill:#C4B5FD,stroke:#A78BFA,color:#000
    style S fill:#DDD6FE,stroke:#C4B5FD,color:#000
    style T fill:#DDD6FE,stroke:#C4B5FD,color:#000
```

## 페이지별 상세 플로우

### 1. 대시보드 페이지

```mermaid
graph LR
    A[대시보드] --> B[종목 목록]
    A --> C[종목 상세]
    A --> D[AI 요약]
    
    B --> E[카테고리 필터]
    B --> F[검색]
    B --> G[종목 카드]
    
    G --> H[호버 시 액션 버튼]
    H --> I[즐겨찾기]
    H --> J[포트폴리오 추가]
    
    G -->|클릭| C
    
    C --> K[차트]
    C --> L[기본 정보]
    C --> M[관련 링크]
    
    M --> N[뉴스 페이지]
    M --> O[교육 페이지]
    M --> P[탐색 페이지]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style G fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style C fill:#A78BFA,stroke:#8B5CF6,color:#fff
```

### 2. 종목 상세 → 다른 페이지 연결

```mermaid
graph TD
    A[종목 상세] --> B[관련 뉴스 버튼]
    A --> C[학습 콘텐츠 버튼]
    A --> D[전략 탐색 버튼]
    A --> E[포트폴리오 버튼]
    A --> F[즐겨찾기 버튼]
    
    B --> G[뉴스 피드 페이지]
    G --> H[뉴스 상세]
    H --> I[뉴스 좋아요/즐겨찾기]
    H --> J[관련 종목 링크]
    J --> A
    
    C --> K[교육 페이지]
    K --> L[오늘의 학습]
    K --> M[학습 대시보드]
    M --> N[학습 모달]
    N --> O[챗봇 학습]
    
    D --> P[탐색 페이지]
    P --> Q[전략 선택]
    Q --> R[전략 모달]
    R --> S[추천 종목]
    S --> A
    
    E --> T[포트폴리오 페이지]
    T --> U[포트폴리오 상세]
    U --> V[수정/삭제]
    
    F --> W[즐겨찾기 페이지]
    W --> X[즐겨찾기 목록]
    X --> A
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style G fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style K fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style P fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style T fill:#C4B5FD,stroke:#A78BFA,color:#000
    style W fill:#C4B5FD,stroke:#A78BFA,color:#000
```

### 3. 뉴스 페이지 플로우

```mermaid
graph TD
    A[뉴스 피드] --> B[뉴스 카드]
    B -->|호버| C[좋아요/즐겨찾기 버튼]
    B -->|클릭| D[뉴스 상세]
    
    C --> E[좋아요 토글]
    C --> F[즐겨찾기 토글]
    
    D --> G[뉴스 내용]
    D --> H[관련 종목]
    D --> I[관련 뉴스]
    D --> J[AI 요약]
    
    H -->|클릭| K[종목 상세]
    I -->|클릭| D
    
    J --> L[챗봇으로 질문]
    L --> M[챗봇 페이지]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style D fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style K fill:#C4B5FD,stroke:#A78BFA,color:#000
    style M fill:#DDD6FE,stroke:#C4B5FD,color:#000
```

### 4. 교육 페이지 플로우

```mermaid
graph TD
    A[교육 페이지] --> B[오늘의 학습]
    A --> C[학습 대시보드]
    A --> D[Q&A]
    A --> E[노트]
    
    B --> F[추천 학습 카드]
    F -->|클릭| G[학습 모달]
    G --> H[챗봇 학습]
    H --> I[질문/답변]
    I --> J[학습 기록 저장]
    
    C --> K[학습 카드]
    K -->|클릭| G
    
    D --> L[챗봇 페이지]
    L --> M[질문 입력]
    M --> N[AI 답변]
    N --> O[추천 질문]
    
    E --> P[노트 목록]
    P -->|클릭| Q[노트 모달]
    Q --> R[노트 작성/수정]
    R --> S[태그 추가]
    R --> T[차트 데이터]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style G fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style L fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style Q fill:#C4B5FD,stroke:#A78BFA,color:#000
```

### 5. 탐색 페이지 플로우

```mermaid
graph TD
    A[탐색 페이지] --> B[전략 카드]
    B -->|클릭| C[전략 모달]
    
    C --> D[전략 설명]
    C --> E[추천 종목]
    C --> F[AI 설명 버튼]
    
    E -->|클릭| G[종목 상세]
    F --> H[챗봇 페이지]
    H --> I[전략 질문]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style C fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style G fill:#C4B5FD,stroke:#A78BFA,color:#000
    style H fill:#DDD6FE,stroke:#C4B5FD,color:#000
```

### 6. 포트폴리오 페이지 플로우

```mermaid
graph TD
    A[포트폴리오 페이지] --> B[포트폴리오 목록]
    A --> C[포트폴리오 요약]
    A --> D[AI 리스크 분석]
    
    B --> E[포트폴리오 카드]
    E -->|클릭| F[포트폴리오 상세]
    E -->|호버| G[수정/삭제 버튼]
    
    F --> H[종목 정보]
    F --> I[수익률 차트]
    F --> J[관련 뉴스]
    F --> K[학습 콘텐츠]
    
    H -->|클릭| L[종목 상세]
    J -->|클릭| M[뉴스 상세]
    K -->|클릭| N[교육 페이지]
    
    G --> O[수정 모달]
    G --> P[삭제 확인]
    
    D --> Q[리스크 항목]
    Q --> R[권장 사항]
    R --> S[관련 학습]
    S --> N
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style F fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style L fill:#C4B5FD,stroke:#A78BFA,color:#000
    style M fill:#DDD6FE,stroke:#C4B5FD,color:#000
    style N fill:#DDD6FE,stroke:#C4B5FD,color:#000
```

### 7. 즐겨찾기 페이지 플로우

```mermaid
graph TD
    A[즐겨찾기 페이지] --> B[즐겨찾기 목록]
    B --> C[종목 카드]
    
    C -->|클릭| D[종목 상세]
    C -->|호버| E[제거 버튼]
    C --> F[포트폴리오 추가 버튼]
    
    E --> G[즐겨찾기 제거]
    F --> H[포트폴리오 추가]
    H --> I[포트폴리오 페이지]
    
    D --> J[관련 기능들]
    J --> K[뉴스]
    J --> L[교육]
    J --> M[탐색]
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style D fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style I fill:#C4B5FD,stroke:#A78BFA,color:#000
```

## 크로스 페이지 네비게이션 맵

```mermaid
graph TB
    subgraph "메인 페이지"
        A[대시보드]
        B[뉴스 피드]
        C[교육]
        D[탐색]
        E[포트폴리오]
        F[즐겨찾기]
        G[챗봇]
    end
    
    subgraph "상세 페이지"
        H[종목 상세]
        I[뉴스 상세]
        J[학습 모달]
        K[전략 모달]
        L[노트 모달]
    end
    
    A -->|종목 선택| H
    A -->|뉴스 링크| B
    A -->|교육 링크| C
    A -->|탐색 링크| D
    A -->|즐겨찾기 추가| F
    A -->|포트폴리오 추가| E
    
    B -->|종목 링크| H
    B -->|뉴스 클릭| I
    B -->|챗봇 질문| G
    
    C -->|학습 카드| J
    C -->|노트| L
    C -->|Q&A| G
    
    D -->|전략 선택| K
    K -->|추천 종목| H
    K -->|AI 설명| G
    
    E -->|종목 클릭| H
    E -->|뉴스 링크| B
    E -->|학습 링크| C
    
    F -->|종목 클릭| H
    F -->|포트폴리오 추가| E
    
    H -->|관련 뉴스| B
    H -->|학습 콘텐츠| C
    H -->|전략 탐색| D
    H -->|즐겨찾기| F
    H -->|포트폴리오| E
    
    I -->|관련 종목| H
    I -->|관련 뉴스| I
    
    J -->|챗봇 학습| G
    G -->|추천 질문| H
    G -->|추천 질문| B
    G -->|추천 질문| C
    
    style A fill:#8B5CF6,stroke:#7C3AED,color:#fff
    style B fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style C fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style D fill:#A78BFA,stroke:#8B5CF6,color:#fff
    style E fill:#C4B5FD,stroke:#A78BFA,color:#000
    style F fill:#C4B5FD,stroke:#A78BFA,color:#000
    style G fill:#DDD6FE,stroke:#C4B5FD,color:#000
    style H fill:#8B5CF6,stroke:#7C3AED,color:#fff
```

## 주요 액션 플로우

### 액션 1: 종목 즐겨찾기 추가

```mermaid
sequenceDiagram
    participant U as 사용자
    participant D as 대시보드
    participant API as 백엔드 API
    participant F as 즐겨찾기 페이지
    
    U->>D: 종목 카드 호버
    D->>D: 액션 버튼 표시
    U->>D: 즐겨찾기 버튼 클릭
    D->>API: POST /api/favorites/:stockId
    API-->>D: 성공 응답
    D->>D: UI 업데이트 (별 아이콘 채움)
    D->>D: 토스트 알림 표시
    D->>F: 캐시 무효화
    U->>F: 즐겨찾기 페이지 이동 가능
```

### 액션 2: 포트폴리오 추가

```mermaid
sequenceDiagram
    participant U as 사용자
    participant D as 대시보드
    participant API as 백엔드 API
    participant P as 포트폴리오 페이지
    
    U->>D: 종목 카드 호버
    D->>D: 액션 버튼 표시
    U->>D: 포트폴리오 추가 버튼 클릭
    D->>API: POST /api/portfolio
    API-->>D: 성공 응답
    D->>D: UI 업데이트 (플러스 아이콘 비활성화)
    D->>D: 토스트 알림 표시
    D->>P: 캐시 무효화
    U->>P: 포트폴리오 페이지 이동 가능
```

### 액션 3: 종목 상세에서 다른 페이지로 이동

```mermaid
sequenceDiagram
    participant U as 사용자
    participant DS as 종목 상세
    participant N as 뉴스 페이지
    participant E as 교육 페이지
    participant EX as 탐색 페이지
    
    U->>DS: 종목 선택
    DS->>DS: 상세 정보 표시
    U->>DS: 관련 뉴스 버튼 클릭
    DS->>N: 뉴스 페이지로 이동
    N->>N: 관련 뉴스 표시
    
    U->>DS: 학습 콘텐츠 버튼 클릭
    DS->>E: 교육 페이지로 이동
    E->>E: 관련 학습 콘텐츠 표시
    
    U->>DS: 전략 탐색 버튼 클릭
    DS->>EX: 탐색 페이지로 이동
    EX->>EX: 관련 전략 표시
```

## 구현 우선순위

### Phase 1: 핵심 기능 (완료)
- ✅ 종목 목록 표시
- ✅ 종목 상세 정보
- ✅ 즐겨찾기 추가/제거
- ✅ 포트폴리오 추가

### Phase 2: 페이지 연결 (진행 중)
- ✅ 종목 상세에서 뉴스 링크
- ✅ 종목 상세에서 교육 링크
- ✅ 종목 상세에서 탐색 링크
- ⏳ 뉴스에서 종목 링크
- ⏳ 교육에서 종목 링크
- ⏳ 탐색에서 종목 링크

### Phase 3: 고급 기능 (예정)
- ⏳ 포트폴리오 추가 모달 (수량 입력)
- ⏳ 일괄 액션
- ⏳ 키보드 단축키
- ⏳ 드래그 앤 드롭
