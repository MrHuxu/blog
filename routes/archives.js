import { Router } from 'express';
import { getAllArticles, getSingleArticle } from '../lib/get-archives';

var router = Router();

router.get('/all_articles', (req, res) => {
  res.send({
    entities: getAllArticles()
  });
});

router.post('/single_article', (req, res) => {
  res.send({
    article: getSingleArticle(req.body.name)
  });
});

export default router;
