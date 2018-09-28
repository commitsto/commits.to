import app from './express'
import { ALLOW_ADMIN_ACTIONS, ENVIRONMENT } from '../app/config'
import { Promises } from '../models/'
import { seed, importJson } from '../db/seed'
import cache from '../db/cache'

import FrontendApi from '../api/v1/frontend'
import PromiseApi from '../api/v1/promises'
import UserApi from '../api/v1/users'

// TODO: https://github.com/Vincit/objection.js/tree/master/examples/express-ts

// Client-side/browser API
app.use('/', FrontendApi)

// "REST" endpoints
app.use('/_s/api/v1', PromiseApi)
app.use('/_s/api/v1', UserApi)

// Utils

// calculate and store reliability for each user
app.get('/cache', (req, resp) => {
  cache()
  resp.redirect('/')
})

if (ENVIRONMENT !== 'production' || ALLOW_ADMIN_ACTIONS) {
  // insert promises.json into db
  app.get('/import', (req, resp) => {
    importJson()
    resp.redirect('/')
  })

  // drop db and repopulate
  app.get('/reset', (req, resp) => {
    seed()
    resp.redirect('/')
  })

  // removes all entries from the promises table
  app.get('/empty', (req, resp) => {
    Promises.destroy({ where: {} })
    resp.redirect('/')
  })
}
