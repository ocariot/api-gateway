const errorHandler = require('./../../utils/error.handler')
const deviceDao = require('./../device-pki/pki.dao')

const msgInternalError = {
    code: 500, message: 'An operation could not be completed due to an internal error...'
}

module.exports = () => {
    return async (req, res, next) => {
        try {
            // 1. Verify that a client certificate has been provided
            if (isEmpty(req.socket.getPeerCertificate(true))) {
                return res.status(400).send(handlerError(400))
            }

            // 2. Check if the client is authorized
            if (!req.client.authorized) {
                return res.status(403).send(handlerError(403))
            }

            // 3. retrieving serialNumber and deviceId from certificate
            const deviceId = req.socket.getPeerCertificate(true).subject.CN
            const serialNumber = req.socket.getPeerCertificate(true).serialNumber
            const device = await deviceDao.getCertInfo(deviceId)

            // 3.1. comparing the certificate's serialNumber with the serialNumber maintained at the gateway
            if (!device || device.serial_number.replace(/:/g, '') !== serialNumber.toLowerCase()) {
                return res.status(403).send(handlerError(403))
            }

            next()
        } catch (e) {
            res.status(msgInternalError.code).json(msgInternalError)
        }
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0
}

function handlerError(code) {
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
