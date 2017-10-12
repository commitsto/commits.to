// --------------------------------- 80chars ---------------------------------->
import Sequelize from 'sequelize'

var sequelize, Promise

// set up a new database using database credentials set in .env
sequelize = new Sequelize('database', process.env.DB_USER, 
                                      process.env.DB_PASS, {
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
});

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.')
    // define a new table 'promises'
    Promise = sequelize.define('promises', {
      urtx: { type: Sequelize.STRING  }, // urtext, including whole URL
      user: { type: Sequelize.STRING  }, // who's making the promise
      what: { type: Sequelize.STRING  }, // what's being promised
      tini: { type: Sequelize.INTEGER }, // unixtime that promise was made
      tdue: { type: Sequelize.STRING },
      domain: { type: Sequelize.STRING }, // request made on
      //wtdid: { type: Sequelize.INTEGER }, // unixtime promise was fulfilled
      //fill: { type: Sequelize.FLOAT   }, // fraction fulfilled
      //void: { type: Sequelize.BOOLEAN }, // whether promise was voided
      // text:   { type: Sequelize.STRING }, // this was just for testing
    })
    //setup()
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err)
  })

export { Promise, sequelize }

// DATABASE FIELDS FOR THE PROMISES TABLE:
//   urtext -- full original text (URL) the user typed to create the promise
//   user -- who's making the promise, parsed as the subdomain in the urtext
//   slug -- unique identifier for the promise, parsed from the urtext URL
//   note -- optional additional notes or context for the promise
//   tini -- unixtime that the promise was made
//   tdue -- unixtime that the promise is due
//   tfin -- unixtime that the promise was fulfilled
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
//   tfin = [unixtime that the promise was fulfilled]
//   fill = 0
//   firm = false
//   void = false
//   clix = 0

// Other ideas for fields: 
// * information about the client that originally created the promise
// * whether the promise was created by the actual user (if they were logged in 
//   and were the first to click on it) or by another logged-in user or by 
//   someone not logged in

// --------------------------------- 80chars ---------------------------------->
