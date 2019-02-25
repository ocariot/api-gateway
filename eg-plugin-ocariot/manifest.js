module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication/ocariot-jwt-policy'));
    pluginContext.registerPolicy(require('./policies/authorization/ocariot-jwtScopes-policy'));
    pluginContext.registerPolicy(require('./policies/auth/ocariot-auth-policy'));
    pluginContext.registerPolicy(require('./policies/body-parser/ocariot-body-parser-policy'));
    pluginContext.registerPolicy(require('./policies/delete-user/ocariot-delete-user-policy'));
    pluginContext.registerCondition(require('./conditions/is-auth'));
    pluginContext.registerCondition(require('./conditions/is-delete'));
    pluginContext.registerGatewayRoute(require('./routes/https'));
    pluginContext.registerGatewayRoute(require('./routes/reference-ocariot'));
  },
  policies:['ocariot-jwt-policy', 'ocariot-jwtScopes-policy', 'haniot-auth-policy','haniot-body-parser-policy'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
};
