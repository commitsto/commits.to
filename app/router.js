import app from './express'
import log from '../lib/logger'
import sendMail from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import { promiseGallerySort } from '../models/promise'
import { Promises, Users } from '../models'

import { isNewPromise } from '../helpers/calculate'
import parsePromise from '../lib/parse/promise'
import { calculateReliability } from '../lib/parse/credit'

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
  const { ip, originalUrl, user } = req

  return parsePromise({
    username: user.username,
    urtext: originalUrl,
    ip: ip
  }).then(parsedPromise => {
    req.parsedPromise = parsedPromise // add to the request object

    log.debug('promise middleware', originalUrl, ip, parsedPromise.id)

    Promises.findOrCreate({
      where: {
        id: parsedPromise.id
      },
      defaults: parsedPromise
    })
      .spread((promise, created) => {
        let toLog = { level: 'debug', state: 'exists' }

        if (created) {
          toLog = { level: 'info', state: 'created' }
          // send @dreev an email
          sendMail({
            To: 'dreeves@gmail.com',
            Subject: 'PROMISE',
            TextBody: promise.id
          })
        }
        log[toLog.level](`promise ${toLog.state}`, promise.dataValues)

        // do our own JOIN
        req.promise = promise
        req.promise.user = req.user
        req.promise.setUser(req.user)

        return next()
      })
  })
    .catch((reason) => { // unparsable promise
      log.error('promise parsing error', reason)
      return res.redirect('/')
    })
})

// show promise
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', req.promise.dataValues)
  res.render('show', {
    promise: req.promise,
    user: req.user,
    isNewPromise: isNewPromise({ promise: req.promise })
  })

  // update click after route has rendered
  res.on('finish', () => {
    req.promise.increment(['clix'], { by: 1 }).then(prom => {
      log.debug('clix incremented', prom.dataValues)
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
  log.debug('render sign up')
  res.render('signup')
})
