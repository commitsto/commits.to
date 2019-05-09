import User from 'models/user';

import { Promises } from 'models/db';

class Pledge {
  public static generateId = ({ username, urtext }) => `${username}/${urtext}`;

  public static find = ({ id, username, urtext }) => {
    const promiseId = id || Pledge.generateId({ username, urtext });

    return Promises.find({
      include: [User.includeModelFor({ username })],
      where: { id: promiseId },
    });
  }
}

export default Pledge;
