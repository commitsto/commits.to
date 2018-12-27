import { Router } from 'express'

import { Sequelize } from '../../db/sequelize'
import { Promises, Users } from '../../models/'
import log, { deSequelize } from '../../../lib/logger'
import { parsePromise, parsePromiseWithIp } from '../../../lib/parse/promise'

import addIdParser from '../id';

const api = Router()

addIdParser(api);

// // show promise
// api.get('/:id(*)', (req, res) => {
//   console.log('GET promise', req.params)
//   res.json({
//     promise: req.promise,
//     user: req.user,
//     // isNewPromise: isNewPromise({ promise: req.promise })
//   })

//   // log.debug('show promise', deSequelize(req.promise))

//   // update click after route has rendered
//   // res.on('finish', () => {
//   //   req.promise.increment(['clix'], { by: 1 }).then(prom => {
//   //     log.debug('clix incremented', deSequelize(prom))
//   //   })
//   // })
// })

// incomplete promises
api.get(['/promises/incomplete'], (req, res) => {
  Promises.findAll({
    where: {
      tfin: null,
      void: {
        [Sequelize.Op.not]: true
      },
      urtext: {
        [Sequelize.Op.not]: null
      },
    },
    // limit: 30
    include: [{
      model: Users
    }],
    order: Sequelize.literal('tini DESC'),
  }).then(function(promises) {
    log.debug('home promises', promises.length)

    res.json({
      promises
    })
  })
})

api.post('/promises/parse/', (req, res) => {
  const {
    promise = {},
    urtext,
    username,
    timezone,
  } = req.body

  const parsedPromise = parsePromise({ promise, urtext, username, timezone })

  if (!parsedPromise) {
    resp.send(400)
  } else {
    res.send(parsedPromise)
  }
})

api.post('/promises/create/', (req, res) => {
  const {
    promise = {},
    urtext,
    username,
    timezone,
  } = req.body

  const parsedPromise = parsePromise({ promise, urtext, username, timezone })

  if (!parsedPromise) {
    res.send(400)
  } else {
    Users.findOne({
      where: {
        username,
      }
    }).then(user => {
      if (user) {
        user.createPromise(parsedPromise)
          .then(function(prom) {
            log.info('promise created via POST', deSequelize(prom), req.body)
            res.status(201).send(prom)
          })
          .catch((reason) => res.status(400).send(reason))
      }
    })
  }
})

api.put('/promises/:username/:urtext', ({ ip, ...req }, res) => {
  const {
    urtext,
    username,
  } = req.params

  Users.findOne({
    where: {
      username,
    }
  }).then(async(user) => {
    if (user) {
      const parsedPromise = await parsePromiseWithIp({ urtext, username, ip })

      if (parsedPromise) {
        user.createPromise(parsedPromise)
          .then(function(prom) {
            log.info('promise created via PUT', deSequelize(prom))
            return res.status(201).send(prom)
          })
          .catch((reason) => res.status(400).send(reason))
      }
    }
    return res.status(400)
  })
})

export default api
