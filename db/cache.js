import { Users } from '../models'
import log from '../lib/logger'

import { calculateReliability, promisesIncluded } from '../lib/parse/credit'

export default () => {
  Users.findAll().then(users => {
    log.info(`caching promises for ${users.length} users`)
    users.forEach(user => {
      user.getValidPromises().then(promises => {
        const score = calculateReliability(promises)
        const doneOrDueCount = promisesIncluded(promises)
        log.debug(`caching ${user.username}'s score:`, score, doneOrDueCount)
        user.update({ score })
        user.update({ doneOrDueCount })
        print("user, score, doneOrDueCount",user.username, score, doneOrDueCount)
      })
    })
  })
}
