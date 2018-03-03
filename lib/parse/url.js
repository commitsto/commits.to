import _ from 'lodash'

const isValidUrl = ({ url, promise }) => {
  const isAppleIcon = url.match(/\/apple\-touch\-icon.*/)
  const isBot = _.includes(['favicon.ico', 'robots.txt'], promise)
  const isFileExtension = url.match(/\.[A-z]{2,4}$/)
  const isLegacyEditRoute = url.match(/\/?edit\/?$/)

  return !(isBot || isAppleIcon || isFileExtension || isLegacyEditRoute)
}

export default isValidUrl
