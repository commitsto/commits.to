import moment from 'moment-timezone'
import _ from 'lodash'

import app from './express'
import { ALLOW_ADMIN_ACTIONS, APP_DOMAIN, ENVIRONMENT } from '../app/config'
import { Promises, Users } from '../models/'
import log, { deSequelize } from '../lib/logger'
import { diffPromises } from '../lib/parse/promise'
import actionNotifier from '../lib/notify'
import parseCredit from '../lib/parse/credit'
import { seed, importJson } from '../db/seed'
import cache from '../db/cache'


const userQuery = (user) => ({
  model: Users,
  where: { username: user }
})


// Global endpoints

app.get('/users/create/:username', (req, res) => {
  const { username } = req.params

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


// User-scoped actions

// TODO implement a /create POST endpoint
// app.post('/promises/create/', (req, resp) => {})

app.post('/_s/:user/promises/edit', (req, res) => {
  // invalid dates/empty string values should unset db fields
  const valOrNull = (val) => _.includes(['Invalid date', ''], val) ? null : val
  const data = _.mapValues(req.body, (val) => valOrNull(val))
  log.info('edit promise form data', data)

  Promises.find({
    where: {
      id: req.body.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    const oldPromise = deSequelize(promise)
    log.info('promise to be updated', oldPromise)

    promise.update({
      cred: parseCredit({ dueDate: promise.tdue, finishDate: promise.tfin }),
      ...data
    }).then(function(prom) {
      const difference = diffPromises(oldPromise, deSequelize(prom))

      if (!_.isEmpty(difference)) {
        log.info('promise updated', difference)

        actionNotifier({
          resource: 'promise',
          action: 'edited',
          identifier: req.body.id,
          meta: difference,
        })
      }

      if (promise) {
        res.redirect(`/${prom.urtext}`)
      } else {
        res.redirect('/')
      }
    })
  })
})

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

app.post('/_s/:user/promises/remove', (req, resp) => {
  Promises.destroy({
    where: {
      id: req.body.id
    },
  }).then(function(deletedRows) {
    log.info('promise removed', req.body, deletedRows)
    actionNotifier({
      resource: 'promise',
      action: 'deleted',
      identifier: req.body.id,
    })
    resp.send(200)
  })
})


// captcha
app.post('/_s/:user/promises/validate', (req, resp) => {
  Promises.upsert({ id: req.body.id })
    .then(function(promise) {
      log.info('promise validated', req.body, promise)
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
