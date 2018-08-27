const jwtz = require('express-jwt-authz');

module.exports = function (actionParams) {
    return (req, res, next) => {
        console.log('executing ocariot authorization policy with params', actionParams);
        jwtz(req.egContext.apiEndpoint.scopes)(req, res, next);
    }
};