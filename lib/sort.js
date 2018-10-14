import moment from 'moment'

import { SID, SIW, SIM, SIY } from './latepenalty'

// Given time t & deadline d (both unixtimes in seconds), return the absolute
// distance in seconds between t & the deadline's Schelling fence nearest to t.
const scheldist = (t, d) => {
  return Math.min(
    Math.abs(t - d),          // absolute difference between t  &  deadline
    Math.abs(t - d - 60),     //                                   1 minute late
    Math.abs(t - d - 3600),   //                                   1 hour late
    Math.abs(t - d - SID),    //                                   1 day late
    Math.abs(t - d - SIW),    //                                   1 week late
    Math.abs(t - d - SIM),    //                                   1 month late
    Math.abs(t - d - SIY),    // absolute difference between t  &  1 year late
  )
}

// Take a time t and a promise p and compute the sort index for p at time t, ie,
// the metric to sort by (lowest to highest, so negative means sort to the top):
// * a huge negative number (-9e9 = 285 years) if there's something wrong
// * tini minus t (typically negative) if no tdue or tfin set
//   (if no tdue, no tfin, and tini in the future then this could sort it after
//   incomplete promises, which is fine, and almost always moot)
// * scheldist for incomplete promises (no tfin but tini and tdue are set)
// * huge positive number, 9e9 - tfin, if it's completed
const schelsort = (t, p) => {
  if (p.tfin != null) { return 9e9 - p.tfin.unix() }
  if (p.tdue == null) { return p.tini == null ? -9e9 : p.tini.unix() - t }
  return scheldist(t, p.tdue.unix())
}

// Return a negative number iff promise a should sort before promise b
const promiseGallerySort = (a, b) => {
  const now = moment().unix()
  return schelsort(now, a) - schelsort(now, b)
}

export default promiseGallerySort
