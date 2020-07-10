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

const GET = async (event) => {
    try {
        const { queryStringParameters } = event
        const id = queryStringParameters && queryStringParameters.id ? queryStringParameters.id : null

        const data = await new Promise((resolve, reject) => {
            let queryToRun = 'select * from employee'

            if (id) {
                queryToRun = `select * from employee where id=${id}`
            }

            connection.query(queryToRun,
                function (err, result) {
                    if (err) {
                        console.log("Error->" + err)
                        reject(err)
                    }

                    resolve(result)
                })
        })
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }

    }
    catch (err) {
        return {
            statusCode: 400,
            body: err.message
        }
    }
}

module.exports = { GET }