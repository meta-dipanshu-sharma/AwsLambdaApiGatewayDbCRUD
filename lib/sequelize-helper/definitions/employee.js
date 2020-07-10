const { DataTypes } = require('sequelize')

module.exports = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
}