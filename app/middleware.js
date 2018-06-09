import subdomainHandler from 'express-subdomain-handler'
import _ from 'lodash'

import app from './express'
import { APP_DOMAIN } from '../app/config'
import sendMail from '../lib/mail'
import log, { deSequelize } from '../lib/logger'
import { Promises, Users } from '../models'

import { parsePromise, parsePromiseWithIp } from '../lib/parse/promise'
import { isBotFromUserAgent } from '../lib/parse/url'
import isValidUrl from '../lib/parse/url'

const renderErrorPage = ({ message, reason = '', res }) => {
  log.error(message, reason)
  return res.status(404).render('404')
}

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
    log.info('invalid url', url, _.pickBy(useragent))
    return res.status(404).render('404')
  }
  return next()
})

// promise parsing
app.param('urtext', function(req, res, next) {
  const { ip, originalUrl: urtext, user: { username } = {} } = req

  const isBot = isBotFromUserAgent({ req })
  let parsedPromise = parsePromise({ username, urtext })
  let foundPromise = undefined

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

    if (!foundPromise) {
      if (isBot) {
        const reason = { username, urtext, isBot }
        return renderErrorPage({ message: 'bot creation attempt', reason, res })
      }

      parsedPromise = await parsePromiseWithIp({ username, urtext, ip })
        .catch((reason) =>
          renderErrorPage({ message: 'promise parsing error', reason, res }))

      if (parsedPromise) {
        const useragent = JSON.stringify(_.pickBy(req.useragent))
        foundPromise = await Promises
          .create({ ...parsedPromise, ip, useragent })
          .catch((reason) =>
            renderErrorPage({ message: 'promise creation error', reason, res }))

        toLog = { level: 'info', state: 'created' }
        sendMail({ // send @dreev an email
          to: 'dreeves@gmail.com',
          subject: foundPromise.id,
          text: `New promise created by: ${username}: ${foundPromise.urtext}`,
        })
      }
    }

    log[toLog.level](`promise ${toLog.state}`, deSequelize(foundPromise))
    req.parsedPromise = parsedPromise // add to the request object
    // do our own JOIN
    req.promise = foundPromise
    req.promise.user = req.user
    req.promise.setUser(req.user)

    return next()
  }) // couldn't handle this promise
    .catch((reason) =>
      renderErrorPage({ message: 'promise finding error', reason, res }))
})
