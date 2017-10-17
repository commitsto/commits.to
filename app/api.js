// --------------------------------- 80chars ---------------------------------->

import app from './express'
import Promise, { sequelize } from '../models/promise'
import parsePromise from '../lib/parse'
// import computeCredit from './latepenalty'

// Actions

// FIXME refactor/secure this
app.get('/promises/remove/:id', (req, resp) => {
  console.log('remove', req.params);
  Promise.destroy({
   where: {
     id: req.params.id
   }
  })
  .then(function(deletedRows){
    console.log('promise removed', deletedRows);
    resp.redirect('/')
  })
})

app.get('/promises/complete/:id', (req, resp) => {
  console.log('complete', req.params);
  // Promise.update({
  //  where: {
  //    id: req.params.id
  //  }
  // })
  // .then(function(deletedRows){
  //   console.log('promise removed', deletedRows);
  //   resp.redirect('/')
  // })
  
  resp.redirect('/')
})

app.get('/promises/create/:urtx(*)', (req, resp) => {
  console.log('create', req.params)
  Promise.create(parsePromise(req.params.urtx))
  .then(function(deletedRows){
    console.log('promise removed', deletedRows);
    resp.redirect(`/${req.params.urtx}`);
  })
})

// Endpoints

app.get('/promise/:udp/:urtx', function(req, resp) {
  let urtx = req.originalUrl.substr(9)
  Promise.findOne({ where: {urtx}})
    .then(function(promise) {
      console.log('single promise', urtx, promise)
    // resp.write(promise)
    resp.json(promise)
  })

})

app.get('/promises', function(req, resp) {
  var dbPromises = {}
  Promise.findAll({
    order: sequelize.literal('tini DESC')
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
  Promise.findAll({
   where: {
     user: req.params.user
   },
  }).then(function(promises) {
    console.log('user promises', promises);
    promises.forEach(function(promise) {
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    })
    resp.json(dbPromises)
  })
})

// --------------------------------- 80chars ---------------------------------->