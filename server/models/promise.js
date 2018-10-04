import moment from 'moment'

import { sequelize, Sequelize } from '../db/sequelize'
import parseCredit from '../../lib/parse/credit'

export const isNewPromise = ({ promise }) => promise.clix === 1

/* eslint-disable max-len */
export default sequelize.define('promises', {
  id: { // username + urtext
    type: Sequelize.STRING, primaryKey: true
  },
  bmid: { // the id of the Beeminder datapoint for this promise
    type: Sequelize.STRING
  },
  urtext: { // full original path the user typed to create the promise
    type: Sequelize.STRING
  },
  slug: { // promise text, parsed from the urtext path
    type: Sequelize.STRING
  },
  what: { // human-readable formatted version of the slug
    type: Sequelize.STRING
  },
  firm: { // firm: true when the due date is confirmed and can't be edited again
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  void: { // true if the promise became unfulfillable or moot
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  cred: { // score calculated by latepenatly
    type: Sequelize.DOUBLE,
    defaultValue: null,
  },
  credit: {
    type: Sequelize.VIRTUAL,
    get: function() {
      const credit = parseCredit({
        dueDate: this.get('tdue'),
        finishDate: this.get('tfin')
      })
      // console.log('virtual credit', credit)
      return credit
    }
  },
  tini: { // when the was promise was made
    type: Sequelize.DATE,
    defaultValue: () => moment()
      .startOf('minute')
      .toDate(),
  },
  tdue: { // when the promise is due
    type: Sequelize.DATE,
    defaultValue: () => moment()
      .startOf('minute')
      .add(1, 'day')
      .toDate(),
  },
  tfin: { // When the promise was (fractionally) fulfilled (even if 0%)
    type: Sequelize.DATE,
    defaultValue: null,
  },
  xfin: { // fraction fulfilled, default 1 (also {value} for bmndr datapoint)
    type: Sequelize.DOUBLE,
    defaultValue: 1,
  },

  clix: { // number of clicks a promise has gotten
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  note: { // optional additional notes or context for the promise
    type: Sequelize.TEXT
  },
  ip: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
  timezone: {
    type: Sequelize.STRING
  },
  useragent: {
    type: Sequelize.JSON
  },
}, {
  indexes: [
    {
      fields: ['urtext']
    }
  ]
})
