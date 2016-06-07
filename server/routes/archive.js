import { Router } from 'express';
import { getAllArticles, getSingleArticle } from '../../lib/get-archives';

var router = Router();

router.get('/all_articles', (req, res) => {
  getAllArticles(req.query).then((articlesContent) => {
    res.send({content: articlesContent});
  });
});

router.post('/single_article', (req, res) => {
  getSingleArticle(req.body.name).then((article) => {
    res.send({article: article});
  });
});

export default router;
