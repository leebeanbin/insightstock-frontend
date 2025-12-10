/**
 * Design Tokens Utility Functions
 * 디자인 토큰을 Tailwind 클래스로 변환하는 유틸리티
 */

import { spacing, typography, borderRadius } from './index';

/**
 * Spacing 값을 CSS 변수 참조로 변환
 */
export function getSpacingClass(value: keyof typeof spacing): string {
  const key = String(value).replace('.', '_');
  return `[var(--spacing-${key})]`;
}

/**
 * Typography Font Size를 CSS 변수 참조로 변환
 */
export function getFontSizeClass(value: keyof typeof typography.fontSize): string {
  return `[var(--font-size-${value})]`;
}

/**
 * Border Radius를 CSS 변수 참조로 변환
 */
export function getBorderRadiusClass(value: keyof typeof borderRadius): string {
  return `[var(--radius-${value})]`;
}

/**
 * Tailwind 클래스 생성 헬퍼
 */
export const tokens = {
  spacing: {
    px: (value: keyof typeof spacing) => `px-${getSpacingClass(value)}`,
    py: (value: keyof typeof spacing) => `py-${getSpacingClass(value)}`,
    p: (value: keyof typeof spacing) => `p-${getSpacingClass(value)}`,
    gap: (value: keyof typeof spacing) => `gap-${getSpacingClass(value)}`,
    spaceY: (value: keyof typeof spacing) => `space-y-${getSpacingClass(value)}`,
    spaceX: (value: keyof typeof spacing) => `space-x-${getSpacingClass(value)}`,
    mb: (value: keyof typeof spacing) => `mb-${getSpacingClass(value)}`,
    mt: (value: keyof typeof spacing) => `mt-${getSpacingClass(value)}`,
    ml: (value: keyof typeof spacing) => `ml-${getSpacingClass(value)}`,
    mr: (value: keyof typeof spacing) => `mr-${getSpacingClass(value)}`,
  },
  typography: {
    text: (value: keyof typeof typography.fontSize) => `text-${getFontSizeClass(value)}`,
  },
  radius: {
    rounded: (value: keyof typeof borderRadius) => `rounded-${getBorderRadiusClass(value)}`,
  },
};

