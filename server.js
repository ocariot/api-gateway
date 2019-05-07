'use strict'

const fs = require('fs')
const gateway = require('express-gateway')
const path = require('path')
const dotenv = require('dotenv')
const defaults = require('./default')

dotenv.load()

const SSL_KEY_PATH = process.env.SSL_KEY_PATH || defaults.SSL_KEY_PATH
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || defaults.SSL_CERT_PATH
const JWT_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH || defaults.JWT_PUBLIC_KEY_PATH

if (!fs.existsSync(SSL_KEY_PATH)) {
    console.error(`SSL key required!\nPlease provide the ssl key in the .env file in SSL_KEY_PATH.`)
    process.exit()
}

if (!fs.existsSync(SSL_CERT_PATH)) {
    console.error(`SSL certificate required!\nPlease provide the ssl certificate in the .env file in SSL_KEY_PATH.`)
    process.exit()
}

const jwt_interval = setInterval(initialize, 1000, JWT_KEY_PATH)

/**
 * Verify that the JWT switch has been provided.
 * Usually provided by account-service.
 *
 * Initialize the express gateway.
 *
 * @param filePath
 */
function initialize(filePath) {
    if (fs.existsSync(filePath)) {
        clearInterval(jwt_interval)

        /* Start Gateway */
        gateway()
            .load(path.join(__dirname, 'config'))
            .run()
    } else {
        console.log('Waiting JWT public key...')
    }
}
