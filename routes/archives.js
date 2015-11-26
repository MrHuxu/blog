import { Router } from 'express';
import { getAllArticles, getArticleContent } from './route-common';

var router = Router();

router.get('/all_articles', (req, res) => {
  res.send({
    entities: getAllArticles()
  });
});

router.post('/single_article', (req, res) => {
  res.send({});
});

export default router;
