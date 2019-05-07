const defaults = require('../../default')

module.exports = function (app) {
    const PORT_HTTPS = process.env.PORT_HTTPS || defaults.PORT_HTTPS

    app.enable('trust proxy')
    app.use(function (req, res, next) {
        if (req.secure || /^(\/.well\-known\/)/g.test(req.url)) {
            next() // request was via https, so do no special handling
            return
        }
        const host = req.headers.host || ''
        // request was via http, so redirect to https
        if (host.includes(':')) {
            res.writeHead(301, {Location: `https://${host.replace(/:\d+/, ':' + PORT_HTTPS)}${req.url}`})
        } else {
            res.writeHead(301, {Location: `https://${host}${':'.concat(PORT_HTTPS)}${req.url}`})
        }
        res.end()
    })
}
