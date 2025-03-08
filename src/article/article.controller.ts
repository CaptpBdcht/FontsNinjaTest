import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Article } from './article.model';
import { ArticleService } from './article.service';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Get articles list' })
  @ApiResponse({ status: 200, description: 'Read successful', type: [Article] })
  async getArticles(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('source') source?: string,
    @Query('search') search?: string,
  ) {
    return this.articleService.getArticles(page, pageSize, source, search);
  }
}
