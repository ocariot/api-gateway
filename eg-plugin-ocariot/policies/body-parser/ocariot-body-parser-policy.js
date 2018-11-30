/**
 * Policy to convert req in object javascript
 */
module.exports = {
    name: 'ocariot-body-parser-policy',
    policy: require('./ocariot-body-parser'),
    schema: {
      $id: 'http://express-gateway.io/schemas/policies/ocariot-body-parser-policy.json',
      type: 'object',
      properties: {}
    }
  };