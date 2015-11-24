var express = require('express');
var router = express.Router();

router.get('/multi_articles', (req, res) => {
  res.send({
    entities: [
    ]
  })
});

router.post('/single_article', (req, res) => {
  res.send({});
});

module.exports = router;
