const httpClient = require('./../../utils/http-client')
const deviceDao = require('./pki.dao')

const isProd = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'

let trackingUrlBase = ''
let vaultUrlBase = ''
let vaultToken = ''
const msgInternalError = {
    code: 500, message: 'An operation could not be completed due to an internal error...'
}
const msgDeviceNotRegistered = {
    code: 400, message: 'Operation cannot be completed because the device is not registered...'
}
module.exports = (actionParams) => {
    trackingUrlBase = actionParams.iotTrackingUrlBase
    vaultUrlBase = actionParams.vaultServiceUrlBase
    vaultToken = actionParams.vaultServiceToken

    return (req, res, next) => {
        // POST /v1/institutions/{institution_id}/devices/{device_id}/pki
        if (/^((\/v1\/institutions\/)[^\W_]{24}\/devices\/[^\W_]{24}\/pki\/?)$/.test(req.path) && req.method === 'POST') {
            return generateCert(req, res)
        }

        // DELETE /v1/institutions/{institution_id}/devices/{device_id}/pki
        if (/^((\/v1\/institutions\/)[^\W_]{24}\/devices\/[^\W_]{24}\/pki\/?)$/.test(req.path) && req.method === 'DELETE') {
            return revokeCert(req, res)
        }

        // DELETE /v1/institutions/{institution_id}/devices/{device_id}/
        if (/^((\/v1\/institutions\/)[^\W_]{24}\/devices\/[^\W_]{24}\/?)$/.test(req.path) && req.method === 'DELETE') {
            return removeDevice(req, res)
        }
        next()
    }
}

async function generateCert(req, res) {
    try {
        // 1. validate request body
        // validateBody(req.body)
        // 2. check that the device exists
        const device = await getDevice(req.params.institution_id, req.params.device_id)

        // 3. sign certificate in vault
        const data = {
            csr: req.body.csr,
            ttl: req.body.ttl ? `${req.body.ttl}h` : '8760h'
        }
        const clientCert = await signCertificate(data)

        // 4. save device and certificate information to the database
        if (!(await deviceDao.saveCertInfo(device.id, clientCert.serial_number))) {
            return res.status(msgInternalError.code).json(msgInternalError)
        }

        // 5. result certificate
        res.status(201).json({
            'certificate': clientCert.certificate,
            'ca': clientCert.ca,
            'exp': convertHoursInDateSeconds(data.ttl)
        })
    } catch (err) {
        if (err instanceof Error && typeof err.message === 'string') {
            err = JSON.parse(err.message)
        }
        res.status(err.code).json(err)
    }
}

function revokeCert(req, res) {

}

function validateBody(body, res) {
    if (!body.csr) {
        throw new Error('{"code": 400, "message": "Required fields were not provided...", "description": "csr required!"}')
    } else {
        validateCsr(body.csr)
    }
    // validate 1-8760
    const re = RegExp('^([1-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9]|[1-7][0-9]{3}|8[0-6][0-9]{2}|87[0-5][0-9]|8760)$')
    if (body.ttl && !re.test(body.ttl)) {
        throw new Error('{"code": 400, "message": "ttl value is not valid...", ' +
            '"description": "The accepted value for ttl is between 1-8760. What is equivalent to 1h up to 1 year!"}')
    }
}

function convertHoursInDateSeconds(hours) {
    return new Date().setSeconds(parseInt(hours, 10) * 6000)
}

function validateCsr(csr) {

}

function getDevice(institutionId, deviceId) {
    return new Promise((resolve, reject) => {
        httpClient
            .get(trackingUrlBase.concat(`/v1/institutions/${institutionId}/devices/${deviceId}`))
            .then(result => {
                if (result.status === 200 && result.data) return resolve(result.data)
                reject(msgDeviceNotRegistered)
            })
            .catch(err => {
                if (!err.response || !err.response.data) return reject(msgInternalError)
                reject(err.response.data)
            })
    })
}

function signCertificate(data) {
    return new Promise((resolve, reject) => {
        httpClient
            .post(vaultUrlBase.concat(`/pki/sign/:name`), data, {headers: {'X-Vault-Token': vaultToken}})
            .then(result => {
                if (result.data) return resolve(buildCertificate(result.data))
                reject(msgInternalError)
            })
            .catch(err => {
                if (!err.response || !err.response.data) return reject(msgInternalError)
                reject(err.response.data)
            })
    })
}

function buildCertificate(data) {
    return {
        certificate: '',
        ca: '',
        serial_number: ''
    }
}

function removeDevice(req, res) {
    // 1. remove in service
    httpClient
        .delete(trackingUrlBase.concat(`/v1/institutions/${req.params.institution_id}/devices/${req.params.device_id}`))
        .then(async (result) => {
            if (result.status !== 204) {
                return res.status(msgInternalError.code).json(msgInternalError)
            }
            // 2. remove in gateway database
            await deviceDao.deleteCertInfo(req.params.device_id)
            res.status(204).send()
        })
        .catch(err => {
            if (!err.response || !err.response.data) {
                return res.status(msgInternalError.code).json(msgInternalError)
            }
            res.status(err.response.status).json(err.response.data)
        })
}
