/**
 * Design Tokens
 * 디자인 시스템의 모든 토큰을 중앙에서 관리
 */

/**
 * Spacing Scale (간격)
 * 4px 기준으로 구성
 */
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

/**
 * Typography Scale (타이포그래피)
 */
export const typography = {
  fontFamily: {
    sans: ['Pretendard', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    // Pixel values for numeric usage (e.g., Skeleton height)
    px: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  } as {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    px: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

/**
 * Size Scale (크기)
 */
export const sizes = {
  icon: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    // Pixel values for lucide-react icons (size prop)
    px: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      '2xl': 32,
    },
  },
  button: {
    sm: {
      height: '2rem',      // 32px
      paddingX: '0.75rem',  // 12px
      paddingY: '0.5rem',   // 8px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.5rem',    // 40px
      paddingX: '1rem',    // 16px
      paddingY: '0.625rem', // 10px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem',      // 48px
      paddingX: '1.25rem', // 20px
      paddingY: '0.75rem', // 12px
      fontSize: '1rem',    // 16px
    },
  },
  input: {
    sm: {
      height: '2rem',      // 32px
      paddingX: '0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.5rem',    // 40px
      paddingX: '1rem',    // 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem',      // 48px
      paddingX: '1.25rem', // 20px
      fontSize: '1rem',    // 16px
    },
  },
  card: {
    padding: {
      sm: '0.75rem',  // 12px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
    },
    borderRadius: {
      sm: '0.5rem',   // 8px
      md: '0.75rem',  // 12px
      lg: '1rem',     // 16px
      xl: '1.5rem',   // 24px
    },
  },
} as const;

/**
 * Border Radius (둥근 모서리)
 */
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

/**
 * Shadow (그림자)
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

/**
 * Z-Index Scale (레이어 순서)
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Transition (전환 효과)
 */
export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * Breakpoints (반응형 브레이크포인트)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Layout Constants (레이아웃 상수)
 */
export const layout = {
  sidebar: {
    width: '480px',      // 30rem
    minWidth: '480px',
    collapsedWidth: '64px', // 4rem
  },
  modal: {
    small: '400px',       // 25rem
    medium: '600px',      // 37.5rem
    large: '800px',       // 50rem
    maxHeight: '80vh',
    noteHeight: '85vh',
  },
  toast: {
    minWidth: '300px',
    maxWidth: '500px',
  },
  panel: {
    width: '500px',       // 31.25rem
    maxWidth: '35vw',
  },
  chart: {
    height: '320px',      // 20rem
  },
} as const;

