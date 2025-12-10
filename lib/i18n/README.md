# i18n 시스템

중앙화된 번역 시스템으로 모든 텍스트를 관리합니다.

## 사용 방법

### 기본 사용

```tsx
import { useLanguage } from '@/lib/contexts/LanguageContext';

function MyComponent() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

### 번역 키 구조

번역 키는 점(.)으로 구분된 경로를 사용합니다:

- `common.loading` → 공통: 로딩 중...
- `nav.dashboard` → 네비게이션: 대시보드
- `dashboard.title` → 대시보드: 대시보드
- `settings.theme.light` → 설정 > 테마: 라이트 모드

### 새로운 번역 추가

1. `lib/i18n/translations.ts` 파일 열기
2. `Translations` 인터페이스에 새 필드 추가
3. `ko`와 `en` 객체에 번역 추가

예시:
```typescript
export interface Translations {
  // ... 기존 필드
  myNewSection: {
    title: string;
    description: string;
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    // ... 기존 번역
    myNewSection: {
      title: '새 섹션',
      description: '설명',
    },
  },
  en: {
    // ... 기존 번역
    myNewSection: {
      title: 'New Section',
      description: 'Description',
    },
  },
};
```

### 타입 안전성

TypeScript를 사용하여 번역 키의 타입 안전성을 보장합니다. 잘못된 키를 사용하면 컴파일 에러가 발생합니다.

