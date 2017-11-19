// --------------------------------- 80chars ---------------------------------->

import app from './express'
import Promises, { sequelize } from '../models/promise'
import parsePromise from '../lib/parse'
import mailself from '../lib/mail'
import { setup, importJson } from '../data/seed'
// import computeCredit from '../lib/latepenalty'

import moment from 'moment-timezone'

// Actions

app.get('/promises/remove/:id(*)', (req, resp) => {
  console.log('remove', req.params);
  // FIXME: refactor/secure this
  Promises.destroy({
   where: {
     id: req.params.id
   }
  })
  .then(function(deletedRows){
    console.log('promise removed', deletedRows);
    resp.redirect('/')
  })
})

app.get('/promises/:user/remove', function(req, resp) {
  var dbPromises = {};
  Promises.destroy({
    where: {
      user: req.params.user
    }
  }).then(function(deletedRows) {
    console.log('user promises removed', deletedRows);
    resp.redirect('/')
  })
})

app.get('/promises/complete/:id(*)', (req, resp) => {
  Promises.update({
    tfin: moment()//.tz('America/New_York') // FIXME
  },{
   where: { id: req.params.id }
  })
  .then(function(promise){
    console.log('complete promise', promise);
    resp.redirect('/')
  })
})


app.post('/promises/edit/:id(*)', (req, res) => {
  console.log('edit promise', req.params.id, req.body);

  Promises.update({
    ...req.body
  },{
    where: { id: req.params.id }
  })
  .then(function(rows) {
    if (rows && req.params.id) {
      res.redirect(`/${req.params.id}`); 
    } else {
      res.redirect('/')
    }
  })
})

app.get('/promises/create/:urtext(*)', (req, resp) => {
  console.log('create', req.params)
  parsePromise({ urtext: req.params.urtext, ip: req.ip }).then((parsedPromise) => {
    Promises.create(parsedPromise)
    .then(function(promise){
      console.log('promise created', promise);
      mailself('PROMISE', promise.urtext) // send dreeves@ an email 
      resp.redirect(`/${req.params.urtext}`);
    })
  })
})

// Endpoints

app.get('/promise/:udp/:urtext', function(req, resp) {
  let urtext = req.originalUrl.substr(9)
  Promises.findOne({ where: {urtext}})
    .then(function(promise) {
      console.log('single promise', urtext, promise)
    // resp.write(promise)
    resp.json(promise)
  })

})

app.get('/promises', function(req, resp) {
  var dbPromises = {}
  Promises.findAll({
    order: sequelize.literal('tdue DESC')
  }).then(function(promises) {
    // console.log('all promises', promises)
    // create nested array of promises by user:
    promises.forEach(function(promise) { 
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    });
    resp.json(dbPromises);
  })
})

app.get('/promises/:user', function(req, resp) {
  var dbPromises = {};
  Promises.findAll({
    where: {
      user: req.params.user
    },
    order: sequelize.literal('tdue DESC')
  }).then(function(promises) {
    console.log('user promises', promises);
    promises.forEach(function(promise) {
      console.log(promise.tfin)
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    })
    resp.json(dbPromises)
  })
})

/* Utils */

// drop db and repopulate
app.get('/import', (req, resp) => {
  importJson()
  resp.redirect('/')
})

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