// --------------------------------- 80chars ---------------------------------->

/* The main function here is credit(t) which computes the fraction of full 
credit you get for being t seconds late. It's roughly a continuous version of
the following:
  credit(t) = 1    if t<60s  # seconds late (no or almost no penalty)
  credit(t) = .999 if t<1h   # minutes late (baaaasically counts)
  credit(t) = .99  if t<1d   # hours late   (no big deal, almost fully counts)
  credit(t) = .9   if t<1w   # days late    (main thing is it's done)
  credit(t) = .5   if t<1mo  # weeks late   (half counts if this late)
  credit(t) = .1   if t<1y   # months late  (mostly doesn't count)
  credit(t) = .01  if t<10y  # years late   (better late than never, barely)
  credit(t) = 0    otherwise # decades late (zero or essentially zero credit)
*/

const SIH = 3600        // seconds in hour
const SID = 86400       // seconds in day
const SIW = SID*7       // seconds in week
const DIY = 365.25      // days in year
const SIM = SID*DIY/12  // seconds in month
const SIY = SID*DIY     // seconds in year

// Linearly interpolate to return u when x=a and v when x=b (NOT CURRENTLY USED)
function lscale(x, a, b, u, v) { return (b*u - a*v + (v-u)*x)/(b-a) }

// Exponentially interpolate to return u when x=a and v when x=b
function escale(x, a, b, u, v) {
  return u*Math.pow(u/v, a/(b-a))*Math.exp(Math.log(v/u)/(b-a)*x)
}

// Do an h-interpolation to return u when x=a and v when x=b. 
// Special cases: h=-1 is linear, h=0 is exponential, h=1 is hyperbolic.
function hscale(h, x, a, b, u, v) {
  if (h === 0) { return escale(x, a, b, u, v) }
  let r = (Math.pow(v/u, -h)-1)/h/(a-b)
  return u*Math.pow(1-h*r*(x - a), -1/h)
}

// Compute the credit you get for being t seconds late
function credit(t) {
  let h = 8
  if (t <= 0) { return 1 } // maybe <=59s late should still be 1 (no penalty)?
  else if (t < SIH) { return hscale(h, t, 0,   SIH,    1,    .999) }
  else if (t < SID) { return hscale(h, t, SIH, SID,    .999, .99)  }
  else if (t < SIW) { return hscale(h, t, SID, SIW,    .99,  .9)   }
  else if (t < SIM) { return hscale(h, t, SIW, SIM,    .9,   .5)   }
  else if (t < SIY) { return hscale(h, t, SIM, SIY,    .5,   .1)   }
  else              { return hscale(h, t, SIY, 10*SIY, .1,   .01)  }
}

/* 
An alternative simple late penalty function I've used before in another context 
is 1-(t/(86400*7))^4 which gives you a couple days of very little penalty and
then your credit plummets till you get 0 credit for being more than a week late.
*/

// --------------------------------- 80chars ---------------------------------->
