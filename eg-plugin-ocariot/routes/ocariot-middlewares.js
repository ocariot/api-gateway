var cors = require('cors')

/**
 * File to configuration globals middlewares 
 */
module.exports = function (app) {

    var corsOptions = {
        origin: '*',
        methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
      }

      app.use(cors(corsOptions));
};
