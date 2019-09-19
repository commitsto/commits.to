import { Sequelize, sequelize } from 'server/db/sequelize';

const Users = sequelize.define('users', {
  counted: {
    defaultValue: null,
    type: Sequelize.INTEGER,
  },
  pending: {
    defaultValue: null,
    type: Sequelize.INTEGER,
  },
  score: {
    defaultValue: null,
    type: Sequelize.DOUBLE,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Users.prototype.getValidPromises = function({ order = [['tfin', 'DESC']] } = {}) {
  return this.getPromises({
    include: [{
      model: Users
    }],
    order,
    where: {
      void: {
        [Sequelize.Op.not]: true
      }
    },
  });
};

export default Users;
