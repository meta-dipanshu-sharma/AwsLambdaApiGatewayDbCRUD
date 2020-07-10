const modules = require('./employee')

const index = (event) => {
    const method = event.httpMethod
    
    return modules[method](event)
}

exports.handler = index