# Design Tokens

디자인 시스템의 모든 토큰을 중앙에서 관리합니다.

## 사용 방법

### Spacing (간격)

```tsx
import { spacing } from '@/lib/design-tokens';

// CSS 변수로 사용
<div style={{ padding: spacing[4] }}>Content</div>

// Tailwind 클래스로 사용 (자동으로 변환됨)
<div className="p-4">Content</div>
```

### Typography (타이포그래피)

```tsx
import { typography } from '@/lib/design-tokens';

// CSS 변수로 사용
<div style={{ 
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.lineHeight.normal
}}>Text</div>
```

### Sizes (크기)

```tsx
import { sizes } from '@/lib/design-tokens';

// 버튼 크기
const buttonSize = sizes.button.md;
// { height: '2.5rem', paddingX: '1rem', paddingY: '0.625rem', fontSize: '0.875rem' }
```

### Border Radius

```tsx
import { borderRadius } from '@/lib/design-tokens';

<div style={{ borderRadius: borderRadius.lg }}>Content</div>
```

### Shadows

```tsx
import { shadows } from '@/lib/design-tokens';

<div style={{ boxShadow: shadows.md }}>Content</div>
```

## CSS 변수

모든 디자인 토큰은 CSS 변수로도 사용할 수 있습니다:

- `--spacing-{size}`: 간격
- `--font-size-{size}`: 폰트 크기
- `--font-weight-{weight}`: 폰트 굵기
- `--line-height-{size}`: 줄 간격
- `--radius-{size}`: 둥근 모서리
- `--shadow-{size}`: 그림자
- `--z-{layer}`: z-index

