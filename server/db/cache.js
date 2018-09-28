import { Users } from '../models'
import log from '../../lib/logger'

import { calculateReliability } from '../../lib/parse/credit'

// FIXME get rid of this whole concept

export default () => {
  Users.findAll().then(users => {
    log.info(`caching promises for ${users.length} users`)
    users.forEach(user => {
      user.getValidPromises().then(promises => {
        const { score, counted } = calculateReliability(promises)

        log.debug(`caching ${user.username}'s score:`, score, counted)
        user.update({ score, counted, pending: promises.length - counted })
      })
    })
  })
}
