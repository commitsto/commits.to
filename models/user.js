import { Sequelize, sequelize } from '../db/sequelize'

const Users = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  score: {
    type: Sequelize.DOUBLE,
    defaultValue: null,
  },
  counted: {
    type: Sequelize.INTEGER,
    defaultValue: null,
  },
  pending: {
    type: Sequelize.INTEGER,
    defaultValue: null,
  },
})

Users.prototype.getValidPromises = function({ order = [['tfin', 'DESC']] } = {}) {
  return this.getPromises({
    where: {
      void: {
        [Sequelize.Op.not]: true
      }
    },
    include: [{
      model: Users
    }],
    order
  })
}

export default Users
