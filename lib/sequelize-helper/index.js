const Sequelize = require('sequelize')
const { mysql } = require('../../etc/config.json')
const employeeModel = require('./definitions/employee')

const Q = require('q')
const sequelizeCache = {}
const getConnection = () => {
  if (sequelizeCache.connection) {
    return Q(sequelizeCache.connection)
  }

  const connection = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    dialect: 'mysql'
  })


  return connection.authenticate()
    .then(() => {
      console.log('connection establish!!')
      sequelizeCache.connection = connection
      return Q(connection)
    })
    .catch((err) => {
      console.log('Unable to connect DB')
      throw new Error(err.stack)
    })
}

const getModels = () => {
  if (sequelizeCache.models) {
    return Q(sequelizeCache.models)
  }

  return getConnection()
    .then(connection => {
      return connection.define('employee', employeeModel, {
        freezeTableName: true
      })
    })
    .then(employee => {
      const models = { employee }

      sequelizeCache.models = models
      //console.log(models)
      return Q(models)
    })


}

module.exports = { getConnection, getModels }


