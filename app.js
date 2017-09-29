// --------------------------------- 80chars ---------------------------------->

import express from 'express';
import expressHandlebars from 'express-handlebars';

import chrono from 'chrono-node'; // Sugar.js parses some things better
import moment from 'moment';
import sassMiddleware from 'node-sass-middleware';

import { Promise, sequelize } from './models/promise.js';

import { users, promises } from './data/seed.js';

import computeCredit from './lib/latepenalty.js';
import parsePromise from './lib/parse.js';

import handlePromiseRequest from './lib/middleware.js';

var app = express();

app.use(sassMiddleware({
  src: __dirname + '/public',
  dest: '/tmp',
  debug: true,
  force: true,
  //outputStyle: 'compressed',
}));

app.use(express.static('public'));
app.use(express.static('tmp'));

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(process.env.PORT);


// LATEST SPEC:
// The "/by/..." part is an optional power-user thing, not part of the MVP.
// Instead, the first time you go to alice.promises.to/foo it gives you the 
// option to choose a deadline, defaulting to now+7days (or to what the "/by/" 
// part parsed to, if that's easy, but just make it a suggestion for the user, 
// just like now+7days is if they don't specify a "/by/"). 
// For every subsequent GET of alice.promises.to/foo it shows the deadline, with
// no way to change it.

// IDEAS FOR LATER:
// Simpler date parsing:
//   Maybe the date has to be YYYY-MM-DD_HH:MM
//   Example: bob.promises.to/foo_the_bar/by/2017-09-13_12:00
// Magic spaces:
//   Whichever non-alphanumeric character is most common in the urtext, that's 
//   what's assumed to be a space and is replaced with spaces before parsing.
// Less magical version:
//   A non-alphanumeric character must follow "alice.promises.to/" and that
//   character is taken as the ersatz space. Eg:
//   alice.promises.to/_start_her_promises_with_underscores
// Flexibility on the '/by/' part:
//   Requiring the string '/by/' to appear in the promise URL means no ambiguity
//   about where to start parsing the deadline. But the Chrono parsing library 
//   actually does great taking the whole string like "foo the bar by noon 
//   tomorrow" and figuring out the time. We could also just take the last
//   occurrence of "by" and parse everything after it as the deadline.


// Routes

app.get('/', (req, resp) => { 
  resp.render('home');
})

app.get('/sign-up', (req, resp) => {
  resp.render('signup');
})

app.get('/:user.promises.to/:promise/by/:date', handlePromiseRequest);

// TODO: if the url was just alice.promises.to then we want to show alice's
// statistics and list of promises and everything
app.get('/:user.promises.to', function(req, resp) {});


// Actions

// TODO implement a 'delete' route?
// app.get('/promises/remove/:urtx', (req, resp) => {
//   Promise.findAll({
//    where: {
//      user: req.params.user
//    },
//   })
// })


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
    promises.forEach(function(promise) { // create nested array of promises by user
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    });
    resp.json(dbPromises);
  })
})

app.get('/promises/:user', function(req, resp) {
  var dbPromises = [];
  Promise.findAll({
   where: {
     user: req.params.user
   },
  }).then(function(promises) {
    // console.log('user promises', promises);
    promises.forEach(function(promise) {
      dbPromises.push(promise);
    });
    resp.json(dbPromises);
  })
})


// Utils

app.get('/reset', (req, resp) => {
  setup()
  resp.redirect('/')
})

// removes all entries from the promises table
app.get('/clear', (req, resp) => {
  Promise.destroy({where: {}})
  resp.redirect('/')
})

// utility to populate table with hardcoded promises above
function setup() { 
  Promise.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){         // and creates a new one!
      // Add the default promises to the database
      for (var i = 0; i < promises.length; i++) {
        Promise.create(parsePromise(promises[i]))
      }
    })
}

/* 
let test
//test = chrono.parseDate("foo the bar by sep 15th noon")
test = chrono.parseDate("Call_the_dentist by 2017-10-15 12pm")
console.log(`DEBUG: ${test} (unixtime = ${test.getTime()/1000}`)
console.log("DEBUG: ", JSON.stringify(parsePromise(promises[2])))
*/

// --------------------------------- 80chars ---------------------------------->
