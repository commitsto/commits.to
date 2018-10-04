import _ from 'lodash'

const isValidUrl = ({ url }) => {
  const isAppleIcon = url.match(/\/apple\-touch\-icon.*/)
  const isBot = _.includes(['favicon.ico', 'robots.txt'], url)
  const isFileExtension = url.match(/\.[A-z]{2,4}$/)
  const isLegacyEditRoute = url.match(/\/edit\/?$/)
  const isDateModifier = url.match(/\/by\/?$/)
  const isQueryString = url.match(/\?[^\/]*?$/)
  const isUsernameString = url.match(/\/\w+\.commits\.to\/.*/)

  return !(
    isBot ||
    isAppleIcon ||
    isFileExtension ||
    isLegacyEditRoute ||
    isDateModifier ||
    isQueryString ||
    isUsernameString
  )
}

export const isBotFromUserAgent = ({ req: { xhr, ...req } }) => {
  const isBot =
    _.get(req, 'useragent.isAuthoritative', false) &&
    _.get(req, 'useragent.browser', 'unknown') === 'unknown' ||
    _.get(req, 'useragent.isBot', false)


  return xhr || // don't create promises from ajax requests by default
    isBot && isBot !== 'curl' // allow @philip to create promises via curl
}

export default isValidUrl
