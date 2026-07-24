import { Injectable } from '@nestjs/common';
import { ArticleDto } from './articles.dto';

const ARTICLES_BY_LOCALE: Record<string, ArticleDto[]> = {
  ru: [
    {
      id: 1,
      title: 'Как проходит первая консультация?',
      content: 'Знакомимся, формулируем ваш запрос и договариваемся о формате.',
    },
  ],
  en: [
    {
      id: 1,
      title: 'Can sessions be online?',
      content:
        'Yes, I work via Zoom/Meet. In-person sessions are available by arrangement.',
    },
  ],
};

@Injectable()
export class ArticlesService {
  getArticles(locale?: string): ArticleDto[] {
    return ARTICLES_BY_LOCALE[locale ?? 'ru'] ?? ARTICLES_BY_LOCALE.ru;
  }
}
