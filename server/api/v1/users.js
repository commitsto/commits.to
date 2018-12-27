import { Router } from 'express'

import { Users } from '../../models/'
import log from '../../../lib/logger'
import { APP_DOMAIN } from '../../app/config'

const api = Router()

api.get('/users/create/:username', (req, res) => {
  const { username } = req.params

  if (username) {
    Users.create({ username })
      .then(() => {
        log.info('user created', username)
        res.redirect(`//${username}.${APP_DOMAIN}`)
      })
  } else {
    res.redirect('/')
  }
})

// // user promises list
// app.get('/_s/:user', (req, res) => {
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
