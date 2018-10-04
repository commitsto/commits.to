import Handlebars from 'handlebars'
import APP_DOMAIN from '../server/app/config'

const userPath = (name) => `//${name}.${APP_DOMAIN}`
export const promisePath = ({ username, urtext }) =>
  `${userPath(username)}/${urtext}`

Handlebars.registerHelper('userPath', ({ username }) => {
  return userPath(username)
})

Handlebars.registerHelper('promisePath', ({ user: { username }, urtext }) => {
  return promisePath({ username, urtext })
})

Handlebars.registerHelper('editPromisePath', ({ user: { username }, urtext }) => {
  return `${promisePath({ username, urtext })}#edit`
})
