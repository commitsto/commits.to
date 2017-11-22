import moment from 'moment-timezone'
import Handlebars from 'handlebars'

import APP_DOMAIN from '../data/config'
import computeCredit from './latepenalty'

const hoursUntil = function(dueDate) {
  const now = moment();
  const end = moment.tz(dueDate, 'America/New_York')
  let diff = end.diff(now)
  diff = moment.duration(diff).asHours()
  // console.log('dueStatus', dueDate, diff)
  return diff;
}

Handlebars.registerHelper('__appDomain', function() {
  return APP_DOMAIN
});

Handlebars.registerHelper('promiseDomain', function(domain) {
  return domain || APP_DOMAIN
});

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain
  // console.log('verbifyDomain', domain)
  return domain && domain.replace('.to', ' to')
});

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return
  const pDate = moment.tz(date, 'America/New_York').format('MMMM Do YYYY, h:mm:ss a')
  const interval = moment(date).fromNow()
  // console.log('prettyDate', date, pDate)
  return "Due " + interval + " ("+ pDate +")"
});

Handlebars.registerHelper('isoDate', function(date) {
  if (!date) return
  const isoDate = moment(date).format("YYYYMMDDTHHmmss")
  // console.log('isoDate', date, isoDate)
  return isoDate
});

Handlebars.registerHelper('creditStatus', function(dueDate, finishDate) {
  if (!dueDate) return;
  if (!finishDate) {
    var now = moment().utc()
    if (dueDate > now) return;  // Don't display for tickets before due date
    finishDate = now            // Display optimistically, as if they finished now
  } 
  const diff = moment(finishDate).diff(dueDate, 'seconds')
  const credit = computeCredit(diff)
  console.log('creditStatus', dueDate, finishDate, diff, credit)
  // return `promise--status ${credit}`
  return `${(credit*100).toFixed(credit === 1 ? 0 : 3)}%`
});

Handlebars.registerHelper('creditColor', function(dueDate, finishDate) {
  if (!finishDate || !dueDate) return;
  const diff = moment(finishDate).diff(dueDate, 'seconds')
  const credit = computeCredit(diff)
  console.log('creditColor', credit)
  let color = 'green'
  if (credit < .5) {
    color = 'red'
  } else if (credit < .9) {
    color = 'orange'
  } else if (credit < 1) {
    color = 'blue'
  // } else if (credit < (24 * 5)) {
  //   color = 'blue'
  }    
  return `credit--status-${color}`
});

function isPending(p) { 
  return (p.tdue === null || moment() < p.tdue) && (!p.tfin)
}

function calculateUserReliability(user, promises) {
  // TODO: Make this cache? Currently loops over a lot of data, called many times per page
  // TODO: Feels like this might maybe be better placed elsewhere
  let numerator = 0
  let denominator = 0
  let tnow = moment()
  if (!promises) { return NaN }
  promises.forEach(p => {
    if (p.user == user) {
      if (!isPending(p)) {
        let oxfin = p.xfin ? p.xfin : 1 // optimistic xfin is 1
        let otfin = p.tfin ? p.tfin : tnow // optimistic tfin is now
        let diff = moment(otfin).diff(p.tdue, 'seconds')
        numerator += oxfin * computeCredit(diff)
        denominator += 1
      }
    }
  })
  if (denominator == 0) { return NaN }
  return ( numerator / denominator )
}

Handlebars.registerHelper('reliabilityStatus', function(user, promises) {
  var reliability = calculateUserReliability(user, promises)
  if ( isNaN(reliability) ) { return "???" }
  else { return ( reliability * 100 ).toFixed(2).toString() + "%" }
});

Handlebars.registerHelper('reliabilityColor', function(user, promises) {
  let color = 'green'
  var reliability = calculateUserReliability(user, promises)
  if (isNaN(reliability)) {
    color = "gray"
  } else if (reliability < .5) {
    color = 'red'
  } else if (reliability < .9) {
    color = 'orange'
  } else if (reliability < .95) {
    color = 'blue'
  }    
  return `reliability--status-${color}`
});

Handlebars.registerHelper('dateBar', function(dueDate) {
  // if (!dueDate) return
  const diff = parseInt(hoursUntil(dueDate))
  const width = (diff > 100 || diff < 0) ? 'auto' : `${100 - diff}%`
  // console.log('promiseStatus', dueDate, duration.asSeconds(), now, end, credit)
  // return `promise--status ${credit}`
  return `width: ${width}`
});

Handlebars.registerHelper('dueStatus', function(dueDate) {
  // if (!dueDate) return;
  const diff = hoursUntil(dueDate)
  let color = 'green'
  if (diff < 0) {
    color = 'gray'
  } else if (diff < 24) {
    color = 'red'
  } else if (diff < (24 * 2)) {
    color = 'orange'
  } else if (diff < (24 * 5)) {
    color = 'blue'
  }    
  return `promise--status-${color}`
});

