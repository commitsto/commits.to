import _ from 'lodash'

import app from './express'
import log, { deSequelize } from '../lib/logger'
import sendMail from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import { promiseGallerySort } from '../models/promise'
import { Promises, Users } from '../models'

import { isNewPromise } from '../helpers/calculate'
import { parsePromise, parsePromiseWithIp } from '../lib/parse/promise'
import { calculateReliability } from '../lib/parse/credit'
import { isBotFromUserAgent } from '../lib/parse/url'

const renderErrorPage = ({ message, reason = '', res }) => {
  log.error(message, reason)
  return res.status(404).render('404')
}

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getValidPromises().then(promises => {
    const reliability = calculateReliability(promises)

    log.debug(`${req.params.user}'s promises:`, reliability, promises.length)

    req.user.update({ score: reliability })

    promises.sort(promiseGallerySort)

    res.render('user', {
      promises,
      user: req.user,
      reliability
    })
  })
})

// promise parsing
app.get('/_s/:user/:urtext(*)', (req, res, next) => {
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

// show promise
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', deSequelize(req.promise))
  res.render('show', {
    promise: req.promise,
    user: req.user,
    isNewPromise: isNewPromise({ promise: req.promise })
  })

  // update click after route has rendered
  res.on('finish', () => {
    req.promise.increment(['clix'], { by: 1 }).then(prom => {
      log.debug('clix incremented', deSequelize(prom))
    })
  })
})

// home
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: {
      tfin: null,
      void: {
        [Sequelize.Op.not]: true
      },
    }, // only show uncompleted
    // limit: 30
    include: [{
      model: Users
    }],
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    log.debug('home promises', promises.length)

    res.render('home', {
      promises
    })
  })
})

// placeholder
app.get('/sign-up', (req, res) => {
  log.info('render sign up')
  res.render('signup')
})


// catch-all
app.get('*', (req, res) => {
  log.info('render 404')
  res.render('404', req.originalUrl)
})
