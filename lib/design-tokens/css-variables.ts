/**
 * CSS Variables for Design Tokens
 * 디자인 토큰을 CSS 변수로 사용하기 위한 유틸리티
 */

import { spacing, typography, sizes, borderRadius, shadows, zIndex, transitions } from './index';

/**
 * 디자인 토큰을 CSS 변수 문자열로 변환
 */
export function generateCSSVariables(): string {
  const vars: string[] = [];

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    vars.push(`  --spacing-${key}: ${value};`);
  });

  // Typography - Font Size
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    vars.push(`  --font-size-${key}: ${value};`);
  });

  // Typography - Font Weight
  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    vars.push(`  --font-weight-${key}: ${value};`);
  });

  // Typography - Line Height
  Object.entries(typography.lineHeight).forEach(([key, value]) => {
    vars.push(`  --line-height-${key}: ${value};`);
  });

  // Border Radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    vars.push(`  --radius-${key}: ${value};`);
  });

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    vars.push(`  --shadow-${key}: ${value};`);
  });

  // Z-Index
  Object.entries(zIndex).forEach(([key, value]) => {
    vars.push(`  --z-${key}: ${value};`);
  });

  return vars.join('\n');
}

