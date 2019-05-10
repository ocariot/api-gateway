/**
 * Policy to validate scopes
 */
module.exports = {
  name: 'ocariot-jwtScopes-policy',
  policy: require('./ocariot-jwtScopes'),
  schema: {
    $id: 'http://express-gateway.io/schemas/policies/ocariot-jwtScopes-policy.json',
    type: 'object',
    properties: {}
  }
};