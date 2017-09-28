// --------------------------------- 80chars ---------------------------------->
var express = require('express')
var Sequelize = require('sequelize')
var app = express()
var chrono = require('chrono-node') // Sugar.js parses some things better
var Mailgun = require('mailgun-js')
var moment = require('moment')

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

// LATEST SPEC:
// The "/by/..." part is an optional power-user thing, not part of the MVP.
// Instead, the first time you go to alice.promises.to/foo it gives you the 
// option to choose a deadline, defaulting to now+7days (or to what the "/by/" 
// part parsed to, if that's easy, but just make it a suggestion for the user, 
// just like now+7days is if they don't specify a "/by/"). 
// For every subsequent GET of alice.promises.to/foo it shows the deadline, with
// no way to change it.

// IDEAS FOR LATER:
// Simpler date parsing:
//   Maybe the date has to be YYYY-MM-DD_HH:MM
//   Example: bob.promises.to/foo_the_bar/by/2017-09-13_12:00
// Magic spaces:
//   Whichever non-alphanumeric character is most common in the urtext, that's 
//   what's assumed to be a space and is replaced with spaces before parsing.
// Less magical version:
//   A non-alphanumeric character must follow "alice.promises.to/" and that
//   character is taken as the ersatz space. Eg:
//   alice.promises.to/_start_her_promises_with_underscores
// Flexibility on the '/by/' part:
//   Requiring the string '/by/' to appear in the promise URL means no ambiguity
//   about where to start parsing the deadline. But the Chrono parsing library 
//   actually does great taking the whole string like "foo the bar by noon 
//   tomorrow" and figuring out the time. We could also just take the last
//   occurrence of "by" and parse everything after it as the deadline.

app.use(express.static('public'))

function mailself(subj, body) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_KEY, 
                             domain: process.env.MAILGUN_DOMAIN})
  var data = {
    from:    process.env.MAILGUN_FROM,
    to:      process.env.MY_EMAIL,
    subject: subj,
    text:    body,
  }
  mailgun.messages().send(data, (err, body) => {})
}

// Take urtext and return a promise data structure
function parseProm(urtx) {
  let m = urtx.match(/^([^\.]+)\.(promises|commits)\.to\/(.*)$/)
  // TODO: handle the case that no user is given, just "promises.to/foo"
  let user = m ? m[1] : ''
  let domain = m ? m[2] : ''
  let path = m ? m[3] : ''
  let what = ''
  let tdue = Date.now() + 7*24*60*60*1000
  if (path.length > 0) {
    let parsedPath = path.match(/^(.*?)(\/by\/|$)(.*)$/)
    what = parsedPath[1] //.replace(/_/g, ' ')
    //tdue = parsedPath.length > 1 ? 
    //       chrono.parseDate(parsedPath[3].replace(/_/g, ' ')) * 1 : 
    //       Date.now() + 7*24*60*60*1000
    //tdue = tdue ? ( ( tdue < Date.now() && Date.now() - tdue < 24*60*60*1000 ) ?
    //                tdue + 24*60*60*1000 : tdue )
    //            : Date.now() + 7*24*60*60*1000
    tdue = parsedPath[3]
  }
  // TODO: path is now everything after ".promises.to" so now parse out the 
  //       "what" (thing being promised) and the "tdue" (deadline)
  console.log('parseProm', { user, path, domain, what, tdue, urtx })
  return { user, path, domain, what, tdue, urtx, tini: Date.now() }
}

// Compute the credit you get for being t seconds late
function credit(t) {
  // see latepenalty.js
  return 1
}

