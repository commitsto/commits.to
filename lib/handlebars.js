import moment from 'moment-timezone'

import Handlebars from 'handlebars'
import { domain } from '../data/seed'

Handlebars.registerHelper('__appDomain', function() {
  return domain;
});

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain;
  // console.log('verbifyDomain', domain);
  return domain && domain.replace('s.to', ' to');
});

Handlebars.registerHelper('prettyDate', function(date) {
  if (!date) return;
  const pDate = moment(date).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a');
  console.log('prettyDate', date, pDate);
  return pDate;
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