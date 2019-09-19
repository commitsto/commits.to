import { Router } from 'express'

import { Users } from 'models/db'
import log from 'lib/logger'
import { calculateReliability } from 'lib/parse/credit'
import promiseGallerySort from 'lib/sort'

const api = Router()

api.post('/create', (req, res) => {
  const { username } = req.body

  if (username) {
    Users.create({ username })
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
  log.debug('GET user/promises', req.query);

  const { username } = req.query;

  Users.findOne({
    where: {
      username,
    }
  }).then((user) => {
    if (user) {
      return user.getValidPromises().then(promises => {
        const { score, counted } = calculateReliability(promises)

        log.debug(`${username}'s promises:`, score, promises.length)

        user.update({ score, counted, pending: promises.length - counted })

        promises.sort(promiseGallerySort)

        res.send({
          counted,
          pending: promises.length - counted,
          promises,
          reliability: score,
          user,
        })
      })
    }
    return res.send(404)
  })
})

export default api
