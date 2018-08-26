module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication'));
    pluginContext.registerPolicy(require('./policies/authorization'));	
  },
  policies:['authorization', 'authentication'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
};
