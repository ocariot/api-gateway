const jwtz = require('express-jwt-authz');

module.exports = {
  name: 'authorization',
  policy: (params) => {
    return (req, res, next) => {
      jwtz(req.egContext.apiEndpoint.scopes)(req, res, next);
    }
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/policy/ocariot-jwt-authorization.json',
  }
}


