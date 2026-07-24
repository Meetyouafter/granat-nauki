import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(@Query('locale') locale?: string): ArticleDto[] {
    return this.articlesService.getArticles(locale);
  }
}
