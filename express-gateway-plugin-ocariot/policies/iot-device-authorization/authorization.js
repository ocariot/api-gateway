const errorHandler = require('./../../utils/error.handler')
const httpClient = require('../../utils/http-client')

let ACCOUNT_URL_BASE = ''
let IOT_URL_BASE = ''

const msgChildNotFoundUsername = (username) => {
    return {
        code: 400,
        message: `There is no registered Child with username: ${username} on the platform!`,
        description: 'Please register the Child and try again...'
    }
}

const msgChildNotFoundNfc = (tag) => {
    return {
        code: 400,
        message: `There is no child registered on the platform with the NFC tag: ${tag}!`,
        description: 'Please register the Child and try again...'
    }
}

module.exports = function (actionParams) {
    ACCOUNT_URL_BASE = actionParams.accountServiceUrlBase
    IOT_URL_BASE = actionParams.iotServiceUrlBase

    // POST /v1/institutions/:institution_id/environments
    // POST /v1/children/:username/nfc
    // POST /v1/children/:username/weights
    // POST /v1/children/nfc/:nfc_tag/weights
    // HEAD /v1/children/:username/valid
    return async (req, res, next) => {
        // POST /v1/institutions/:institution_id/environments
        if (/^(\/v1\/institutions\/)[^\W_]{24}\/environments\/?$/.test(req.path) && req.method === 'POST') {
            return checkDeviceAssociation(req, res, next)
        }
        // POST /v1/children/:username/nfc
        if (/^(\/v1\/children\/)[^\W_]+\/nfc\/?$/.test(req.path) && req.method === 'POST') {
            return await registerNfcByUsername(req, res)
        }
        // POST /v1/children/:username/weights
        if (/^(\/v1\/children\/)[^\W_]+\/weights\/?$/.test(req.path) && req.method === 'POST') {
            return await postWeightByUsername(req, res)
        }
        // POST /v1/children/:username/nfc
        if (/^(\/v1\/children\/nfc\/)[^\W_]+\/weights\/?$/.test(req.path) && req.method === 'POST') {
            return postWeightByNfcTag(req, res)
        }
        // GET /v1/children/:username
        if (/^(\/v1\/children\/)[^\W_]+\/?$/.test(req.path) && req.method === 'HEAD') {
            return childExistsByUsername(req, res)
        }

        next()
    }
}

/**
 * Checks whether the device that is associated with an institution.
 *
 * RULES:
 * 1. The device can only save environment editions if it is associated with a institution
 */
function checkDeviceAssociation(req, res, next) {
    try {
        const institutionId = req.params.institution_id
        const deviceId = req.socket.getPeerCertificate(true).subject.CN

        httpClient
            .get(IOT_URL_BASE.concat(`/v1/institutions/${institutionId}/devices/${deviceId}`))
            .then(result => {
                if (result.status !== 200) {
                    return res.status(403).send(errorHandler(403, res))
                }
                next()
            })
            .catch((e) => {
                if (!e.response) return res.status(500).send(errorHandler(500))
                res.status(403).send(errorHandler(403, res))
            })
    } catch (err) {
        res.status(500).send(errorHandler(500, res))
    }
}

/**
 * Registers an NFC tag to a child.
 */
async function registerNfcByUsername(req, res) {
    try {
        // 1. Check if the child exists
        const child = await getChildByUsername(req.params.username)
        if (!child) { // child not found by given username
            return res.status(400).send(msgChildNotFoundUsername(req.params.username))
        }

        // 2. Registers an NFC tag to a child.
        await httpClient.post(`${ACCOUNT_URL_BASE}/v1/children/${child.id}/nfc`, req.body)
        res.status(204).send()
    } catch (err) {
        if (err.response && err.response.status) {
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}

/**
 * Save Weight measurement by username
 */
async function postWeightByUsername(req, res) {
    try {
        // 1. Check if the child exists
        const child = await getChildByUsername(req.params.username)
        if (!child) { // child not found by given username
            return res.status(400).send(msgChildNotFoundUsername(req.params.username))
        }

        // 2. Post the measurement based on the ID retrieved by username
        const responseWeight = await httpClient
            .post(`${IOT_URL_BASE}/v1/children/${child.id}/weights`, req.body)
        res.status(responseWeight.status).send(responseWeight.data)
    } catch (err) {
        if (err.response && err.response.status) {
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}

/**
 * Save Weight measurement by NFC tag
 */
async function postWeightByNfcTag(req, res) {
    try {
        const responseChild = await httpClient
            .get(`${ACCOUNT_URL_BASE}/v1/children/nfc/${req.params.nfc_tag}`)

        // 1. Check if the child exists
        if (responseChild.data && !responseChild.data.id) {
            return res.status(400).send(msgChildNotFoundNfc(req.params.nfc_tag))
        }

        // 2. Post the measurement based on the ID retrieved by NFC Tag
        const responseWeight = await httpClient
            .post(`${IOT_URL_BASE}/v1/children/${responseChild.data.id}/weights`, req.body)
        res.status(responseWeight.status).send(responseWeight.data)
    } catch (err) {
        if (err.response && err.response.status) {
            if (err.response.status === 404) {
                return res.status(400).send(msgChildNotFoundNfc(req.params.nfc_tag))
            }
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}

/**
 * Checks whether the child exists by username.
 */
async function childExistsByUsername(req, res) {
    try {
        // 1. Check if the child exists
        const child = await getChildByUsername(req.params.username)

        if (!child) { // child not found by given username
            return res.status(404).send()
        }
        res.status(200).send()
    } catch (err) {
        if (err.response && err.response.status) {
            return res.status(err.response.status).send(err.response.data)
        }
        errorHandler(500, res, req)
    }
}

/**
 * Recover child by username.
 */
function getChildByUsername(username) {
    return new Promise((resolve, reject) => {
        httpClient
            .get(`${ACCOUNT_URL_BASE}/v1/children?limit=1&username=${username}`)
            .then((result) => {
                if (result.data && result.data.length >= 1) {
                    return resolve(result.data[0])
                }
                resolve(undefined)
            })
            .catch(reject)
    })
}
