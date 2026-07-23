import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqItemDto } from './faq.dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

const FAQ_BY_LOCALE: Record<string, FaqItemDto[]> = {
  ru: [
    {
      title: 'Как проходит первая консультация?',
      description:
        'Знакомимся, формулируем ваш запрос и договариваемся о формате.',
    },
    {
      title: 'Можно ли онлайн?',
      description: 'Да, работаю в Zoom/Meet. Очные сессии — по договоренности.',
    },
    {
      title: 'Конфиденциальность?',
      description:
        'Строго соблюдается. Ваши данные и содержание встреч не передаются третьим лицам.',
    },
    {
      title: 'Какова длительность сессии?',
      description:
        'Стандартная сессия длится 50-60 минут. Для диагностики может потребоваться больше времени, это обсуждается заранее.',
    },
    {
      title: 'Как часто нужно встречаться?',
      description:
        'Обычно рекомендуем встречи раз в неделю. Частота может варьироваться в зависимости от вашего запроса и ситуации.',
    },
    {
      title: 'Сколько сессий может потребоваться?',
      description:
        'Количество сессий зависит от вашего запроса и целей. Некоторые вопросы решаются за несколько встреч, другие требуют более длительной работы. Это обсуждается индивидуально.',
    },
    {
      title: 'Работаете ли вы с детьми?',
      description:
        'Да, работаю с детьми и подростками. Формат работы адаптируется под возраст и особенности ребенка.',
    },
    {
      title: 'Что делать, если нужно отменить встречу?',
      description:
        'Просьба предупредить об отмене минимум за 24 часа. При отмене менее чем за 24 часа стоимость сессии сохраняется.',
    },
  ],
  en: [
    {
      title: 'How does the first consultation work?',
      description:
        'We get acquainted, define your request, and agree on a format.',
    },
    {
      title: 'Can sessions be online?',
      description:
        'Yes, I work via Zoom/Meet. In-person sessions are available by arrangement.',
    },
    {
      title: 'Is confidentiality guaranteed?',
      description:
        'Strictly maintained. Your data and the content of sessions are never shared with third parties.',
    },
    {
      title: 'How long does a session last?',
      description:
        'A standard session lasts 50-60 minutes. Diagnostics may take longer, which is discussed in advance.',
    },
    {
      title: 'How often should we meet?',
      description:
        'We usually recommend meeting once a week. Frequency can vary depending on your request and situation.',
    },
    {
      title: 'How many sessions might I need?',
      description:
        'The number of sessions depends on your request and goals. Some issues are resolved in a few meetings, others require longer-term work. This is discussed individually.',
    },
    {
      title: 'Do you work with children?',
      description:
        'Yes, I work with children and teenagers. The format adapts to the age and needs of the child.',
    },
    {
      title: 'What if I need to cancel a session?',
      description:
        'Please notify me at least 24 hours in advance. Cancellations made less than 24 hours before the session are still charged in full.',
    },
  ],
};

@Controller('faq')
@ApiExtraModels(FaqItemDto)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(FaqItemDto) },
        },
      },
    },
  })
  @Get()
  getFaqItems(
    @Query('locale') locale?: string,
    @Query('limit') limit?: number,
  ): FaqItemDto[] {
    const faqItems = FAQ_BY_LOCALE[locale ?? 'ru'] ?? FAQ_BY_LOCALE.ru;

    return limit ? faqItems.slice(0, limit) : faqItems;
  }
}