// Initial promise list hardcoded so don't have to worry about blowing db away
let promises = [
  "alice.promises.to/File_the_TPS_report/by/noon_mon",
  "bob.promises.to/Send_vacation_photos/by/saturday",
  "carol.promises.to/Call_the_dentist/by/12am",
  "dreev.promises.to/show_sergii_this_doing_something_useful/by/3am", // 9-10, done
  "dreev.promises.to/show_bee_open_questions/by/10:30pm", // 9-10, done
  "braden.promises.to/help_with_javascript/by/5pm", // 9-11
  "dreev.promises.to/show_brennan_intro/by/10:50pm", // 9-11, done
  "dreev.promises.to/queue_tweet_etc_for_blog_post/by/2pm", // 9-11, done
  "dreev.promises.to/order_indian/by/5:30pm", // 9-12, done
  "dreev.commits.to/ask_bee_re_sunday_parkways", // 9-13, done
  "dreev.commits.to/follow_up_with_everyone_re_guest_blogging", // 9-13
  "josh.commits.to/get_realisies_running/by/september_30", // 9-13
  "braden.commits.to/outline_bite_counting_post/by/Sunday_11pm", // 9-13
  "dreev.commits.to/report_glitch_bug", // 9-14
  "dreev.commits.to/googledocify_intern_form/by/12pm", // 9-14
  "dreev.promises.to/test_penalty_func/by/saturday_noon", // 9-14
  "sergii.promises.to/work_on_points_2_to_4/by/next_monday", // 9-14
  "dreev.commits.to/meta_debrief_kim/by/midnight_friday", // 9-14
  "dreev.commits.to/ping_mirabai/by/sep_22", // 9-14
  "dreev.commits.to/send_ms_gross_email/by/sunday_11am", // 9-14
  "dreev.promises.to/ping_oli/by/nov_16", // 9-15
  "dreev.promises.to/ping_byorgey/by/dec_20", // 9-15
  "dreev.promises.to/labelzero/by/1am", // 9-15
  "chris.promises.to/follow_up_on_that_support_thread", // 9-18
  "bee.commits.to/new-family-photo-to-yoko/by/tomorrow-night", // 9-18, done early
  "bee.commits.to/rest-of-paperwork-to-yoko-before-the-gym-tomorrow", // 9-18, 2 hours late
  "dreev.promises.to/debug_capitalization/by/tomorrow", // 9-18, done 23.4 hours late
  "bee.commits.to/email-sleep-as-android-for-specifics-about-sleep-length-measurement", // 9-19
  "jessica.commits.to/let_bob_know_re_meeting/by/tomorrow_5pm", // 9-19
  "samuel.commits.to/finish_ch_23_problem_set/by/today_6_pm", // 9-19
  "dreev.promises.to/intern_disc/by/wed", // 9-19, done early
  "kim.promises.to/email_argue_summary/by/fri", // 9-19
  "dreev.commits.to/clear_bogus_commit_for_nick/by/5_minutes_from_now", // 9-19, done early
  "kim.promises.to/reflect_Respond_anxiety_spiral_Assist/by/sat", // 9-19
  "dreev.commits.to/schedule-k_tax_thing/by/5pm", // 9-19, done
  "dreev.promises.to/set_up_mom_on_wordfeud/by/tomorrow", // 9-20, done/void
  "dreev.promises.to/reply_to_use_case_email/by/midnight", // 9-20, done early
  "kim.promises.to/consider_all_weekend_social_options/by/fri/10pm", // 9-20
  "kim.promises.to/submit_conclusion_email/by/10/16", // 9-21
  "kim.promises.to/complete_type_1_essay/by/10/1", // 9-21
  "kim.promises.to/inform_eve_plans/by/2", // 9-21
  "kim.promises.to/email_cynthia_charlap_tickets/by/9/22", // 9-21
  "kim.promises.to/schedule_attorney_meet/by/10/1", // 9-21
  "kim.promises.to/john_PAM_photos_ask/by/10/1", // 9-21
  "kim.promises.to/Nike_p5_email/by/10/1", // 9-21
  "kim.promises.to/intro_martin_marna/by/10/5", // 9-21
  "kim.promises.to/sbonomic_jitsjudgelist_doc/by/10/15", // 9-21
  "kim.promises.to/consider_all_weekend_social_options/by/fri/10pm", // 9-21
  "dreev.commits.to/dedup_the_iwills/by/nov", // 9-22
  "byorgey.promises.to/email_cut_property_summary/by/7pm", // 9-22
  "dreev.commits.to/copy_editing_pass_on_tao2/by/tmw_2pm", // 9-22, done
  "chris.promises.to/open_a_smoothie_shop/by/December", // 9-25
  "pierre.promises.to/water_the_office_plant/by/Friday", // 9-25
  "dreev.promises.to/hanna_reply/by/tonight", // 9-26, done
  "bee.promises.to/read-hannas-emails", // 9-26
  "bee.promises.to/reping-one-with-heart", // 9-26
  "bee.promises.to/fill-out-metromile-feedback", // 9-26
  "bee.promises.to/schedule-planning-with-cantor/by/friday-night", // 9-26
  "dreev.promises.to/ask_jana_about_blood_testers/by/dec_1", // 9-26
  "dreev.commits.to/take_copyediting_pass_on_micheles_draft/by/saturday", // 9/27,
  "stephen.promises.to/decide_upon_late_october_trip/by/saturday", // 9-27
  "roy.promises.to/sign_up_for_app", // 9-27
  "jennyli.promises.to/water_the_plants/by/sunday"  // 9-27
]

let users = [ 
  "alice", "bob", "carol", // testing
  "dreev", "sergii", "kim", "bee", "braden", // initial co-conspirators
  "byorgey", "nick", "josh", "dehowell", "caillu", "mbork", "roy", "jennyli", // daily beemail
  "samuel", "cole", "jessica", "steven", // weekly beemail
  "chris", "stephen", // contributors
  "pierre", // invitees
]

/* 
let test
//test = chrono.parseDate("foo the bar by sep 15th noon")
test = chrono.parseDate("Call_the_dentist by 2017-10-15 12pm")
console.log(`DEBUG: ${test} (unixtime = ${test.getTime()/1000}`)
console.log("DEBUG: ", JSON.stringify(parseProm(promises[2])))
*/

var Promise

// set up a new database using database credentials set in .env
var sequelize = new Sequelize('database', process.env.DB_USER, 
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

// populate table with hardcoded promises above
function setup() { 
  Promise.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){         // and creates a new one!
      // Add the default promises to the database
      for (var i = 0; i < promises.length; i++) {
        Promise.create(parseProm(promises[i]))
      }
    })
}

