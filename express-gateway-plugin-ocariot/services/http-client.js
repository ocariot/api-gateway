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
    get: function (url) {
        return instance.get(url)
    },

    post: (url, body) => {
        return instance.post(url, body)
    },

    delete: function (url) {
        return instance.delete(url)
    }
}
