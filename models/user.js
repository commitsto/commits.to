// --------------------------------- 80chars ---------------------------------->
import db, { Sequelize } from '../db/sequelize'

export default db.define('users', {
  id: { type: Sequelize.STRING, primaryKey: true }, // username
})

// --------------------------------- 80chars ---------------------------------->