app.get('/promise/:udp/:urtx', function(req, resp) {
  let urtx = req.originalUrl.substr(9)
  Promise.findOne({ where: {urtx}})
    .then(function(promise) {
      console.log('single promise', urtx, promise)
    // resp.write(promise)
    resp.json(promise)
  })

})

app.get('/', (req, resp) => { 
  resp.sendFile(__dirname + '/public/index.html') 
})

app.get('/promises', function(req, resp) {
  var dbPromises = {}
  Promise.findAll({
    order: sequelize.literal('tini DESC')
  }).then(function(promises) {
    console.log('a;; promises', promises)
    promises.forEach(function(promise) {
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise) // adds their info to dbPromises value
    });
    resp.send(dbPromises) // sends dbPromises back to the page
  })
})

app.get('/promises/:user', function(req, resp) {
  var dbPromises = [];
  Promise.findAll({
   where: {
     user: req.params.user
   },
  }).then(function(promises) {
    console.log('user promises', promises);
    promises.forEach(function(promise) {
      dbPromises.push(promise) // adds their info to dbPromises value
    });
    resp.send(dbPromises) // sends dbPromises back to the page
  })
})

app.get('/promises/remove/:urtx', (req, resp) => {
  Promise.findAll({
   where: {
     user: req.params.user
   },
  })
})

// creates a new entry in the promises table with the submitted values
app.post('/promises', (req, resp) => {
  console.log('promise req', req, resp);
  Promise.create({ text: req.query.promise })
  resp.sendStatus(200)
})

app.get('/reset', (req, resp) => {
  setup()
  resp.redirect('/')
})

// removes all entries from the promises table
app.get('/clear', (req, resp) => {
  Promise.destroy({where: {}})
  resp.redirect('/')
})

/*
Little picture: Why does this error handling code not run when I surf to 
a bad URL like iwill.glitch.me/foo%bar

Bigger picture: I'm making an app that needs to process any URL the user may 
throw at it. I need the server to get the exact URL the way the user sees it in 
the browser. That's going to be especially tricky for things like '#' characters
but right now I'm just trying to figure out the case of arbitrary '%' characters
that may not correspond to proper %-encodings.

I'm thinking like a catchall error-handling route that no matter what weird
encoding or whatever error is thrown I can still have the code here do something
with the URL as the user typed it.

For now we're just dropping all this and having the app give the user an error
if there are any weird characters in the URL.

app.use(function(req, resp, next) {
  var err = null
  try {
    console.log("TRYING", req.path, req.url)
    decodeURIComponent(req.path)
  } catch(e) {
    err = e
  }
  if (err) {
    console.log("CAUGHT ERR:", err, req.url)
    return resp.redirect('/')
  }
  next();

  //console.log("DEBUG USE1:", req.originalUrl)
  //resp.redirect('/')
})
*/

app.all('*', (req, resp) => {
  // The server at promises.to passes along the full URL the way the user typed
  // it, so when the user hits "bob.promises.to/foo" the Glitch app is called
  // with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
  // "/bob.promises.to/foo" (originalUrl doesn't include the hostname)
  let urtx = req.originalUrl.substr(1) // get rid of the initial slash
  // urtx is now, eg, "bob.promises.to/foo_the_bar/by/9am"
  
  // TODO: don't try to parse a promise if no subdomain, ie, no user given
  // TODOLATER: how to handle "bob.promises.to/foo%bar"
  // TODOLATER: need to url-decode to handle "bob.promises.to/foo^bar"
  // TODOLATER: handle bob.promises.to/do_item_#2/by/9am
  //           https://stackoverflow.com/questions/18796421/capture-anchor-links
  
  console.log("DEBUG urtx:", urtx)
  // Parse the urtext into user, what, whom, tini, tdue, etc
  // Check if a promise already exists with matching user+'|'+what
  // If not, create it
  // If so, do nothing
  let p = parseProm(urtx)
  // TODO: if the url was just alice.promises.to then we want to show alice's
  // statistics and list of promises and everything
  if (p.user === 'www' || p.user === '') { 
    // TODO: this is the case of no username, like if someone just went to
    // "promises.to" or tried to fetch "promises.to/robots.txt" or whatever
    resp.sendFile(__dirname + '/public/index.html') 
  } else if (!users.includes(p.user)) {
    // TODO: tell user "Sorry, no such user! Get in touch if you want to get in
    // on our beta!"
    resp.sendFile(__dirname + '/public/index.html')
  } else {
    Promise.findOne({ where: {urtx} })
      .then(promise => {
        if (promise) {
          console.log('duplicate', urtx);
          resp.redirect(`/promise/${urtx}`);
        } else {
          Promise.create(p);
          mailself('PROMISE', urtx);
        }
    })
 
    resp.sendFile(__dirname + '/public/index.html') 
  }
})

var listener = app.listen(process.env.PORT, function() {
  console.log('Promises app is listening on port ' + listener.address().port)
})

// --------------------------------- 80chars ---------------------------------->
