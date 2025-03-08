import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Article } from './article.model';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ Article ])
  ],
  controllers: [ ArticleController, ScraperController ],
  providers: [ ArticleService, ScraperService ],
  exports: [ ArticleService ]
})
export class ArticleModule {}
