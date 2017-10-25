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

// DATABASE FIELDS FOR THE PROMISES TABLE:
//   urtext -- full original text (URL) the user typed to create the promise
//   user -- who's making the promise, parsed as the subdomain in the urtext
//   slug -- unique identifier for the promise, parsed from the urtext URL
//   note -- optional additional notes or context for the promise
//   tini -- unixtime that the promise was made
//   tdue -- unixtime that the promise is due
//   tfin -- unixtime that the promise was (fractionally) fulfilled (even if 0%)
//   fill -- fraction fulfilled, default 0
//   firm -- true when the due date is confirmed and can't be edited again
//   void -- true if the promise became unfulfillable or moot
//   clix -- number of clicks a promise has gotten
// For example:
//   urtext = "bob.promises.to/foo_the_bar/by/noon_tomorrow"
//   user = "bob"
//   slug = "foo_the_bar"
//   note = "promised in slack discussion about such-and-such"
//   tini = [unixtime of first GET request of the promise's URL]
//   tdue = [what "noon tomorrow" parsed to at time tini]
//   tfin = [unixtime that the user marked the promise as fulfilled]
//   fill = 0
//   firm = false
//   void = false
//   clix = 0

// Other ideas for fields: 
// * information about the client that originally created the promise
// * whether the promise was created by the actual user (if they were logged in 
//   and were the first to click on it) or by another logged-in user or by 
//   someone not logged in

export default Promise = sequelize.define('promises', {
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
