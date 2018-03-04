import moment from 'moment-timezone'
import _ from 'lodash'
import path from 'path'

import app from './express'
import log from '../lib/logger'

import { seed, importJson } from '../db/seed'
import cache from '../db/cache'
import { ALLOW_ADMIN_ACTIONS, APP_DOMAIN, ENVIRONMENT } from '../app/config'
import parseCredit from '../lib/parse/credit'

import { Promises, Users } from '../models/'

const userQuery = (user) => ({
  model: Users,
  where: { username: user }
})

function nein(req, resp) {
  let neinfile = path.resolve(__dirname+'/../public/nein.html')
  return resp.status(404).sendFile(neinfile)
}

// Here's where we reject URLs with bad characters but it would be better to
// specify a big regex defining exactly what *does* count as a valid promise URL
// and reject everything else.
// NB: Rejecting '#' is moot because we don't see them; the browser eats them.
// Also this isn't matching on query string so rejecting '?' here doesn't help.
// That might be pretty important to fix.
// Things we might want to reject but that at least one existing promise 
// in the database currently uses include:
//   at (@) -- just 1 so far!
//   colon (:) -- just 8 so far but pretty useful for times of day!
//   slash (/) -- hundreds :(
app.get(/^\/_s\/(\w+)\/.*[\!\%\$\^\*\(\)\[\]\=\+\{\}\\\|\;\'\"\`\~\.\&].*$/, 
  nein)

// Global endpoints

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


// User-scoped actions

// TODO implement a /create POST endpoint
// app.post('/promises/create/', (req, resp) => {})

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
      log.debug('promise updated', req.body)

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
    log.info('promise completed', req.body, promise.dataValues)
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
