const db = require('express-gateway/lib/db')

const ID = (id) => {
    return `ocariot_device:${id}`
}

exports.getCertInfo = (deviceId) => {
    return new Promise((resolve) => {
        db.get(ID(deviceId), (err, result) => {
            if (err) return resolve(undefined)
            resolve({
                device_id: deviceId,
                serial_number: result
            })
        })
    })
}

exports.saveCertInfo = (deviceId, serialNumber) => {
    return new Promise((resolve) => {
        db
            .pipeline()
            .set(ID(deviceId), serialNumber)
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
