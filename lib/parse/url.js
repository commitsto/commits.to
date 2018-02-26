import _ from 'lodash'

const isValidUrl = ({ url, promise }) => {
  const isAppleIcon = url.match(/\/apple\-touch\-icon.*/)
  const isBot = _.includes(['favicon.ico', 'robots.txt'], promise)
  const isFileExtension = url.match(/\.[A-z]{2,4}$/)

  return !(isBot || isAppleIcon || isFileExtension)
}

export default isValidUrl
