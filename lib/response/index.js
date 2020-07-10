'use strict'

class Response {

    constructor(body, statusCode, headers) {
        this.body = body
        this.statusCode = statusCode || 200
        this.headers = headers || {
            // Lambda Proxy Integration requires that this
            // be set in the proxy response
            'Access-Control-Allow-Origin': '*'
        }
    }

    addHeader(name, value) {
        this.headers[name] = value
    }

    setBody(body) {
        this.body = body
    }

    setStatusCode(statusCode) {
        this.statusCode = statusCode
    }

    setError(error, statusCode) {
        const code = statusCode || error.statusCode || 500
        const body = {
            error: error.message
        }
        this.setBody(body)
        this.setStatusCode(code)
    }

    build() {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify(this.body),
            headers: this.headers
        }
    }

}

module.exports = Response
