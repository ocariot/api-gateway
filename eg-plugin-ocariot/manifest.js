module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication/ocariot-jwt-policy'));
    pluginContext.registerPolicy(require('./policies/authorization/ocariot-jwtScopes-policy'));
    pluginContext.registerGatewayRoute(require('./routes/user.router-gateway'));

  },
  policies:['ocariot-jwt-policy', 'ocariot-jwtScopes-policy'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
};
