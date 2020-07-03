module.exports = {
    version: '1.0.0',
    init: function (pluginContext) {
        pluginContext.registerPolicy(require('./policies/account-authorization'))
        pluginContext.registerPolicy(require('./policies/iot-tracking-authorization'))
        pluginContext.registerPolicy(require('./policies/ds-agent-authorization'))
        pluginContext.registerPolicy(require('./policies/device-authorization'))
        pluginContext.registerPolicy(require('./policies/device-pki'))
        pluginContext.registerPolicy(require('./policies/iot-measurements'))
    },
    // this is for CLI to automatically add to "policies" whitelist in gateway.config
    policies: [
        'account-authorization',
        'iot-tracking-authorization',
        'ds-agent-authorization',
        'device-pki-authorization',
        'device-pki',
        'iot-measurements'
    ],
    schema: {
        $id: 'http://express-gateway.io/schemas/plugins/express-gateway-plugin-ocariot.json'
    }
}
