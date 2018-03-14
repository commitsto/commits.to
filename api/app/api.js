import moment from 'moment-timezone'
import _ from 'lodash'

import app from './express'
import log from '../lib/logger'
import { ALLOW_ADMIN_ACTIONS, APP_DOMAIN, ENVIRONMENT } from '../app/config'

import { seed, importJson } from '../db/seed'
import cache from '../db/cache'

import { Sequelize } from '../db/sequelize'
import { Promises, Users } from '../models/'

import isNewPromise from '../lib/calculate'
import parseCredit, { calculateReliability } from '../lib/parse/credit'
import { promiseGallerySort } from '../models/promise'

const userQuery = (user) => ({
  model: Users,
  where: { username: user }
})

// Endpoints


// GET Promises

app.get(['/promises/incomplete'], (req, res) => {
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

    res.json({ promises })
  })
})

// user promises list
// app.get('/_s/:user', (req, res) => {
//   log.debug('user promises', req.params.user)
//
//   req.user.getValidPromises().then(promises => {
//     const reliability = calculateReliability(promises)
//
//     log.debug(`${req.params.user}'s promises:`, reliability, promises.length)
//
//     req.user.update({ score: reliability })
//
//     promises.sort(promiseGallerySort)
//
//     res.json({
//       promises,
//       user: req.user,
//       reliability
//     })
//   })
// })

// GET User Promises

app.get('/users/:user/promises', (req, res) => {
  req.user.getValidPromises({ order: [['tini']] }).then(promises => {
    // TODO return (scoped?) reliability also?
    // const reliability = calculateReliability(promises)

    log.debug(`/users/${req.user.username}/promises`, promises.length)

    return res.json({ promises })
  })
})

// GET Promise

app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', req.promise.dataValues)
  res.json({
    promise: req.promise,
    user: req.user,
    isNewPromise: isNewPromise({ promise: req.promise }),
  })

  // update click after route has rendered
  res.on('finish', () => {
    req.promise.increment(['clix'], { by: 1 }).then(prom => {
      log.debug('clix incremented', prom.dataValues)
    })
  })
})


// Actions

// TODO implement a /create POST endpoint
// app.post('/promises/create/', (req, resp) => {})

app.post('/users/create/', (req, resp) => {
  const { body: { username } } = req
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

// DELETE Promise

// FIXME make these REST-ful (and consistent)
app.delete('/promises/:id', (req, resp) => {
  Promises.destroy({
    where: {
      id: req.params.id
    },
  }).then(function(deletedRows) {
    log.info('promise removed', req.body, deletedRows)
    resp.send(200)
  })
})

// POST Edit Promise

app.post('/_s/:user/promises/edit', (req, res) => {
  // invalid dates/empty string values should unset db fields
  const valOrNull = (val) => _.includes(['Invalid date', ''], val) ? null : val
  const data = _.mapValues(req.body, (val) => valOrNull(val))

  log.info('edit promise', req.params.id, data)

  Promises.find({
    where: {
      id: req.body.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    promise.update({
      cred: parseCredit({ dueDate: promise.tdue, finishDate: promise.tfin }),
      ...data
    }).then(function(prom) {
      log.info('promise updated', req.body)

      if (promise) {
        res.redirect(`/${prom.urtext}`)
      } else {
        res.redirect('/')
      }
    })
  })
})

// POST Complete Promise

app.post('/_s/:user/promises/complete', (req, resp) => {
  Promises.findOne({
    where: {
      id: req.body.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    promise.update({
      tfin: moment(), // FIXME this should be handled consistently,
      cred: parseCredit({ dueDate: promise.tdue })
    })
    log.info('promise completed', req.body, promise.id)
    resp.send(200)
  })
})


// Utils

// calculate and store reliability for each user
app.get('/cache', (req, resp) => {
  cache()
  resp.redirect('/')
})

if (ENVIRONMENT !== 'production' || ALLOW_ADMIN_ACTIONS) {
  // insert promises.json into db
  app.get('/import', (req, resp) => {
    importJson()
    resp.redirect('/')
  })

  // drop db and repopulate
  app.get('/reset', (req, resp) => {
    seed()
    resp.redirect('/')
  })

  // removes all entries from the promises table
  app.get('/empty', (req, resp) => {
    Promises.destroy({ where: {} })
    resp.redirect('/')
  })

  // removes all promises for a given user
  app.get('/_s/:user/promises/remove', function(req, resp) {
    Promises.destroy({
      include: [userQuery(req.params.user)],
    }).then(function(deletedRows) {
      log.warn('user promises removed', deletedRows)
      resp.redirect('/')
    })
  })
}
