/*eslint-disable */
// This code is done and tested!
// See the spec for a graph of the credit function and the rationale for this.

/* The main function here is credit(t) which computes the fraction of full
credit you get for being t seconds late. It's roughly a continuous version of
the following:
  credit(t) = 1      if t<=0s  # not late so no penalty
  credit(t) = .99999 if t<60s  # seconds late (essentially no penalty)
  credit(t) = .999   if t<1h   # minutes late (baaaasically counts)
  credit(t) = .99    if t<1d   # hours late   (no big deal, almost fully counts)
  credit(t) = .9     if t<1w   # days late    (main thing is it's done)
  credit(t) = .5     if t<1mo  # weeks late   (half counts if this late)
  credit(t) = .1     if t<1y   # months late  (mostly doesn't count)
  credit(t) = .01    if t<10y  # years late   (better late than never, barely)
  credit(t) = 0      otherwise # decades late (essentially zero credit)
*/

const cSecs   = 0.99999  // how much credit you get if you're  seconds  late
const cMins   = 0.999    //                                    minutes
const cHours  = 0.99     //                                    hours
const cDays   = 0.9      //                                    days
const cWeeks  = 0.5      //                                    weeks
const cMonths = 0.1      //                                    months
const cYears  = 0.01     // how much credit you get if you're  years    late

// Hand-picked magic h-values to give the lateness function sudden drops at all
// the focal lateness thresholds (a minute late, an hour late, etc) while still
// being continuous and strictly monotonically decreasing.
const hSecs   = 300000  // h param for how steep the curve is if  seconds  late
const hMins   = 3000    //                                        minutes
const hHours  = 548     //                                        hours
const hDays   = 32      //                                        days
const hWeeks  = 5.4     //                                        weeks
const hMonths = 4.2     //                                        months
const hYears  = 4       // h param for how steep the curve is if  years    late

const SIH = 3600        // seconds in an hour
const SID = 86400       // seconds in a day
const SIW = SID*7       // seconds in a week
const DIY = 365.25      // days in a year
const SIM = SID*DIY/12  // seconds in a month
const SIY = SID*DIY     // seconds in a year

const exp = Math.exp // let's not ugly up all our math
const log = Math.log //  by littering it with "Math." prefixes
const pow = Math.pow // (actually new javascript can do x**y for exponents)

// Linearly interpolate to return u when x=a and v when x=b
// NOT CURRENTLY USED and in fact is equivalent to hscale with h=-1
// function lscale(x, a, b, u, v) { return (b*u - a*v + (v-u)*x)/(b-a) }

// Exponentially interpolate to return u when x=a and v when x=b
// This is standard exponential growth and is the limiting case of h=0 in hscale
// below. That function isn't defined at h=0 so we need this as a special case.
// We could also just never set h to exactly 0 and use .000001 or something
// which would be plenty close enough but let's do it right cuz math is fun!
const escale = function(x, a, b, u, v) {
  return u*pow(u/v, a/(b-a))*exp(log(v/u)/(b-a)*x)
}

// Do an h-interpolation to return u when x=a and v when x=b.
// Special cases: h=-1 is linear, h=0 is exponential, h=1 is hyperbolic.
// As h approaches infinity this becomes a step function where hscale(a) = u
// but for x>a, hscale(x) = v (assuming u>v).
// For the derivation of this, see bonus.glitch.me
const hscale = function(h, x, a, b, u, v) {
  if (h === 0) { return escale(x, a, b, u, v) }
  const r = (pow(v/u, -h)-1)/h/(a-b)
  return u*pow(1-h*r*(x-a), -1/h)
}

// Compute the credit you get for being t seconds late
export default function credit(t) {
  if      (t <= 0)  { return 1 } // not late at all, or early, means full credit
  else if (t < 60)  { return hscale(hSecs,   t,   0,     60, 1,       cSecs)   }
  else if (t < SIH) { return hscale(hMins,   t,  60,    SIH, cSecs,   cMins)   }
  else if (t < SID) { return hscale(hHours,  t, SIH,    SID, cMins,   cHours)  }
  else if (t < SIW) { return hscale(hDays,   t, SID,    SIW, cHours,  cDays)   }
  else if (t < SIM) { return hscale(hWeeks,  t, SIW,    SIM, cDays,   cWeeks)  }
  else if (t < SIY) { return hscale(hMonths, t, SIM,    SIY, cWeeks,  cMonths) }
  else              { return hscale(hYears,  t, SIY, 10*SIY, cMonths, cYears)  }
}

/* Side note:
An alternative simple late penalty function I've used before in another context
is 1-(t/(86400*7))^4 which gives you a couple days of very little penalty and
then your credit plummets till you get 0 credit for being more than a week late.
That week can be generalized by replacing the 86400*7 (number of seconds in a
week) in the equation with any amount of time.
*/
