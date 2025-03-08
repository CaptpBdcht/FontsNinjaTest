import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import axios from 'axios';
import * as cheerio from 'cheerio';

import { Article } from './article.model';

@Injectable()
export class ScraperService {

  constructor(@InjectModel(Article) private readonly articleModel: typeof Article) {}

  async scrapeArticles(): Promise<void> {
    const articles = [];
    const url = 'https://news.ycombinator.com/';

    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      $('tr.athing').each((index, element) => {
        const titleline = $(element).find('span.titleline');
        const titlelineText = titleline.text();
        const siteSeparator = titlelineText.lastIndexOf(' ');

        const href = titleline.extract({
          links: {
            selector: 'a',
            value: 'href',
          },
        })['links'];

        const age = $(
          $(element).parent().find('span.age').toArray()[index]
        ).attr('title');

        // Remove sources parenthesis
        const source = titlelineText.slice(siteSeparator + 2, titlelineText.length - 1);

        articles.push({
          title: titlelineText.slice(0, siteSeparator),
          url: href,
          source,
          publishedDate: new Date(age.split(' ')[0]),
        });
      });

      await this.articleModel.bulkCreate(articles);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }
}
