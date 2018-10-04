import { sequelize } from '../db/sequelize'
import Promises from './promise'
import Users from './user'

sequelize.sync().then(function() {
  Users.hasMany(Promises, { foreignKey: 'userId', targetKey: 'username' })
  Promises.belongsTo(Users, { foreignKey: 'userId', source: 'username' })
})

export { Promises, Users }
