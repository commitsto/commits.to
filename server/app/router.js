import app from './express'
import log, { deSequelize } from '../../lib/logger'

import { Sequelize } from '../db/sequelize'
import { Promises, Users } from '../models'
import promiseGallerySort from '../../lib/sort'
import { isNewPromise } from '../models/promise'
import { calculateReliability } from '../../lib/parse/credit'

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getValidPromises().then(promises => {
    const { score, counted } = calculateReliability(promises)

    log.debug(`${req.params.user}'s promises:`, score, promises.length)

    req.user.update({ score, counted, pending: promises.length - counted })

    promises.sort(promiseGallerySort)

    res.render('user', {
      user: req.user,
      reliability: score,
      promises,
      counted,
      pending: promises.length - counted,
    })
  })
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

// all promises
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: {
      tfin: null,
      void: {
        [Sequelize.Op.not]: true
      },
      urtext: {
        [Sequelize.Op.not]: null
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
