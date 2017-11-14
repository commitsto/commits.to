// --------------------------------- 80chars ---------------------------------->

import app from './express'
import { users, setup } from '../data/seed'
import Promises, { sequelize } from '../models/promise'
import parsePromise from '../lib/parse'

import { logger } from '../lib/logger'

app.get([ // Home
  '/?',
  '/promises.to/?',
  '/commits.to/?'
], (req, resp) => {
    Promises.findAll({
      order: sequelize.literal('tini DESC'),
      // limit: 30
    }).then(function(promises) {
      resp.render('home', {
        promises
      })
    })
})

// if a user visits bob.promises.to (or iwill.glitch.me/bob.promises.to) then
// render the home view, but with only that user's promises
app.get('/:user.([promises|commits]+\.to+)', (req,resp) => {
  var dbPromises = {}
  Promises.findAll({
    where: {
      user: req.params.user
    },
    order: sequelize.literal('tdue DESC')
  }).then(function(promises) {
    resp.render('user', { 
      promises,
      user: req.params.user
    })
  })
})

// edit a promise
app.get('/:user.([promises|commits]+\.to+)/:promise*?/edit', (req, resp) => {
  const parsedPromise = parsePromise({ urtext: req.originalUrl.replace(/\/edit$/,''), ip: req.ip })
  .then(parsedPromise => {
    const { id } = parsedPromise

    console.log('editPromise', req.ip, parsedPromise)

    if (parsedPromise.user === 'www' || parsedPromise.user === '') {
      resp.redirect('/')
    } else if (!users.includes(parsedPromise.user)) {
      resp.redirect('/sign-up')
    } else {
      Promises.findOne({ where: { id } }).then((promise) => {
        if (promise) {
          console.log('promise exists', promise.dataValues)
          resp.render('edit', {
            promise,
          })
        } else {
          console.error('no such promise', promise, id)
          resp.redirect('/')
        }
      })
    }
  })
  .catch((reason) => { // unparsable promise
    console.log(reason)
    resp.redirect('/')
  })
})


// TODO: handle domain agnosticism
// The server at promises.to passes along the full URL the way the user typed
// it, so when the user hits "bob.promises.to/foo" the Glitch app is called
// with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
// "/bob.promises.to/foo" (req.originalUrl doesn't include the hostname which
// from the perspective of this Glitch app is "iwill.glitch.me")

app.get('/:user.([promises|commits]+\.to+)/:promise?/:modifier?/:date*?', (req,resp) => {
  const parsedPromise = parsePromise({ urtext: req.originalUrl, ip: req.ip })
  .then(parsedPromise => {
    const { id } = parsedPromise

    console.log('handleRequest', req.ip, parsedPromise)

    if (parsedPromise.user === 'www' || parsedPromise.user === '') {
      resp.redirect('/')
    } else if (!users.includes(parsedPromise.user)) {
      resp.redirect('/sign-up')
    } else {
      Promises.findOne({ where: { id } }).then((promise) => {
        if (promise) {
          console.log('promise exists', promise.dataValues)
          resp.render('promise', {
            promise,
            secret: true // FIXME: does this do anything still?
          })
        } else {
          console.log('redirecting to create promise', promise, id)          
          logger.info('new promise request', parsedPromise, req.ip) // don't remove this

          resp.render('create', {
            promise: parsedPromise,
            showSubmitButton: true // FIXME when everything is being stored
          })
        }     
      })
    }
  })
  .catch((reason) => { // unparsable promise
    console.log(reason)
    resp.redirect('/')
  })
})


        
/* Static */

app.get('/sign-up', (req, resp) => { resp.render('signup') })


/* Utils */

// drop db and repopulate
app.get('/reset', (req, resp) => {
  setup()
  resp.redirect('/')
})

// removes all entries from the promises table
app.get('/empty', (req, resp) => {
  Promises.destroy({where: {}})
  resp.redirect('/')
})

// --------------------------------- 80chars ---------------------------------->