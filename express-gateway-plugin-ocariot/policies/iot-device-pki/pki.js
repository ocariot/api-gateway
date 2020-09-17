const httpClient = require('./../../utils/http-client')
const deviceDao = require('./pki.dao')
const errorHandler = require('./../../utils/error.handler')

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

        // POST /v1/institutions/{institution_id}/devices/{device_id}/pki/renew
        if (/^((\/v1\/institutions\/)[^\W_]{24}\/devices\/[^\W_]{24}\/pki\/renew\/?)$/.test(req.path) && req.method === 'POST') {
            return renewCert(req, res)
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
        validateBody(req.body)

        // 2. check that the device exists
        const device = await getDevice(req.params.institution_id, req.params.device_id)

        // 3. checking if the device has a certificate
        const deviceRegistered = await deviceDao.getCertInfo(req.params.device_id)
        if (deviceRegistered && deviceRegistered.serial_number) {
            invalidateCertificate({serial_number: deviceRegistered.serial_number}).then().catch((err) => {
                console.log('Error: ', err.code, '. Message:', err.message)
            })
        }

        // 4. sign certificate in vault
        const data = {
            csr: req.body.csr,
            ttl: req.body.ttl ? `${req.body.ttl}h` : '8760h',
            common_name: device.id
        }
        const clientCert = await signCertificate(data)

        const certInfo = {
            csr: data.csr,
            ttl: data.ttl,
            serial_number: clientCert.serial_number
        }

        // 5. save device and certificate information to the database
        if (!(await deviceDao.saveCertInfo(device.id, certInfo))) {
            return res.status(msgInternalError.code).json(msgInternalError)
        }

        // 6. result certificate
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

async function renewCert(req, res) {
    try {
        // 1. checking if the device has a certificate
        const deviceRegistered = await deviceDao.getCertInfo(req.params.device_id)

        if (!deviceRegistered) {
            return res.status(403).json({code: 403, message: 'No certificate registered for this device.'})
        }

        const serialNumber = req.socket.getPeerCertificate(true).serialNumber
        if (deviceRegistered.serial_number.replace(/:/g, '') !== serialNumber.toLowerCase()) {
            return errorHandler(403, res)
        }

        invalidateCertificate({serial_number: deviceRegistered.serial_number}).then().catch((err) => {
            console.log('Error: ', err.code, '. Message:', err.message)
        })

        // 2. sign certificate in vault
        const data = {
            csr: deviceRegistered.csr,
            ttl: deviceRegistered.ttl,
            common_name: deviceRegistered.device_id
        }

        const clientCert = await signCertificate(data)

        const certInfo = {
            csr: data.csr,
            ttl: data.ttl,
            serial_number: clientCert.serial_number
        }

        // 3. save device and certificate information to the database
        if (!(await deviceDao.saveCertInfo(deviceRegistered.device_id, certInfo))) {
            return res.status(msgInternalError.code).json(msgInternalError)
        }

        // 4. result certificate
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

async function revokeCert(req, res) {
    try {
        // 1.checking if the device has a certificate
        const device = await deviceDao.getCertInfo(req.params.device_id)

        if (!device || !device.serial_number) {
            return res.status(204).json()
        }

        if (!(await deviceDao.deleteCertInfo(device.device_id))) {
            return res.status(msgInternalError.code).json(msgInternalError)
        }

        // 2. payload to send for Vault
        const data = {
            serial_number: device.serial_number
        }

        // 3. invalidating certificate in Vault
        invalidateCertificate(data).then().catch((err) => {
            console.log('Error: ', err.code, '. Message:', err.message)
        })

        res.status(204).json()
    } catch (err) {
        if (err instanceof Error && typeof err.message === 'string') {
            err = JSON.parse(err.message)
        }
        res.status(err.code).json(err)
    }
}

function validateBody(body, res) {
    if (!body.csr) {
        throw new Error('{"code": 400, "message": "Required fields were not provided...", "description": "csr required!"}')
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
            .post(vaultUrlBase.concat(`/v1/pki/sign/devices`), data, {headers: {'X-Vault-Token': vaultToken}})
            .then(result => {
                if (result.data) return resolve(buildCertificate(result.data))
                reject(msgInternalError)
            })
            .catch(err => {
                if (!err.response || !err.response.data) return reject(msgInternalError)
                if (!err.response.data.code) err.response.data.code = err.response.status
                reject(err.response.data)
            })
    })
}

function buildCertificate(data) {
    return {
        certificate: data.data.certificate,
        ca: data.data.issuing_ca,
        serial_number: data.data.serial_number
    }
}

function invalidateCertificate(data) {
    return new Promise((resolve, reject) => {
        httpClient
            .post(vaultUrlBase.concat(`/v1/pki/revoke`), data, {headers: {'X-Vault-Token': vaultToken}})
            .then(result => {
                return resolve(result.data)
            })
            .catch((err) => {
                return reject(msgInternalError)
            })
    })
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
            const device = await deviceDao.getCertInfo(req.params.device_id)
            // 2.1. checking if the device has a certificate
            if (device && device.serial_number) {
                // 2.2. invalidating certificate in Vault
                invalidateCertificate({serial_number: device.serial_number}).then().catch((err) => {
                    console.log('Error: ', err.code, '. Message:', err.message)
                })
                await deviceDao.deleteCertInfo(device.device_id)
            }

            res.status(204).send()
        })
        .catch(err => {
            if (!err.response || !err.response.data) {
                return res.status(msgInternalError.code).json(msgInternalError)
            }
            res.status(err.response.status).json(err.response.data)
        })
}
