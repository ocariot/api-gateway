module.exports = {
  version: '1.0.1',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication/ocariot-jwt-policy'))
    pluginContext.registerPolicy(require('./policies/authorization/ocariot-jwtScopes-policy'))
    pluginContext.registerPolicy(require('./policies/auth/ocariot-auth-policy'))
    pluginContext.registerPolicy(require('./policies/body-parser/ocariot-body-parser-policy'))
    pluginContext.registerPolicy(require('./policies/delete-user/ocariot-delete-user-policy'))
    pluginContext.registerCondition(require('./conditions/is-auth'))
    pluginContext.registerCondition(require('./conditions/is-delete'))
    // pluginContext.registerGatewayRoute(require('./routes/https'))
    pluginContext.registerGatewayRoute(require('./routes/cors'))
    pluginContext.registerGatewayRoute(require('./routes/static-directory'))
    pluginContext.registerGatewayRoute(require('./routes/redirect-http'))
    pluginContext.registerGatewayRoute(require('./routes/api-reference'))
  },
  policies:['ocariot-jwt-policy', 'ocariot-jwtScopes-policy', 'ocariot-auth-policy','ocariot-body-parser-policy','ocariot-delete-user-policy'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
};
