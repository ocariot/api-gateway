const errorHandler = require('./../../utils/error.handler')
const deviceDao = require('./../device-pki/pki.dao')

const isProd = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'

module.exports = (actionParams) => {
    return (req, res, next) => {
        console.log('>>> device-authorization')
        /**
         * If checks fail, return 403
         *  errorHandler(403, res)
         *
         *  Be careful not to give next() when you don't pass validations
         */
        next()
    }
}
