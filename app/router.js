// --------------------------------- 80chars ---------------------------------->
import _ from 'lodash'

import app from './express'
import log from '../lib/logger'
import mailself from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import Promises from '../models/promise'
import { Users } from '../models/user'

import { users } from '../data/seed'
import parsePromise from '../lib/parse/promise'

// validates all requests with a :user param
app.param('user', function(req, res, next, id) {
  console.log('user check')
  if (!users.includes(id)) {
    return res.redirect('/sign-up')
  }
  next()
})

// user promises list
app.get('/:user.(commits.to|promises.to)', (req, res) => {
  log.debug('user promises', req.params.user)

  Users.findOne({
    where: {
      username: req.params.user,
    }
  }).then(user => {
    if (user) {
      user.getPromises()
        .then(promises => {
          const reliability = _.meanBy(promises, 'credit')
          log.debug(`${req.params.user}'s promises:`, reliability, promises.length)

          res.render('user', {
            promises,
            user: req.params.user,
            reliability
          })
        })
    }
  })
})

// FIXME: check users in DB

// promise parsing middleware
app.get('/:user.(commits.to|promises.to)/:promise/:modifier?/:date*?', (req, res, next) => {
  const parsedPromise = parsePromise({ urtext: req.originalUrl, ip: req.ip })
    .then(parsedPromise => {
      req.parsedPromise = parsedPromise // add to the request object that is passed along

      console.log('promise middleware', req.ip, req.parsedPromise.id)

      const { id, username } = parsedPromise
      if (users.includes(username)) {
        console.log('middleware user', username)

        Promises.findOne({ where: { id } })
          .then((promise) => {
            if (promise) {
              console.log('promise exists', promise.dataValues)
              promise.increment(['clix'], { by: 1 }).then(updated => {
                console.log('clix incremented', updated.id)
                return next()
              })
            } else {
              // TODO track IP address created from
              Promises.create(parsedPromise)
                .then(promise => {
                  console.log('promise created', promise)
                  mailself('PROMISE', promise.urtext) // send dreeves@ an email
                  return next()
                })
            }
          })
      } else {
       return res.redirect('/sign-up')
      }
    })
    .catch((reason) => { // unparsable promise
      console.log('promise parsing error', reason)
      res.redirect('/')
    })
})

// edit promise (this has to come before the show route, else it's ambiguous)
app.get('/:user.(commits.to|promises.to)/:urtext*?/edit', (req, res, next) => {
  const { parsedPromise: { id, user } = {} } = req

  console.log('edit promise', id)
  Promises.findOne({ where: { id }, include: [{ model: Users }] }).then((promise) => res.render('edit', { promise }))
})

// show promise
app.get('/:user.(commits.to|promises.to)/:urtext(*)', (req, res, next) => {
  const { parsedPromise: { id }  = {}} = req

  Promises.findOne({ where: { id }, include: [{ model: Users }] }).then((promise) => {
    console.log('show promise', id)
    res.render('show', { promise })
  })
})

// home
app.get(['/?', '/((www.)?)promises.to/?', '/((www.)?)commits.to/?'], (req, res) => {
  Promises.findAll({
    // where: { tfin: null }, // only show uncompleted
    // limit: 30
    include: [{
      model: Users
    }],
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    // console.log('homepage promises', promises)
    log.info('render: home', promises[0] && promises[0].user && promises[0].user.dataValues)

    res.render('home', {
      promises
    })
  })
})

// placeholder
app.get('/sign-up', (req, res) => { res.render('signup') })

// --------------------------------- 80chars ---------------------------------->
