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
  const pDate = new Date(date);
  console.log('prettyDate', date, pDate);
  return pDate.toISOString().slice(0, 10);
});