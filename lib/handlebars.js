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
  // console.log('prettyDate', date, pDate)
  return pDate
});

Handlebars.registerHelper('creditStatus', function(dueDate, finishDate) {
  if (!finishDate) return;
  const diff = moment(finishDate).diff(dueDate)
  const credit = computeCredit(diff * 60) // convert to sconds
  console.log('creditStatus', dueDate, finishDate, diff, credit)
  // return `promise--status ${credit}`
  return `(${credit})`
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


// TODO: Evaluate the usefulness of the function below for creating a "Add to Calendar" text button under a newly created promise  
//function buildAddToCalendarHTML(what,tdue) {
//  var googleCalendarHTML = '<a href="http://www.google.com/calendar/event?action=TEMPLATE&text=Your+IWill+Promise+to+';
//  googleCalendarHTML += what;
//  googleCalendarHTML += '+is+due';
//  googleCalendarHTML += '&dates=';
//  need to convert tdue to YYYYMMDDToHHMMSSZ/YYYYMMDDToHHMMSSZ (in Greenwich Mean Time with end time default to one hour after start time)
//  var convertedTdue = '';
//  googleCalendarHTML += convertedTdue;
//  googleCalendarHTML += '"';
//  googleCalendarHTML += ' target="_blank" rel="nofollow"';
//  googleCalendarHTML += '>Add to my calendar</a>';
//  return googleCalendarHTML;
//}
//Then perhaps use the returned HTML in a partials/button.handlebars file (not created yet) that only shows up upon initial creation of promise