import { Router } from 'express';
import Fave from '../models/faves.js';

const router = Router();

// GET faves based on user ID only.
router.get('/users/:user/faves', async (req, res) => {
  console.log({ body: req.body, params: req.params });
  if (!req.params.user) {
    res.send(400);
    return;
  }

  const faves = await Fave.find({ user: req.params.user });
  res.send(faves);
});

// GET faves based on user ID + key
router.get('/users/:user/faves/:key', async (req, res) => {
  console.log({ body: req.body, params: req.params });
  if (!req.params.user) {
    res.send(400);
    return;
  }

  const faves = await Fave.find({ user: req.params.user, key: req.params.key });
  res.send(faves);
});

// POST (add/remove)
router.post('/users/:user/faves/:key', async (req, res) => {
  console.log({ body: req.body, params: req.params });
  if (!req.params.user) {
    res.send(400);
    return;
  }

  if (req.body.op === 'ADD') {
    if (
      !(await Fave.findOne({
        user: req.params.user,
        key: req.params.key,
        value: req.body.value,
      }))
    ) {
      const created = await Fave.create({
        user: req.params.user,
        key: req.params.key,
        value: req.body.value,
      });

      console.log({ created });
    }
    res.status(204).send();
    return;
  } else if (req.body.op === 'REMOVE') {
    await Fave.findOneAndRemove({
      user: req.params.user,
      key: req.params.key,
      value: req.body.value,
    });
    res.status(204).send();
    return;
  } else {
    res.status(400).send('unsupported operation');
  }
});

export default router;
