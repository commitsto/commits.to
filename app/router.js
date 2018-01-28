import _ from 'lodash'

import app from './express'
import log from '../lib/logger'
import mailself from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import Promises from '../models/promise'
import { Users } from '../models/user'

import { APP_DOMAIN } from '../data/config'
import parsePromise from '../lib/parse/promise'

import path from 'path'

// validates all requests with a :user param
app.param('user', function(req, res, next, id) {
  log.debug('user check', id)

  Users.findOne({
    where: {
      username: req.params.user,
    }
  }).then(user => {
    if (user) {
      req.user = user
      return next()
    }
    return res.redirect(`//${APP_DOMAIN}/sign-up`)
  })
})

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getPromises({
    include: [{
      model: Users
    }],
    order: [['tfin', 'DESC']],
  }).then(promises => {
    const c = _.filter(_.map(promises, x => x.credit), x => _.isFinite(x))
    const reliability = _.mean(c)
    log.debug(`${req.params.user}'s promises:`, reliability, promises.length)

    req.user.update({ score: reliability })

    promises.sort(function (a,b) {
      // pending promises are sorted by due date (tdue) ascending
      // completed promises are sorted by completion date (tfin) descending
      // completed promises sort after pending promises

      if ( a.tfin == null ) {
        if ( b.tfin == null ) {
          return a.tdue - b.tdue
        }
        else {
          return -1
        }
      }
      else {
        if ( b.tfin == null ) {
          return 1
        }
        else {
          return b.tfin - a.tfin
        }
      }
    })

    res.render('user', {
      promises,
      user: req.user,
      reliability
    })
  })
})

var nein = (req, resp) =>
  resp.status(404).sendFile(path.resolve(__dirname+'/../public/nein.html'))

// The deal with routing:
// 1. The subdomain handler turns URLs like 
//    "alice.commits.to/foo_bar/baz" into 
//    "/_s/alice/foo_bar/baz" 
//    (the "_s" is a magic string. https://en.wikipedia.org/wiki/Magic_string )
//    It's the "/_s/..." version that the router matches on.
// 2. There are a million gotchas and bugs with trying to use Express's partial
//    regex syntax -- eg, https://github.com/expressjs/express/issues/2495 -- so
//    we want to use actual regexes as the first arg to app.get() instead of
//    strings.
// 3. The matched groups in the regex can be accessed as req.params[1] etc.
// 4. If we wanted to use the string version, here's a handy route tester to see
//    how things get matched: https://wesleytodd.github.io/express-route-tester

// Paths to files we might want to serve but that don't currently exist
// (any files in /public will automatically get served)
app.get(/^\/_s\/(\w+)\/test\d*\.txt$/, nein) // eg test123.txt
app.get(/^\/_s\/(\w+)\/favicon\.ico$/, nein)
app.get(/^\/_s\/(\w+)\/apple-touch-icon.*\.png$/, nein)

// Things rogue bots or pentesters have tried to GET
app.get(/^\/_s\/(\w+)\/xmlrpc\.php$/, nein)
app.get(/^\/_s\/(\w+)\/cms\/wp-includes\/wlwmanifest\.xml$/, nein)
app.get(/^\/_s\/(\w+)\/hirevmcyvpgypnk\.html$/, nein)
app.get(/^\/_s\/(\w+)\/blog\/wp-includes\/wlwmanifest\.xml$/, nein)
app.get(/^\/_s\/(\w+)\/site\/wp-includes\/wlwmanifest\.xml$/, nein)
app.get(/^\/_s\/(\w+)\/wordpress\/wp-includes\/wlwmanifest\.xml$/, nein)
app.get(/^\/_s\/(\w+)\/wp-includes\/wlwmanifest\.xml$/, nein)
app.get(/^\/_s\/(\w+)\/wp\/wp-includes\/wlwmanifest\.xml$/, nein)

