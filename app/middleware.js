import subdomainHandler from 'express-subdomain-handler'

import app from './express'
import { APP_DOMAIN } from '../app/config'

import log from '../lib/logger'
import { Users } from '../models'

import isValidUrl from '../lib/parse/url'

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

app.param('promise', function(req, res, next, id) {
  log.debug('url check', id)
  // handle invalid requests with a 404
  if (!isValidUrl({ url: req.originalUrl, promise: req.params.promise })) {
    return res.status(404).send('Sorry, that doesn\'t look like a valid url...')
  }
  return next()
})
