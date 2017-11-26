// --------------------------------- 80chars ---------------------------------->
import Sequelize from 'sequelize'
import moment from 'moment-timezone'

import parseCredit from '../lib/parse/credit'

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

// new argument against "domain": "commits.to" and "promises.to" might
// diverge, as different implementations. we should assume this version
// is "commits.to" and treat "promises.to" strictly as an alias.
// i guess this isn't an argument against storing it, i just don't think we
// should use it for anything currently.

export default sequelize.define('promises', {
  id: { type: Sequelize.STRING, primaryKey: true }, // normalized urtext
  bmid: { type: Sequelize.STRING }, // the id of the Beeminder datapoint for this promise
  urtext: { type: Sequelize.STRING }, // full original text (URL) the user typed to create the promise
  domain: { type: Sequelize.STRING }, // domain the request was made on
  
  user: { type: Sequelize.STRING }, // who's making the promise, parsed as the subdomain in the urtext
  slug: { type: Sequelize.STRING }, // unique identifier for the promise, parsed from the urtext URL
  what: { type: Sequelize.STRING }, // human-readable formatted version of the slug
  
  firm: { type: Sequelize.BOOLEAN, defaultValue: false }, // firm: true when the due date is confirmed and can't be edited again
  void: { type: Sequelize.BOOLEAN, defaultValue: false }, // true if the promise became unfulfillable or moot
  cred: { type: Sequelize.DOUBLE, defaultValue: null }, // score calculated by latepenatly
  
  credit: {
    type: Sequelize.VIRTUAL,
    get: function() {
      // TODO make parseCredit more robust
      const cred = parseCredit({
        dueDate: this.get('tdue'),
        finishDate: this.get('tfin') || undefined // for default param to override
      })
      
      console.log('virtual credit', cred)
      return cred
    }
  },
  
  tini: { type: Sequelize.DATE, defaultValue: moment() }, // when the was promise was made
  tdue: { type: Sequelize.DATE/*, defaultValue: moment().tz('America/New_York').add(1, 'days')*/ }, // unixtime that the promise is due
  tfin: { type: Sequelize.DATE, defaultValue: undefined }, // When the promise was (fractionally) fulfilled (even if 0%)
  xfin: { type: Sequelize.DOUBLE, defaultValue: 0 }, // fraction fulfilled, default 0 (also {value} for bmndr datapoint)
  
  clix: { type: Sequelize.INTEGER, defaultValue: 0 }, // number of clicks a promise has gotten
  note: { type: Sequelize.STRING }, // optional additional notes or context for the promise 
}, {
  indexes: [
    {
      // unique: true,
      fields: ['user']
    }
  ]
})

sequelize.authenticate()
  .then(function(err) {
    console.log('Database connection established')
  })
  .catch(function (err) {
    console.log('Database connection error: ', err)
  })

// --------------------------------- 80chars ---------------------------------->
