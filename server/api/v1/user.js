import { Router } from 'express'

import { Users } from '../../models'
import log from '../../../lib/logger'

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

// // user promises list
// app.get('/promises', (req, res) => {
//   log.debug('user promises', req.params.user)

//   req.user.getValidPromises().then(promises => {
//     const { score, counted } = calculateReliability(promises)

//     log.debug(`${req.params.user}'s promises:`, score, promises.length)

//     req.user.update({ score, counted, pending: promises.length - counted })

//     promises.sort(promiseGallerySort)

//     res.render('user', {
//       user: req.user,
//       reliability: score,
//       promises,
//       counted,
//       pending: promises.length - counted,
//     })
//   })
// })

export default api
