const sequelizeHelper = require('../lib/sequelize-helper')
const GET = (request, response) => {
  const { queryStringParameters } = request.event
  const id = queryStringParameters && queryStringParameters.id ? queryStringParameters.id : null
  return sequelizeHelper.getModels()
    .then(models => {
      if (id) {
        response.body = id
        return models.employee.findOne({ where: { id }, attributes: ['id', 'firstName', 'lastName'] })
      }
      else {
        return models.employee.findAll({ attributes: ['id', 'firstName', 'lastName'] })
      }

    })
    .then(result => {
      response.body = JSON.stringify(result)
      response.statusCode = 200
      return response
    })
}

module.exports = { GET }