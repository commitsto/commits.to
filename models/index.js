import Promises from './promise'
import Users from './user'

Users.hasMany(Promises, { foreignKey: 'userId', targetKey: 'username' })
Promises.belongsTo(Users, { foreignKey: 'userId', source: 'username' })

export { Promises, Users }
