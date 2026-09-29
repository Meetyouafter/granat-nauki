export * from './data';
export * from './apiStatuses';
export * from './paths';

export const COOKIE_ACCEPTED = 'cookie_accepted' as const;
export const THEME = 'theme' as const;

export const RU_LOCALE = 'ru' as const;
export const EN_LOCALE = 'en' as const;
export const LOCALES = [RU_LOCALE, EN_LOCALE];

export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_EMAIL_LENGTH = 100;