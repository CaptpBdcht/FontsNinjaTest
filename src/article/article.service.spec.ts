import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { Article } from './article.model';
import { ArticleService } from './article.service';
import { ArticleModule } from './article.module';

describe('ArticleService', () => {
  let articleService: ArticleService;

  const firstArticle = {
    title: 'First Article',
    url: 'https://first.com',
    source: 'first',
    publishedDate: new Date('2025-03-05T18:59:04'),
  };

  const secondArticle = {
    title: 'Second Article',
    url: 'https://second.com',
    source: 'second',
    publishedDate: new Date('2025-03-05T18:59:04'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'mysql',
          host: '127.0.0.1',
          username: 'root',
          password: 'toor',
          database: 'scraper_db',
          models: [ Article ]
        }),
        SequelizeModule.forFeature([ Article ]),
        ConfigModule.forRoot(),
        ArticleModule
      ],
      providers: [ ArticleService ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
  });

  beforeEach(async () => {
    // Force-sync la DB avant chaque test pour l'isolation
    await articleService['articleModel'].sync({ force: true });
  });

  it('should be defined', () => {
    expect(articleService).toBeDefined();
  });

  it('should create an article', async () => {
    const articleData = {
      title: 'Test Article',
      url: 'https://example.com',
      source: 'Test Source',
      publishedDate: new Date()
    };

    const article = await articleService.create(articleData);

    expect(article.title).toBe('Test Article');
    expect(article.url).toBe('https://example.com');
  });

  it('should return all articles', async () => {
    await articleService.create(firstArticle);
    await articleService.create(secondArticle);

    const articles = await articleService.getArticles();

    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe('First Article');
    expect(articles[1].title).toBe('Second Article');
  });

  it('should return articles filtered by source', async () => {
    await articleService.create(firstArticle);
    await articleService.create(secondArticle);

    const page = 1;
    const pageSize = 10;
    const source = 'first';

    const result = await articleService.getArticles(page, pageSize, source);

    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject(firstArticle);
  });
});
