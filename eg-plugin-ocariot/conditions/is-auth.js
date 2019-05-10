/**
 * Condição para verficar se a rota requisitada é a de login
 */
module.exports = {
  name: 'is-auth',
  handler: function (req, conditionConfig) {    
    return (conditionConfig.authpath === req.url && req.method === 'POST');
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/conditions/is-auth.json',
    type: 'object',
    properties: {
      authpath: {
        type: 'string'
      }
    },
    required: ['authpath']
  }
};
