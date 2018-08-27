module.exports = {
  name: 'ocariot-jwtScopes-policy',
  policy: require('./ocariot-jwtScopes'),
  schema: {
    name: 'authentication',
    $id: 'http://express-gateway.io/schemas/policies/ocariot-jwtScopes-policy.json',
  }
};