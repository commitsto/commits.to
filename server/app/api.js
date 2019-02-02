import { Router } from 'express';

import log from '../../lib/logger'
import { Promises } from '../models/'
import { seed, importJson } from '../db/seed'
import cache from '../db/cache'

import PromiseApi from '../api/v1/promise'
import UserApi from '../api/v1/user'

const api = Router();

// REST endpoints
api.use('/promise', PromiseApi)
api.use('/user', UserApi)

// Utils

// calculate and store reliability for each user
api.get('/cache', (req, resp) => {
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

export default api;
