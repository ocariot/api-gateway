/**
 * Login Policy
 * 
 */
module.exports = {
  name: 'ocariot-auth-policy',
  policy: require('./ocariot-auth'),
  schema: {
    name: 'ocariot-jwt-policy',
    $id: 'http://express-gateway.io/schemas/policies/ocariot-auth-policy.json',
    type: 'object',
    properties: {
      urlauthservice: {
        type: 'string'
      },
      secretOrPublicKey: {
        type: 'string'
      },
      secretOrPublicKeyFile: {
        type: 'string'
      },
      issuer: {
        type: 'string'
      }
    },
    required: ['urlauthservice','issuer'],
    oneOf: [{ required: ['secretOrPublicKey'] }, { required: ['secretOrPublicKeyFile'] }]
  }
};
