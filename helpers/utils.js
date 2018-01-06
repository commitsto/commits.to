import Handlebars from 'handlebars'
import APP_DOMAIN from '../data/config'

const pathForUser = (name) => `//${name}.${APP_DOMAIN}`

Handlebars.registerHelper('__appDomain', function() {
  return APP_DOMAIN
})

Handlebars.registerHelper('promiseDomain', function(domain) {
  return domain || APP_DOMAIN
})

Handlebars.registerHelper('userPath', function({ username }) {
  return pathForUser(username)
})

Handlebars.registerHelper('promisePath', function({ user: { username }, slug }) {
  return `${pathForUser(username)}/${slug}`
})
