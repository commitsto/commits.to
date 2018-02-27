import _ from 'lodash'

import app from './express'
import log from '../lib/logger'
import mailself from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import Promises, { promiseGallerySort } from '../models/promise'
import { Users } from '../models/user'

import { isNewPromise } from '../helpers/calculate'

import { APP_DOMAIN } from '../data/config'
import parsePromise from '../lib/parse/promise'
import isValidUrl from '../lib/parse/url'

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

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getPromises({
    where: {
      void: {
        [Sequelize.Op.not]: true
      }
    },
    include: [{
      model: Users
    }],
    order: [['tfin', 'DESC']],
  }).then(promises => {
    const reliability = _(promises)
      .map((p) => p.credit)
      .compact()
      .mean()

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

// promise parsing middleware
app.get('/_s/:user/:promise/:modifier?/:date*?', (req, res, next) => {
  const { ip, originalUrl, params, user } = req
  // handle invalid requests by serving up a blank 404
  if (!isValidUrl({ url: originalUrl, promise: params.promise })) {
    return res.status(404).send('Sorry, that doesn\'t look like a valid url...')
  }

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
      .then((promise, created) => {
        // FIXME this is always undefiend... sequelize sucks
        console.log('promise created?', created)

        let toLog = { level: 'debug', state: 'exists' }

        if (created) {
          toLog = { level: 'info', state: 'created' }
          mailself('PROMISE', promise[0].urtext) // send dreeves@ an email
        }
        log[toLog.level](`promise ${toLog.state}`, promise[0].dataValues)

        // do our own JOIN
        req.promise = promise[0]
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
