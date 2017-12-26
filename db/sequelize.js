// --------------------------------- 80chars ---------------------------------->
import Sequelize from 'sequelize'

var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

const sequelize = new Sequelize(match[5], match[1], match[2], {
  dialect: 'postgres',
  protocol: 'postgres',
  port: match[4],
  host: match[3],
  logging: true //false
})

sequelize.authenticate()
  .then(function() {
    console.log('Database connection established')
  })
  .catch(function (err) {
    console.log('Database connection error: ', err)
  })

export { Sequelize, sequelize }
