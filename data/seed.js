import _ from 'lodash'

import Promises from '../models/promise'
import Users from '../models/user'
import { parsePromise } from '../lib/parse/promise'
import parseCredit from '../lib/parse/credit'

import data from './promises.json'

Users.hasMany(Promises, { constraints: false })
Promises.belongsTo(Users, { constraints: false })

// create seed users
export function seed() { 
  Users.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){
      users.forEach((key) => {
        console.log('create user', key)
        Users.create({id: key})
      })
    })
}

// FIXME refactor parsePromise to work for all imports

export function importJson() {
  Promises.sync().then(function(){
    Object.keys(data).forEach((key) => {
      
      // ***FIXME refactor into method
      const { user, slug, note, tini, tdue, tfin, xfin } = data[key]
      const promise = { 
        id: key.toLowerCase(),
        urtext: key,
        user,
        slug,
        what: slug,
        note,
        cred: tfin && tdue && parseCredit({ dueDate :tdue, finishDate: tfin }) || null,
        tini: tini && new Date(tini) || null,
        tdue: tdue && new Date(tdue) || null,
        tfin: tfin && new Date(tfin) || null,
        xfin
      }
      console.log('import', key, data[key], promise)
      Promises.create(promise)
    })
  })
}

// utility to populate table with hardcoded promises below
export function setup() { 
  Promises.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){
      Object.keys(promises).forEach((key) => {
        let prom = parsePromise({ urtext: key })
        prom = _.extend(prom, promises[key])
        Promises.create(prom)
      })
    })
}

export const users = [ 
  /* testing */ 
  "alice", "bob", "carol",
  /* initial co-conspirators */ 
  "dreev", "sergii", "kim", "bee", "braden", 
  /* daily beemail */ 
  "byorgey", "nick", "josh", "dehowell", "caillu", "mbork", "roy", "jennyli", 
  "owen",
  /* weekly beemail */ 
  "samuel", "cole", "jessica", "steven",
  /* contributors */ 
  "chris", "stephen", "temujin9",
  /* invitees */ 
  "pierre", "chelsea", 
]

// dreev calls dibs on "danny", "dan", & "d" in case we implement aliases
// usernames to disallow: "www", "admin", 

// Initial promise list hardcoded so don't have to worry about blowing db away
export const promises = {
  // examples
  "alice.promises.to/File_the_TPS_report/by/noon_mon": {},
  "bob.promises.to/Send_vacation_photos/by/saturday": {},
  "carol.promises.to/Call_the_dentist/by/12am": {},

  "chris.promises.to/follow_up_on_that_support_thread": {
    tini: '2017-9-18'
  },
  "chris.promises.to/open_a_smoothie_shop/by/December": {
    tini: '2017-9-25'
  },
  "chris.promises.to/learn-more-about-glitch/by/monday": {
    tini: '2017-9-28'
  },
  "chris.promises.to/learn-more-about-something-else/by/monday": {
    tini: '2017-9-28'
  },
  "chris.promises.to/build-out-a-promise-completion-interface/by/next-week": {
    tini: '2017-0-13'
  },
  "chris.promises.to/finish-the-datepicker-feature/by/tomorrow": {
    tini: '2017-0-28'
  },
  "chris.promises.to/finish-the-latest-pr/by/tonight": {
    tini: '2017-1-02'
  },

  "braden.promises.to/help_with_javascript/by/5pm": {
    tini: '2017-9-11'
  },
  "braden.commits.to/outline_bite_counting_post/by/Sunday_11pm": {
    tini: '2017-9-13'
  },

  "byorgey.promises.to/email_cut_property_summary/by/7pm": {
    tini: '2017-9-22'
  },
  "byorgey.promises.to/upload_new_factorization_cards/by/Oct_25": {
    tini: '2017-0-18'
  },
  "byorgey.promises.to/email_cut_property_summary": {
    tini: '2017-0-18'
  },

  "owen.promises.to/adjust-the-shed/by/tonight_7pm": {
    tini: '2017-9-28'
  },
  "owen.promises.to/research_and_pseudocode_calendar_integration/by/oct_6": {
    tini: '2017-9-9',
    tdue: '2017-10-6'
  },
  
  "josh.commits.to/get_realisies_running/by/september_30": {
    tini: '2017-9-13'
  },
  "josh.promises.to/get_realsies_payment_dashboard_up/by/2017_11_30": {
    tini: '2017-1-15'
  },

  "sergii.promises.to/work_on_points_2_to_4/by/next_monday": {
    tini: '2017-9-14'
  },
  "jessica.commits.to/let_bob_know_re_meeting/by/tomorrow_5pm": {
    tini: '2017-9-19'
  },
  "samuel.commits.to/finish_ch_23_problem_set/by/today_6_pm": {
    tini: '2017-9-19'
  },
  "pierre.promises.to/water_the_office_plant/by/Friday": {
    tini: '2017-9-25'
  },
  "stephen.promises.to/decide_upon_late_october_trip/by/saturday": {
    tini: '2017-9-27'
  },
  "roy.promises.to/sign_up_for_app": {
    tini: '2017-9-27'
  },
  "jennyli.promises.to/water_the_plants/by/sunday": {
    tini: '2017-9-27'
  },
  "cole.promises.to/find_a_rep_for_dining_vendors": {
    tini: '2017-9-28'
  },
  "caillu.commits.to/test_trying_out_time/by/2017-09-30_20:42": {
    tini: '2017-9-30'
  },
  "mbork.promises.to/edit_tutorial_for_students/by/tomorrow_8am": {
    tini: '2017-0-06'
  },

  "bee.commits.to/new-family-photo-to-yoko/by/tomorrow-night": {
    tini: '2017-9-8',
    tfin: '2017-9-9',
    cred: .9
  },
  "bee.commits.to/rest-of-paperwork-to-yoko-before-the-gym-tomorrow": {
    tini: '2017-9-17',
    tdue: '2017-9-18 9:59',
    tfin: '2017-9-18 11:59',
    cred: .99,
    note: '2 hours late'
  },
  "bee.commits.to/email-sleep-as-android-for-specifics-about-sleep-length-measurement": {
    tini: '2017-9-19'
  },
  "bee.promises.to/read-hannas-emails": {
    tini: '2017-9-6',
    tfin: '2017-9-6',
    cred: 1
  },
  "bee.promises.to/reping-one-with-heart": {
    tini: '2017-9-26'
  },
  "bee.promises.to/fill-out-metromile-feedback": {
    tini: '2017-9-26'
  },
  "bee.promises.to/schedule-planning-with-cantor/by/friday-night": {
    tini: '2017-9-6',
    tfin: '2017-9-6',
    cred: 1
  },
  "bee.commits.to/put-away-camping-gear-this-weekend": {
    tini: '2017-9-29'
  },
  "bee.commits.to/prettying_road_editor": {
    tini: '2017-0-04'
  },
  "bee.commits.to/go_to_bed/by/11pm": {
    tini: '2017-0-20'
  },
  "bee.promises.to/reply_to_hin/by/tuesday": {
    tini: '2017-1-10'
  },
  "bee.commits.to/call_jacob_this_week/by/next_week": {
    tini: '2017-1-13'
  },
  "bee.commits.to/answer_lau_on_klondikebar/by/5:05pm": {
    tini: '2017-11-20'
  }
}
