import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_BY_LOCALE: Record<string, FaqItem[]> = {
  ru: [
    {
      question: 'Как проходит первая консультация?',
      answer: 'Знакомимся, формулируем ваш запрос и договариваемся о формате.',
    },
    {
      question: 'Можно ли онлайн?',
      answer: 'Да, работаю в Zoom/Meet. Очные сессии — по договоренности.',
    },
    {
      question: 'Конфиденциальность?',
      answer:
        'Строго соблюдается. Ваши данные и содержание встреч не передаются третьим лицам.',
    },
    {
      question: 'Какова длительность сессии?',
      answer:
        'Стандартная сессия длится 50-60 минут. Для диагностики может потребоваться больше времени, это обсуждается заранее.',
    },
    {
      question: 'Как часто нужно встречаться?',
      answer:
        'Обычно рекомендуем встречи раз в неделю. Частота может варьироваться в зависимости от вашего запроса и ситуации.',
    },
    {
      question: 'Сколько сессий может потребоваться?',
      answer:
        'Количество сессий зависит от вашего запроса и целей. Некоторые вопросы решаются за несколько встреч, другие требуют более длительной работы. Это обсуждается индивидуально.',
    },
    {
      question: 'Работаете ли вы с детьми?',
      answer:
        'Да, работаю с детьми и подростками. Формат работы адаптируется под возраст и особенности ребенка.',
    },
    {
      question: 'Что делать, если нужно отменить встречу?',
      answer:
        'Просьба предупредить об отмене минимум за 24 часа. При отмене менее чем за 24 часа стоимость сессии сохраняется.',
    },
  ],
  en: [
    {
      question: 'How does the first consultation work?',
      answer: 'We get acquainted, define your request, and agree on a format.',
    },
    {
      question: 'Can sessions be online?',
      answer:
        'Yes, I work via Zoom/Meet. In-person sessions are available by arrangement.',
    },
    {
      question: 'Is confidentiality guaranteed?',
      answer:
        'Strictly maintained. Your data and the content of sessions are never shared with third parties.',
    },
    {
      question: 'How long does a session last?',
      answer:
        'A standard session lasts 50-60 minutes. Diagnostics may take longer, which is discussed in advance.',
    },
    {
      question: 'How often should we meet?',
      answer:
        'We usually recommend meeting once a week. Frequency can vary depending on your request and situation.',
    },
    {
      question: 'How many sessions might I need?',
      answer:
        'The number of sessions depends on your request and goals. Some issues are resolved in a few meetings, others require longer-term work. This is discussed individually.',
    },
    {
      question: 'Do you work with children?',
      answer:
        'Yes, I work with children and teenagers. The format adapts to the age and needs of the child.',
    },
    {
      question: 'What if I need to cancel a session?',
      answer:
        'Please notify me at least 24 hours in advance. Cancellations made less than 24 hours before the session are still charged in full.',
    },
  ],
};

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  getAllFaq(@Query('locale') locale?: string): FaqItem[] {
    return FAQ_BY_LOCALE[locale ?? 'ru'] ?? FAQ_BY_LOCALE.ru;
  }
}
