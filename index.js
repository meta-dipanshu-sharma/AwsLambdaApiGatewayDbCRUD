const modules = require('./employee')

const Request = require('./lib/request')
const Response = require('./lib/response')

const index = (event, context, callback) => {
    const method = event.httpMethod

    const request = new Request(event)
    const response = new Response()

    return modules[method](request, response)
        .then(() => callback(null, response))
}
exports.handler = index