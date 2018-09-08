import moment from 'moment'

import { SID, SIW, SIM, SIY } from './latepenalty'

// Convert Moment date object to unixtime in seconds
const unixtm = (d) => { return d.valueOf() / 1000 }

// Given time t and a promise p, return the absolute distance in seconds between
// t and the promise's Schelling fence nearest to t. If the deadline is null,
// return a negative number so everything without a deadline sorts to the top,
// with promises created earlier appearing first. (But if a promise has no
// deadline and a creation time in the future for some reason then it may in
// fact sort later. That's probably reasonable and almost always moot.)
const scheldist = (t, p) => {
  if (p.tdue === null) { return p.tini === null ? -1e9 : unixtm(p.tini) - t }
  const tdue = unixtm(p.tdue)
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

// Return a negative number iff promise a should sort before promise b
const promiseGallerySort = (a, b) => {
  if (a.tfin === null && b.tfin === null) {  // sort by decreasing urgency
    const now = unixtm(moment())
    return scheldist(now, a) - scheldist(now, b)
  }
  if (a.tfin === null) { return -1 } // only promise a incomplete so sort it 1st
  if (b.tfin === null) { return 1 }  // only promise b incomplete so sort it 1st
  return unixtm(b.tfin) - unixtm(a.tfin)   // sort by decreasing completion date
}

export default promiseGallerySort
