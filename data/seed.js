import log from '../lib/logger'
import _ from 'lodash'

import Promises from '../models/promise'
import { Users } from '../models/user'
import { parseUrtext } from '../lib/parse/promise'
import parseCredit from '../lib/parse/credit'
import parseText from '../lib/parse/text'

import data from './promises.json'

Users.hasMany(Promises, { foreignKey: 'userId', targetKey: 'username' })
Promises.belongsTo(Users, { foreignKey: 'userId', source: 'username' })

// create seed users
export function seed() {
  return Users.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){
      users.forEach((key) => {
        log.info('create user', key)
        Users.create({username: key})
      })
    })
    .then(() => setup())
    // .then(() => importJson())
}

// utility to populate table with hardcoded promises below
export function setup() {
  Promises.sync({force: true}).then(function(){
    Object.keys(promises).forEach((key) => {
      let prom = parseUrtext({ urtext: key })
      prom = _.extend(prom, promises[key])

      Users.findOne({
        where: {
          username: prom.username
        }
      }).then((user) => {
        const p = user && user.createPromise(prom)
        log.info('creating promise for', user.dataValues, p)
      })
    })
  })
}

export function cache() {
  Users.findAll().then(users => {
    users.forEach(user => {
      user.getPromises().then(promises => {
        const reliability = _.meanBy(promises, 'credit')
        log.debug(`caching ${user.username}'s reliability:`, reliability, promises.length)

        user.update({ score: reliability })
      })
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
        id: user + key.toLowerCase(),
        urtext: key,
        username: user,
        slug,
        what: parseText(slug),
        note,
        cred: tfin && tdue && parseCredit({ dueDate :tdue, finishDate: tfin }) || null,
        tini: tini && new Date(tini) || null,
        tdue: tdue && new Date(tdue) || null,
        tfin: tfin && new Date(tfin) || null,
        xfin
      }
      log.info('import', key, data[key], promise)

      Users.findOne({
        where: {
          username: user
        }
      }).then((u) => {
        const p = u && u.createPromise(promise)
        log.info('creating imported promise for', u.username, promise, p)
      })
    })
  })
}

export const users = [
  /* testing */
  'alice', 'bob', 'carol', 'deb',
  /* initial co-conspirators */
  'dreev', 'sergii', 'kim', 'bee', 'braden',
  /* daily beemail */
  'byorgey', 'nick', 'josh', 'dehowell', 'caillu', 'mbork', 'roy', 'jennyli', 'owen',
  /* weekly beemail */
  'samuel', 'cole', 'jessica', 'steven',
  /* contributors */
  'chris', 'stephen', 'temujin9',
  /* invitees */
  'pierre', 'chelsea', 'forrest'
]

// dreev calls dibs on 'danny', 'dan', & 'd' in case we implement aliases
// usernames to disallow: 'www', 'admin',

// Initial promise list hardcoded so don't have to worry about blowing db away
export const promises = {
  // examples
  'alice/File_the_TPS_report/by/noon_mon': {},
  'bob/Send_vacation_photos/by/saturday': {},
  'carol/Call_the_dentist/by/12am': {},

  'chris/follow_up_on_that_support_thread': {
    tini: '2017-9-18'
  },
  'chris/build-out-a-promise-completion-interface/by/next-week': {
    tini: '2017-0-13'
  },
  'chris/finish-the-datepicker-feature/by/tomorrow': {
    tini: '2017-0-28'
  },
  'chris/finish-the-latest-pr/by/tonight': {
    tini: '2017-1-02'
  },

  'braden/help_with_javascript/by/5pm': {
    tini: '2017-9-11'
  },
  'braden/outline_bite_counting_post/by/Sunday_11pm': {
    tini: '2017-9-13'
  },

  'byorgey/email_cut_property_summary/by/7pm': {
    tini: '2017-9-22'
  },
  'byorgey/upload_new_factorization_cards/by/Oct_25': {
    tini: '2017-0-18'
  },
  'byorgey/email_cut_property_summary': {
    tini: '2017-0-18'
  },

  'owen/adjust-the-shed/by/tonight_7pm': {
    tini: '2017-9-28'
  },
  'owen/research_and_pseudocode_calendar_integration/by/oct_6': {
    tini: '2017-9-9',
    tdue: '2017-10-6'
  },

  'josh/get_realisies_running/by/september_30': {
    tini: '2017-9-13'
  },
  'josh/get_realsies_payment_dashboard_up/by/2017_11_30': {
    tini: '2017-1-15'
  },

  'sergii/work_on_points_2_to_4/by/next_monday': {
    tini: '2017-9-14'
  },
  'jessica/let_bob_know_re_meeting/by/tomorrow_5pm': {
    tini: '2017-9-19'
  },
  'samuel/finish_ch_23_problem_set/by/today_6_pm': {
    tini: '2017-9-19'
  },
  'pierre/water_the_office_plant/by/Friday': {
    tini: '2017-9-25'
  },
  'stephen/decide_upon_late_october_trip/by/saturday': {
    tini: '2017-9-27'
  },
  'roy/sign_up_for_app': {
    tini: '2017-9-27'
  },
  'jennyli/water_the_plants/by/sunday': {
    tini: '2017-9-27'
  },
  'cole/find_a_rep_for_dining_vendors': {
    tini: '2017-9-28'
  },
  'caillu/test_trying_out_time/by/2017-09-30_20:42': {
    tini: '2017-9-30'
  },
  'mbork/edit_tutorial_for_students/by/tomorrow_8am': {
    tini: '2017-0-06'
  },

  'bee/new-family-photo-to-yoko/by/tomorrow-night': {
    tini: '2017-9-8',
    tfin: '2017-9-9',
    cred: .9
  },
  'bee/rest-of-paperwork-to-yoko-before-the-gym-tomorrow': {
    tini: '2017-9-17',
    tdue: '2017-9-18 9:59',
    tfin: '2017-9-18 11:59',
    cred: .99,
    note: '2 hours late'
  },
  'bee/email-sleep-as-android-for-specifics-about-sleep-length-measurement': {
    tini: '2017-9-19'
  },
  'bee/read-hannas-emails': {
    tini: '2017-9-6',
    tfin: '2017-9-6',
    cred: 1
  },
  'bee/reping-one-with-heart': {
    tini: '2017-9-26'
  },
  'bee/fill-out-metromile-feedback': {
    tini: '2017-9-26'
  },
  'bee/schedule-planning-with-cantor/by/friday-night': {
    tini: '2017-9-6',
    tfin: '2017-9-6',
    cred: 1
  },
  'bee/put-away-camping-gear-this-weekend': {
    tini: '2017-9-29'
  },
  'bee/prettying_road_editor': {
    tini: '2017-0-04'
  },
  'bee/go_to_bed/by/11pm': {
    tini: '2017-0-20'
  },
  'bee/reply_to_hin/by/tuesday': {
    tini: '2017-1-10'
  },
  'bee/call_jacob_this_week/by/next_week': {
    tini: '2017-1-13'
  },
  'bee/answer_lau_on_klondikebar/by/5:05pm': {
    tini: '2017-11-20'
  }
}
