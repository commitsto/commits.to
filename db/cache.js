import { Users } from '../models'
import log from '../lib/logger'

import { calculateReliability } from '../lib/parse/credit'

export default () => {
  Users.findAll().then(users => {
    log.info(`caching promises for ${users.length} users`)
    users.forEach(user => {
      user.getValidPromises().then(promises => {
        const rel = calculateReliability(promises)
        const score = rel.score
        const counted = rel.counted
        log.debug(`caching ${user.username}'s score:`, score, counted)
        user.update({ score, counted })
      })
    })
  })
}
