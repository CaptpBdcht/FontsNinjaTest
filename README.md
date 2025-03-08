## Description

[FontsNinja](https://fontsninja.notion.site/Test-technique-Dev-Back-End-1922ebef6cd680df8038d5b9ff4d37f5) Backend Technical Test.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Architecture Articles

### Scraping
- Si le nombre d'articles à scraper augmente, le scraping devrait être executé de manière asynchrone en utilisant un système de queues.
- Un système de jobs permettrait alors de répartir la charge des écritures en DB en la diluant sur une plus grande période de temps.
- L'architecture du code permettrait aussi la création de nouveaux scrapers qui viendraient feed la queue, et les routes pourraient évoluer vers une liste sous /scraping, i.e /scraping/ycombinator, /scraping/bbcnews.

### DB
- Avec un grand nombre d'articles, il faut mettre en place des index sur la table `articles`, i.e sur les colonnes `title`, `source` et `publishedDate`.
```sql
CREATE INDEX idx_title ON articles(title);
CREATE INDEX idx_source ON articles(source);
CREATE INDEX idx_publiblished_date on articles(publishedDate);
```
- Des indexes sur plusieurs colonnes peuvent aussi être utilisés.
- L'insertion en batch via `Sequelize.bulkCreate()` permet de réduire la charge d'écriture.
- Avec un grand nombre de scrapers, il peut être pertinent de créer une table d'articles par scrapers.
- Pour la lecture, un système de cache peut réduire la charge en stockant par exemple les articles les plus récents ou les résultats des recherches les plus effectuées. 

- Pour la question "Une requête SQL pour récupérer les articles publiés au cours des 7 derniers jours, triés par date de publication (décroissant) pour laquelle vous proposerez un ou plusieurs index" on peut utiliser la requête suivante :
```sql
SELECT * FROM articles
WHERE publishedDate >= NOW() - INTERVAL 7 DAY
ORDER BY publishedDate DESC;
```

### Swagger
- Visit http://localhost:3000/api

## Run tests

```bash
# Test des services Article & Scraper
$ npm run test
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
