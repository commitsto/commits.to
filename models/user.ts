import { Users } from 'models/db';

import { calculateReliability } from 'lib/parse/credit';
import promiseGallerySort from 'lib/sort';

class User {
  public static _dbModel = Users; // tslint:disable-line variable-name

  public static includeModelFor = ({ username }) => ({
    model: User._dbModel,
    where: { username }
  })

  public static pledges = ({ username }) =>
    Users.findOne({
      where: {
        username,
      }
    }).then((user) => {
      if (user) {
        return user.getValidPromises().then((promises) => {
          const { score, counted } = calculateReliability(promises);

          user.update({ score, counted, pending: promises.length - counted });
          promises.sort(promiseGallerySort);

          return {
            counted,
            pending: promises.length - counted,
            promises,
            reliability: score,
            user,
          };
        });
      }
      return false;
    })

}

export default User;
