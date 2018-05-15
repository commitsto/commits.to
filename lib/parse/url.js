import _ from 'lodash'

const isValidUrl = ({ url }) => {
  const isAppleIcon = url.match(/\/apple\-touch\-icon.*/)
  const isBot = _.includes(['favicon.ico', 'robots.txt'], url)
  const isFileExtension = url.match(/\.[A-z]{2,4}$/)
  const isLegacyEditRoute = url.match(/\/?edit\/?$/)
  const isDateModifier = url.match(/\/?by\/?$/)
  const isUsernameString = url.match(/\/\w+\.commits\.to.*/)

  return !(
    isBot ||
    isAppleIcon ||
    isFileExtension ||
    isLegacyEditRoute ||
    isDateModifier ||
    isUsernameString
  )
}

export default isValidUrl
