import { Router } from 'express'
import moment from 'moment-timezone'
import _ from 'lodash'

import Pledge from 'models/pledge';
import User from 'models/user';

import { Promises, Users } from 'models/db'
import log, { deSequelize } from '../../../lib/logger'
import { parsePromise, parsePromiseWithIp } from '../../../lib/parse/promise'
import actionNotifier from '../../../lib/notify'
import parseCredit from '../../../lib/parse/credit'
import { diffPromises } from '../../../lib/parse/promise'

import addIdParser from '../id';

const userQuery = (user) => ({
  model: Users,
  where: { username: user }
});

const api = Router()
addIdParser(api);

api.get('/', (req, res) => {
  log.info('GET promise', req.query);
  Pledge.find(req.query).then((promise) => {
    res.json({ promise })
    log.debug('show promise', deSequelize(promise))
  });
})

api.get(['/incomplete'], (req, res) => {
  Pledge.findIncomplete().then((promises) => {
    res.json({ promises })
    log.debug('incomplete promises', promises.length)
  })
})

api.post('/parse/', (req, res) => {
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

api.post('/create/', (req, res) => {
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

api.put('/:username/:urtext', ({ ip, ...req }, res) => {
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

// TODO: make this work
api.post('/complete', (req, resp) => {
  Pledge.find({ id: req.body.id }).then((promise) => {
    const tfin = moment().toDate()
    promise.update({
      tfin,
      cred: parseCredit({ dueDate: promise.tdue, finishDate: tfin })
    })
    log.info('promise completed', req.body, promise.id)
    resp.send(200)
  })
})

api.post('/remove', (req, resp) => {
  Promises.destroy({
    where: {
      id: req.body.id
    },
  }).then(function (deletedRows) {
    log.info('promise removed', req.body, deletedRows)
    actionNotifier({
      resource: 'promise',
      action: 'deleted',
      identifier: req.body.id,
    })
    resp.send(200)
  })
})

api.post('/edit', (req, res) => {
  // invalid dates/empty string values should unset db fields
  const valOrNull = (val) => _.includes(['Invalid date', ''], val) ? null : val
  const data = _.mapValues(req.body, (val) => valOrNull(val))
  log.info('edit promise form data', req.body)

  Promises.find({
    where: {
      id: req.body.id
    },
    include: [{ model: Users }],
  }).then(function (promise) {
    const oldPromise = deSequelize(promise)
    log.info('promise to be updated', oldPromise)

    promise.update({
      cred: parseCredit({ dueDate: promise.tdue, finishDate: promise.tfin }),
      ...data
    }).then(function (prom) {
      const difference = diffPromises(oldPromise, deSequelize(prom))

      if (!_.isEmpty(difference)) {
        log.info('promise updated', difference)

        actionNotifier({
          resource: 'promise',
          action: 'edited',
          identifier: req.body.id,
          meta: difference,
        })
      }

      if (promise) {
        res.redirect(`/${prom.urtext}`)
      } else {
        res.redirect('/')
      }
    })
  })
})

// // captcha
// api.post('/validate', ({ body: { id } = {} }, resp) => {
//   if (!id) {
//     resp.send(404)
//   } else {
//     Promises.upsert({ id: id.toLowerCase() })
//       .then(function (promise) {
//         log.info('promise validated', id, promise)
//         resp.send(200)
//       })
//   }
// })

export default api
