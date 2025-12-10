/**
 * Tailwind Design Tokens
 * 디자인 토큰을 Tailwind에 통합
 */

import type { Config } from 'tailwindcss';
import { spacing, typography, sizes, borderRadius, shadows, zIndex, transitions, breakpoints } from './index';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        ...spacing,
      },
      fontSize: {
        ...typography.fontSize,
      },
      fontWeight: {
        ...typography.fontWeight,
      },
      lineHeight: {
        ...typography.lineHeight,
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },
      borderRadius: {
        ...borderRadius,
      },
      boxShadow: {
        ...shadows,
      },
      zIndex: {
        ...zIndex,
      },
      transitionDuration: {
        ...transitions,
      },
      screens: {
        ...breakpoints,
      },
    },
  },
  plugins: [],
};

export default config;

