import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqItemDto } from './faq.dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

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
    return this.faqService.getFaqItems(locale, limit);
  }
}
