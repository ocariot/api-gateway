const deviceDao = require('../iot-device-pki/pki.dao')

/**
 * Policy that verifies certificates sent by iot devices.
 */

module.exports = function () {
    return async (req, res, next) => {
        // Verifies that the device iot is allowed to consume endpoints pipeline
        if (await tlsAuthorization(req, res)) {
            next()  // customer allowed! go to next middleware
        }
    }
}

async function tlsAuthorization(req, res) {
    try {
        // 1. Verify that a client certificate has been provided
        if (isEmpty(req.socket.getPeerCertificate(true))) {
            res.status(400).send(iotDeviceErrorHandler(400))
            return false
        }

        // 2. Check if the client is authorized
        if (!req.client.authorized) {
            res.status(403).send(iotDeviceErrorHandler(403))
            return false
        }

        // 3. retrieving serialNumber and deviceId from certificate
        const deviceId = req.socket.getPeerCertificate(true).subject.CN
        const serialNumber = req.socket.getPeerCertificate(true).serialNumber
        const device = await deviceDao.getCertInfo(deviceId)

        // 3.1. comparing the certificate's serialNumber with the serialNumber maintained at the gateway
        if (!device || device.serial_number.replace(/:/g, '') !== serialNumber.toLowerCase()) {
            res.status(403).send(iotDeviceErrorHandler(403))
            return false
        }
        return true
    } catch (e) {
        res.status(500).send(iotDeviceErrorHandler(500))
        return false
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0
}

function iotDeviceErrorHandler(code) {
    const messages = {
        400: () => {
            return {
                code: 400,
                message: 'TLS client authentication failed!',
                description: 'Client certificate are required!'
            }
        },
        403: () => {
            return {
                code: 403,
                message: 'TLS client authorization failed!',
                description: 'Client certificate is not valid or has been revoked!'
            }
        },
        500: () => {
            return {
                code: 500,
                message: 'An internal server error has occurred.'
            }
        }
    }
    return (messages[code] || messages[500])()
}
