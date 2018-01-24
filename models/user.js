import { Sequelize, sequelize } from '../db/sequelize'

class users extends Sequelize.Model { }

users.init({
  username: { type: Sequelize.STRING, unique: true },
  score: { type: Sequelize.DOUBLE, defaultValue: null },
}, { sequelize })


export { users as Users }
