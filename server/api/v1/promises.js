import { Router } from 'express'

import { Users } from '../../models/'
import log, { deSequelize } from '../../../lib/logger'
import { parsePromise, parsePromiseWithIp } from '../../../lib/parse/promise'

const api = Router()

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
