좋아! **Figma Design System 전체 가이드**를 만들어줄게. Figma에서 바로 따라하면서 구축할 수 있는 수준으로 만들 거야.

---

# 🎨 InsightStock — Figma Design System Guide
**Version 1.0**  
**Last Updated:** 2024.11.20  
**Purpose:** 개발팀과 디자인팀이 동일한 토큰과 컴포넌트를 사용하도록 보장

---

## 📑 Table of Contents

1. [Setup Guide](#1-setup-guide)
   - 1.1 [Figma File Structure](#11-figma-file-structure)
   - 1.2 [Figma Plugins 설치](#12-figma-plugins-설치)
   - 1.3 [초기 세팅](#13-초기-세팅)
   - 1.4 [Frame 생성 규칙 (AI 이해용)](#14-frame-생성-규칙-ai-이해용) ⭐ **NEW**
2. [Variables (Tokens)](#2-variables-tokens)
3. [Typography Styles](#3-typography-styles)
4. [Component Library](#4-component-library)
5. [Layout System](#5-layout-system)
6. [Page Templates](#6-page-templates)
7. [Handoff Guidelines](#7-handoff-guidelines)

---

## 🚀 Quick Reference (자주 쓰는 값)

**Primary 컬러:** `#16A362` (primary/600)  
**기본 Spacing:** 4px, 8px, 16px, 24px, 32px, 48px (8px 배수)  
**기본 Border Radius:** 8px (Button/Input), 12px (Card), 4px (Badge)  
**기본 Transition:** 0.2s ease-out  
**기본 Shadow:** `0px 1px 3px rgba(0, 0, 0, 0.1)` (Card Default)  
**Hover Shadow:** `0px 4px 12px rgba(0, 0, 0, 0.15)` (Card Hover)  
**Focus Ring:** `0px 0px 0px 3px #E6F8EE` (primary/100, 3px spread)

**Frame 생성 규칙 (AI 필수):**
- **네이밍**: PascalCase, 접미사 규칙 준수 (`Dashboard`, `StockListSection`, `Button`)
- **Auto Layout**: 모든 Frame에 필수 적용 (Shift + A)
- **Gap/Padding**: Variables 사용 (`spacing/md` = 16px)
- **계층 구조**: 최대 5단계 (Page → Section → Component → Element → Detail)
- **Constraints**: 반응형 고려하여 설정

**컴포넌트 기본 높이:**
- Button: 40px (Medium), 48px (Large)
- Input: 40px
- Icon Button: 40px (Medium), 32px (Small)
- Table Row: 48px
- Nav Item: 40px

**Typography 기본:**
- H1: 24px / 32px (Pretendard Bold)
- H2: 20px / 28px (Pretendard Bold)
- H3: 18px / 26px (Pretendard SemiBold)
- Body1: 16px / 24px (Pretendard Regular)
- Body2: 14px / 20px (Pretendard Regular)
- Caption: 12px / 16px (Pretendard Regular)

---

## 1. Setup Guide

### 1.1 Figma File Structure

**프로젝트 구조:**
```
InsightStock Design System/
├── 📄 00_Cover (커버 페이지)
├── 📄 01_Tokens (Variables 정의)
├── 📄 02_Typography (Text Styles)
├── 📄 03_Icons (Icon Library)
├── 📄 04_Components (컴포넌트 라이브러리)
│   ├── Atoms (Button, Input, Badge, etc.)
│   ├── Molecules (Card, Table Row, etc.)
│   └── Organisms (Header, Sidebar, etc.)
├── 📄 05_Layouts (Grid, Spacing 가이드)
├── 📄 06_Templates (Dashboard, News, Education 등 전체 페이지)
└── 📄 07_Handoff (개발 전달 스펙)
```

---

### 1.2 Figma Plugins 설치

**필수 플러그인:**
1. **Stark** — 접근성 검증 (색상 대비, Focus State)
2. **Iconify** — Lucide Icons 불러오기
3. **Content Reel** — 더미 데이터 생성
4. **Auto Layout** — 자동 레이아웃 검증
5. **Design Lint** — 일관성 검사

---

### 1.3 초기 세팅

**1) 새 파일 생성**
- File → New Design File
- 이름: `InsightStock Design System`

**2) Frame 설정**
- Desktop: 1440 x 1024 (기본)
- Tablet: 768 x 1024
- Mobile: 375 x 812

**3) 페이지 생성**
- 좌측 Layers 패널에서 "Page" 추가
- 위 구조대로 페이지 7개 생성

---

### 1.4 Frame 생성 규칙 (AI 이해용)

**⚠️ AI가 Figma 작업을 수행할 때 반드시 따라야 하는 규칙입니다.**

#### 1.4.1 Frame 네이밍 컨벤션

**기본 규칙:**
- **대소문자**: PascalCase 사용 (예: `Dashboard`, `StockList`, `AISummaryPanel`)
- **구분자**: 공백 없음, 단어는 대문자로 구분
- **접미사**: Frame 타입에 따라 접미사 추가

**Frame 타입별 네이밍:**

| Frame 타입 | 네이밍 규칙 | 예시 |
|-----------|------------|------|
| **Page Frame** (전체 페이지) | `{PageName}` | `Dashboard`, `NewsFeed`, `Education` |
| **Section Frame** (페이지 내 섹션) | `{SectionName}Section` | `StockListSection`, `ChartSection` |
| **Component Frame** (컴포넌트) | `{ComponentName}` | `Button`, `Card`, `Input` |
| **Container Frame** (레이아웃용) | `{Purpose}Container` | `HeaderContainer`, `ContentContainer` |
| **State Frame** (상태별) | `{ComponentName}{State}` | `ButtonHover`, `InputError` |

**예외 규칙:**
- Variant가 있는 컴포넌트: `{ComponentName}/{VariantName}` (예: `Button/Primary`, `Button/Secondary`)
- 반응형 Frame: `{PageName}{Breakpoint}` (예: `DashboardTablet`, `DashboardMobile`)

#### 1.4.2 Frame 계층 구조 규칙

**계층 구조 (Layers 패널):**
```
📄 Page Name
└── 🖼️ PageFrame (최상위 Frame)
    ├── 🖼️ SectionFrame (섹션)
    │   ├── 🖼️ ComponentFrame (컴포넌트)
    │   │   ├── 📝 Text Layer
    │   │   └── 🎨 Shape Layer
    │   └── 🖼️ ContainerFrame (레이아웃)
    └── 🖼️ SectionFrame
```

**규칙:**
1. **최상위 Frame**: 항상 Page Frame으로 시작 (F 단축키로 생성)
2. **중첩 깊이**: 최대 5단계 (Page → Section → Component → Element → Detail)
3. **Frame vs Group**: 
   - Frame: 레이아웃/컨테이너 용도 (Auto Layout 적용 가능)
   - Group: 단순 그룹핑 (레이아웃 변경 없음)
   - **원칙**: 가능한 한 Frame 사용 (Auto Layout 활용)

#### 1.4.3 Frame 타입별 생성 규칙

**1) Page Frame (전체 페이지)**
```
생성 방법:
1. F 단축키 또는 Frame Tool 선택
2. Frame Type: Desktop (1440 x 1024)
3. Name: "Dashboard" (PascalCase)
4. Auto Layout: Horizontal 또는 Vertical (레이아웃에 따라)
5. Constraints: None (최상위이므로)
```

**2) Section Frame (페이지 내 섹션)**
```
생성 방법:
1. Page Frame 내부에서 F 단축키
2. Name: "{SectionName}Section" (예: "StockListSection")
3. Auto Layout: 필수 적용
4. Direction: Horizontal 또는 Vertical
5. Gap: Spacing Variables 사용 (spacing/md = 16px)
6. Padding: Spacing Variables 사용
```

**3) Component Frame (재사용 컴포넌트)**
```
생성 방법:
1. Section Frame 내부에서 F 단축키
2. Name: "{ComponentName}" (예: "Button", "Card")
3. Auto Layout: 필수 적용
4. 우클릭 → "Create Component" (재사용 시)
5. Component Name: "Button" (Variant는 Properties에서 설정)
```

**4) Container Frame (레이아웃용)**
```
생성 방법:
1. Section Frame 내부에서 F 단축키
2. Name: "{Purpose}Container" (예: "HeaderContainer")
3. Auto Layout: 필수 적용
4. Width/Height: Fill Container 또는 Fixed
5. Constraints: Left/Right + Top/Bottom (반응형 고려)
```

#### 1.4.4 Auto Layout 적용 규칙

**필수 적용 대상:**
- ✅ 모든 Frame (Page Frame 제외, 선택사항)
- ✅ 모든 Component
- ✅ 모든 Container

**Auto Layout 설정 순서:**
```
1. Frame 선택
2. Shift + A (Auto Layout 적용)
3. Direction 설정:
   - Horizontal: 가로 배치 (Button 내부, Header)
   - Vertical: 세로 배치 (Card 내부, Form)
4. Gap 설정:
   - Variables 아이콘 클릭 → spacing/md (16px) 선택
5. Padding 설정:
   - Variables 아이콘 클릭 → spacing/md 또는 spacing/lg 선택
6. Alignment 설정:
   - Horizontal: Left (기본), Center, Right
   - Vertical: Top (기본), Center, Bottom
```

**Gap/Padding 규칙:**
- **Gap**: 요소 간 간격 (spacing/sm = 8px, spacing/md = 16px)
- **Padding**: Frame 내부 여백 (spacing/md = 16px, spacing/lg = 24px)
- **일관성**: 같은 레벨의 Frame은 동일한 Gap/Padding 사용

#### 1.4.5 Constraints 설정 규칙

**Constraints 적용 대상:**
- Container Frame (반응형 대응)
- Component 내부 요소 (부모 크기 변경 시 대응)

**설정 규칙:**

| 요소 타입 | Horizontal | Vertical | 이유 |
|----------|-----------|----------|------|
| **Header/Footer** | Left & Right | Top | 좌우 고정, 상하 고정 |
| **Sidebar** | Left | Top & Bottom | 좌측 고정, 상하 고정 |
| **Main Content** | Left & Right | Top & Bottom | 전체 확장 |
| **Button Label** | Left & Right | Center | 텍스트 중앙 정렬 |
| **Icon** | Center | Center | 아이콘 중앙 정렬 |

**설정 방법:**
1. 요소 선택
2. 우측 패널 → Constraints 섹션
3. Horizontal: Left, Center, Right, Left & Right, Scale
4. Vertical: Top, Center, Bottom, Top & Bottom, Scale

#### 1.4.6 Frame 크기 규칙

**고정 크기 (Fixed Width/Height):**
- Button: Width Auto (Min: 80px), Height 40px (Medium)
- Input: Width Fill Container (Min: 200px), Height 40px
- Icon Button: Width 40px, Height 40px
- Card: Width Auto (Fill Container 또는 360px), Height Auto (Min: 100px)

**유동 크기 (Fill Container):**
- Section Frame: Width Fill Container, Height Auto
- Container Frame: Width Fill Container, Height Auto
- Text Layer: Width Fill Container (Horizontal Resizing)

**최소/최대 크기:**
- Min Width: 내용에 따라 설정 (예: Button Min 80px)
- Max Width: 반응형 고려 (예: Modal Max 90vw)
- Min Height: 내용에 따라 설정 (예: Card Min 100px)

#### 1.4.7 AI 작업 시 체크리스트

**Frame 생성 전 확인:**
- [ ] Frame 타입 결정 (Page/Section/Component/Container)
- [ ] 네이밍 규칙 준수 (PascalCase, 접미사)
- [ ] Auto Layout 적용 여부 확인
- [ ] Gap/Padding에 Variables 사용
- [ ] Constraints 설정 (반응형 고려)

**Frame 생성 후 확인:**
- [ ] Layers 패널에서 계층 구조 확인
- [ ] Auto Layout Direction/Gap/Padding 확인
- [ ] Constraints 설정 확인
- [ ] Frame Name이 명확한지 확인
- [ ] 중첩 깊이가 5단계 이하인지 확인

**컴포넌트 생성 시 추가 확인:**
- [ ] Component로 변환 전 Variant 구조 설계
- [ ] Properties 설정 (Type, Size, State 등)
- [ ] Variant별 이름 규칙: `{Property}={Value}` (예: `Type=Primary, Size=Medium`)

#### 1.4.8 실제 예시 (AI 참고용)

**예시 1: Button 컴포넌트 Frame 생성**

```
작업 순서:
1. F 단축키 → Frame 생성
2. Name: "Button" (PascalCase, 접미사 없음 - Component이므로)
3. Width: Auto (Min: 80px)
4. Height: 40px (Fixed)
5. Shift + A → Auto Layout 적용
6. Direction: Horizontal
7. Gap: Variables 아이콘 클릭 → spacing/sm (8px) 선택
8. Padding: Variables 아이콘 클릭 → spacing/md (16px 좌우), spacing/sm (12px 상하) 선택
9. Fill: Variables 아이콘 클릭 → primary/600 선택
10. Border Radius: 8px (All)
11. 우클릭 → "Create Component"
12. Component Name: "Button"
13. Properties 추가: Type (Primary/Secondary/Ghost), Size (Medium/Large), State (Default/Hover/Disabled)
```

**예시 2: Card 컴포넌트 Frame 생성**

```
작업 순서:
1. F 단축키 → Frame 생성
2. Name: "Card" (PascalCase, 접미사 없음)
3. Width: Fill Container (또는 360px 고정)
4. Height: Auto (Min: 100px)
5. Shift + A → Auto Layout 적용
6. Direction: Vertical
7. Gap: Variables 아이콘 클릭 → spacing/md (16px) 선택
8. Padding: Variables 아이콘 클릭 → spacing/lg (24px) 선택
9. Fill: Variables 아이콘 클릭 → background/card (white) 선택
10. Border: 1px, Variables 아이콘 클릭 → border/default (gray/200) 선택
11. Border Radius: 12px (All)
12. Shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)
13. 우클릭 → "Create Component"
```

**예시 3: Dashboard 페이지 Frame 생성**

```
작업 순서:
1. F 단축키 → Frame Type: Desktop (1440 x 1024)
2. Name: "Dashboard" (PascalCase, Page Frame이므로 접미사 없음)
3. Shift + A → Auto Layout 적용
4. Direction: Horizontal
5. Gap: 0px
6. Padding: 0px
7. Fill: Variables 아이콘 클릭 → background/page (gray/50) 선택
8. 내부에 Sidebar, MainAreaContainer Frame 생성 (위 Step 2-8 참조)
```

**⚠️ AI 작업 시 자주 하는 실수:**
- ❌ Frame Name을 소문자로 작성 (`dashboard` → ✅ `Dashboard`)
- ❌ 접미사 규칙 무시 (`StockList` → ✅ `StockListSection`)
- ❌ Auto Layout 미적용 (반드시 Shift + A)
- ❌ Gap/Padding에 직접 px 값 입력 (`16px` → ✅ Variables `spacing/md`)
- ❌ Constraints 미설정 (반응형 문제 발생)

---

## 2. Variables (Tokens)

Figma Variables를 사용하여 **디자인 토큰을 코드와 1:1 매핑** 가능하게 만듦.

### 2.0 브랜드 컬러 정책 (중요!)

**⚠️ 핵심 원칙:**
- **전체 디자인 시스템의 기본 컬러는 Primary Green (`#16A362`)입니다.**
- 모든 CTA, 링크, 강조 요소는 Primary 컬러를 사용합니다.
- Primary 컬러는 브랜드 아이덴티티의 핵심입니다.

**Primary 컬러 사용 규칙:**
1. **CTA 버튼**: Primary/600 (`#16A362`) 사용
2. **링크**: Primary/600 사용
3. **Focus Ring**: Primary/600 사용 (접근성 필수)
4. **Active 상태**: Primary/500 (`#1DBF6A`) 사용
5. **Selected 상태**: Primary/100 (`#E6F8EE`) 배경 + Primary/600 텍스트
6. **Hover 상태**: Primary/500 (버튼), Primary/100 (배경)

**다른 컬러 사용 금지:**
- ❌ 파란색, 보라색 등 다른 브랜드 컬러 사용 금지
- ✅ 예외: Semantic 컬러 (Red, Blue, Yellow, Green)는 데이터 표시용으로만 사용
- ✅ 예외: Neutral Gray는 텍스트, 배경, Border용으로 사용

**검증 방법:**
- 모든 컴포넌트에서 Primary 컬러 사용 여부 확인
- 다른 브랜드 컬러가 사용된 경우 즉시 Primary로 변경

### 2.1 Color Variables 생성

**Step 1: Variables 패널 열기**
- 우측 패널에서 "Variables" 아이콘 클릭
- 또는 단축키: `Ctrl + Alt + K` (Windows) / `Cmd + Option + K` (Mac)

**Step 2: Collection 생성**
- `+ Create Collection` 클릭
- 이름: `Color Tokens`

**⚠️ 중요: 명명 규칙**
- **Figma Variables**: 슬래시(`/`) 사용 → `primary/600`, `gray/900`
- **CSS Variables**: 하이픈(`-`) 사용 → `--primary-600`, `--gray-900`
- **코드에서 사용**: 하이픈 형식으로 변환 필요
- **매핑 규칙**: Figma Export 시 자동 변환 또는 수동 매핑 테이블 제공

---

### 2.2 Primary Colors

**Collection:** `Color Tokens`  
**Mode:** `Light` (기본)

| Variable Name (Figma) | CSS Variable | Hex Value | RGB | 용도 | 사용 예시 |
|------------------------|--------------|-----------|-----|------|-----------|
| `primary/600` | `--primary-600` | `#16A362` | `rgb(22, 163, 98)` | 브랜드 핵심 컬러, CTA, 주요 버튼 | Primary Button, Link, Focus Ring |
| `primary/500` | `--primary-500` | `#1DBF6A` | `rgb(29, 191, 106)` | Hover/Active 상태 | Button Hover, Active Nav Item |
| `primary/400` | `--primary-400` | `#34D883` | `rgb(52, 216, 131)` | 수치 강조, 작은 액센트 | 수익률 강조, 작은 아이콘 |
| `primary/100` | `--primary-100` | `#E6F8EE` | `rgb(230, 248, 238)` | 박스 배경, 페일한 강조 | Selected State, Info Toast 배경 |

**색상 적용 방법:**
1. Figma Variables 패널에서 `primary/600` 선택
2. Fill 또는 Stroke에 적용
3. 개발 시: CSS에서 `var(--primary-600)` 또는 `#16A362` 직접 사용

**생성 방법:**
1. `+ Create Variable` 클릭
2. Type: `Color` 선택
3. Name: `primary/600` 입력
4. Value: `#16A362` 입력
5. 나머지도 동일하게 반복

---

### 2.3 Semantic Colors

| Variable Name (Figma) | CSS Variable | Hex Value | RGB | 용도 | 사용 예시 |
|------------------------|--------------|-----------|-----|------|-----------|
| `semantic/red` | `--semantic-red` | `#EF4444` | `rgb(239, 68, 68)` | 상승, 수익, 에러 | 가격 상승 표시, Error Toast, Error Input |
| `semantic/blue` | `--semantic-blue` | `#1D4ED8` | `rgb(29, 78, 216)` | 하락, 손실 | 가격 하락 표시, 손실 금액 |
| `semantic/yellow` | `--semantic-yellow` | `#F59E0B` | `rgb(245, 158, 11)` | 경고, 주의 | Warning Toast, 리스크 경고 |
| `semantic/green` | `#10B981` | `rgb(16, 185, 129)` | 성공, 완료 | Success Toast, 완료 상태 |

**⚠️ 중요 규칙:**
- **색상만으로 정보 전달 금지**: 항상 아이콘(▲▼) 또는 텍스트("상승", "하락") 병행
- **접근성**: 모든 색상은 WCAG 2.1 AA 기준 (4.5:1 대비비) 준수
- **검증**: Stark 플러그인으로 대비비 확인 필수

---

### 2.4 Neutral Colors (Grayscale)

| Variable Name (Figma) | CSS Variable | Hex Value | RGB | 용도 | 사용 예시 |
|------------------------|--------------|-----------|-----|------|-----------|
| `gray/900` | `--gray-900` | `#111827` | `rgb(17, 24, 39)` | 제목, 강조 텍스트 | H1, H2, H3, 주요 텍스트 |
| `gray/700` | `--gray-700` | `#374151` | `rgb(55, 65, 81)` | 본문 텍스트 | Body1, Body2, 일반 텍스트 |
| `gray/600` | `#4B5563` | `rgb(75, 85, 99)` | 보조 텍스트, 아이콘 | Caption, Icon 기본 색상 |
| `gray/400` | `#9CA3AF` | `rgb(156, 163, 175)` | Placeholder, 비활성 | Input Placeholder, Disabled Text |
| `gray/300` | `#D1D5DB` | `rgb(209, 213, 219)` | Border (subtle), Disabled | Disabled Button 배경 |
| `gray/200` | `#E5E7EB` | `rgb(229, 231, 235)` | Border, Divider | Card Border, Table Border, Divider |
| `gray/100` | `#F3F4F6` | `rgb(243, 244, 246)` | Hover 배경 | Button Hover, Table Row Hover |
| `gray/50` | `#F9FAFB` | `rgb(249, 250, 251)` | 페이지 배경 | Page Background, Table Header |
| `white` | `#FFFFFF` | `rgb(255, 255, 255)` | 카드 배경 | Card Background, Input Background |

**색상 대비비 (WCAG 2.1 AA 기준):**
- `gray/900` on `white`: 15.8:1 ✅ (AAA)
- `gray/700` on `white`: 12.6:1 ✅ (AAA)
- `gray/600` on `white`: 7.0:1 ✅ (AA)
- `primary/600` on `white`: 4.6:1 ✅ (AA)
- `gray/400` on `white`: 3.1:1 ⚠️ (Large Text만 AA, Normal Text는 부족)

**사용 규칙:**
- `gray/400`는 Placeholder에만 사용 (본문 텍스트에는 사용 금지)
- 모든 텍스트는 최소 `gray/600` 이상 사용
- 배경과 텍스트 대비비는 항상 4.5:1 이상 유지

---

### 2.5 Alias Variables (Semantic Mapping)

**Collection:** `Semantic Tokens`  
**Purpose:** 용도별로 색상 매핑 (코드와 동일하게)

| Alias Name | Reference | 용도 |
|------------|-----------|------|
| `background/page` | `gray/50` | 페이지 배경 |
| `background/card` | `white` | 카드 배경 |
| `background/hover` | `gray/100` | Hover 상태 배경 |
| `text/primary` | `gray/900` | 주요 텍스트 |
| `text/secondary` | `gray/700` | 본문 텍스트 |
| `text/tertiary` | `gray/600` | 보조 텍스트 |
| `border/default` | `gray/200` | 기본 Border |
| `border/focus` | `primary/600` | Focus State |

**생성 방법:**
1. 새 Collection 생성: `Semantic Tokens`
2. Variable 추가
3. Type: `Alias` 선택
4. Value에서 기존 Variable 참조 (예: `Color Tokens/gray/50`)

---

### 2.6 Number Variables (Spacing)

**Collection:** `Spacing Tokens`  
**Type:** `Number`  
**단위:** `px` (Figma에서는 Number로 저장, 사용 시 px 자동 적용)

| Variable Name (Figma) | CSS Variable | Value (px) | 8px 배수 | 용도 | 사용 예시 |
|------------------------|--------------|------------|----------|------|-----------|
| `spacing/xs` | `--spacing-xs` | `4` | 0.5× | 아이콘-텍스트 간격 | Button 내부 Icon-Text, Badge Dot-Label |
| `spacing/sm` | `--spacing-sm` | `8` | 1× | 작은 여백, 요소 간격 | Badge Gap, Toast Icon-Message |
| `spacing/md` | `--spacing-md` | `16` | 2× | 기본 여백, 섹션 내부 | Card Padding, Input Padding, 기본 Gap |
| `spacing/lg` | `--spacing-lg` | `24` | 3× | 섹션 간격, 큰 여백 | Card 사이 간격, Section Margin |
| `spacing/xl` | `--spacing-xl` | `32` | 4× | 큰 섹션 간격 | Page Section Margin, 큰 Card Padding |
| `spacing/2xl` | `--spacing-2xl` | `48` | 6× | 페이지 상단 여백 | Page Top Margin, 큰 Section Spacing |

**⚠️ 중요 규칙:**
- **모든 Spacing은 8px의 배수**로만 사용 (4px는 예외, 0.5×)
- Figma Variables에서 Number로 저장: `4`, `8`, `16` 등 (px 없이)
- Auto Layout Gap/Padding에 Variables 직접 적용 가능
- 개발 시: CSS에서 `var(--spacing-md)` 또는 `16px` 직접 사용

**Figma에서 적용:**
1. Auto Layout 패널 열기
2. Gap 또는 Padding 입력란 클릭
3. Variables 아이콘 (4개 점) 클릭
4. `Spacing Tokens/spacing/md` 선택
5. 자동으로 `16px`로 변환됨

**생성 방법:**
1. Collection: `Spacing Tokens`
2. Type: `Number`
3. Name: `spacing/md`, Value: `16`

---

### 2.7 Variables 적용 방법

**Frame/Shape에 적용:**
1. Frame 선택
2. 우측 패널 → Fill
3. 색상 선택기에서 Variables 아이콘 클릭 (4개 점)
4. `Semantic Tokens/background/card` 선택

**Auto Layout Spacing에 적용:**
1. Frame 선택 (Auto Layout 적용된 상태)
2. Auto Layout 패널
3. Spacing 입력란에서 Variables 아이콘 클릭
4. `Spacing Tokens/spacing/md` 선택

---

## 3. Typography Styles

### 3.1 Font Setup

**필요 폰트:**
1. **Pretendard** (한글)
   - Weight: 400 (Regular), 600 (SemiBold), 700 (Bold)
   - 다운로드: [https://github.com/orioncactus/pretendard](https://github.com/orioncactus/pretendard)
2. **Inter** (영문, 숫자)
   - Weight: 400, 600, 700
   - Figma에서 자동 로드됨

**폰트 설치:**
- Mac: Font Book에서 설치
- Windows: 폰트 파일 우클릭 → 설치
- Figma 재시작

---

### 3.2 Text Styles 생성

**Step 1: Text Styles 패널 열기**
- 우측 패널 → Text → Style 아이콘 (4개 점)
- `Create Style` 클릭

**Step 2: Heading Styles**

#### H1 — Page Title
```
Text Layer:
  Font: Pretendard
  Weight: 700 (Bold)
  Size: 24px
  Line Height: 32px (133.33%, Auto 아님)
  Letter Spacing: -0.5px
  Color: #111827 (gray/900, text/primary)
  Alignment: Left

**생성 방법:**
1. 텍스트 레이어 생성 (T 단축키)
2. 위 속성 정확히 적용
3. 우측 Text 패널 → Style 아이콘 (4개 점) → `Create Style`
4. Name: `H1 - Page Title`
5. Description: "페이지 최상단 제목"
6. Organize: `Heading/H1 - Page Title` (폴더 구조)
```

---

#### H2 — Section Title
```
Text Layer:
  Font: Pretendard
  Weight: 700 (Bold)
  Size: 20px
  Line Height: 28px (140%, Auto 아님)
  Letter Spacing: -0.3px
  Color: #111827 (gray/900, text/primary)
  Alignment: Left

**생성:** `Heading/H2 - Section Title`
```

#### H3 — Card Title
```
Text Layer:
  Font: Pretendard
  Weight: 600 (SemiBold)
  Size: 18px
  Line Height: 26px (144.44%, Auto 아님)
  Letter Spacing: 0px
  Color: #111827 (gray/900, text/primary)
  Alignment: Left
  Max Lines: 2 (말줄임)

**생성:** `Heading/H3 - Card Title`
```

---

**Step 3: Body Styles**

#### Body1 — Primary Text
```
Text Layer:
  Font: Pretendard
  Weight: 400 (Regular)
  Size: 16px
  Line Height: 24px (150%, Auto 아님)
  Letter Spacing: 0px
  Color: #374151 (gray/700, text/secondary)
  Alignment: Left

**생성:** `Body/Body1 - Primary`
```

#### Body2 — Secondary Text
```
Text Layer:
  Font: Pretendard
  Weight: 400 (Regular)
  Size: 14px
  Line Height: 20px (142.86%, Auto 아님)
  Letter Spacing: 0px
  Color: #374151 (gray/700, text/secondary)
  Alignment: Left

**생성:** `Body/Body2 - Secondary`
```

#### Caption — Small Label
```
Text Layer:
  Font: Pretendard
  Weight: 400 (Regular)
  Size: 12px
  Line Height: 16px (133.33%, Auto 아님)
  Letter Spacing: 0px
  Color: #4B5563 (gray/600, text/tertiary)
  Alignment: Left

**생성:** `Body/Caption - Small`
```

---

**Step 4: Number Styles (Tabular)**

#### Number/Large — 가격 표시
```
Text Layer:
  Font: Inter
  Weight: 600 (SemiBold)
  Size: 18px
  Line Height: 26px (144.44%, Auto 아님)
  Letter Spacing: 0px
  Color: #111827 (gray/900, text/primary)
  Alignment: Right (숫자는 우측 정렬)
  Font Features: Tabular Figures On (필수!)

**Tabular Figures 설정:**
Text 패널 → More Options → Font Features → Tabular Figures 체크

**생성:** `Number/Number/Large`
```

**Tabular Numbers 설정 (중요!):**
1. 텍스트 레이어 선택
2. 우측 Text 패널 → More Options (⋯) 클릭
3. `Font features` 섹션 확장
4. `Tabular figures` 체크박스 활성화
5. 이 설정이 없으면 숫자 정렬이 깨짐!

#### Number/Medium — 일반 숫자
```
Text Layer:
  Font: Inter
  Weight: 400 (Regular)
  Size: 16px
  Line Height: 24px (150%, Auto 아님)
  Letter Spacing: 0px
  Color: #374151 (gray/700, text/secondary)
  Alignment: Right
  Font Features: Tabular Figures On (필수!)

**생성:** `Number/Number/Medium`
```

#### Number/Small — 작은 숫자
```
Text Layer:
  Font: Inter
  Weight: 400 (Regular)
  Size: 14px
  Line Height: 20px (142.86%)
  Letter Spacing: 0px
  Color: #4B5563 (gray/600, text/tertiary)
  Alignment: Right
  Font Features: Tabular Figures On

**생성:** `Number/Number/Small`
```

---

### 3.3 Text Styles 정리

**최종 Text Styles 목록:**
```
📝 Heading/
   ├── H1 - Page Title
   ├── H2 - Section Title
   └── H3 - Card Title
📝 Body/
   ├── Body1 - Primary
   ├── Body2 - Secondary
   └── Caption - Small
📝 Number/
   ├── Number/Large
   └── Number/Medium
```

---

## 4. Component Library

### 4.0 컴포넌트 공통 규칙 (중요!)

**⚠️ 모든 컴포넌트의 기본 설정 (명시되지 않으면 기본값):**
- **Type**: Frame (Auto Layout)
- **Opacity**: 100% (명시되지 않으면)
- **Effects**: None (명시되지 않으면)
- **Border**: None (명시되지 않으면)
- **Shadow**: None (명시되지 않으면)

**명시 규칙:**
- 기본값과 다른 경우만 명시
- 예: Border가 있으면 명시, 없으면 생략
- 예: Opacity가 100%가 아니면 명시

**Border Radius 축약 규칙:**
- 모든 모서리가 같으면: `Border Radius: 8px (All)`
- 특정 모서리만 다를 때만 상세 명시

**색상 표기 규칙:**
- Hex 값: `#16A362`
- Variable 참조: `primary/600` 또는 `{primary/600}`
- RGB는 필요시만 명시

---

### 4.1 Atoms (기본 컴포넌트)

---

#### 4.1.1 Button

**Component Structure:**
```
Button (Auto Layout, Horizontal)
├── Icon (Optional, 16x16)
└── Label (Text)
```

**Properties (Variants):**

| Property | Options |
|----------|---------|
| `Type` | `Primary` / `Secondary` / `Ghost` |
| `Size` | `Medium` (40px) / `Large` (48px) |
| `State` | `Default` / `Hover` / `Disabled` |
| `Icon` | `None` / `Left` / `Right` |

---

**Variant: Primary / Medium / Default**
```
Frame:
  Direction: Horizontal
  Gap: 8px (Icon-Text 사이)
  Padding: 16px (좌우), 12px (상하)
  Width: Auto (Min: 80px)
  Height: 40px (고정)
  Fill: #16A362 (primary/600)
  Border Radius: 8px (All)

Label:
  Text Style: Body1 - Primary
  Color: #FFFFFF (white)
  Alignment: Center
  
Icon (optional):
  Size: 16px × 16px
  Color: #FFFFFF (white)
  Stroke Width: 1.75px (Lucide)
```

**Variant: Primary / Medium / Hover**
```
Frame:
  Fill: #1DBF6A (primary/500)
  Shadow: 0px 2px 4px rgba(22, 163, 98, 0.2)
  Transform: Scale 0.98 (Prototype만, 실제는 100%)
```

**Variant: Primary / Medium / Disabled**
```
Frame:
  Fill: #D1D5DB (gray/300)

Label:
  Color: #4B5563 (gray/600)
  
Icon (optional):
  Color: #4B5563 (gray/600)
  Opacity: 60%
```

---

**Variant: Secondary / Medium / Default**
```
Frame:
  Fill: #F3F4F6 (gray/100)
  Border: 1px #E5E7EB (gray/200, Inside)
  Border Radius: 8px (All)

Label:
  Text Style: Body1 - Primary
  Color: #111827 (gray/900, text/primary)
  
Icon (optional):
  Color: #111827 (gray/900)
```

**Variant: Secondary / Medium / Hover**
```
Frame:
  Fill: #E5E7EB (gray/200)
  Border: 1px #D1D5DB (gray/300)
  Shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)
```

**Variant: Ghost / Medium / Default**
```
Frame:
  Fill: Transparent
  Border Radius: 8px

Label:
  Text Style: Body1 - Primary
  Color: #16A362 (primary/600)
  
Icon (optional):
  Color: #16A362 (primary/600)
```

**Variant: Ghost / Medium / Hover**
```
Frame:
  Fill: #E6F8EE (primary/100)
```

**Variant: Large (48px Height)**
```
Frame:
  Padding: 20px (좌우), 14px (상하)
  Height: 48px
  Gap: 8px (Icon-Text)
  
  (나머지 속성은 Medium과 동일)
  
Label:
  Text Style: Body1 - Primary (16px 유지)
  
Icon:
  Size: 18px × 18px (Large는 약간 큰 아이콘)
```

---

**생성 방법:**
1. Frame 생성 (F)
2. Auto Layout 적용 (Shift + A)
3. 텍스트 추가 ("Button")
4. 패딩/간격 조정
5. 우클릭 → `Create Component`
6. Name: `Button`
7. 우측 패널 → Properties → `+ Add Property`
   - Type: `Variant`
   - Name: `Type`, Options: `Primary, Secondary, Ghost`
8. 각 Variant별로 복사해서 속성 변경
9. 이름 규칙: `Type=Primary, Size=Medium, State=Default`

---

#### 4.1.2 Input

**Component Structure:**
```
Input (Auto Layout, Vertical)
├── Label (Optional)
└── Input Field (Auto Layout, Horizontal)
    ├── Prefix Icon (Optional)
    ├── Text (Placeholder or Value)
    └── Suffix Icon (Optional)
```

**Properties:**
| Property | Options |
|----------|---------|
| `State` | `Default` / `Focus` / `Error` / `Disabled` |
| `Label` | `True` / `False` |
| `Prefix` | `None` / `Search` / `User` |
| `Suffix` | `None` / `Clear` / `Check` |

---

**Variant: Default**
```
Input Field:
  Direction: Horizontal
  Gap: 8px (Prefix Icon-Text 사이)
  Padding: 0px 12px (좌우만)
  Width: Auto (Fill Container, Min: 200px)
  Height: 40px (고정)
  Fill: #FFFFFF (white)
  Border: 1px #E5E7EB (gray/200, Inside)
  Border Radius: 8px (All)

Placeholder Text:
  Text Style: Body2 - Secondary
  Color: #9CA3AF (gray/400)

Value Text:
  Text Style: Body2 - Secondary
  Color: #111827 (gray/900, text/primary)

Prefix Icon (optional):
  Size: 16px × 16px
  Color: #4B5563 (gray/600)
  Margin Left: 12px

Suffix Icon (optional):
  Size: 16px × 16px
  Color: #4B5563 (gray/600)
  Margin Right: 12px
```

**Variant: Focus**
```
Input Field:
  Border: 2px #16A362 (primary/600, Inside)
  Shadow: 0px 0px 0px 3px #E6F8EE (primary/100, Focus Ring)
  Fill: #FFFFFF (white) 유지
```

**Variant: Error**
```
Input Field:
  Border:
    Width: 2px
    Color: #EF4444 (semantic/red)
    Opacity: 100%
  
  Shadow:
    Type: Drop Shadow
    X: 0px
    Y: 0px
    Blur: 0px
    Spread: 3px
    Color: rgba(239, 68, 68, 0.1) (red-100)

Helper Text (Input 하단):
  Text Style: Caption - Small
  Font: Pretendard
  Weight: 400
  Size: 12px
  Line Height: 16px
  Color: #EF4444 (semantic/red)
  Margin Top: 4px
  Alignment: Left
```

**Variant: Disabled**
```
Input Field:
  Fill:
    Color: #F9FAFB (gray/50)
    Opacity: 100%
  
  Border:
    Width: 1px
    Color: #E5E7EB (gray/200)
  
  Placeholder Text:
    Color: #9CA3AF (gray/400)
    Opacity: 60%
  
  Cursor: not-allowed (개발 시)
```

**Label (Optional, Input 위에 표시):**
```
Label Text:
  Text Style: Body2 - Secondary
  Font: Pretendard
  Weight: 400
  Size: 14px
  Line Height: 20px
  Color: #111827 (gray/900, text/primary)
  Margin Bottom: 4px
  Alignment: Left
```

---

#### 4.1.3 Badge (Chip)

**Component Structure:**
```
Badge (Auto Layout, Horizontal)
├── Dot (Optional, 6x6 Circle)
└── Label (Text)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Variant` | `Default` / `Primary` / `Warning` / `Success` |
| `Dot` | `True` / `False` |

---

**Variant: Default**
```
Frame:
  Direction: Horizontal
  Gap: 4px (Dot-Label 사이)
  Padding: 4px (상하), 8px (좌우)
  Width: Auto
  Height: Auto (Min: 24px)
  Fill: #F3F4F6 (gray/100)
  Border Radius: 4px (All)

Label:
  Text Style: Body2 - Secondary
  Color: #4B5563 (gray/600, text/tertiary)

Dot (optional):
  Size: 6px × 6px
  Fill: #4B5563 (gray/600)
  Border Radius: 50% (Circle)
  Margin Right: 4px
```

**Variant: Primary**
```
Frame:
  Fill: #E6F8EE (primary/100)
  Border Radius: 4px (All)

Label:
  Text Style: Body2 - Secondary
  Color: #16A362 (primary/600)

Dot (optional):
  Fill: #16A362 (primary/600)
  Size: 6px × 6px
```

**Variant: Warning**
```
Frame:
  Fill: rgba(245, 158, 11, 0.1) (Yellow-100)
  Border Radius: 4px (All)

Label:
  Text Style: Body2 - Secondary
  Color: #F59E0B (semantic/yellow)

Dot (optional):
  Fill: #F59E0B (semantic/yellow)
```

**Variant: Success**
```
Frame:
  Fill: rgba(16, 185, 129, 0.1) (Green-100)
  Border Radius: 4px (All)

Label:
  Text Style: Body2 - Secondary
  Color: #10B981 (semantic/green)

Dot (optional):
  Fill: #10B981 (semantic/green)
```

**Variant: Error**
```
Frame:
  Fill: rgba(239, 68, 68, 0.1) (Red-100)
  Border Radius: 4px (All)

Label:
  Text Style: Body2 - Secondary
  Color: #EF4444 (semantic/red)

Dot (optional):
  Fill: #EF4444 (semantic/red)
```

---

#### 4.1.4 Icon Button

**Component Structure:**
```
Icon Button (Frame)
└── Icon (20x20)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Size` | `Small` (32px) / `Medium` (40px) |
| `State` | `Default` / `Hover` / `Active` |

**Variant: Medium / Default**
```
Frame:
  Width: 40px (고정)
  Height: 40px (고정)
  Fill: Transparent
  Border Radius: 8px (All)
  Alignment: Center (Icon 중앙 정렬)

Icon:
  Size: 20px × 20px
  Color: #4B5563 (gray/600)
  Stroke Width: 1.75px (Lucide)
```

**Variant: Medium / Hover**
```
Frame:
  Fill: #F3F4F6 (gray/100)

Icon:
  Color: #16A362 (primary/600)
```

**Variant: Medium / Active**
```
Frame:
  Fill: #E6F8EE (primary/100)

Icon:
  Color: #16A362 (primary/600)
```

**Variant: Small (32px)**
```
Frame:
  Width: 32px
  Height: 32px
  Border Radius: 6px
  
  (나머지 속성은 Medium과 동일)
  
Icon:
  Size: 16px × 16px (Small은 작은 아이콘)
```

---

#### 4.1.5 Toast (Notification)

**Component Structure:**
```
Toast (Auto Layout, Horizontal)
├── Icon (Optional, 16x16)
├── Message (Body2, Flex Grow)
└── Close Button (Optional, Icon Button 16x16)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Variant` | `Success` / `Error` / `Warning` / `Info` |
| `Duration` | `Auto` (4초) / `Manual` |
| `Icon` | `True` / `False` |
| `Close Button` | `True` / `False` |

**Variant: Success**
```
Frame:
  Direction: Horizontal
  Gap: 8px (Icon-Message 사이)
  Padding: 12px (상하), 16px (좌우)
  Width: Auto (Min: 300px, Max: 500px)
  Height: Auto (Min: 48px)
  Fill: rgba(16, 185, 129, 0.1) (Green-100)
  Border: 1px #10B981 (semantic/green, Inside)
  Border Radius: 8px (All)
  Shadow: 0px 4px 12px rgba(0, 0, 0, 0.1)

Icon:
  Size: 16px × 16px
  Color: #10B981 (semantic/green)
  Stroke Width: 1.75px (Lucide)

Message:
  Text Style: Body2 - Secondary
  Color: #10B981 (semantic/green)
  Flex: 1 (Grow)

Close Button (Optional):
  Size: 16px × 16px
  Icon: X
  Color: #10B981 (semantic/green)
  Opacity: 60% (Hover 시 100%)
```

**Variant: Error**
```
Frame:
  Fill:
    Color: rgba(239, 68, 68, 0.1) (Red-100)
    Opacity: 100%
  
  Border:
    Width: 1px
    Color: #EF4444 (semantic/red)
    Opacity: 100%
  
  Border Radius: 8px
  Shadow: 동일 (Success와 동일한 Shadow 값)

Icon:
  Size: 16px × 16px
  Color: #EF4444 (semantic/red)
  Component: AlertCircle (Lucide)

Message:
  Text Style: Body2 - Secondary
  Color: #EF4444 (semantic/red)
```

**Variant: Warning**
```
Frame:
  Fill:
    Color: rgba(245, 158, 11, 0.1) (Yellow-100)
    Opacity: 100%
  
  Border:
    Width: 1px
    Color: #F59E0B (semantic/yellow)
    Opacity: 100%
  
  Border Radius: 8px
  Shadow: 동일

Icon:
  Size: 16px × 16px
  Color: #F59E0B (semantic/yellow)
  Component: AlertTriangle (Lucide)

Message:
  Text Style: Body2 - Secondary
  Color: #F59E0B (semantic/yellow)
```

**Variant: Info**
```
Frame:
  Fill:
    Color: #E6F8EE (primary/100)
    Opacity: 100%
  
  Border:
    Width: 1px
    Color: #16A362 (primary/600)
    Opacity: 100%
  
  Border Radius: 8px
  Shadow: 동일

Icon:
  Size: 16px × 16px
  Color: #16A362 (primary/600)
  Component: Info (Lucide)

Message:
  Text Style: Body2 - Secondary
  Color: #16A362 (primary/600)
```

**레이아웃 & Position:**
- Gap: 8px (Icon-Message 사이), 12px (Message-Close Button 사이)
- Min Width: 300px
- Max Width: 500px
- Position: Fixed (개발 시)
  - Top: 24px
  - Left: 50%
  - Transform: translateX(-50%) (중앙 정렬)
- Z-index: 9999 (최상단)

**애니메이션 (개발 시):**
- 등장: Slide Down (0.25s ease-out)
  - From: translateY(-20px), opacity: 0
  - To: translateY(0), opacity: 1
- 사라짐: Fade Out (0.2s ease-in)
  - From: opacity: 1
  - To: opacity: 0, translateY(-10px)
- Auto-dismiss: 4초 후 자동 사라짐 (Success/Info만)

---

#### 4.1.6 Modal (Dialog)

**Component Structure:**
```
Modal Overlay (Fixed, Full Screen, Auto Layout Center)
└── Modal Content (Auto Layout, Vertical)
    ├── Header (Auto Layout, Horizontal)
    │   ├── Title (H3)
    │   └── Close Button (Icon Button, 32x32)
    ├── Divider (Optional, 1px)
    ├── Body (Auto Layout, Vertical)
    │   └── [Content Slot]
    └── Footer (Optional, Auto Layout, Horizontal)
        ├── Cancel Button (Secondary)
        └── Confirm Button (Primary)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Size` | `Small` (400px) / `Medium` (600px) / `Large` (800px) |
| `Footer` | `True` / `False` |
| `Close on Overlay Click` | `True` / `False` |

**Overlay:**
```
Frame:
  Type: Frame (Fixed Position)
  Width: 100vw (Full Screen)
  Height: 100vh (Full Screen)
  Position: Fixed (개발 시)
  Z-index: 9998
  
  Fill:
    Color: rgba(0, 0, 0, 0.5)
    Opacity: 100%
    (RGB: 0, 0, 0 / Alpha: 0.5)
  
  Backdrop Filter (개발 시):
    Blur: 4px (Optional, 성능 고려)
  
  Alignment:
    Content: Center (Modal Content 중앙 정렬)
```

**Modal Content (Medium - 600px):**
```
Frame:
  Direction: Vertical
  Gap: 0px
  Padding: 0px (All, Header/Body/Footer에서 개별 패딩)
  Width: 600px (고정, Max: 90vw 반응형)
  Height: Auto (Min: 200px, Max: 80vh 스크롤)
  Fill: #FFFFFF (white, background/card)
  Border Radius: 12px (All)
  Shadow: 0px 20px 25px rgba(0, 0, 0, 0.15)
  Position: Center (Overlay 내부)
```

**Modal Content (Small - 400px):**
```
Frame:
  Width: 400px
  Max Width: 90vw
  (나머지 속성은 Medium과 동일)
```

**Modal Content (Large - 800px):**
```
Frame:
  Width: 800px
  Max Width: 90vw
  (나머지 속성은 Medium과 동일)
```

**Header:**
```
Frame:
  Direction: Horizontal
  Gap: 12px
  Padding: 24px (좌우), 24px (상), 16px (하)
  Width: 100% (Fill Container)
  Height: Auto (Min: 64px)
  Fill: Transparent
  
Border Bottom (Footer 있을 때만, 별도 레이어):
  Width: 100%
  Height: 1px
  Fill: #E5E7EB (gray/200)
  Position: Bottom

Title:
  Text Style: H3 - Card Title
  Color: #111827 (gray/900)
  Flex: 1 (Grow)

Close Button:
  Component: Icon Button (Medium, 40px)
  Icon: X (20px × 20px)
  Color: #4B5563 (gray/600)
```

**Divider (Optional, Header-Body 사이):**
```
Type: Rectangle
Width: 100%
Height: 1px
Fill: #E5E7EB (gray/200)
Margin: 0px
Opacity: 100%
```

**Body:**
```
Frame:
  Direction: Vertical
  Gap: 16px
  Padding: 24px (All)
  Width: 100% (Fill Container)
  Height: Auto (Min: 100px)
  Fill: Transparent
  Overflow Y: Auto (개발 시 스크롤)
```

**Footer:**
```
Frame:
  Direction: Horizontal
  Gap: 8px (버튼들 사이)
  Padding: 16px (상), 24px (좌우), 24px (하)
  Width: 100% (Fill Container)
  Height: Auto (Min: 72px)
  Fill: Transparent
  Justify: Flex End (우측 정렬)
  
Border Top (별도 레이어):
  Width: 100%
  Height: 1px
  Fill: #E5E7EB (gray/200)
  Position: Top

Buttons:
  Cancel: Secondary / Medium
  Confirm: Primary / Medium
  Width: Auto
```

**애니메이션:**
- 등장: Fade In (0.3s) + Scale (0.95 → 1.0, cubic-bezier(0.4, 0, 0.2, 1))
- 사라짐: Fade Out (0.2s) + Scale (1.0 → 0.95)

**접근성:**
- ESC 키로 닫기
- Focus Trap (Modal 내부에만 포커스)
- aria-modal="true"
- aria-labelledby="modal-title"

---

#### 4.1.7 Skeleton (Loading Placeholder)

**Component Structure:**
```
Skeleton (Frame)
└── Shimmer Effect (Rectangle with Gradient)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Variant` | `Text` / `Circle` / `Rectangle` |
| `Width` | `Auto` / `Fixed` (px) |
| `Height` | `Auto` / `Fixed` (px) |

**Variant: Text**
```
Frame:
  Type: Rectangle
  Width: 100% (Fill Container, Min: 60px)
  Height: 16px (Body1 기준)
  Fill: #E5E7EB (gray/200)
  Border Radius: 4px (All)
  
Effects (개발 시):
  Shimmer 애니메이션 (CSS로 구현, Figma에서는 불가)
```

**Variant: Circle (Avatar Skeleton)**
```
Frame:
  Type: Ellipse
  Width: 40px (고정)
  Height: 40px (고정)
  Fill: #E5E7EB (gray/200)
  Border Radius: 50% (Circle)
  Effects: Shimmer (개발 시 CSS)
```

**Variant: Rectangle (Card/Image Skeleton)**
```
Frame:
  Type: Rectangle
  Width: 가변 (예: 360px, Min: 100px)
  Height: 가변 (예: 200px, Min: 60px)
  Fill: #E5E7EB (gray/200)
  Border Radius: 8px (Card는 12px, All)
  Effects: Shimmer (개발 시 CSS)
```

**Shimmer 애니메이션 (개발 시 CSS):**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #E5E7EB 0%,
    #F3F4F6 50%,
    #E5E7EB 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 1.5s infinite linear;
}
```

**Figma에서 Skeleton 표현:**
- 실제 Shimmer 애니메이션은 불가
- 대신: Fill을 gray/200으로 설정하고, 개발자에게 "Shimmer 효과 적용" 명시
- 또는: Gradient Overlay로 약간의 깊이감 표현 (선택사항)

**사용 예시:**
- Text Skeleton: 3줄 (16px, 20px, 16px 높이)
- Card Skeleton: Rectangle (360x200px)
- Avatar Skeleton: Circle (40x40px)

---

### 4.2 Molecules (조합 컴포넌트)

---

#### 4.2.1 Card

**Component Structure:**
```
Card (Auto Layout, Vertical)
├── Header (Auto Layout, Horizontal)
│   ├── Title (H3)
│   └── Action Button (Optional)
├── Divider (1px Line)
├── Content (Auto Layout, Vertical)
│   └── [Slot for Content]
└── Footer (Optional)
```

**Properties:**
| Property | Options |
|----------|---------|
| `Variant` | `Default` / `Hover` / `Selected` |
| `Header` | `True` / `False` |
| `Footer` | `True` / `False` |

---

**Variant: Default**
```
Frame:
  Direction: Vertical
  Gap: 16px (Header-Content 사이)
  Padding: 20px (All)
  Width: Auto (Fill Container 또는 고정)
  Height: Auto (Min: 100px)
  Fill: #FFFFFF (white, background/card)
  Border: 1px #E5E7EB (gray/200, Inside)
  Border Radius: 12px (All)
  Shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)

Header (Optional):
  Padding: 0px (Card Padding 사용)
  Gap: 12px (Title-Action Button 사이)
  Height: Auto
  Border Bottom: None (Divider 사용 시)

Divider (Optional):
  Type: Rectangle
  Width: 100% (Fill Container)
  Height: 1px
  Fill: #E5E7EB (gray/200)
  Margin: 0px (Card Padding 내부)
  Opacity: 100%

Content:
  Padding: 0px (Card Padding 사용)
  Gap: 16px (세로 간격)

Footer (Optional):
  Padding: 0px (Card Padding 사용)
  Gap: 8px (버튼들 사이)
  Height: Auto
  Border Top: None (Divider 사용 시)
```

**Variant: Hover**
```
Frame:
  Shadow: 0px 4px 12px rgba(0, 0, 0, 0.15)
  Transform: Scale 1.02 (Prototype만, 실제는 100%)
  (Border, Fill은 Default와 동일)
```

**Variant: Selected**
```
Frame:
  Border: 2px #16A362 (primary/600, Inside)
  Shadow: 0px 0px 0px 3px #E6F8EE (primary/100, Focus Ring)
  Fill: #FFFFFF (white) 유지
```

**Variant: Clickable (Card가 클릭 가능한 경우)**
```
Frame:
  Cursor: pointer (개발 시)
  
  Hover State:
    Shadow: Hover Variant와 동일
    Transform: Scale 1.02 (Prototype)
```

---

#### 4.2.2 Table Row

**Component Structure:**
```
Table Row (Auto Layout, Horizontal)
├── Cell 1 (Text)
├── Cell 2 (Text)
├── Cell 3 (Number)
└── Cell 4 (Badge)
```

**Properties:**
| Property | Options |
|----------|---------|
| `State` | `Default` / `Hover` / `Selected` |

**Variant: Default**
```
Frame:
  Direction: Horizontal
  Gap: 16px (Cell들 사이)
  Padding: 0px 16px (좌우만)
  Width: 100% (Fill Container)
  Height: 48px (고정)
  Fill: Transparent
  
Border Bottom (별도 레이어):
  Width: 100%
  Height: 1px
  Fill: #E5E7EB (gray/200)
  Position: Bottom

Cell (각 컬럼):
  Type: Auto Layout (Horizontal) 또는 Text
  Padding: 0px
  Gap: 8px (Icon-Text 사이, 있을 경우)
  Alignment: Left (기본), Right (숫자 컬럼)
  Min Width: 80px (컬럼별로 다를 수 있음)
  
  Text:
    Text Style: Body2 - Secondary (기본)
    Color: #111827 (gray/900, text/primary)
    Alignment: Left 또는 Right
```

**Variant: Hover**
```
Frame:
  Fill: #F3F4F6 (gray/100, background/hover)
  (Border Bottom은 Default와 동일)
```

**Variant: Selected**
```
Frame:
  Fill: #E6F8EE (primary/100)
  (Border Bottom은 Default와 동일)
  
Left Indicator (별도 Rectangle):
  Width: 3px
  Height: 100% (48px)
  Fill: #16A362 (primary/600)
  Position: Left
```

**Table Header Row (별도 컴포넌트):**
```
Frame:
  Height: 40px (일반 Row보다 작음)
  
  Fill:
    Color: #F9FAFB (gray/50)
    Opacity: 100%
  
  Border Bottom:
    Height: 2px (일반 Row보다 두꺼움)
    Color: #E5E7EB (gray/200)
  
  Cell Text:
    Text Style: Caption - Small
    Font: Pretendard
    Weight: 600 (SemiBold)
    Size: 12px
    Line Height: 16px
    Color: #4B5563 (gray/600, text/tertiary)
```

---

#### 4.2.3 News Card

**Component Structure:**
```
News Card (Auto Layout, Vertical)
├── Thumbnail (Image, 16:9)
├── Content (Auto Layout, Vertical)
│   ├── Title (H3, 2줄 말줄임)
│   ├── Summary (Body2, 1줄 말줄임)
│   ├── Meta (Auto Layout, Horizontal)
│   │   ├── Source (Caption)
│   │   ├── Dot Separator
│   │   └── Time (Caption)
│   └── Tags (Auto Layout, Horizontal, Wrap)
│       ├── Badge 1
│       └── Badge 2
```

**Size:** Width 360px (가변 가능)

**Variant: Default**
```
Frame:
  Direction: Vertical
  Gap: 0px (Thumbnail-Content 사이)
  Padding: 0px (All)
  Width: 360px (고정, 가변 가능)
  Height: Auto (Min: 300px)
  Fill: #FFFFFF (white, background/card)
  Border Radius: 12px (All)
  Shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)

Thumbnail (Image):
  Type: Rectangle
  Width: 100% (Fill Container)
  Height: 200px (고정, 16:9 비율)
  Border Radius:
    Top Left: 12px
    Top Right: 12px
    Bottom Left: 0px
    Bottom Right: 0px
  Fill:
    Type: Image (또는 Placeholder)
    Placeholder Color: #F3F4F6 (gray/100)
  Object Fit: Cover

Content (Frame):
  Type: Frame (Auto Layout, Vertical)
  Direction: Vertical
  Gap: 8px
  Padding: 16px (All)
  Width: 100% (Fill Container)
  Height: Auto

Title:
  Text Style: H3 - Card Title
  Font: Pretendard
  Weight: 600 (SemiBold)
  Size: 18px
  Line Height: 26px
  Letter Spacing: 0px
  Color: #111827 (gray/900, text/primary)
  Max Lines: 2
  Text Overflow: Ellipsis
  Alignment: Left

Summary:
  Text Style: Body2 - Secondary
  Font: Pretendard
  Weight: 400
  Size: 14px
  Line Height: 20px
  Color: #374151 (gray/700, text/secondary)
  Max Lines: 1
  Text Overflow: Ellipsis

Meta (Frame, Auto Layout Horizontal):
  Gap: 8px
  Padding: 0px
  Alignment: Left
  
  Source:
    Text Style: Caption - Small
    Color: #4B5563 (gray/600, text/tertiary)
  
  Dot Separator:
    Type: Circle
    Size: 2px × 2px
    Fill: #9CA3AF (gray/400)
    Margin: 0px 4px
  
  Time:
    Text Style: Caption - Small
    Color: #4B5563 (gray/600, text/tertiary)

Tags (Frame, Auto Layout Horizontal, Wrap):
  Gap: 6px
  Padding: 0px
  Margin Top: 8px
  Wrap: On
  
  Badge:
    Component: Badge (Default Variant)
    Size: Auto
```

**Variant: Hover**
```
Frame:
  Shadow: 0px 4px 12px rgba(0, 0, 0, 0.15)
  Transform: Scale 1.02 (Prototype만)

Title:
  Color: #16A362 (primary/600)
  (나머지는 Default와 동일)
```

---

### 4.3 Organisms (복합 컴포넌트)

---

#### 4.3.1 Sidebar (Navigation)

**Component Structure:**
```
Sidebar (Auto Layout, Vertical)
├── Logo Area (80px Height)
│   └── Logo + App Name
├── Navigation Items (Auto Layout, Vertical)
│   ├── Nav Item (Dashboard) [Default/Active]
│   ├── Nav Item (News)
│   ├── Nav Item (Education)
│   ├── Nav Item (Explore)
│   ├── Nav Item (Portfolio)
│   ├── Divider
│   ├── Nav Item (Favorites)
│   ├── Nav Item (History)
│   ├── Nav Item (Hot Issue)
│   └── Divider
└── Settings (Bottom Aligned)
    └── Nav Item (Settings)
```

**Sidebar Size:**
```
Frame:
  Direction: Vertical
  Gap: 0px
  Padding: 0px (All)
  Width: 240px (Expanded) / 72px (Collapsed, Phase 2)
  Height: 100vh (또는 1024px)
  Min Height: 600px
  Fill: #FFFFFF (white, background/card)
  
Border Right (별도 레이어):
  Width: 1px
  Height: 100%
  Fill: #E5E7EB (gray/200)
  Position: Right
```

---

**Nav Item Component:**
```
Frame:
  Type: Frame (Auto Layout, Horizontal)
  Direction: Horizontal
  Gap: 12px (Icon-Label 사이)
  Padding: 8px (상하), 16px (좌우)
  Width: 100% (Fill Container)
  Height: 40px (고정)
  Min Width: 200px
  
  Border Radius:
    All: 8px
  
  Properties:
    State: Default / Hover / Active

Variant: Default
  Fill:
    Color: Transparent
    Opacity: 0%
  
  Border: None
  
  Icon:
    Size: 20px × 20px (정사각형)
    Color: #4B5563 (gray/600)
    Stroke Width: 1.75px (Lucide Icons)
    Opacity: 100%
  
  Label:
    Text Style: Body2 - Secondary
    Font: Pretendard
    Weight: 400 (Regular)
    Size: 14px
    Line Height: 20px
    Color: #374151 (gray/700, text/secondary)
    Alignment: Left

Variant: Hover
  Fill: #F3F4F6 (gray/100, background/hover)
  
  Icon:
    Color: #16A362 (primary/600)
  
  Label:
    Color: #111827 (gray/900, text/primary)

Variant: Active
  Fill: #E6F8EE (primary/100)
  
  Icon:
    Color: #16A362 (primary/600)
  
  Label:
    Text Style: Body2 - Secondary
    Color: #16A362 (primary/600)
    Weight: 600 (SemiBold)
  
Left Indicator (별도 Rectangle):
  Width: 3px
  Height: 100% (40px)
  Fill: #16A362 (primary/600)
  Position: Left
  Border Radius: 0px 2px 2px 0px (좌측만 직선)
```

**Logo Area:**
```
Frame:
  Type: Frame (Auto Layout, Horizontal)
  Direction: Horizontal
  Gap: 12px
  Padding: 20px 16px
  Width: 100%
  Height: 80px (고정)
  
  Fill: Transparent
  Border Bottom:
    Width: 1px
    Color: #E5E7EB (gray/200)
  
  Logo:
    Size: 32px × 32px
    Border Radius: 8px
  
  App Name:
    Text Style: H2 - Section Title
    Font: Pretendard
    Weight: 700 (Bold)
    Size: 20px
    Color: #111827 (gray/900)
```

**Divider (Navigation 내부):**
```
Type: Rectangle
Width: 100% (Fill Container)
Height: 1px
Fill: #E5E7EB (gray/200)
Margin: 8px 16px (상하, 좌우)
Opacity: 100%
```

---

#### 4.3.2 Header (Market Summary)

**Component Structure:**
```
Header (Auto Layout, Horizontal)
├── KOSPI Card
│   ├── Label ("코스피")
│   ├── Price (Number/Large)
│   └── Change (Number/Medium + Badge)
├── KOSDAQ Card
│   └── (동일 구조)
├── USD/KRW Card
│   └── (동일 구조)
└── Search Bar (Input)
```

**Header Size:**
```
Frame:
  Direction: Horizontal
  Gap: 24px (Market Cards 사이, Search Bar와의 간격)
  Padding: 16px (상하), 32px (좌우)
  Width: 100% (Fill Container)
  Height: 80px (고정)
  Fill: #FFFFFF (white, background/card)
  
Border Bottom (별도 레이어):
  Width: 100%
  Height: 1px
  Fill: #E5E7EB (gray/200)
  Position: Bottom
```

**Market Card (KOSPI/KOSDAQ/USD-KRW):**
```
Frame:
  Type: Frame (Auto Layout, Vertical)
  Direction: Vertical
  Gap: 4px
  Padding: 0px
  Width: Auto (내용에 맞춤, Min: 120px)
  Height: Auto (Min: 60px)
  
  Fill: Transparent
  Border: None

Label:
  Text Style: Caption - Small
  Font: Pretendard
  Weight: 400
  Size: 12px
  Line Height: 16px
  Color: #4B5563 (gray/600, text/tertiary)
  Alignment: Left

Price:
  Text Style: Number/Large
  Font: Inter
  Weight: 600 (SemiBold)
  Size: 18px
  Line Height: 26px
  Letter Spacing: 0px
  Font Feature: Tabular Numbers
  Color: #111827 (gray/900, text/primary)
  Alignment: Left

Change (Frame, Auto Layout Horizontal):
  Gap: 4px
  Padding: 0px
  Alignment: Left
  
  Change Value:
    Text Style: Number/Medium
    Font: Inter
    Weight: 400
    Size: 16px
    Line Height: 24px
    Font Feature: Tabular Numbers
    Color: #EF4444 (semantic/red, 상승) 또는 #1D4ED8 (semantic/blue, 하락)
  
  Badge:
    Component: Badge
    Variant: Primary (상승) 또는 Default (하락)
    Size: Auto
    Padding: 2px 6px
```

**Search Bar (Input):**
```
Component: Input
Variant: Default
Width: 300px (고정 또는 Flex Grow)
Height: 40px
Placeholder: "종목명 또는 코드 검색"
Prefix Icon: Search (16px × 16px)
```

---

#### 4.3.3 AI Summary Panel

**Component Structure:**
```
AI Panel (Auto Layout, Vertical)
├── Header (Auto Layout, Horizontal)
│   ├── Icon (Sparkles) + Title ("AI 요약")
│   └── Close Button (Icon Button)
├── Divider
├── Loading State (Optional)
│   ├── Skeleton Lines (3개)
│   └── Text ("AI가 분석 중입니다...")
├── Content (Auto Layout, Vertical)
│   ├── Section: 한 문장 요약 (H3)
│   ├── Section: 주요 이슈 (Bullet List)
│   ├── Section: 가격 해석 (Body2)
│   ├── Warning Card: 리스크 요약
│   └── CTA: Education 이동 (Button)
```

**Panel Size:**
```
Frame:
  Direction: Vertical
  Gap: 16px
  Padding: 24px (All)
  Width: 500px (고정) 또는 35% (Dashboard 기준)
  Height: 100vh (또는 1024px)
  Min Width: 400px
  Max Width: 600px
  Fill: #FFFFFF (white, background/card)
  
Border Left (별도 레이어):
  Width: 1px
  Height: 100%
  Fill: #E5E7EB (gray/200)
  Position: Left
  
Shadow (선택사항):
  0px 0px 8px rgba(0, 0, 0, 0.05) (좌측 그림자)
```

**Header (AI Panel):**
```
Frame:
  Type: Frame (Auto Layout, Horizontal)
  Direction: Horizontal
  Gap: 12px
  Padding: 0px
  Width: 100%
  Height: Auto
  
  Fill: Transparent

Icon:
  Size: 20px × 20px
  Color: #16A362 (primary/600)
  Stroke Width: 1.75px

Title:
  Text Style: H3 - Card Title
  Font: Pretendard
  Weight: 600
  Size: 18px
  Color: #111827 (gray/900)
  Flex: 1 (Grow)

Close Button:
  Component: Icon Button
  Size: Medium (40px)
  Variant: Default
  Icon: X (20px × 20px)
```

**Content Sections:**
```
한 문장 요약:
  Text Style: H3 - Card Title
  Font: Pretendard
  Weight: 700 (Bold)
  Size: 18px
  Line Height: 26px
  Color: #111827 (gray/900)
  Margin Bottom: 12px

주요 이슈 (Bullet List):
  Frame: Auto Layout Vertical
  Gap: 8px
  Padding: 0px
  
  Bullet:
    Type: Circle
    Size: 4px × 4px
    Fill: #16A362 (primary/600)
    Margin Right: 8px
  
  List Item:
    Text Style: Body2 - Secondary
    Font: Pretendard
    Size: 14px
    Color: #374151 (gray/700)
    Alignment: Left

가격 해석:
  Text Style: Body2 - Secondary
  Font: Pretendard
  Size: 14px
  Color: #374151 (gray/700)
  Line Height: 20px
  Margin Top: 8px
```

**Warning Card:**
```
Frame:
  Direction: Horizontal
  Gap: 8px
  Padding: 12px (All)
  Width: 100% (Fill Container)
  Height: Auto (Min: 48px)
  Fill: rgba(245, 158, 11, 0.1) (Yellow-100)
  Border: 1px #F59E0B (semantic/yellow, Inside)
  Border Radius: 8px (All)

Icon:
  Size: 16px × 16px
  Color: #F59E0B (semantic/yellow)
  Stroke Width: 1.75px (Lucide)

Text:
  Text Style: Body2 - Secondary
  Color: #F59E0B (semantic/yellow)
  Flex: 1 (Grow)
```

**CTA Button:**
```
Component: Button
Variant: Primary / Medium / Default
Width: 100% (Fill Container)
Text: "'{개념}'에 대해 더 알아보기"
Icon: GraduationCap (Left, Optional)
```

---

## 5. Layout System

### 5.1 Grid Setup

**Desktop (1440px)**
```
Columns: 12
Margin: 80px (Left/Right)
Gutter: 24px
```

**적용 방법:**
1. Frame 선택 (1440x1024)
2. 우측 패널 → Layout Grid
3. `+` 클릭
4. Type: `Columns`
5. Count: `12`
6. Margin: `80`
7. Gutter: `24`
8. Color: `#FF0000` (Red, 10% Opacity)

---

**Tablet (768px)**
```
Columns: 8
Margin: 40px
Gutter: 16px
```

**Mobile (375px)**
```
Columns: 4
Margin: 20px
Gutter: 12px
```

---

### 5.2 Auto Layout 가이드

**기본 원칙:**
1. **모든 컴포넌트는 Auto Layout 사용**
2. **Padding/Gap은 Spacing Variables 사용**
3. **Text는 Fill Container (Horizontal Resizing)**

---

**Auto Layout 패턴:**

#### 수평 정렬 (Horizontal)
```
사용 케이스: Button + Icon, Header 항목들

설정:
  Direction: Horizontal
  Gap: {spacing/sm} (8px)
  Padding: {spacing/md} (16px)
  Alignment: Center (Vertical)
```

#### 수직 정렬 (Vertical)
```
사용 케이스: Card 내부, Form 필드들

설정:
  Direction: Vertical
  Gap: {spacing/md} (16px)
  Padding: {spacing/lg} (24px)
  Alignment: Left (Horizontal)
```

#### Wrap (Flow Layout)
```
사용 케이스: Tag 목록, Badge 그룹

설정:
  Direction: Horizontal
  Wrap: On
  Gap: {spacing/sm} (8px)
```

---

### 5.3 Spacing Scale 적용

**일관성 있는 간격:**
| 요소 간격 | Spacing Token | 사용 예시 |
|----------|---------------|-----------|
| 아이콘-텍스트 | `xs` (4px) | Button 내부 |
| 작은 요소 | `sm` (8px) | Badge Gap |
| 기본 간격 | `md` (16px) | Card 내부 Content |
| 섹션 간격 | `lg` (24px) | Card 사이 |
| 큰 섹션 | `xl` (32px) | Page Section |
| 페이지 여백 | `2xl` (48px) | 상단 Title 아래 |

---

### 5.4 Breakpoint System

**Desktop First 접근:**
```
Desktop: ≥ 1440px (기본)
Tablet: 768px ~ 1439px
Mobile: < 768px
```

**Breakpoint Variables (Figma에서 Number Variable로 생성):**
| Variable Name | Value | 용도 |
|---------------|-------|------|
| `breakpoint/desktop` | `1440` | Desktop 시작점 |
| `breakpoint/tablet` | `768` | Tablet 시작점 |
| `breakpoint/mobile` | `375` | Mobile 기준 너비 |

**레이아웃 변형 규칙:**

#### Desktop (≥ 1440px)
```
- Sidebar: 240px (Expanded)
- Main Content: Auto (Fill)
- AI Panel: 500px (Optional)
- Grid: 12 columns
- Margin: 80px (좌우)
- Gutter: 24px
```

#### Tablet (768px ~ 1439px)
```
- Sidebar: 72px (Collapsed, 아이콘만)
- Main Content: Auto (Fill)
- AI Panel: 400px (Optional, 오버레이)
- Grid: 8 columns
- Margin: 40px (좌우)
- Gutter: 16px

변형 예시:
- Dashboard: Stock List 30% → Chart 70%
- News Grid: 3열 → 2열
- Education Q&A: 좌우 분할 → 상하 분할
```

#### Mobile (< 768px)
```
- Sidebar: Drawer (240px, 오버레이)
- Main Content: 100% (Full Width)
- AI Panel: Bottom Sheet (Full Width, 60vh)
- Grid: 4 columns
- Margin: 20px (좌우)
- Gutter: 12px

변형 예시:
- Dashboard: Stock List → Full Width (차트는 하단)
- News Grid: 2열 → 1열
- Portfolio Charts: 가로 → 세로 스택
```

**컴포넌트 반응형 규칙:**

| 컴포넌트 | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| **Button** | 40px 높이 | 40px 높이 | 44px 높이 (터치 타겟) |
| **Input** | 40px 높이 | 40px 높이 | 44px 높이 |
| **Card Padding** | 20px~24px | 16px~20px | 16px |
| **Modal Width** | 600px | 90vw (Max 600px) | 100vw (Full) |
| **Toast** | 300~500px | 280~400px | 90vw (Max 400px) |
| **Table** | Horizontal Scroll | Horizontal Scroll | Card View로 변환 |

**Figma에서 반응형 테스트:**
1. Frame을 3개 생성 (Desktop, Tablet, Mobile)
2. 각 Frame에 동일 컴포넌트 배치
3. Constraints 설정:
   - Desktop: Fixed
   - Tablet: Left/Right + Top
   - Mobile: Left/Right + Top/Bottom
4. Auto Layout의 Min/Max Width 활용

---

## 6. Page Templates

### 6.1 Dashboard Template

**Frame Size:** 1440 x 1024

**레이아웃 구조:**
```
Dashboard Frame (Auto Layout, Horizontal)
├── Sidebar (240px, Fixed)
└── Main Area (1200px, Auto Layout, Vertical)
    ├── Header (Market Summary, 80px Fixed)
    └── Content (Auto Layout, Horizontal)
        ├── Stock List (480px, Fixed Width)
        │   ├── Search Input
        │   ├── Sort Options
        │   └── Stock Table (Virtual Scroll)
        ├── Chart Area (720px, Fill)
        │   ├── Chart Tabs (1D/1W/1M)
        │   ├── Candlestick Chart
        │   └── Related News (3 Cards)
        └── AI Panel (500px, Optional, Slide from Right)
```

**AI 작업 시 단계별 생성 방법:**

**Step 1: 최상위 Page Frame 생성**
```
1. F 단축키 또는 Frame Tool 선택
2. Frame Type: Desktop (1440 x 1024)
3. Name: "Dashboard" (PascalCase, 접미사 없음)
4. Auto Layout: Horizontal
5. Gap: 0px (Sidebar와 Main Area 사이 간격 없음)
6. Padding: 0px (전체 페이지이므로)
```

**Step 2: Sidebar Frame 생성**
```
1. Dashboard Frame 내부에서 F 단축키
2. Name: "Sidebar" (Component이므로 접미사 없음)
3. Width: 240px (Fixed)
4. Height: Fill Container (100vh)
5. Auto Layout: Vertical
6. Gap: 0px (Nav Items 사이는 개별 설정)
7. Constraints: Left, Top & Bottom
8. 우클릭 → "Create Component" (재사용)
```

**Step 3: Main Area Frame 생성**
```
1. Dashboard Frame 내부에서 F 단축키
2. Name: "MainAreaContainer" (Container 접미사)
3. Width: Fill Container (나머지 공간 채움)
4. Height: Fill Container
5. Auto Layout: Vertical
6. Gap: 0px
7. Padding: 0px
8. Constraints: Left & Right, Top & Bottom
```

**Step 4: Header Section 생성**
```
1. MainAreaContainer 내부에서 F 단축키
2. Name: "HeaderSection" (Section 접미사)
3. Width: Fill Container
4. Height: 80px (Fixed)
5. Auto Layout: Horizontal
6. Gap: spacing/lg (24px, Market Cards 사이)
7. Padding: 16px (상하), 32px (좌우)
8. Constraints: Left & Right, Top
```

**Step 5: Content Container 생성**
```
1. MainAreaContainer 내부에서 F 단축키
2. Name: "ContentContainer" (Container 접미사)
3. Width: Fill Container
4. Height: Fill Container
5. Auto Layout: Horizontal
6. Gap: 0px (Stock List, Chart, AI Panel 사이 간격 없음)
7. Padding: 0px
8. Constraints: Left & Right, Top & Bottom
```

**Step 6: Stock List Section 생성**
```
1. ContentContainer 내부에서 F 단축키
2. Name: "StockListSection" (Section 접미사)
3. Width: 480px (Fixed)
4. Height: Fill Container
5. Auto Layout: Vertical
6. Gap: spacing/md (16px)
7. Padding: spacing/lg (24px)
8. Constraints: Left, Top & Bottom
```

**Step 7: Chart Area Section 생성**
```
1. ContentContainer 내부에서 F 단축키
2. Name: "ChartAreaSection" (Section 접미사)
3. Width: Fill Container (나머지 공간)
4. Height: Fill Container
5. Auto Layout: Vertical
6. Gap: spacing/md (16px)
7. Padding: spacing/lg (24px)
8. Constraints: Left & Right, Top & Bottom
```

**Step 8: AI Panel Section 생성 (선택)**
```
1. ContentContainer 내부에서 F 단축키
2. Name: "AISummaryPanelSection" (Section 접미사)
3. Width: 500px (Fixed)
4. Height: Fill Container
5. Auto Layout: Vertical
6. Gap: spacing/md (16px)
7. Padding: spacing/lg (24px)
8. Constraints: Right, Top & Bottom
9. Border Left: 1px gray/200 (별도 Rectangle 레이어)
```

**⚠️ AI 작업 시 주의사항:**
- 모든 Frame은 Auto Layout 필수 적용
- Gap/Padding은 반드시 Variables 사용 (직접 px 값 입력 금지)
- Frame Name은 PascalCase, 접미사 규칙 준수
- Constraints는 반응형을 고려하여 설정
- 중첩 깊이 5단계 이하 유지

---

### 6.2 News & Feed Template

**레이아웃 구조:**
```
News Frame (Auto Layout, Vertical)
├── Sidebar (240px)
└── Main Area (1200px)
    ├── Header (Tab: 전체/종목/업종/글로벌)
    ├── Filter Bar (오늘/이번주/1개월)
    └── News Grid (Auto Layout, Horizontal Wrap)
        ├── News Card (360px)
        ├── News Card
        └── News Card (3열, 무한 스크롤)
```

**Grid 설정:**
```
Direction: Horizontal
Wrap: On
Gap: 24px
Padding: 32px
Columns: Auto (3개가 자연스럽게 배치)
```

---

### 6.3 Education Template

**레이아웃 구조:**
```
Education Frame (Auto Layout, Vertical)
├── Sidebar (240px)
└── Main Area (1200px)
    ├── Tab Bar (학습 대시보드 / Q&A / 노트)
    └── Content Area
        ├── (Learning Dashboard 선택 시)
        │   ├── Section: 오늘의 학습 (2열 Grid)
        │   ├── Section: 뉴스 기반 추천
        │   └── Section: 포트폴리오 기반 추천
        │
        ├── (Q&A 선택 시)
        │   ├── Left Panel (30%): 질문 기록
        │   ├── Right Panel (70%): 답변 표시
        │   └── Bottom Bar: 질문 입력
        │
        └── (노트 선택 시)
            ├── Filter Bar (태그 선택)
            └── Note Grid (2열, Notion 스타일 카드)
```

---

### 6.4 Portfolio Template

**레이아웃 구조:**
```
Portfolio Frame (Auto Layout, Vertical)
├── Sidebar (240px)
└── Main Area (1200px, Auto Layout, Vertical)
    ├── Summary Header (Full Width)
    │   ├── 총 평가금액 (Number/Large)
    │   ├── 총 수익률 (Badge + Number)
    │   └── 오늘 손익
    ├── Holdings Table (Full Width)
    │   └── Table Component
    ├── Charts Section (Auto Layout, Horizontal)
    │   ├── Sector Pie Chart (50%)
    │   └── Contribution Bar Chart (50%)
    └── AI Risk Analysis Card
        ├── Warning Items (Vertical List)
        └── CTA Button ("리스크 개선 제안")
```

---

## 7. Handoff Guidelines

### 7.1 Figma → Dev 전달 체크리스트

**디자이너가 확인할 사항:**
- [ ] 모든 컴포넌트가 Variables를 사용하는가?
- [ ] Text Styles가 모두 적용되었는가?
- [ ] Auto Layout이 일관되게 적용되었는가?
- [ ] 색상 대비가 4.5:1 이상인가? (Stark 플러그인으로 검증)
- [ ] Hover/Focus State가 모두 정의되었는가?
- [ ] Loading/Error State가 포함되었는가?
- [ ] 반응형(Tablet/Mobile)이 고려되었는가?

---

### 7.2 Inspect Panel 사용법

**개발자에게 전달 시:**
1. Frame 선택
2. 우측 상단 "Dev Mode" 토글 ON
3. 코드 복사:
   - CSS: Padding, Margin, Border Radius 등
   - Variables: 자동으로 CSS Custom Properties로 변환
4. Assets 다운로드:
   - Icon: SVG 포맷
   - Image: WebP (2x Export)

---

### 7.3 Component Props → Code 매핑

**Button 예시:**
```
Figma Variant: Type=Primary, Size=Medium, State=Default

→ React Component:
<Button 
  variant="primary" 
  size="medium" 
  disabled={false}
>
  클릭
</Button>

→ CSS Variables:
background: var(--primary-600);
padding: var(--spacing-md) var(--spacing-lg);
border-radius: 8px;
```

---

### 7.4 애니메이션 전달

**Prototype에서 전환 정의:**
1. 두 Frame 선택 (Default → Hover)
2. Prototype 탭 → Interaction 추가
3. Trigger: `While Hovering`
4. Action: `Change to` Hover State
5. Animation: `Smart Animate`
6. Easing: `Ease Out`
7. Duration: `200ms`

**개발 전달 시:**
- Prototype Link 공유
- README에 애니메이션 스펙 명시

---

### 7.5 애니메이션 상세 스펙

**⚠️ 개발팀과의 협의 사항 (필수 준수):**

#### 협의된 Transition 규칙

**1. 모든 인터랙티브 요소 Transition 필수**
- Hover, Focus, Active, Disabled 모든 상태 변경 시 Transition 적용
- 즉시 변경 금지

**2. Duration 표준 (협의 완료)**
- Hover, Focus: `0.2s` (200ms)
- Modal/Drawer: `0.3s` (300ms)
- Toast: `0.25s` Enter, `0.2s` Exit
- Page Transition: `0.3s ~ 0.5s`

**3. Easing Function 표준 (협의 완료)**
- Hover: `cubic-bezier(0.4, 0, 0.2, 1)` (Ease Out)
- Modal Open: `cubic-bezier(0.4, 0, 0.2, 1)` (Ease Out)
- Modal Close: `cubic-bezier(0.4, 0, 1, 1)` (Ease In)
- Toast: `cubic-bezier(0.16, 1, 0.3, 1)` (Bouncy)

**4. GPU 가속 속성만 사용 (협의 완료)**
- ✅ 사용: `transform`, `opacity`
- ❌ 금지: `width`, `height`, `top`, `left` (성능 저하)

**5. Accessibility 필수 (협의 완료)**
- `prefers-reduced-motion` 미디어 쿼리 지원 필수

#### 애니메이션 타입별 상세 스펙

**1. Hover States**
```css
/* Button, Card, Link */
transition: all 0.2s ease;
/* 또는 개별 속성 */
transition-property: background-color, color, transform, box-shadow;
transition-duration: 0.2s;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

**구체적 Transition 값 (협의 완료):**

| 요소 | 속성 | Duration | Easing |
|------|------|----------|--------|
| **Button Hover** | `background-color` | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Card Hover** | `box-shadow`, `transform` | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Icon Hover** | `color` | 0.15s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Link Hover** | `color`, `text-decoration` | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Table Row Hover** | `background-color` | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |

**상세 CSS 코드는 Section 7.6 (개발자용) 참조**

**2. Modal Open/Close**
```css
/* 등장 */
@keyframes modalEnter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 사라짐 */
@keyframes modalExit {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}

.modal-enter {
  animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-exit {
  animation: modalExit 0.2s cubic-bezier(0.4, 0, 1, 1);
}
```

**Overlay:**
```css
.modal-overlay-enter {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**3. Toast (Notification)**
```css
/* 등장 */
@keyframes toastSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 사라짐 */
@keyframes toastFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.toast-enter {
  animation: toastSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-exit {
  animation: toastFadeOut 0.2s cubic-bezier(0.4, 0, 1, 1);
}
```

**4. Drawer (Sidebar)**
```css
/* 열림 (좌측에서) */
@keyframes drawerSlideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-enter {
  animation: drawerSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 닫힘 */
.drawer-exit {
  animation: drawerSlideOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}
```

**5. Skeleton Shimmer**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-300) 50%,
    var(--gray-200) 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 1.5s infinite linear;
}
```

**6. Page Transition**
```css
/* 페이지 전환 (Next.js) */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 0.2s ease;
}
```

**7. Loading Spinner**
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**8. Progress Bar (Indeterminate)**
```css
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.progress-bar {
  animation: progress 2s infinite ease-in-out;
}
```

#### Easing Functions (표준화)

| 용도 | Easing Function | CSS Value |
|------|----------------|-----------|
| **Hover** | Ease Out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Modal/Drawer Open** | Ease Out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Modal/Drawer Close** | Ease In | `cubic-bezier(0.4, 0, 1, 1)` |
| **Toast Enter** | Ease Out (Bouncy) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Toast Exit** | Ease In | `cubic-bezier(0.4, 0, 1, 1)` |
| **Page Transition** | Ease | `ease` |

#### Duration 표준

| 애니메이션 타입 | Duration | 이유 |
|----------------|----------|------|
| **Micro-interactions** (Hover, Focus) | 0.15s ~ 0.2s | 즉각적인 피드백 |
| **Modal/Drawer** | 0.3s | 충분히 인지 가능 |
| **Toast** | 0.25s (Enter), 0.2s (Exit) | 빠른 등장, 부드러운 사라짐 |
| **Page Transition** | 0.3s ~ 0.5s | 자연스러운 전환 |
| **Loading** | 1s ~ 2s (Loop) | 부드러운 반복 |

#### Focus State Transition (협의 완료)

**모든 Focus 가능 요소에 Transition 적용:**

```css
/* Input Focus */
.input {
  transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px var(--primary-100);
}

/* Button Focus */
.button:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
  transition: outline 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Link Focus */
.link:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
  border-radius: 4px;
  transition: outline 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Focus Ring 규칙 (협의 완료):**
- Width: 2px
- Color: Primary/600 (`#16A362`)
- Offset: 2px
- Border Radius: 4px
- Transition: 0.2s

#### Active State Transition (협의 완료)

**버튼 Press 효과:**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1);
}
```

**Nav Item Active:**
```css
.nav-item.active {
  background-color: var(--primary-100);
  color: var(--primary-600);
  font-weight: 600;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Disabled State (협의 완료)

**Disabled 요소는 Transition 없음:**
```css
.button:disabled {
  background-color: var(--gray-300);
  color: var(--gray-600);
  cursor: not-allowed;
  /* Transition 없음 - 즉시 변경 */
}
```

#### Accessibility 고려사항 (협의 완료)

```css
/* 사용자가 애니메이션 감소를 선호하는 경우 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**⚠️ 협의 사항:**
- 모든 개발자는 이 규칙을 필수 준수
- Transition Duration/Easing 변경 시 디자인팀과 사전 협의
- 새로운 애니메이션 추가 시 이 가이드에 먼저 문서화

**Figma Prototype 설정 (협의 완료):**

**Hover State Prototype:**
1. 두 Frame 선택 (Default → Hover)
2. Prototype 탭 → Interaction 추가
3. Trigger: `While Hovering`
4. Action: `Change to` Hover State
5. Animation: `Smart Animate`
6. Duration: `200ms` (0.2s)
7. Easing: `Ease Out` (Figma 기본값, 개발 시 cubic-bezier로 변환)

**Modal Open Prototype:**
1. Trigger: `On Click`
2. Action: `Change to` Modal Frame
3. Animation: `Smart Animate`
4. Duration: `300ms` (0.3s)
5. Easing: `Ease Out`

**Toast Prototype:**
1. Trigger: `On Click` (또는 자동)
2. Action: `Change to` Toast Frame
3. Animation: `Smart Animate`
4. Duration: `250ms` (0.25s)
5. Easing: `Ease Out`

**개발 전달 시 포함할 정보 (협의 완료):**
1. 애니메이션 타입 (Hover, Modal 등)
2. Duration (ms) - 정확한 값
3. Easing Function (CSS cubic-bezier 값) - Figma Easing과 매핑
4. Keyframes (필요한 경우) - 전체 코드
5. Trigger (Hover, Click 등)
6. Accessibility 고려사항
7. GPU 가속 속성 확인 (transform, opacity만 사용)

**Figma → CSS Easing 매핑:**
- Figma "Ease Out" → CSS `cubic-bezier(0.4, 0, 0.2, 1)`
- Figma "Ease In" → CSS `cubic-bezier(0.4, 0, 1, 1)`
- Figma "Ease" → CSS `ease`

---

---

### 7.5 Figma Variables → CSS Variables

**Export 방법:**
1. Figma Variables 패널
2. Collection 선택 (Color Tokens)
3. 우측 상단 `...` → `Export`
4. Format: `CSS Variables`
5. 파일 저장 → `tokens.css`

**명명 규칙 변환:**
- Figma: `primary/600` → CSS: `--primary-600`
- Figma: `gray/900` → CSS: `--gray-900`
- Figma: `spacing/md` → CSS: `--spacing-md`

**결과 예시:**
```css
:root {
  /* Primary Colors */
  --primary-600: #16A362;
  --primary-500: #1DBF6A;
  --primary-400: #34D883;
  --primary-100: #E6F8EE;
  
  /* Semantic Colors */
  --semantic-red: #EF4444;
  --semantic-blue: #1D4ED8;
  --semantic-yellow: #F59E0B;
  --semantic-green: #10B981;
  
  /* Neutral Colors */
  --gray-900: #111827;
  --gray-700: #374151;
  --gray-600: #4B5563;
  --gray-400: #9CA3AF;
  --gray-300: #D1D5DB;
  --gray-200: #E5E7EB;
  --gray-100: #F3F4F6;
  --gray-50: #F9FAFB;
  --white: #FFFFFF;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Semantic Tokens (Alias) */
  --background-page: var(--gray-50);
  --background-card: var(--white);
  --background-hover: var(--gray-100);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-700);
  --text-tertiary: var(--gray-600);
  --border-default: var(--gray-200);
  --border-focus: var(--primary-600);
}
```

**TypeScript/JavaScript에서 사용:**
```typescript
// tokens.ts
export const tokens = {
  color: {
    primary: {
      600: '#16A362',
      500: '#1DBF6A',
      // ...
    },
    gray: {
      900: '#111827',
      // ...
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    // ...
  }
} as const;
```

개발자는 이 파일을 그대로 사용 가능.

---

### 7.6 Icons Export

**Figma에서 Lucide Icons 사용:**
1. Iconify 플러그인 설치
2. 검색: `lucide`
3. 필요한 아이콘 삽입
4. 우클릭 → `Export` → SVG

**개발 전달:**
- 아이콘 이름 문서화
  ```
  Dashboard: BarChart3
  News: Newspaper
  Education: GraduationCap
  ```
- 개발팀은 `lucide-react` 라이브러리에서 직접 import

---

## 📝 Figma Design System 완성 체크리스트

### Frame 생성 규칙 (AI 작업 필수)
- [ ] Frame 네이밍 컨벤션 준수 (PascalCase, 접미사 규칙)
- [ ] 모든 Frame에 Auto Layout 적용
- [ ] Gap/Padding에 Variables 사용 (직접 px 값 입력 금지)
- [ ] Constraints 설정 (반응형 고려)
- [ ] 계층 구조 5단계 이하 유지
- [ ] Frame vs Group 구분 명확 (레이아웃 변경 시 Frame 사용)

### Variables
- [ ] Color Tokens (Primary, Semantic, Neutral) 생성
- [ ] Semantic Tokens (Alias) 생성
- [ ] Spacing Tokens 생성
- [ ] Breakpoint Tokens 생성 (Desktop/Tablet/Mobile)

### Typography
- [ ] Pretendard/Inter 폰트 설치
- [ ] Text Styles (H1~H3, Body, Caption, Number) 생성
- [ ] Tabular Numbers 설정 (Number Styles)

### Components - Atoms
- [ ] Button (Primary/Secondary/Ghost, 모든 Variant)
- [ ] Input (Default/Focus/Error/Disabled)
- [ ] Badge (Default/Primary/Warning/Success)
- [ ] Icon Button (Small/Medium, 모든 State)
- [ ] Toast (Success/Error/Warning/Info)
- [ ] Modal (Small/Medium/Large)
- [ ] Skeleton (Text/Circle/Rectangle)

### Components - Molecules
- [ ] Card (Default/Hover/Selected)
- [ ] Table Row (Default/Hover/Selected)
- [ ] News Card (Default/Hover)

### Components - Organisms
- [ ] Sidebar (Navigation Items, 모든 State)
- [ ] Header (Market Summary)
- [ ] AI Summary Panel

### Layout & Responsive
- [ ] Grid System (Desktop/Tablet/Mobile)
- [ ] Breakpoint 변형 예시
- [ ] 반응형 컴포넌트 변형 (Button, Card, Modal 등)

### Templates
- [ ] Dashboard 전체 페이지 (Desktop)
- [ ] Dashboard 반응형 (Tablet/Mobile)
- [ ] News & Feed 페이지
- [ ] Education 페이지 (3개 탭 모두)
- [ ] Portfolio 페이지
- [ ] Settings 페이지
- [ ] Login/Signup 페이지

### Handoff
- [ ] Dev Mode로 전환 가능 확인
- [ ] Variables Export (CSS) - 명명 규칙 확인
- [ ] Prototype 전환 정의 (모든 인터랙션)
- [ ] 애니메이션 스펙 문서화
- [ ] README 작성 (개발자 가이드)
- [ ] 접근성 검증 (Stark 플러그인)

---

## 🎉 완성!

이제 이 가이드를 따라하면:
1. **디자이너는** 일관된 디자인 시스템으로 빠르게 작업
2. **개발자는** Figma Variables를 코드로 1:1 변환
3. **QA는** Figma를 기준으로 정확하게 검증
