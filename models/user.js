// --------------------------------- 80chars ---------------------------------->
import { Sequelize, sequelize } from '../db/sequelize'

class users extends Sequelize.Model {
  // static get userRel() {
  //   console.log('userRel', this)
  //   return 'testing'
  //   // return this.getPromises()
  //   //   .then(promises => {
  //   //     console.log('users reliability promises', promises.length)
  //   //
  //   //     return promises.length// || ''
  //   //   })
  // }
}

users.init({
  username: { type: Sequelize.STRING, unique: true },
  // reliability: {
  //   type: Sequelize.VIRTUAL
  // }
},{
  sequelize,
  // getterMethods: {
  //   reliability() {
  //     return 'test'
  //   }
  // }
  // as: 'users'

})

// attributes: [[Sequelize.fn('AVG', Sequelize.col('cred')), 'reliability']]

export { users as Users }

// --------------------------------- 80chars ---------------------------------->
