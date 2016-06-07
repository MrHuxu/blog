require('babel-core/register');
import { Router } from 'express';
import { getRepos } from '../../lib/get-repos';
import { clearEmptyObjItems } from '../../lib/common';

var router = Router();

router.get('/repos', (req, res) => {
  getRepos().then((repos) => {
    res.send({entities: clearEmptyObjItems(repos)});
  });
});

export default router;
