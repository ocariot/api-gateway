/**
 * Service created to requests
 */
const https = require('https')
const axios = require('axios')

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

module.exports = {
    get: function (url, options) {
        return instance.get(url, options)
    },

    post: (url, body, options) => {
        return instance.post(url, body, options)
    },

    delete: function (url, options) {
        return instance.delete(url, options)
    }
}
