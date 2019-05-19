import User from 'models/user';

import { Promises } from 'models/db';
import { Sequelize } from 'server/db/sequelize';

// TODO: https://github.com/Vincit/objection.js/tree/master/examples/express-ts

class Pledge {
  public static _dbModel = Promises; // tslint:disable-line variable-name

  public static generateId = ({ username, urtext }) => `${username}/${urtext}`;

  public static find = ({ id, username, urtext }: IPledge = {}) => {
    // fixme set username/urtext if not passed
    const pledgeId = id || Pledge.generateId({ username, urtext });

    // console.log('find PLEDGE', pledgeId);

    return Promises.find({
      include: [User.includeModelFor({ username })],
      where: { id: pledgeId },
    });
  }

  public static findIncomplete = ({ limit = null } = {}) => {
    return Promises.findAll({
      include: [{
        model: User._dbModel,
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
        },
      },
    });
  }
}

export default Pledge;
