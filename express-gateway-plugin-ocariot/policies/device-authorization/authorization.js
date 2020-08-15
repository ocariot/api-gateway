const generalErrorHandler = require('./../../utils/error.handler')
const deviceDao = require('./../device-pki/pki.dao')
const service = require('../../utils/http-client')

let IOT_TRACKING_SERVICE = ''
module.exports = function (actionParams) {
    IOT_TRACKING_SERVICE = actionParams.iotTrackingUrlBase
    return async (req, res, next) => {

        /**
         * ####### CHILDREN.WEIGHTS #######
         * ####### ENVIRONMENTS #######
         */
        // POST /v1/children/{user_name}/weights ['measurements:create']
        // POST /v1/institutions/{institution_id}/environments ['environment:create']
        await tlsAuthorization(req, res)

        /**
         * ####### ENVIRONMENTS #######
         */
        // POST /v1/institutions/{institution_id}/environments ['environment:create']
        if (/^((\/v1\/institutions\/)[^\W_]{24}\/environments\/{0,1})$/.test(req.path) && req.method === 'POST') {
            checkDeviceAssociation(req, res, next)
        } else {
            next()
        }
    }
}

async function tlsAuthorization(req, res) {
    try {
        // 1. Verify that a client certificate has been provided
        if (isEmpty(req.socket.getPeerCertificate(true))) {
            return res.status(400).send(errorHandler(400))
        }

        // 2. Check if the client is authorized
        if (!req.client.authorized) {
            return res.status(403).send(errorHandler(403))
        }

        // 3. retrieving serialNumber and deviceId from certificate
        const deviceId = req.socket.getPeerCertificate(true).subject.CN
        const serialNumber = req.socket.getPeerCertificate(true).serialNumber
        const device = await deviceDao.getCertInfo(deviceId)

        // 3.1. comparing the certificate's serialNumber with the serialNumber maintained at the gateway
        if (!device || device.serial_number.replace(/:/g, '') !== serialNumber.toLowerCase()) {
            return res.status(403).send(errorHandler(403))
        }
    } catch (e) {
        res.status(500).send(errorHandler(500))
    }
}

function checkDeviceAssociation(req, res, next) {
    const deviceId = req.socket.getPeerCertificate(true).subject.CN
    const institutionId = req.params.institution_id

    service
        .get(IOT_TRACKING_SERVICE.concat(`/v1/institutions/${institutionId}/devices/${deviceId}`))
        .then(result => {
            if (result.status !== 200) return res.status(403).send(generalErrorHandler(403, res))
            next()
        })
        .catch((e) => {
            if (!e.response) return res.status(500).send(errorHandler(500))
            return res.status(403).send(generalErrorHandler(403, res))
        })
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0
}

function errorHandler(code) {
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