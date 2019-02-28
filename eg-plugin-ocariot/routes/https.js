'use strict'

const http = require('http')
const https = require('https')
const defaults = require('../../default')
const fs = require('fs')
const greenlock = require('greenlock-express')

/* Create certificates (HTTPS certificates and JWT public key ) directory if it doesn't exists */
const cert_path = process.env.CERT_PATH || defaults.CERT_PATH
const ssl_private_key_path = process.env.SSL_PRIVATE_KEY_PATH || defaults.SSL_PRIVATE_KEY_PATH
const ssl_certificate_path = process.env.SSL_CERT_PATH || defaults.SSL_CERT_PATH
const portHTTPS = process.env.PORT_HTTPS || defaults.PORT_HTTPS
const https_options = {
    key: fs.readFileSync(ssl_private_key_path),
    cert: fs.readFileSync(ssl_certificate_path)
}

/*Create the certificates dir if it doesn't exist */
if (!fs.existsSync(cert_path)) {
    fs.mkdirSync(cert_path)
}

module.exports = (app) => {
    if ((process.env.NODE_ENV || defaults.NODE_ENV) !== 'production') {
        try {
            https.createServer(https_options, app)
                .listen(portHTTPS, () => {
                    console.log("HTTPS server listenning on port", portHTTPS)
                })
        } catch (err) {
            console.error('Failure starting HTTPS server:\r\n' + err)
            process.exit(1)
        }

    } else {
        // returns an instance of node-greenlock with additional helper methods
        var lex = greenlock.create({
            // Let's Encrypt v2 is ACME draft 11
            // Note: If at first you don't succeed, stop and switch to staging
            server: 'https://acme-staging-v02.api.letsencrypt.org/directory'
            // server: 'https://acme-v02.api.letsencrypt.org/directory'
            , version: 'draft-11'
            // You MUST have write access to save certs
            , configDir: '~/.config/acme/'

            // If you wish to replace the default plugins, you may do so here
            //
            , challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '~/.config/acme/challenges' }) }
            , store: require('le-store-certbot').create({
                webrootPath: ':configDir/www/.well-known/acme-challenge',
                privkeyPath: ssl_private_key_path,
                certPath: ssl_certificate_path,
            })

            // Get notified of important updates and help me make greenlock better
            , communityMember: false

            // You probably wouldn't need to replace the default sni handler
            // See https://git.daplie.com/Daplie/le-sni-auto if you think you do
            //, sni: require('le-sni-auto').create({})

            , approveDomains: approveDomains
        })

        function approveDomains(opts, certs, cb) {
            // Only one domain is listed with *automatic* registration via SNI
            // (it's an array because managed registration allows for multiple domains,
            //                                which was the case in the simple example)
            console.log('Certificating domains: ' + opts.domains)

            // The domains being approved for the first time are listed in opts.domains
            // Certs being renewed are listed in certs.altnames
            if (certs) {
                opts.domains = [certs.subject].concat(certs.altnames)
            }

            fooCheckDb(opts.domains, function (err, agree, email) {
                if (err) { cb(err); return }

                // Services SHOULD automatically accept the ToS and use YOUR email
                // Clients MUST NOT accept the ToS without asking the user
                opts.agreeTos = agree
                opts.email = email

                // NOTE: you can also change other options such as `challengeType` and `challenge`
                // (this would be helpful if you decided you wanted wildcard support as a domain altname)
                // opts.challengeType = 'http-01'
                // opts.challenge = require('le-challenge-fs').create({})

                cb(null, { options: opts, certs: certs })
            })
        }


        function fooCheckDb(domains, cb) {
            // This is an oversimplified example of how we might implement a check in
            // our database if we have different rules for different users and domains
            var approved_domains = ["" + (process.env.HTTPS_DOMAIN || defaults.HTTPS_DOMAIN)]
            var userEmail = "" + (process.env.HTTPS_MAIL || defaults.HTTPS_MAIL)
            console.log(`Domain allowed: ${approved_domains} Domain email: ${userEmail}`)
            var userAgrees = true
            var passCheck = domains.every(function (domain) {
                return -1 !== approved_domains.indexOf(domain)
            })

            if (!passCheck) {
                cb(new Error('domain not allowed'))
            } else {
                cb(null, userAgrees, userEmail)
            }
        }

        // handles acme-challenge and redirects to https
        http.createServer(lex.middleware(require('redirect-https')()))
            .listen(80, function () {
                console.log("Listening for ACME http-01 challenges on", this.address())
            })

        // Create HTTPS server
        https.createServer(lex.httpsOptions, lex.middleware(app))
            .listen(portHTTPS, function () {
                console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address())
            })
    }

    /* Redirect HTTP to HTTPS */
    app.enable('trust proxy')
    app.use(function (req, res, next) {
        if (req.secure) {
            next() // request was via https, so do no special handling
        } else {
            res.redirect((process.env.API_GATEWAY_SERVICE || defaults.API_GATEWAY_SERVICE) + req.url) // request was via http, so redirect to https
        }
    })
}