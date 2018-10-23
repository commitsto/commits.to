import _ from 'lodash'

const isValidUrl = ({ url }) => {
  const validityChecks = [
    {
      match: url.match(/\/apple\-touch\-icon.*/),
      message: 'isAppleIcon',
    },
    {
      match: _.includes(['favicon.ico', 'robots.txt'], url),
      message: 'isBot',
    },
    {
      match: url.match(/\.[A-z]{2,4}$/),
      message: 'isFileExtension',
    },
    {
      match: url.match(/\/edit\/?$/),
      message: 'isLegacyEditRoute',
    },
    {
      match: url.match(/\/by\/?$/),
      message: 'isDateModifier',
    },
    {
      match: url.match(/\?[^\/]*?$/),
      message: 'Promise URL has a query string',
    },
    {
      match: url.match(/\/\w+\.commits\.to\/.*/),
      message: 'Promise URL contains the domain',
    },
    {
      match: url.match(/%/),
      message: 'Promise URL contains an invalid character',
    },
  ]

  return _(validityChecks)
    .filter('match')
    .map('message')
    .value()
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
