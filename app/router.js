// --------------------------------- 80chars ---------------------------------->

import app from './express'
import APP_DOMAIN from '../data/config'
import { logger } from '../lib/logger'
import mailself from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import Promises from '../models/promise'
import Users from '../models/user'

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
  console.log('user promises', req.params.user)
  
  Promises.findAll({
    where: {
      userId: req.params.user,
      // [Sequelize.Op.not]: [
      //   { tfin: null },
      // ],
    },
    order: Sequelize.literal('tdue DESC'),
  }).then(function(promises) {
    console.log(`${req.params.user}'s promises:`, promises.length)
    
    // FIXME should be able to do this with one query
    // TODO also find & calculate overdue promises
    Users.findOne({
      where: {
        id: req.params.user,
      }
    }).then(user => {
      console.log('user findOne', user.dataValues)
      
      if (user) {
        user.getPromises({ where: {} }).then(promises => {
          console.log('getPromises', promises[0].dataValues)
          
          // FIXME this is so bad
          // TODO replace cred static field with calculated credit field
          user.getPromises({ attributes: [[Sequelize.fn('AVG', Sequelize.col('cred')), 'reliability']] })
            .then(rel => {
              console.log('reliability', rel)
            
              res.render('user', { 
                promises,
                user: req.params.user,
                reliability: rel[0].dataValues.reliability
              })
            })
        })
      }
    })      
  })
})

// promise parsing middleware
app.get('/:user.(commits.to|promises.to)/:promise/:modifier?/:date*?', (req, res, next) => {
  const parsedPromise = parsePromise({ urtext: req.originalUrl, ip: req.ip })
    .then(parsedPromise => {
      req.parsedPromise = parsedPromise // add to the request object that is passed along
      
      console.log('promise middleware', req.ip, req.parsedPromise.id)
      
      const { id, userId } = parsedPromise
      if (users.includes(userId)) {
        console.log('middleware user', userId)
        
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
       return next() 
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
  Promises.findOne({ where: { id } }).then((promise) => res.render('edit', { promise }))
})

// show promise
app.get('/:user.(commits.to|promises.to)/:urtext(*)', (req, res, next) => {
  const { parsedPromise: { id, user }  = {}} = req
  Promises.findOne({ where: { id } }).then((promise) => {
    console.log('show promise', id)
    res.render('show', { promise })
  })
})

// home
app.get(['/?', '/((www.)?)promises.to/?', '/((www.)?)commits.to/?'], (req, res) => {
  Promises.findAll({
    // where: { tfin: null }, // only show uncompleted promises on the homepage
    // limit: 30
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    res.render('home', {
      promises
    })
  })
})

// placeholder
app.get('/sign-up', (req, res) => { res.render('signup') })

// --------------------------------- 80chars ---------------------------------->