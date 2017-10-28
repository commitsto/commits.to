// --------------------------------- 80chars ---------------------------------->
import Sequelize from 'sequelize'

// set up a new database using database credentials set in .env
export const sequelize = new Sequelize('database', process.env.DB_USER, 
                                                   process.env.DB_PASS, {
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
  storage: '.data/database.sqlite'
})

export default Promise = sequelize.define('promises', {
  // TODO: change 'urtx' to 'urtext' and see README for other fields
  urtx: { type: Sequelize.STRING  }, // urtext, including whole URL
  user: { type: Sequelize.STRING  }, // who's making the promise
  what: { type: Sequelize.STRING  }, // TODO: change to "slug"
  tini: { type: Sequelize.INTEGER }, // unixtime that promise was made
  tdue: { type: Sequelize.STRING },
  tfin: { type: Sequelize.STRING },
  // new argument against "domain": "commits.to" and "promises.to" might
  // diverge, as different implementations. we should assume this version
  // is "commits.to" and treat "promises.to" strictly as an alias.
  // i guess this isn't an argument against storing it, i just don't think we
  // should use it for anything currently.
  domain: { type: Sequelize.STRING }, // domain the request was made on
  //fill: { type: Sequelize.FLOAT   }, // fraction fulfilled
  //void: { type: Sequelize.BOOLEAN }, // whether promise was voided
  //text:   { type: Sequelize.STRING }, // this was just for testing
})

sequelize.authenticate()
  .then(function(err) {
    console.log('Database connection established')
  })
  .catch(function (err) {
    console.log('Database connection error: ', err)
  })

// --------------------------------- 80chars ---------------------------------->
