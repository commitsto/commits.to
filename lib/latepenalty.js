/*eslint-disable */
// See the spec for a graph of the credit function and the rationale for this.

/* The main function is credit(t) which computes the fraction of full credit
you get for being t seconds late. It's roughly a continuous version of this:
  credit(t) = 1      if t<=0s  # not late so no penalty
  credit(t) = .99999 if t<60s  # seconds late (essentially no penalty)
  credit(t) = .999   if t<1h   # minutes late (baaaasically counts)
  credit(t) = .99    if t<1d   # hours late   (no big deal, almost fully counts)
  credit(t) = .9     if t<1w   # days late    (main thing is it's done)
  credit(t) = .5     if t<30d  # weeks late   (half counts if this late)
  credit(t) = .1     if t<1y   # months late  (mostly doesn't count)
  credit(t) = .01    if t<10y  # years late   (better late than never, barely)
  credit(t) = 0      otherwise # decades late (essentially zero credit)
*/

const cSecs = 0.99999 // how much credit you get if you're seconds late
const cMins = 0.999   //                                   minutes
const cHrs  = 0.99    //                                   hours
const cDays = 0.9     //                                   days
const cWks  = 0.5     //                                   weeks
const cMos  = 0.1     //                                   months
const cYrs  = 0.01    //                                   years


// Hand-picked magic h-values to give the lateness function sudden drops at all
// the focal lateness thresholds (a minute late, an hour late, etc) while still
// being continuous and strictly monotonically decreasing.
const hSecs = 300000 // h param for how steep the curve is if seconds late
const hMins = 3000   //                                       minutes
const hHrs  = 548    //                                       hours
const hDays = 32     //                                       days
const hWks  = 5.4    //                                       weeks
const hMos  = 4.2    //                                       months
const hYrs  = 4      //                                       years

//NB: treat 30d as 1mo and 365d as 1yr so that Schelling fence deadlines are
//the same time of day as the original deadline.
export const secInMin = 60
export const secInHour = 3600
export const secInDay = 86400
export const secInWeek = 7   * secInDay
export const secInMon = 30  * secInDay
export const secInYear = 365 * secInDay

// Let's not ugly up all our pretty math by littering it with "Math." prefixes
// (actually new javascript can do x**y for exponents).
const exp = Math.exp
const log = Math.log
const pow = Math.pow

// Linearly interpolate to return u when x=a and v when x=b
// This is equivalent to hscale with h=-1 and isn't used for commits.to but it's
// nice for comparison:
// function lscale(x, a, b, u, v) { return (b*u - a*v + (v-u)*x)/(b-a) }

// Exponentially interpolate to return u when x=a and v when x=b
// This is standard exponential growth and is the limiting case of h=0 in hscale
// below. That function isn't defined at h=0 so we need this as a special case.
// We could also just never set h to exactly 0 and use .000001 or something
// which would be plenty close enough but let's do it right cuz math is fun!
const escale = function(x, a, b, u, v) {
  return u * pow(u / v, a / (b - a)) * exp(log(v / u) / (b - a) * x)
}

// Do an h-interpolation to return u when x=a and v when x=b.
// Special cases: h=-1 is linear, h=0 is exponential, h=1 is hyperbolic.
// As h approaches infinity this becomes a step function where hscale(a) = u
// but for x>a, hscale(x) = v (assuming u>v).
// For the derivation of this, see bonus.glitch.me
const hscale = function(h, x, a, b, u, v) {
  if (h === 0) { return escale(x, a, b, u, v) }
  const r = (pow(v / u, -h) - 1) / h / (a - b)
  return u * pow(1 - h * r * (x - a), -1 / h)
}

// Compute the credit you get for being t seconds late
export default function credit(t) {
  return t <= 0   ? 1 : // not late at all or early => full credit
         t < secInMin   ? hscale(hSecs, t, 0,    secInMin,     1,     cSecs) :
         t < secInHour ? hscale(hMins, t, secInMin,   secInHour,   cSecs, cMins) :
         t < secInDay  ? hscale(hHrs,  t, secInHour, secInDay,    cMins, cHrs)  :
         t < secInWeek ? hscale(hDays, t, secInDay,  secInWeek,    cHrs,  cDays) :
         t < secInMon  ? hscale(hWks,  t, secInWeek,  secInMon,    cDays, cWks)  :
         t < secInYear ? hscale(hMos,  t, secInMon,  secInYear,    cWks,  cMos)  :
                    hscale(hYrs,  t, secInYear,  10 * secInYear, cMos,  cYrs)
}

/* Side note:
An alternative simple late penalty function I've used before in another context
is 1-(t/(86400*7))^4 which gives you a couple days of very little penalty and
then your credit plummets till you get 0 credit for being more than a week late.
That week can be generalized by replacing the 86400*7 (number of seconds in a
week) in the equation with any amount of time.
*/
