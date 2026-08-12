import type { Locale } from '@interfaces';

export * from './translation-status.enum';
export * from './session-format.enum';

export const LOCALE_RU = 'ru';
export const LOCALE_EN = 'en';

export const DEEPL_LOCALE_MAP: Record<Locale, string> = {
  [LOCALE_RU]: 'RU',
  [LOCALE_EN]: 'EN-US',
};

export const MAX_TRANSLATE_ATTEMPTS_COUNT = 5;

export const MIN_CHILD_AGE = 3;
export const MAX_CHILD_AGE = 16;
