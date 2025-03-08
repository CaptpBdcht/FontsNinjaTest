import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import axios from 'axios';

import { Article } from './article.model';
import { ScraperService } from './scraper.service';

const mockArticlesRepository = {
  bulkCreate: jest.fn(),
};

jest.mock('axios'); // Fake axios for service test

describe('ScraperService', () => {
  let scraperService: ScraperService;
  let repository: typeof Article;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScraperService,
        {
          provide: getModelToken(Article),
          useValue: mockArticlesRepository
        }
      ],
    }).compile();

    scraperService = module.get<ScraperService>(ScraperService);
    repository = module.get<typeof Article>(getModelToken(Article));
  });

  it('should be defined', () => {
    expect(scraperService).toBeDefined();
  });

  it('should scrape articles correctly', async () => {
    const mockArticles = [
      {
        title: 'Article 1',
        url: 'https://first.com/1',
        source: 'first.com', 
        publishedDate: new Date('2025-03-05T18:59:04')
      }, {
        title: 'Article 2',
        url: 'https://second.com/2',
        source: 'second.com',
        publishedDate: new Date('2025-03-05T18:59:04')
      },
    ];

    axios.get = jest.fn().mockResolvedValue({ data: mockArticles });

    await scraperService.scrapeArticles();
    expect(mockArticlesRepository.bulkCreate).toHaveBeenCalled();
  });
});
