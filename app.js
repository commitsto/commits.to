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
  // debug: true,
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

app.get([
  '/',
  '/promises.to/?',
  '/commits.to/?'
], (req, resp) => { 
  const domain = req.originalUrl.substr(1).replace('/',''); // FIXME use domain parsing lib?
  console.log('home', req.originalUrl, domain);
  resp.render('home', {domain: domain});
});

app.get('/sign-up', (req, resp) => { resp.render('signup') })

// we want any actionable route to be handled by the middleware and for now
// we probably don't want to let anyone just create promises with domains that don't exist
// FIXME: we should have a single configurable list of domains
app.get('/:user.([promises|commits]+\.to+)/:promise?/:modifier?/:date?', handlePromiseRequest)

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
    // create nested array of promises by user:
    promises.forEach(function(promise) { 
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
      dbPromises.push(promise)
    })
    resp.json(dbPromises)
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
Little picture: Why does this error handling code not run when I surf to 
a bad URL like iwill.glitch.me/foo%bar

Bigger picture: I'm making an app that needs to process any URL the user may 
throw at it. I need the server to get the exact URL the way the user sees it in 
the browser. That's going to be especially tricky for things like '#' characters
but right now I'm just trying to figure out the case of arbitrary '%' characters
that may not correspond to proper %-encodings.

I'm thinking like a catchall error-handling route that no matter what weird
encoding or whatever error is thrown I can still have the code here do something
with the URL as the user typed it.

For now we're just dropping all this and having the app give the user an error
if there are any weird characters in the URL.

app.use(function(req, resp, next) {
  var err = null
  try {
    console.log("TRYING", req.path, req.url)
    decodeURIComponent(req.path)
  } catch(e) {
    err = e
  }
  if (err) {
    console.log("CAUGHT ERR:", err, req.url)
    return resp.redirect('/')
  }
  next();

  //console.log("DEBUG USE1:", req.originalUrl)
  //resp.redirect('/')
})
*/

/* 
let test
//test = chrono.parseDate("foo the bar by sep 15th noon")
test = chrono.parseDate("Call_the_dentist by 2017-10-15 12pm")
console.log(`DEBUG: ${test} (unixtime = ${test.getTime()/1000}`)
console.log("DEBUG: ", JSON.stringify(parsePromise(promises[2])))
*/

// --------------------------------- 80chars ---------------------------------->
