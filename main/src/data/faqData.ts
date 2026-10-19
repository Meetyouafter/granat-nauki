import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';
import type { FaqItemDto } from '@/types';

// TODO: временные моки, пока FAQ не переехал в БД
const faqData: Record<(typeof routing.locales)[number], FaqItemDto[]> = {
  ru: [
    {
      id: 1,
      title: 'С какого возраста можно начинать подготовку к школе?',
      description: 'Обычно с 5 лет. На первой встрече я смотрю, что ребёнку уже даётся легко, а над чем стоит поработать.',
    },
    {
      id: 2,
      title: 'Как проходят занятия?',
      description: 'Занятие длится 45 минут и проходит в игровой форме. После него я рассказываю родителям, что получилось и что можно повторить дома.',
    },
    {
      id: 3,
      title: 'Можно ли заниматься онлайн?',
      description: 'Да, онлайн подходит детям от 6 лет. Для младших лучше очные встречи.',
    },
    {
      id: 4,
      title: 'Нужно ли присутствие родителя?',
      description: 'На первой встрече да. Дальше ребёнок обычно занимается сам, а родитель получает обратную связь после занятия.',
    },
  ],
  en: [
    {
      id: 1,
      title: 'At what age can school preparation start?',
      description: 'Usually from age 5. At the first meeting I look at what already comes easily to the child and what is worth working on.',
    },
    {
      id: 2,
      title: 'What are the sessions like?',
      description: 'A session lasts 45 minutes and is built around play. Afterwards I tell the parents what went well and what can be practiced at home.',
    },
    {
      id: 3,
      title: 'Can we study online?',
      description: 'Yes, online works for children from age 6. For younger ones in-person meetings are better.',
    },
    {
      id: 4,
      title: 'Does a parent need to be present?',
      description: 'At the first meeting, yes. After that the child usually works alone, and the parent gets feedback after the session.',
    },
  ],
};

export const getFaqItems = (locale: string, limit?: number): FaqItemDto[] => {
  const items = hasLocale(routing.locales, locale)
    ? faqData[locale]
    : faqData[routing.defaultLocale];
  return items.slice(0, limit);
};
