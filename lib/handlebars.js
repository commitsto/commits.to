import Handlebars from 'handlebars'
import { domain } from '../data/seed.js'

Handlebars.registerHelper('__appDomain', function() {
  return domain;
});

Handlebars.registerHelper('verbifyDomain', function(opts) {
  const domain = opts.hash && opts.hash.domain;
  console.log('verbifyDomain', domain);
  return domain && domain.replace('s.to', ' to');
});