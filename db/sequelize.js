// --------------------------------- 80chars ---------------------------------->
import Sequelize from 'sequelize'

// set up a new database using database credentials set in .env
const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  logging: false,
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  // Security note: db is saved to `.data/database.sqlite` in local filesystem.
  // Nothing in `.data` directory gets copied if someone remixes the project.
  storage: `${process.env.DB_PATH || '.data/'}database.sqlite`
})

sequelize.authenticate()
  .then(function(err) {
    console.log('Database connection established')
  })
  .catch(function (err) {
    console.log('Database connection error: ', err)
  })

export default sequelize;

export { Sequelize };