// Legacy redirects which I think eventually we need to provide a UI for so that
// the user can create these to their heart's delight whenever they, eg, give
// out a URL with a typo or an old promise is subsumed by an new one or whatever
app.get(/^\/_s\/alice\/old-url-testing\/?$/, (q, r) => r.redirect('/new-url')) 

app.get(/^\/_s\/dreev\/finish_implementing_this_system\/?$/, 
  (q, r) => r.redirect('/finish_implementing_this_system/by/january'))
app.get(/^\/_s\/dreev\/send_the_dang_belated_yearly_beemail\/by\/?$/, 
  (q, r) => r.redirect('/send_the_dang_belated_yearly_beemail/by/next_week'))

app.get(/^\/_s\/bee\/schedule-planning-with-cantor\/by\/friday-night\/?$/, 
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/reping-one-with-heart\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/put-away-camping-gear-this-weekend\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/call_jacob_this_week\/by\/next_week\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/fill-out-metromile-feedback\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/read-hannas-emails\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/email-sleep-as-android-for-specifics-about-sleep-length-measurement\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/rest-of-paperwork-to-yoko-before-the-gym-tomorrow\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/new-family-photo-to-yoko\/by\/tomorrow-night\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
app.get(/^\/_s\/bee\/reply-to-hin\/by\/tuesday\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))

// Here's where we reject URLs with bad characters but it would be better to
// specify a big regex defining exactly what *does* count as a valid promise URL
// and reject everything else.
// NB: Rejecting '#' is moot because we don't see them; the browser eats them.
// Also this isn't matching on query string so rejecting '?' here doesn't help.
// Things we might want to reject but that at least one existing promise 
// in the database currently uses: @ & : (at, ampersand, colon)
app.get(/^\/_s\/(\w+)\/.*[\!\%\$\^\*\(\)\[\]\=\+\{\}\\\|\;\'\"\`\~].*$/, nein)

// promise parsing middleware
app.get('/_s/:user/:promise/:modifier?/:date*?', (req, res, next) => {
  const { ip, originalUrl, params, parsedPromise, user } = req

  parsePromise({
    username: user.username,
    urtext: originalUrl,
    ip: ip
  }).then(parsedPromise => {
    req.parsedPromise = parsedPromise // add to the request object

    log.debug('promise middleware', originalUrl, ip, parsedPromise.id)

    Promises.findOrCreate({
      where: {
        id: parsedPromise.id
      },
      defaults: parsedPromise
    })
      .then((promise, created) => {
        let toLog = { level: 'debug', state: 'exists' }

        if (created) {
          toLog = { level: 'info', state: 'created' }
          mailself('PROMISE', promise[0].urtext) // send dreeves@ an email
        }
        log[toLog.level](`promise ${toLog.state}`, promise[0].dataValues)

        // do our own JOIN
        req.promise = promise[0]
        req.promise.user = req.user
        req.promise.setUser(req.user)

        req.promise.increment(['clix'], { by: 1 }).then(prom => {
          log.debug('clix incremented', prom.dataValues)
          return next()
        })
      })
  })
    .catch((reason) => { // unparsable promise
      log.error('promise parsing error', reason)
      return res.redirect('/')
    })
})

// edit promise (this has to come before the show route, else it's ambiguous)
app.get('/_s/:user/:urtext*?/edit', (req, res) => {
  log.debug('edit promise', req.promise.dataValues)
  res.render('edit', {
    promise: req.promise
  })
})

// show promise
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', req.promise.dataValues)
  res.render('show', {
    promise: req.promise,
    user: req.user,
  })
})

// home
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: { tfin: null }, // only show uncompleted
    // limit: 30
    include: [{
      model: Users
    }],
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    log.debug('home promises', promises.length)

    res.render('home', {
      promises
    })
  })
})

// placeholder
app.get('/sign-up', (req, res) => {
  log.debug('render sign up')
  res.render('signup')
})

// Final catchall route -- shouldn't ever actually be reached
app.get('*', (req, resp) => resp.status(404).send('404 Weirdly Not Found'))
