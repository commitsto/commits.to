import app from './express'
import moment from 'moment-timezone'
import _ from 'lodash'

import mailself from '../lib/mail'
import { cache, seed, setup, importJson } from '../data/seed'
import { ALLOW_ADMIN_ACTIONS, APP_DOMAIN, ENVIRONMENT } from '../data/config'

import Promises, { sequelize } from '../models/promise'
import { Users } from '../models/user'
import parsePromise from '../lib/parse/promise'
import parseCredit from '../lib/parse/credit'

const userQuery = (user) => ({
  model: Users,
  where: { username: user }
})

// Actions

app.get('/_s/:user/promises/remove/:id(*)', (req, resp) => {
  console.log('remove', req.params)
  // FIXME: refactor/secure this
  Promises.destroy({
    where: {
      id: req.params.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(deletedRows) {
    console.log('promise removed', deletedRows)
    resp.redirect('/')
  })
})

app.get('/_s/:user/promises/remove', function(req, resp) {
  Promises.destroy({
    include: [userQuery(req.params.user)],
  }).then(function(deletedRows) {
    console.log('user promises removed', deletedRows)
    resp.redirect('/')
  })
})

app.get('/_s/:user/promises/complete/:id(*)', (req, resp) => {
  Promises.findOne({
    where: {
      id: req.params.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    promise.update({
      tfin: moment(), //.tz('America/New_York')  FIXME,
      cred: parseCredit({ dueDate: promise.tdue })
    })

    console.log('complete promise', promise.dataValues)
    resp.redirect('/')
  })
})

app.post('/_s/:user/promises/edit/:id(*)', (req, res) => {
  // invalid dates/empty string values should unset db fields
  const data = _.mapValues(req.body, (value) =>
    _.includes(['Invalid date', ''], value) ? null : value)

  console.log('edit promise**', req.params.id, data, req.body)

  Promises.find({
    where: {
      id: req.params.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    promise.update({
      cred: parseCredit({ dueDate: promise.tdue, finishDate: promise.tfin }),
      ...data
    }).then(function(prom) {
      console.log('promise updated', req.body)
      if (promise) {
        res.redirect(`/${prom.urtext}`)
      } else {
        res.redirect('/')
      }
    })
  })
})

// Deprecated because we no longer use /create - FIXME: delete?
//
// app.get('/promises/create/:urtext(*)', (req, resp) => {
//   console.log('create', req.params)
//   parsePromise({urtext: req.params.urtext, ip: req.ip}).then((parsedPromise) => {
//     Promises.create(parsedPromise).then(function(promise) {
//       console.log('promise created', promise.dataValues)
//       mailself('PROMISE', promise.urtext) // send dreeves@ an email
//       resp.redirect(`/${req.params.urtext}`)
//     })
//   })
// })

// Endpoints

app.get('/promise/:udp/:urtext', function(req, resp) {
  let urtext = req.originalUrl.substr(9)
  Promises.findOne({ where: { urtext } }).then(function(promise) {
    console.log('single promise', urtext, promise)
    // resp.write(promise)
    resp.json(promise)
  })

})

app.get('/promises', function(req, resp) {
  let dbPromises = {}
  Promises.findAll({ order: sequelize.literal('tdue DESC') }).then(function(promises) {
    // console.log('all promises', promises)
    // create nested array of promises by user:
    promises.forEach(function(promise) {
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    })
    resp.json(dbPromises)
  })
})

app.get('/promises/:user', function(req, resp) {
  let dbPromises = {}
  Promises.findAll({
    where: {
      user: req.params.user
    },
    order: sequelize.literal('tdue DESC')
  }).then(function(promises) {
    console.log('user promises', promises)
    promises.forEach(function(promise) {
      console.log(promise.tfin)
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    })
    resp.json(dbPromises)
  })
})

app.get('/users/create/:username', (req, res) => {
  const { username } = req.params

  if (username) {
    Users.create({ username })
      .then(() => {
        res.redirect(`//${username}.${APP_DOMAIN}`)
      })
  } else {
    res.redirect('/')
  }
})

/* Utils */

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
}
