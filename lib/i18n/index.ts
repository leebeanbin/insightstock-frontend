/**
 * i18n Core
 * 중앙화된 번역 시스템
 */

import { translations, type Language, type Translations } from './translations';
import { getNestedValue } from './utils';

export type { Language, Translations };

/**
 * 번역 키를 타입 안전하게 접근하는 헬퍼 함수
 * 예: getTranslation('ko', 'dashboard.title')
 * 변수 치환 지원: getTranslation('ko', 'news.noRelatedNews', { stockName: '삼성전자' })
 */
export function getTranslation(
  lang: Language,
  key: string,
  variables?: Record<string, string>
): string {
  const translation = translations[lang];
  let text = getNestedValue(translation, key);
  
  // 변수 치환
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), varValue);
    });
  }
  
  return text;
}

/**
 * 중첩된 번역 객체 접근
 */
export function getNestedTranslation(
  lang: Language,
  ...keys: string[]
): string {
  const translation = translations[lang];
  let value: any = translation;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return keys.join('.');
    }
  }

  return typeof value === 'string' ? value : keys.join('.');
}

/**
 * 번역 함수 생성
 */
export function createTranslator(lang: Language) {
  return (key: string): string => {
    return getTranslation(lang, key);
  };
}

