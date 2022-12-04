// @ts-expect-error
import moment from 'moment'

import parseCredit from 'lib/parse/credit'
import { sequelize, Sequelize } from 'server/db/sequelize'

/* eslint-disable max-len */
export default sequelize.define('promises', {
  bmid: { // the id of the Beeminder datapoint for this promise
    type: Sequelize.STRING
  },
  clix: { // number of clicks a promise has gotten
    defaultValue: 1,
    type: Sequelize.INTEGER
  },
  cred: { // score calculated by latepenatly
    defaultValue: null,
    type: Sequelize.DOUBLE
  },
  credit: {
    get: function () { // tslint:disable-line
      const credit = parseCredit({
        dueDate: this.get('tdue'),
        finishDate: this.get('tfin')
      })
      // console.log('virtual credit', credit)
      return credit
    },
    type: Sequelize.VIRTUAL
  },
  firm: { // firm: true when the due date is confirmed and can't be edited again
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  id: { // username + urtext
    primaryKey: true,
    type: Sequelize.STRING
  },
  ip: {
    defaultValue: null,
    type: Sequelize.STRING
  },
  note: { // optional additional notes or context for the promise
    type: Sequelize.TEXT
  },
  slug: { // promise text, parsed from the urtext path
    type: Sequelize.STRING
  },
  tdue: { // when the promise is due
    defaultValue: () => moment()
      .startOf('minute')
      .add(1, 'day')
      .toDate(),
    type: Sequelize.DATE
  },
  tfin: { // When the promise was (fractionally) fulfilled (even if 0%)
    defaultValue: null,
    type: Sequelize.DATE
  },
  timezone: {
    type: Sequelize.STRING
  },
  tini: { // when the was promise was made
    defaultValue: () => moment()
      .startOf('minute')
      .toDate(),
    type: Sequelize.DATE
  },
  urtext: { // full original path the user typed to create the promise
    type: Sequelize.STRING
  },
  useragent: {
    type: Sequelize.JSON
  },
  void: { // true if the promise became unfulfillable or moot
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  what: { // human-readable formatted version of the slug
    type: Sequelize.STRING
  },
  xfin: { // fraction fulfilled, default 1 (also {value} for bmndr datapoint)
    defaultValue: 1,
    type: Sequelize.DOUBLE
  }
}, {
  indexes: [
    {
      fields: ['urtext']
    }
  ]
})
