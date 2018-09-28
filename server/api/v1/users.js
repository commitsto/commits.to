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

export default api
