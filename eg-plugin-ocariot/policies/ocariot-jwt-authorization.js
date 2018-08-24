const jwtz = require('express-jwt-authz');
module.exports = plugin;

module.exports = {
  name: 'jwtScopes',
  policy: (params) => {
    return (req, res, next) => {
      jwtz(req.egContext.apiEndpoint.scopes)(req, res, next)
    }
  }
}
/*const plugin = {
  version: '1.0.0',
  policies: ['apiroot'],
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'jwtScopes',
      policy: (params) => (req, res, next) => jwtz(req.egContext.apiEndpoint.scopes)(req, res, next)
    })
  }
}*/


