import { Users } from 'models/db';

class User {
  public static includeModelFor = ({ username }) => ({
    model: Users,
    where: { username }
  })

}

export default User;
