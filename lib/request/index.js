'use strict'

class Request {

    constructor(event) {
        this.event = event
        this.method = event.httpMethod
        this.headers = event.headers || {}
        this.body = this._parseBodyFromEvent(event)
        this.queryStringParameters = event.queryStringParameters || {}
        this.pathParameters = event.pathParameters || {}
    }

    _parseBodyFromEvent(event) {
        if (!event.body) {
            return {}
        }

        if (event.headers && event.headers['content-type']) {
            const contentType = event.headers['content-type'].split(';')[0]
            if ('multipart/form-data' === contentType) {
                return event.body
            }
        }

        try {
            return JSON.parse(event.body)
        }
        catch (error) {
            console.log('Request error:\n' + error.stack)
            return {}
        }
    }

}

module.exports = Request
