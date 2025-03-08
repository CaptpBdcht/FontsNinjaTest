import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ScraperService } from './scraper.service';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {

  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  @ApiOperation({ summary: 'Runs YCombinator articles scraping' })
  @ApiResponse({ status: 200, description: 'Scraping successful' })
  @ApiResponse({
    status: 500,
    description: 'Erreur lors du scraping',
    schema: { example: 'Error' }
  })
  async scrapeArticles() {
    try {
      return await this.scraperService.scrapeArticles();
    } catch(error) {
      throw new Error(error);
    }
  }
}
