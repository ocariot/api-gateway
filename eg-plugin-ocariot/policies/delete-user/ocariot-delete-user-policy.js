/**
 * Delte user gateway policy
 * 
 */
module.exports = {
  name: 'ocariot-delete-user-policy',
  policy: require('./ocariot-delete-user'),
  schema: {
    name: 'ocariot-delete-user-policy',
    $id: 'http://express-gateway.io/schemas/policies/ocariot-delete-user-policy.json',
    type: 'object',
    properties: {
      urldeleteservice: {
        type: 'string'
      }      
    },
    required: ['urldeleteservice']
  }
};
