// --------------------------------- 80chars ---------------------------------->
import db, { Sequelize } from '../db/sequelize'



export default db.define('users', {
  username: { type: Sequelize.STRING, unique: true },
},{
  indexes: [{
    fields: ['username']
  }]
})

// --------------------------------- 80chars ---------------------------------->
