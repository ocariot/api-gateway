/**
 * Policy to validate scopes
 */
//const jwtz = require('express-jwt-authz');
function error(res) {
    return res.status(403).send({"code": 403,"message": "FORBIDDEN","description": "Authorization failed due to insufficient permissions.","redirect_link": "/users/auth"});
}

module.exports = function (actionParams) {
    const jwtz = (expectedScopes) => {
        if (!Array.isArray(expectedScopes)) {
            throw new Error('Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)');
        }

        return function (req, res, next) {
            if (expectedScopes.length === 0) {
                return next();
            }
            if (!req.user || typeof req.user.scope !== 'string') { return error(res); }
            var scopes = req.user.scope.split(' ');
            var allowed = expectedScopes.some(function (scope) {
                return scopes.indexOf(scope) !== -1;
            });

            return allowed ?
                next() :
                error(res);
        }
    }
    return (req, res, next) => {
        // console.log('executing haniot authorization policy with params');
        // console.log(actionParams);        
        jwtz(req.egContext.apiEndpoint.scopes)(req, res, next);
    }
};