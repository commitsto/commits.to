import moment from 'moment-timezone'
import _ from 'lodash'
import { Router } from 'express'

import { Promises, Users } from '../../models/'
import log, { deSequelize } from '../../../lib/logger'
import actionNotifier from '../../../lib/notify'
import parseCredit from '../../../lib/parse/credit'
import { diffPromises } from '../../../lib/parse/promise'

const userQuery = (user) => ({
  model: Users,
  where: { username: user }
})

const api = Router()

api.post('/_s/:user/promises/edit', (req, res) => {
  // invalid dates/empty string values should unset db fields
  const valOrNull = (val) => _.includes(['Invalid date', ''], val) ? null : val
  const data = _.mapValues(req.body, (val) => valOrNull(val))
  log.info('edit promise form data', data)

  Promises.find({
    where: {
      id: req.body.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    const oldPromise = deSequelize(promise)
    log.info('promise to be updated', oldPromise)

    promise.update({
      cred: parseCredit({ dueDate: promise.tdue, finishDate: promise.tfin }),
      ...data
    }).then(function(prom) {
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

api.post('/_s/:user/promises/complete', (req, resp) => {
  Promises.findOne({
    where: {
      id: req.body.id
    },
    include: [userQuery(req.params.user)],
  }).then(function(promise) {
    const tfin = moment().toDate()
    promise.update({
      tfin,
      cred: parseCredit({ dueDate: promise.tdue, finishDate: tfin })
    })
    log.info('promise completed', req.body, promise.id)
    resp.send(200)
  })
})

api.post('/_s/:user/promises/remove', (req, resp) => {
  Promises.destroy({
    where: {
      id: req.body.id
    },
  }).then(function(deletedRows) {
    log.info('promise removed', req.body, deletedRows)
    actionNotifier({
      resource: 'promise',
      action: 'deleted',
      identifier: req.body.id,
    })
    resp.send(200)
  })
})

// captcha
api.post('/_s/:user/promises/validate', ({ body: { id } = {} }, resp) => {
  if (!id) {
    resp.send(404)
  } else {
    Promises.upsert({ id: id.toLowerCase() })
      .then(function(promise) {
        log.info('promise validated', id, promise)
        resp.send(200)
      })
  }
})

export default api
