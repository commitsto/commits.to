import Sequelize from 'sequelize'

import { DATABASE_URL } from '../app/config'
import log from '../../lib/logger'

const postgresRegex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
let sequelize = { define: () => {} } // stub

if (DATABASE_URL) {
  let match = DATABASE_URL.match(postgresRegex)
  sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true // false
  })

  if (process.env.NODE_ENV !== 'test') { // will hang on mocha exiting
    sequelize.authenticate()
      .then(function() {
        log.info('Database connection established')
      })
      .catch(function(err) {
        log.error('Database connection error: ', err)
      })
  }
}

export { Sequelize, sequelize }
