/**
 * Condition to verify if the requested route is to delete users and method is DELETE
 */
module.exports = {
  name: 'is-delete',
  handler: function (req, conditionConfig) {  
    const regex = new RegExp(conditionConfig.deletepath);    
    return (regex.test(req.url) && req.method === 'DELETE');
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/conditions/is-delete.json',
    type: 'object',
    properties: {
      deletepath: {
        type: 'string'
      }
    },
    required: ['deletepath']
  }
};
