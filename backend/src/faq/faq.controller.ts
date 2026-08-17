import { Controller, Get, Put, Query, Body } from '@nestjs/common';
import { FaqService } from './faq.service';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FaqItemDto } from './dto/faq-item.dto';
import { LocaleListQueryDto } from '@common/dto/locale-list-query.dto';
import { SaveFaqItemsDto } from './dto/save-faq-items.dto';

const wrapped = {
  properties: {
    data: {
      type: 'array',
      items: { $ref: getSchemaPath(FaqItemDto) },
    },
  },
};

@Controller('faq')
@ApiTags('FAQ')
@ApiExtraModels(FaqItemDto)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOperation({
    summary: 'Список вопросов',
    description:
      'Для локали ru отдаётся оригинал вместе со статусом перевода. ' +
      'Для остальных локалей — только уже переведённые элементы.',
  })
  @ApiOkResponse({ schema: wrapped })
  @ApiBadRequestResponse({ description: 'Некорректные locale или limit' })
  @Get()
  async getFaqItems(@Query() query: LocaleListQueryDto): Promise<FaqItemDto[]> {
    return await this.faqService.findAll(query.locale, query.limit);
  }

  @ApiOperation({
    summary: 'Полная замена списка вопросов',
    description:
      'Элементы без id создаются, с id — обновляются, отсутствующие в теле запроса удаляются. ' +
      'Порядок элементов в массиве задаёт порядок в выдаче. ' +
      'Правка русского текста сбрасывает перевод в статус pending.',
  })
  @ApiOkResponse({
    description: 'Сохранённый список в порядке из запроса',
    schema: wrapped,
  })
  @ApiBadRequestResponse({
    description: 'Пустые поля или повторяющиеся id',
  })
  @ApiNotFoundResponse({
    description: 'Элемента с переданным id не существует',
  })
  @Put()
  async saveFaqItems(@Body() body: SaveFaqItemsDto): Promise<FaqItemDto[]> {
    return await this.faqService.saveAll(body.items);
  }
}
