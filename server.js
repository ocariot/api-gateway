'use strict'

const fs = require('fs')
const gateway = require('express-gateway')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const SSL_KEY_PATH = process.env.SSL_KEY_PATH || './.certs/tls.key'
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || './.certs/tls.pem'
const JWT_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH || './.certs/jwt.key.pub'

if (!fs.existsSync(SSL_KEY_PATH)) {
    console.error(`SSL key required!\nPlease provide the ssl key in the .env file in SSL_KEY_PATH.`)
    process.exit()
}

if (!fs.existsSync(SSL_CERT_PATH)) {
    console.error(`SSL certificate required!\nPlease provide the ssl certificate in the .env file in SSL_CERT_PATH.`)
    process.exit()
}

if (!fs.existsSync(JWT_KEY_PATH)) {
    console.error(`JWT public key required!\nPlease provide the jwt public key in the .env file in JWT_PUBLIC_KEY_PATH.`)
    process.exit()
}

/* Start Gateway */
gateway()
    .load(path.join(__dirname, 'config'))
    .run()
