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
      //whom: { type: Sequelize.STRING  }, // to whom are you promising
      tini: { type: Sequelize.INTEGER }, // unixtime that promise was made
      tdue: { type: Sequelize.STRING },
      // TODO: i don't think we need a field for the domain. we can parse it
      //       from the urtext whenever we may want it.
      domain: { type: Sequelize.STRING },// request made on
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
//   slug -- https://en.wikipedia.org/wiki/Semantic_URL#Slug (previously "what")
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
//   tini = [unixtime of first GET request of the promise's URL]
//   tdue = [what "noon tomorrow" parsed to at time tini]
//   tfin = [unixtime that the promise was fulfilled]
//   fill = 0
//   void = false
//   clix = 0
//   conf = false
//   note = "promised in slack discussion about such-and-such"

// Other ideas for fields: 
// * information about the client that originally created the promise
// * whether the promise was created by the actual user (if they were logged in 
//   and were the first to click on it) or by another logged-in user or by 
//   someone not logged in
// * conf: maybe we create the promise whether or not anyone clicks the button 
//   to confirm it, in which case we store when it's actually been confirmed
// * 

/* SCRATCH NOTES

urtext -- URL originally used to create the promise
user/subdomain -- parsed from the urtext
slug -- parsed from the urtext
whom (not currently used) -- to whom you are promising
tini -- date the promise was created
tdue -- due date

*/

// --------------------------------- 80chars ---------------------------------->
