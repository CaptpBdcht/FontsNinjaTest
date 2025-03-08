import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Article extends Model<Article> {
  @Column
  title: string;

  @Column
  url: string;

  @Column
  source: string;

  @Column
  publishedDate: Date;
}
