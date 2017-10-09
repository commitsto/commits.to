// --------------------------------- 80chars ---------------------------------->

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

const SIH = 3600        // seconds in hour
const SID = 86400       // seconds in day
const SIW = SID*7       // seconds in week
const DIY = 365.25      // days in year
const SIM = SID*DIY/12  // seconds in month
const SIY = SID*DIY     // seconds in year

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
function escale(x, a, b, u, v) {
  return u*pow(u/v, a/(b-a))*exp(log(v/u)/(b-a)*x)
}

// Do an h-interpolation to return u when x=a and v when x=b. 
// Special cases: h=-1 is linear, h=0 is exponential, h=1 is hyperbolic.
// As h approaches infinity this becomes a step function where hscale(a) = u
// but for x>a, hscale(x) = v (assuming u>v).
// For the derivation of this, see bonus.glitch.me
function hscale(h, x, a, b, u, v) {
  if (h === 0) { return escale(x, a, b, u, v) }
  const r = (pow(v/u, -h)-1)/h/(a-b)
  return u*pow(1-h*r*(x-a), -1/h)
}

// Compute the credit you get for being t seconds late
export default function credit(t) {
  if      (t <= 0)  { return 1 } // not late at all, or early, means full credit
  else if (t < 60)  { return hscale(300000, t,   0,     60, 1,       0.99999) }
  else if (t < SIH) { return hscale(3000,   t,  60,    SIH, 0.99999, 0.999)   }
  else if (t < SID) { return hscale(548,    t, SIH,    SID, 0.999,   0.99)    }
  else if (t < SIW) { return hscale(32,     t, SID,    SIW, 0.99,    0.9)     }
  else if (t < SIM) { return hscale(5.4,    t, SIW,    SIM, 0.9,     0.5)     }
  else if (t < SIY) { return hscale(4.2,    t, SIM,    SIY, 0.5,     0.1)     }
  else              { return hscale(4,      t, SIY, 10*SIY, 0.1,     0.01)    }
}

/* Implementation note and beehavioral-economic rationale:
I hand-picked those magic h-values to give the function the shape I wanted, with
intentional second-order discontinuities. The discontinuies (sudden drops in how
much credit you get as time passes) give urgency to hit various focal lateness 
thresholds (a minute late, an hour late, etc). 

We don't want you to feel like, once you've missed the deadline, that another 
hour or day or week won't matter. Also we need the property that the late 
penalty increase (ie, that the remaining credit decrease) with every second that
passes after the deadline. We want to show your reliability percentage visibly 
ticking down second by second whenever you have an overdue promise.

So the discontinuities work like this: If you miss the nominal deadline your 
credit drops to 99.999% within seconds. The next sudden drop is at the 1-minute
mark. After that you can still get 99.9% credit if you're less than an hour 
late. And if you miss that, you can still get 99% credit if you're less than a 
day late. At 24 hours the credit drops again to 90%, etc. A minute, an hour, a 
day, a week, a month, all the way up to the one-year anniversary of the 
deadline. If you hit that then you still get 10% credit. After that it drops 
pretty quickly to 1% and asymptotically approaches 0%, without ever reaching it.
You always get some positive epsilon of credit no matter how late you are.
*/

/* 
An alternative simple late penalty function I've used before in another context 
is 1-(t/(86400*7))^4 which gives you a couple days of very little penalty and
then your credit plummets till you get 0 credit for being more than a week late.
That week can be generalized by replacing the 86400*7 in the equation with any
amount of time.
*/

// --------------------------------- 80chars ---------------------------------->
