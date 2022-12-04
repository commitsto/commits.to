import _ from 'lodash'

import { Promises } from 'models/db'
import { Sequelize } from 'server/db/sequelize'

import User from 'models/user'
import PledgeParser from 'services/pledge/parser'

// TODO: https://github.com/Vincit/objection.js/tree/master/examples/express-ts

class Pledge {
  public static _dbModel = Promises // tslint:disable-line variable-name

  public static find = ({ id: rawId, username: rawUsername, urtext }: IPledge = {}) => {
    const { id, username } = PledgeParser.parse({ id: rawId, username: rawUsername, urtext })

    return Promises.find({
      include: [User.includeModelFor({ username })],
      where: { id }
    })
  }

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

  public static destroy = ({ id }) => {
    return Promises.destroy({
      where: {
        id
      }
    })
  }
}

export default Pledge
