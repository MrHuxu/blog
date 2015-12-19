import { Router } from 'express';
import { getRepos } from '../lib/get-repos';

var router = Router();

router.get('/repos', (req, res) => {
  getRepos().then((repos) => {
    res.send({entities: repos});
  });
});

export default router;
