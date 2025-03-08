import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { Article } from './article.model';

@Injectable()
export class ArticleService {

  constructor(@InjectModel(Article) private articleModel: typeof Article) {
  }

  async getArticles(page = 1, pageSize = 10, source?: string, search?: string) {
    const whereClause: any = {};
    if (source) {
      whereClause.source = source;
    }
    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`,
      };
    }

    return Article.findAll({
      where: whereClause,
      order: [[ 'publishedDate', 'DESC' ]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  async findAll() {
    return this.articleModel.findAll();
  }

  async create(createArticleDto: Partial<Article>) {
    return this.articleModel.create(createArticleDto);
  }
}
