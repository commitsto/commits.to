import moment from 'moment'

import { SID, SIW, SIM, SIY } from './latepenalty'

// Given time t and a promise p, return the absolute distance in seconds between
// t and the promise's Schelling fence nearest to t. If the deadline is null,
// return a negative number so everything without a deadline sorts to the top,
// with promises created earlier appearing first. (But if a promise has no
// deadline and a creation time in the future for some reason then it may in
// fact sort later. That's probably reasonable and almost always moot.)
const scheldist = (t, p) => {
  if (p.tdue === null && p.tini === null) { return Number.MIN_SAFE_INTEGER }
  if (p.tdue === null && p.tini !== null) { return p.tini.valueOf() / 1000 - t }
  const tdue = p.tdue.valueOf() / 1000
  return Math.min(
    Math.abs(t - tdue),         // abs difference between t  &  deadline
    Math.abs(t - tdue - 60),    //                              1 minute late
    Math.abs(t - tdue - 3600),  //                              1 hour late
    Math.abs(t - tdue - SID),   //                              1 day late
    Math.abs(t - tdue - SIW),   //                              1 week late
    Math.abs(t - tdue - SIM),   //                              1 month late
    Math.abs(t - tdue - SIY),   // abs difference between t  &  1 year late
  )
}

const promiseGallerySort = (a, b) => {
  if (a.tfin === null && b.tfin === null) {  // sort by decreasing urgency
    const now = moment().valueOf() / 1000
    return scheldist(now, a) - scheldist(now, b)
    // Or the nice simple thing to do would be to always sort in plain old
    // due date order like so:
    // return a_tdue - b_tdue
  }
  if (a.tfin === null) {  // only promise a is incomplete so sort it first
    return -1
  }
  if (b.tfin === null) {  // only promise b is incomplete so sort it first
    return 1
  }
  // sort by decreasing completion date
  return b.tfin.valueOf() / 1000 - a.tfin.valueOf() / 1000
}

export default promiseGallerySort
