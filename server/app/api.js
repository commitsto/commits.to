import { Router } from 'express'
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

import log from 'lib/logger'
import { Promises } from 'models/db/'
import { seed, importJson } from '../db/seed'
import cache from '../db/cache'

import PromiseApi from '../api/v1/promise'
import UserApi from '../api/v1/user'

const api = Router()

// REST endpoints
api.use('/promise', PromiseApi)
api.use('/user', UserApi)

// Utils

// calculate and store reliability for each user
api.get('/cache', (req, resp) => {
  Sentry.init({
    dsn: 'https://afbebbc21b9e4b75a344cf2c7fa3a83a@o4504271213756416.ingest.sentry.io/4504271219392512',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })

  cache()
  resp.redirect('/')
})

// insert promises.json into db
api.post('/import', (req, resp) => {
  importJson()
  resp.redirect('/')
})

// drop db and repopulate
api.post('/reset', (req, resp) => {
  seed()
  resp.redirect('/')
})

// removes all entries from the promises table
api.post('/empty', (req, resp) => {
  Promises.destroy({ where: {} })
  resp.redirect('/')
})

// // catch-all
api.get('*', (req, res) => {
  log.info('render 401', req.originalUrl)
  res.send(401)
})

export default api
