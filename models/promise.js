import Sequelize from 'sequelize';

var sequelize, Promise;

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
      tdue: { type: Sequelize.STRING }, // unixtime that the promise is due
      //tmzn: { type: Sequelize.STRING  }, // timezone
      //wtdid: { type: Sequelize.INTEGER }, // unixtime that the promise was fulfilled
      //fill: { type: Sequelize.FLOAT   }, // fraction fulfilled
      //void: { type: Sequelize.BOOLEAN }, // whether promise was voided
      // text:   { type: Sequelize.STRING }, // this was just for testing
    });    
    //setup()
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err)
  })

export { Promise, sequelize };

// DATABASE FIELDS:
//   urtx -- urtext, ie, full original text the user typed to create the promise
//   user -- who's making the promise
//   what -- what's being promised
//   whom -- to whom are you promising
//   tini -- unixtime that the promise was made
//   tdue -- unixtime that the promise is due
//   tmzn -- timezone assumed for parsing the deadline
//   tfin -- unixtime that the promise was fulfilled
//   fill -- fraction fulfilled, default 0
//   void -- true if the promise became unfulfillable or moot
//   clix -- number of clicks a promise has gotten
// For example:
//   urtx = "bob.promises.to/foo_the_bar/by/noon_tomorrow"
//   user = "bob"
//   what = "foo the bar"
//   whom = null
//   tini = [unixtime of first GET request of the promise's URL]
//   tdue = [what "noon tomorrow" parsed to at time tini]
//   tmzn = "America/Los_Angeles"
//   tfin = [unixtime that the promise was fulfilled]
//   fill = 0
//   void = false

// Other ideas for fields: 
// * information about the client that originally created the promise
// * whether the promise was created by the actual user (if they were logged in 
//   and were the first to click on it) or by another logged-in user or by 
//   someone not logged in
// * conf: maybe we create the promise whether or not anyone clicks the button to confirm
//   it, in which case we store when it's actually been confirmed.
