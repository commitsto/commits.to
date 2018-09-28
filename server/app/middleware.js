import subdomainHandler from 'express-subdomain-handler'
import _ from 'lodash'

import app from './express'
import { APP_DOMAIN } from '../app/config'
import log, { deSequelize } from '../../lib/logger'
import actionNotifier from '../../lib/notify'
import { Promises, Users } from '../models'

import { parsePromise, parsePromiseWithIp } from '../../lib/parse/promise'
import isValidUrl, { isBotFromUserAgent } from '../../lib/parse/url'
import { nextCloseOfBusiness } from '../../lib/parse/time'

const pageWithStatus = ({
  message, reason = {}, res = {}, template, status
}) => {
  log.error(message, reason)
  return res.status(status).render(template, { ...reason })
}

const renderErrorPage = (opts) =>
  pageWithStatus({ status: 404, template: '404', ...opts })

app.use(subdomainHandler({
  baseUrl: APP_DOMAIN,
  prefix: '_s',
  logger: true
}))

// validates all requests with a :user param
app.param('user', function(req, res, next, param) {
  log.debug('user check', param)

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

app.param('urtext', function(req, res, next, param) {
  const { originalUrl: url, useragent } = req
  log.debug('url check', param)
  // handle invalid requests with a 404
  if (!isValidUrl({ url })) {
    const reason = { url, useragent: _.pickBy(useragent) }
    return renderErrorPage({ message: 'invalid url', reason, res })
  }
  return next()
})

// promise parsing
app.param('urtext', function(req, res, next) {
  const { ip, originalUrl: urtext, user: { username } = {} } = req
  const isBot = isBotFromUserAgent({ req })

  let parsedPromise = parsePromise({ username, urtext })
  let foundPromise = undefined
  let wasPromiseCreated = false

  if (!parsedPromise) {
    return renderErrorPage({ message: 'unparseable promise', res })
  }

  return Promises.find({
    where: {
      id: parsedPromise.id
    },
  }).then(async(p) => {
    foundPromise = p
    let toLog = { level: 'debug', state: 'exists' }

    if (!foundPromise) { // hasn't been captcha validated
      if (isBot) {
        const reason = { username, urtext, isBot }

        return pageWithStatus({
          template: 'captcha',
          status: 404,
          message: 'bot creation attempt',
          reason,
          res
        })
      }

      return pageWithStatus({
        template: 'autocaptcha',
        status: 401, // send unauthorized instead of not found
        message: 'promise has not been validated',
        reason: { username, urtext },
        res
      })
    }

    if (!foundPromise.urtext) { // exists with only 'id' field
      parsedPromise = await parsePromiseWithIp({ username, urtext, ip })
        .catch((reason) =>
          renderErrorPage({ message: 'promise parsing error', reason, res }))

      if (parsedPromise) {
        const useragent = JSON.stringify(_.pickBy(req.useragent))

        if (!parsedPromise.tdue) {
          parsedPromise.tdue = nextCloseOfBusiness(parsedPromise)
        }

        wasPromiseCreated = true // ensure creation is logged and email is sent

        await Promises
          .upsert({ ...parsedPromise, ip, useragent })
          .catch((reason) =>
            renderErrorPage({ message: 'promise creation error', reason, res }))
      }
    }

    return Promises.findOne({
      where: {
        id: parsedPromise.id,
      },
    }).then((promise) => {
      // send @dreev an email
      if (wasPromiseCreated) {
        toLog = { level: 'info', state: 'created' }
        actionNotifier({
          resource: 'promise',
          action: 'created',
          identifier: promise.id,
          meta: deSequelize(promise),
        })
      }

      log[toLog.level](`promise ${toLog.state}`, deSequelize(promise))
      req.parsedPromise = parsedPromise // add to the request object
      // do our own JOIN
      req.promise = promise
      req.promise.user = req.user
      req.promise.setUser(req.user)

      return next()
    })
  }) // couldn't handle this promise
    .catch((reason) =>
      renderErrorPage({ message: 'promise finding error', reason, res }))
})
