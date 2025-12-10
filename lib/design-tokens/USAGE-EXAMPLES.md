# Design Tokens 사용 예시

## Spacing (간격)

### CSS 변수 사용
```tsx
<div style={{ padding: 'var(--spacing-4)' }}>Content</div>
```

### Tailwind 클래스 사용
```tsx
<div className="p-4">Content</div> {/* spacing-4 = 1rem = 16px */}
```

## Typography (타이포그래피)

### CSS 변수 사용
```tsx
<h1 style={{ 
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  lineHeight: 'var(--line-height-tight)'
}}>Title</h1>
```

### Tailwind 클래스 사용
```tsx
<h1 className="text-2xl font-bold leading-tight">Title</h1>
```

## Button Sizes

```tsx
import { sizes } from '@/lib/design-tokens';

const buttonStyle = {
  height: sizes.button.md.height,
  paddingLeft: sizes.button.md.paddingX,
  paddingRight: sizes.button.md.paddingX,
  paddingTop: sizes.button.md.paddingY,
  paddingBottom: sizes.button.md.paddingY,
  fontSize: sizes.button.md.fontSize,
};
```

## Border Radius

```tsx
<div className="rounded-lg">Content</div> {/* radius-lg = 0.75rem = 12px */}
```

## Shadows

```tsx
<div className="shadow-md">Content</div> {/* shadow-md */}
```

## Z-Index

```tsx
<div className="z-modal">Modal</div> {/* z-modal = 1050 */}
```

