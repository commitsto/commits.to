import _ from 'lodash'

import { Promises } from 'models/db'
import { Sequelize } from 'server/db/sequelize'

import User from 'models/user'
import PledgeParser from 'services/pledge/parser'

// TODO: https://github.com/Vincit/objection.js/tree/master/examples/express-ts

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Pledge {
  public static _dbModel = Promises // tslint:disable-line variable-name

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static find = ({ id: rawId, username: rawUsername, urtext }: IPledge = {}) => {
    const pledge = PledgeParser.parse({ id: rawId, username: rawUsername, urtext })
    if (pledge == null) {
      throw Error(`Unable to find pledge #${rawId} for user '${rawUsername}' with urtext '${urtext}'`)
    }
    const { id, username } = pledge

    return Promises.find({
      include: [User.includeModelFor({ username })],
      where: { id }
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static findIncomplete = ({ limit = null } = {}) => {
    return Promises.findAll({
      include: [{
        model: User._dbModel
      }],
      limit,
      order: Sequelize.literal('tini DESC'),
      where: {
        tfin: null,
        urtext: {
          [Sequelize.Op.not]: null
        },
        void: {
          [Sequelize.Op.not]: true
        }
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static destroy = ({ id }) => {
    return Promises.destroy({
      where: {
        id
      }
    })
  }
}

export default Pledge
