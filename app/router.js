import _ from 'lodash'

import app from './express'
import log from '../lib/logger'
import mailself from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import Promises from '../models/promise'
import { Users } from '../models/user'

import parsePromise from '../lib/parse/promise'

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
    return res.redirect('/sign-up')
  })
})

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getPromises({ include: [{ model: Users }] }).then(promises => {
    const reliability = _.meanBy(promises, 'credit')
    log.debug(`${req.params.user}'s promises:`, reliability, promises.length)

    req.user.update({ score: reliability })

    res.render('user', {
      promises,
      user: req.user,
      reliability
    })
  })
})

// promise parsing middleware
app.get('/_s/:user/:promise/:modifier?/:date*?', (req, res, next) => {
  if (req.params.promise === 'favicon.ico') return next()

  parsePromise({ username: req.user.username, urtext: req.originalUrl, ip: req.ip }).then(parsedPromise => {
    req.parsedPromise = parsedPromise // add to the request object that is passed along

    log.debug('promise middleware', req.originalUrl, req.ip, req.parsedPromise.id)

    Promises.findOrCreate({
      where: {
        id: parsedPromise.id
      },
      defaults: parsedPromise
    }).then((promise, created) => {
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

      req.promise.increment(['clix'], { by: 1 }).then(promise => {
        log.debug('clix incremented', promise.dataValues)
        return next()
      })
    })
  }).catch((reason) => { // unparsable promise
    log.error('promise parsing error', reason)
    res.redirect('/')
  })
})

// edit promise (this has to come before the show route, else it's ambiguous)
app.get('/_s/:user/:urtext*?/edit', (req, res) => {
  log.debug('edit promise', req.promise.dataValues)
  res.render('edit', {
    promise: req.promise
  })
})

// show promise
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', req.promise.dataValues)
  res.render('show', {
    promise: req.promise,
    user: req.user
  })
})

// home
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: { tfin: null }, // only show uncompleted
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
