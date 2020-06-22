const db = require('express-gateway/lib/db')

const ID = (id) => {
    return `ocariot_device:${id}`
}

exports.getCertInfo = (deviceId) => {
    return new Promise((resolve) => {
        db.get(ID(deviceId), (err, result) => {
            if (err || !result) return resolve(undefined)
            const certInfo = JSON.parse(result)
            resolve({
                device_id: deviceId,
                serial_number: certInfo.serial_number,
                csr: certInfo.csr,
                ttl: certInfo.ttl
            })
        })
    })
}

exports.saveCertInfo = (deviceId, certInfo) => {
    return new Promise((resolve) => {
        db
            .pipeline()
            .set(ID(deviceId), JSON.stringify(certInfo))
            .get(ID(deviceId))
            .exec((err, result) => {
                if (err) return resolve(false)
                resolve(result[1][1])
            })
    })
}

exports.deleteCertInfo = (deviceId) => {
    return new Promise((resolve) => {
        db.del(ID(deviceId), (err, response) => {
            if (response >= 1) return resolve(true)
            resolve(false)
        })
    })
}
