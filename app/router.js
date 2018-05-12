import _ from 'lodash'

import app from './express'
import log, { deSequelize } from '../lib/logger'
import sendMail from '../lib/mail'

import { Sequelize } from '../db/sequelize'
import { promiseGallerySort } from '../models/promise'
import { Promises, Users } from '../models'

import { isNewPromise } from '../helpers/calculate'
import { parsePromise, parsePromiseWithIp } from '../lib/parse/promise'
import { calculateReliability } from '../lib/parse/credit'

// user promises list
app.get('/_s/:user', (req, res) => {
  log.debug('user promises', req.params.user)

  req.user.getValidPromises().then(promises => {
    const reliability = calculateReliability(promises)

    log.debug(`${req.params.user}'s promises:`, reliability, promises.length)

    req.user.update({ score: reliability })

    promises.sort(promiseGallerySort)

    res.render('user', {
      promises,
      user: req.user,
      reliability
    })
  })
})

// promise parsing
app.get('/_s/:user/:urtext(*)', (req, res, next) => {
  const { ip, originalUrl: urtext, user: { username } = {} } = req
  const isAuthoritative = _.get(req, 'useragent.isAuthoritative', false)
  const isBot = isAuthoritative && _.get(req, 'useragent.isBot', false)

  let parsedPromise = parsePromise({ username, urtext })
  let foundPromise = undefined

  return Promises.find({
    where: {
      id: parsedPromise.id
    },
  }).then(async(p) => {
    foundPromise = p
    let toLog = { level: 'debug', state: 'exists' }

    if (!foundPromise) {
      if (isBot && isBot !== 'curl') { // allow @philip to create promises
        log.error('bot creation attempt', username, urtext, isBot)
        return res.status(404).render('404')
      }

      parsedPromise = await parsePromiseWithIp({ username, urtext, ip })
        .catch((reason) => { // unparsable promise
          log.error('promise parsing error', reason)
          return res.render('404') // FIXME?
        })

      if (parsedPromise) {
        const useragent = JSON.stringify(_.pickBy(req.useragent))
        foundPromise = await Promises
          .create({ ...parsedPromise, ip, useragent })
          .catch((reason) => { // creating promise failed
            log.error('promise creation error', reason)
            return res.render('404') // FIXME?
          })
        toLog = { level: 'info', state: 'created' }
        // send @dreev an email
        sendMail({
          to: 'dreeves@gmail.com',
          subject: foundPromise.id,
          text: `New promise created by: ${username}: ${foundPromise.urtext}`,
        })
      }
    }

    log[toLog.level](`promise ${toLog.state}`, deSequelize(foundPromise))
    req.parsedPromise = parsedPromise // add to the request object
    // do our own JOIN
    req.promise = foundPromise
    req.promise.user = req.user
    req.promise.setUser(req.user)

    return next()
  })
    .catch((...reason) => { // couldn't handle this promise
      log.error('promise finding error', reason)
      return res.render('404') // FIXME?
    })
})

// show promise
app.get('/_s/:user/:urtext(*)', (req, res) => {
  log.debug('show promise', deSequelize(req.promise))
  res.render('show', {
    promise: req.promise,
    user: req.user,
    isNewPromise: isNewPromise({ promise: req.promise })
  })

  // update click after route has rendered
  res.on('finish', () => {
    req.promise.increment(['clix'], { by: 1 }).then(prom => {
      log.debug('clix incremented', deSequelize(prom))
    })
  })
})

// home
app.get(['/?'], (req, res) => {
  Promises.findAll({
    where: {
      tfin: null,
      void: {
        [Sequelize.Op.not]: true
      },
    }, // only show uncompleted
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
  log.info('render sign up')
  res.render('signup')
})


// catch-all
app.get('*', (req, res) => {
  log.info('render 404')
  res.render('404', req.originalUrl)
})
