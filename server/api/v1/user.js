import { Router } from 'express'

import Users from 'models/user';
import log from 'lib/logger';

const api = Router()

api.post('/create', (req, res) => {
  const { username } = req.body

  if (username) {
    Users._dbModel.create({ username }) // FIXME
      .then(() => {
        log.info('user created', username)
        res.send(200)
      })
  } else {
    res.send(400)
  }
})

// user promises list
api.get('/promises', (req, res) => {
  log.info('GET user/promises', req.query);

  const { username } = req.query;

  Users.pledges({ username }).then((payload) => {
    if (payload) {
      log.debug(`${username}'s promises: ${payload.promises.length}`)
      return res.json(payload);
    }
    return res.send(400);
  })
})

export default api;
