const jwtz = require('express-jwt-authz');

module.exports = function (actionParams) {
    return (req, res, next) => {
        jwtz(req.egContext.apiEndpoint.scopes)(req, res, next);
    }
};