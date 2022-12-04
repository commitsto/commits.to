import { sequelize } from 'server/db/sequelize'

import Promises from './promise'
import Users from './user'

sequelize.sync().then(function () { // tslint:disable-line
  Users.hasMany(Promises, { foreignKey: 'userId', targetKey: 'username' })
  Promises.belongsTo(Users, { foreignKey: 'userId', source: 'username' })
})

export { Promises, Users }
