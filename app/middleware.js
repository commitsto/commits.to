import subdomainHandler from 'express-subdomain-handler'

import app from './express'
import { APP_DOMAIN } from '../app/config'

import log from '../lib/logger'
import { Users } from '../models'

app.use(subdomainHandler({
  baseUrl: APP_DOMAIN,
  prefix: '_s',
  logger: true
}))

// validates all requests with a :user param
app.param('user', function(req, res, next, id) {
  log.debug('user check', id)

  Users.findOne({
    where: {
      username: req.params.user,
    }
  }).then(user => {
    if (user) {
      req.user = user
      return next()
    }
    return res.redirect(`//${APP_DOMAIN}/sign-up`)
  })
})
