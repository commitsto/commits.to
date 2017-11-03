// --------------------------------- 80chars ---------------------------------->

import app from './express'
import { users, setup } from '../data/seed'
import Promise, { sequelize } from '../models/promise'
import parsePromise from '../lib/parse'

import { logger } from '../lib/logger'

app.get([ // Home
  '/?',
  '/promises.to/?',
  '/commits.to/?'
], (req, resp) => {
    Promise.findAll({
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
  Promise.findAll({
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
app.get('/:user.([promises|commits]+\.to+)/:promise?/:modifier?/:date*?', (req,resp) => {
  // The server at promises.to passes along the full URL the way the user typed
  // it, so when the user hits "bob.promises.to/foo" the Glitch app is called
  // with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
  // "/bob.promises.to/foo" (req.originalUrl doesn't include the hostname which
  // from the perspective of this Glitch app is "iwill.glitch.me")
  
  // urtext is now, eg, "bob.promises.to/foo_the_bar/by/9am"
    
  console.log('handleRequest', req.params, req.ip)
  const request = req.originalUrl.substr(1) // get rid of the initial slash
  const parsedPromise = parsePromise(request, req.ip)
  const { id } = parsedPromise
  
  console.log('DEBUG: handleRequest:', JSON.stringify(parsedPromise))
  
  if (parsedPromise.user === 'www' || parsedPromise.user === '') {
    // this is the case of no username, like if someone just went to
    // "promises.to" or tried to fetch "promises.to/robots.txt" or whatever
    resp.redirect('/')
  } else if (!users.includes(parsedPromise.user)) {
    // don't let people create new subdomains/users on the fly
    resp.redirect('/sign-up')
  } else {
    // Check if a promise already exists with matching user+'|'+what
    Promise.findOne({ where: { id } }) // this has to check against the parsed urtext (which strips the query param)
      .then(promise => {
        if (promise) {
          console.log('promise exists', promise.dataValues)
          resp.render('promise', {
            promise,
            secret: true // always show controls
          })
        } else {
          console.log('redirecting to create promise', promise, id)
          // TODO: https://github.com/beeminder/iwill/issues/23
          //Promise.create(p)
          
          // IMPORTANT: log every new promise request to papertrail
          logger.info('new promise request', parsedPromise)
          
          resp.render('create', {
            promise: parsedPromise,
          })
        }     
      })
  }
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
  Promise.destroy({where: {}})
  resp.redirect('/')
})

// --------------------------------- 80chars ---------------------------------->