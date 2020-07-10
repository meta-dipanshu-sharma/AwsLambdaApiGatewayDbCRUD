const Q = require('q')
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'database-1.cusxldl2fwf5.us-west-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Dipanshu#sharma25',
  port: 3306,
  database: "awsdb",
  multipleStatements: true,
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 60 * 1000,
  timeout: 60 * 60 * 60 * 1000,
  debug: true
})

const validateparams = (params) => {
  const { employees } = params
  if (!employees) {
    return Q.reject(new Error('Missing: employees parameter'))
  }
  if (!employees.length) {
    return Q.reject(new Error(`Missing: employees data`))
  }
  const isValid = employees.every((emp) => emp.firstName && emp.lastName)
  if (!isValid) {
    return Q.reject(new Error('Invalid: employees data are not valid, missing first_name or last_name'))
  }
  return Q(employees)
}

const createBulkInsertQuery = (params) => {
  const { employees } = params

  let insertQuery = 'INSERT INTO `employee` (`firstName`, `lastName`) VALUES '

  var lineCount = 0

  employees.forEach(emp => {
    const values = `${!lineCount ? '' : ',\n'}('${emp.firstName}', '${emp.lastName}')`

    insertQuery = insertQuery + values

    lineCount++
  })

  insertQuery = insertQuery + ';'
  return insertQuery
}

const POST = async (event) => {
  const params = JSON.parse(event.body)

  try {
    const data = await new Promise((resolve, reject) => {
      return validateparams(params)
        .then(() => {
          const insertQuery = createBulkInsertQuery(params)
          connection.query(insertQuery,
            function (err, result) {
              if (err) {
                console.log("Error->" + err)
                return reject(err)
              }

              return resolve(result)
            })
        })
        .catch((err) => {
          return reject(err)
        })
    })
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    }
  }
  catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
}

module.exports = { POST }