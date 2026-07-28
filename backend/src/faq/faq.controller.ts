import { Controller, Get, Put, Query, Body } from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GetFaqDto } from './dto/getFaq.dto';
import { GetFaqQueryDto } from './dto/getFaqQuery.dto';
import { PutFaqDto } from './dto/putFaq.dto';

@Controller('faq')
@ApiExtraModels(GetFaqDto)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(GetFaqDto) },
        },
      },
    },
  })
  @Get()
  async getFaqItems(@Query() query: GetFaqQueryDto): Promise<GetFaqDto[]> {
    return await this.faqService.getFaqItems(query.locale, query.limit);
  }

  @Put()
  async saveFaqItems(@Body() body: PutFaqDto): Promise<GetFaqDto[]> {
    return await this.faqService.saveFaqItems(body.items);
  }
}
