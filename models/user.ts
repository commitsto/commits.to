import { Users } from 'models/db';

class User {
  public static _dbModel = Users; // tslint:disable-line variable-name

  public static includeModelFor = ({ username }) => ({
    model: User._dbModel,
    where: { username }
  })

}

export default User;
