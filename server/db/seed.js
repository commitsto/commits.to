import log from '../../lib/logger'

import { Promises, Users } from '../models'
import { parsePromise } from '../../lib/parse/promise'

import data from './data/promises.json' // dreev's promises for initial import

// dreev calls dibs on 'danny', 'dan', & 'd' in case we implement aliases
// usernames to disallow: 'www', 'admin',

const USERS = [
  /* testing */
  'alice', 'bob', 'carol', 'deb',
  /* initial co-conspirators */
  'dreev', 'sergii', 'kim', 'bee', 'braden',
  /* daily beemail */
  'byorgey', 'nick', 'josh', 'dehowell', 'caillu',
  'mbork', 'roy', 'jennyli', 'owen',
  /* weekly beemail */
  'samuel', 'cole', 'jessica', 'steven',
  /* contributors */
  'chris', 'stephen', 'temujin9', 'jordan',
  /* invitees */
  'pierre', 'chelsea', 'forrest',
  'mike',
]

// utility to populate table with hardcoded promises below
export const importJson = function() {
  return Promises.sync().then(function() {
    Object.keys(data).forEach((key) => {
      const { user: username, ...promise } = data[key]
      const parsedPromise = parsePromise({ promise, username, urtext: key })

      log.debug('importing promise', key, data[key], parsedPromise)

      Users.findOne({
        where: {
          username
        }
      })
        .then((u) => {
          const p = u && u.createPromise(parsedPromise)
          log.debug('creating imported promise:', u.username, parsedPromise, p)
        })
        .catch((err) => console.error('import error', err))
    })
  })
}

// drop db, create seed users, import test data
export const seed = function() {
  return Users.sync({ force: true }) // drops the table if it exists
    .then(function() {
      USERS.forEach((key) => {
        log.debug('create user', key)
        Users.create({ username: key })
      })
    })
    .then(() => {
      Promises.sync({ force: true }).then(() => importJson())
    })
    .catch((err) => console.error('import error', err))
}
