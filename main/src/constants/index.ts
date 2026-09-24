export const paths = {
  home: '/',
  about: '/about',
  services: '/services',
  articles: '/articles',
  reviews: '/reviews',
  faq: '/faq',
  contacts: '/contacts',
  privacy: '/privacy',
  terms: '/terms',
} as const;

export const contacts = {
  telegram: 'https://t.me/lev_ant',
  email: 'missisnickonova007@mail.ru',
  whatsapp: 'https://wa.me/79025688428',
} as const;

export const socialLinks = {
  telegram: 'https://t.me/lev_ant',
  instagram: 'https://www.instagram.com/lev_ant',
} as const;

export const COOKIE_ACCEPTED = 'cookie_accepted' as const;
export const THEME = 'theme' as const;

export const RU_LOCALE = 'ru' as const;
export const EN_LOCALE = 'en' as const;
export const LOCALES = [RU_LOCALE, EN_LOCALE];