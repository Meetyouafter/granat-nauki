import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';
import type { ArticleDto } from '@/types';

// TODO: временные моки, пока статьи не переехали в БД
const articlesData: Record<(typeof routing.locales)[number], ArticleDto[]> = {
  ru: [
    {
      id: 1,
      title: 'Как понять, что ребёнок готов к школе',
      content: 'Готовность к школе складывается не только из умения читать и считать. Важно, может ли ребёнок удерживать внимание, слушать взрослого и спокойно переносить неудачи.',
    },
    {
      id: 2,
      title: 'Игры, которые развивают внимание',
      content: 'Простые игры дома помогают тренировать внимание: найди отличия, повтори ритм, собери по образцу. Достаточно 10 минут в день.',
    },
    {
      id: 3,
      title: 'Адаптация в первом классе',
      content: 'Первые месяцы в школе бывают непростыми. Рассказываю, как поддержать ребёнка и на какие сигналы стоит обратить внимание.',
    },
  ],
  en: [
    {
      id: 1,
      title: 'How to tell your child is ready for school',
      content: 'School readiness is about more than reading and counting. It matters whether the child can hold attention, listen to an adult and cope calmly with setbacks.',
    },
    {
      id: 2,
      title: 'Games that build attention',
      content: 'Simple games at home help train attention: spot the difference, repeat the rhythm, build from a sample. Ten minutes a day is enough.',
    },
    {
      id: 3,
      title: 'Settling into first grade',
      content: 'The first months of school can be hard. Here is how to support your child and which signs are worth noticing.',
    },
  ],
};

export const getArticles = (locale: string, limit?: number): ArticleDto[] => {
  const items = hasLocale(routing.locales, locale)
    ? articlesData[locale]
    : articlesData[routing.defaultLocale];
  return items.slice(0, limit);
};
