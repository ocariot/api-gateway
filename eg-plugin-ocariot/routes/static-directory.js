const express = require('express')
const cors = require('cors')

module.exports = function (app) {
    app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEADER'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
    ))
    app.use(express.static('assets', {dotfiles: 'allow'}))
}
