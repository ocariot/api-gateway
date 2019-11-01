module.exports = {
    version: '1.0.0',
    init: function (pluginContext) {
       pluginContext.registerPolicy(require('./policies/account-authorization'));
    },
    policies:['account-authorization'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
    schema: {
        $id: "http://express-gateway.io/schemas/plugins/express-gateway-plugin-ocariot.json"
    }
};
