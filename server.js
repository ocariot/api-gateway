const gateway = require('express-gateway')
const path = require('path')
const dotenv = require('dotenv')
const defaults = require('./default')
const fs = require('fs')

dotenv.load()

/* Create certificates (HTTPS certificates and JWT public key ) directory if it doesn't exists */
const cert_path = process.env.CERT_PATH || defaults.CERT_PATH
const ssl_private_key_path = process.env.SSL_PRIVATE_KEY_PATH || defaults.SSL_PRIVATE_KEY_PATH
const ssl_certificate_path = process.env.SSL_CERT_PATH || defaults.SSL_CERT_PATH
const jwt_public_key_path = process.env.JWT_PUBLIC_KEY_PATH || defaults.JWT_PUBLIC_KEY_PATH

/*Create the certificates dir if it doesn't exist */
if (!fs.existsSync(cert_path)) {
        fs.mkdirSync(cert_path)
}

if ((process.env.NODE_ENV || defaults.NODE_ENV) !== 'production') {
        /* In development or test environment it's generated a self signed SSL certificate */
        require('pem').createCertificate({ days: 365, selfSigned: true }, function (err, keys) {
                if (err) {
                        console.error('Failure generating self-signed HTTPS certificates:\r\n' + err)
                        process.exit(1)
                }
                /* Store certificates in the file system*/
                try {
                        fs.writeFileSync(ssl_private_key_path, keys.serviceKey, 'ascii')
                        fs.writeFileSync(ssl_certificate_path, keys.certificate, 'ascii')
                } catch (err) {
                        console.error('Failure saving self-signed HTTPS certificates:\r\n' + err)
                        process.exit(1)
                }
        })
}

/* Waits for public key used in JWT token verification */
const jwt_public_key_interval = setInterval(waitFileSync, 1000, jwt_public_key_path)
function waitFileSync(filePath) {
        if (fs.existsSync(filePath)) {
                clearInterval(jwt_public_key_interval);
                /* Start Gateway */
                gateway()
                        .load(path.join(__dirname, 'config'))
                        .run()
        } else{console.log('Waiting JWT public key...')}
}