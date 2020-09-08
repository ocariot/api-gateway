const errorHandler = require('./../../utils/error.handler')
const httpClient = require('../../utils/http-client')

let ACCOUNT_URL_BASE = ''
let IOT_URL_BASE = ''

module.exports = function (actionParams) {
    ACCOUNT_URL_BASE = actionParams.accountServiceUrlBase
    IOT_URL_BASE = actionParams.iotServiceUrlBase

    return async (req, res, next) => {
        // /v1/children/{username}/weights
        if (/^(\/v1\/children\/)[^\W_]+\/weights\/?$/.test(req.path) && req.method === 'POST') {
            return await postWeightByUsername(req, res)
        } // /v1/children/nfc/{nfc_tag}/weights
        else if (/^(\/v1\/children\/nfc\/)[^\W_]+\/weights\/?$/.test(req.path) && req.method === 'POST') {
            return postWeightByNfcTag(req, res, next)
        }
        next()
    }
}

async function postWeightByUsername(req, res) {
    try {
        const responseChild = await httpClient
            .get(`${ACCOUNT_URL_BASE}/v1/children?limit=1&username=${req.params.username}`)

        // 1. Check if the child exists
        if (responseChild.data && responseChild.data.length === 0) {
            return res.status(400).send({
                    code: 400,
                    message: `There is no registered Child with username: ${req.params.username} on the platform!`,
                    description: 'Please register the Child and try again...'
                }
            )
        }

        // 2. Post the measurement based on the ID retrieved by username
        const responseWeight = await httpClient
            .post(`${IOT_URL_BASE}/v1/children/${responseChild.data[0].id}/weights`, req.body)
        res.status(responseWeight.status).send(responseWeight.data)
    } catch (err) {
        if (err.response && err.response.status) {
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}

const msgChildNotFoundNtTag = (tag) => {
    return {
        code: 400,
        message: `There is no child registered on the platform with the NFC tag: ${tag}!`,
        description: 'Please register the Child and try again...'
    }
}

async function postWeightByNfcTag(req, res) {
    try {
        const responseChild = await httpClient
            .get(`${ACCOUNT_URL_BASE}/v1/children/nfc/${req.params.nfc_tag}`)

        // 1. Check if the child exists
        if (responseChild.data && !responseChild.data.id) {
            return res.status(400).send(msgChildNotFoundNtTag(req.params.nfc_tag))
        }

        // 2. Post the measurement based on the ID retrieved by NFC Tag
        const responseWeight = await httpClient
            .post(`${IOT_URL_BASE}/v1/children/${responseChild.data.id}/weights`, req.body)
        res.status(responseWeight.status).send(responseWeight.data)
    } catch (err) {
        if (err.response && err.response.status) {
            if (err.response.status === 404) {
                return res.status(400).send(msgChildNotFoundNtTag(req.params.nfc_tag))
            }
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}