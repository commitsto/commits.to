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
      //limit: 30 show them all for now
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
  }).then(function(promises) {
    resp.render('user', { 
      promises,
      user: req.params.user
    })
  })
})

// TODO: handle domain agnosticism
// The server at promises.to passes along the full URL the way the user typed
// it, so when the user hits "bob.promises.to/foo" the Glitch app is called
// with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
// "/bob.promises.to/foo" (req.originalUrl doesn't include the hostname which
// from the perspective of this Glitch app is "iwill.glitch.me")

app.get('/:user.([promises|commits]+\.to+)/:promise?/:modifier?/:date*?', (req,resp) => {
  const parsedPromise = parsePromise(req.originalUrl, req.ip)
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
          logger.info('new promise request', parsedPromise) // don't remove this

          resp.render('create', {
            promise: parsedPromise,
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