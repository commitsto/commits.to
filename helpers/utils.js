import Handlebars from 'handlebars'
import APP_DOMAIN from '../data/config'

Handlebars.registerHelper('__appDomain', function() {
  return APP_DOMAIN
});

Handlebars.registerHelper('promiseDomain', function(domain) {
  return domain || APP_DOMAIN
});