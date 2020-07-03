const errorHandler = require('./../../utils/error.handler')
const httpClient = require('../../utils/http-client')

let ACCOUNT_URL_BASE = ''
let IOT_URL_BASE = ''
module.exports = function (actionParams) {
    ACCOUNT_URL_BASE = actionParams.accountServiceUrlBase
    IOT_URL_BASE = actionParams.iotServiceUrlBase

    return async (req, res, next) => {
        if (/^(\/v1\/children\/)[^\W_]+\/weights\/?$/.test(req.path) && req.method === 'POST') {
            return await postWeightByUsername(req, res, next)
        }
        next()
    }
}

async function postWeightByUsername(req, res, next) {
    try {
        const responseChild = await httpClient
            .get(`${ACCOUNT_URL_BASE}/v1/children?limit=1&username=${req.params.username}`)

        // 1. Check if the child exists
        if (responseChild.data && responseChild.data.length === 0) {
            return childNotFound(req, res)
        }

        // 2. Post the measurement based on the ID retrieved by username
        const responseWeight = await httpClient
            .post(`${IOT_URL_BASE}/v1/children/${responseChild.data[0].id}/weights`, req.body)
        res.status(responseWeight.status).send(responseWeight.data)
    } catch (err) {
        if (!err.response) return errorHandler(500, res, req)
        if (err.response.status) {
            res.status(err.response.status).send(err.response.data)
        }
    }
}

function childNotFound(req, res) {
    res.status(400).send({
            code: 400,
            message: `There is no registered Child with username: ${req.params.username} on the platform!`,
            description: 'Please register the Child and try again...'
        }
    )
}
