import _ from 'lodash'

import Pledge from 'models/pledge'
import { parseTimezone } from 'lib/parse/time'

export const parsePromiseWithIp = ({ username, urtext, ip }) => {
  return new Promise((resolve, reject) => {
    parseTimezone(ip)
      .then((timezone) => {
        resolve(Pledge.parse({ username, urtext, timezone }))
      })
      .catch((e) => {
        reject('failed to parse timezone from IP', e)
      })
  })
}
