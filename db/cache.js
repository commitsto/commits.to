import { Users } from '../models'
import log from '../lib/logger'

import { calculateReliability } from '../lib/parse/credit'

export default () => {
  Users.findAll().then(users => {
    users.forEach(user => {
      user.getValidPromises().then(promises => {
        const score = calculateReliability(promises)
        log.debug(`caching ${user.username}'s score:`, score, promises.length)
        user.update({ score })
      })
    })
  })
}
