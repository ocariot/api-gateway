module.exports = {
    name: 'iot-device-pki',
    policy: require('./pki'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/iot-device-pki.json',
        type: 'object',
        properties: {
            iotTrackingUrlBase: {
                type: 'string',
                title: 'url',
                description: 'the URL of the iot tracking service for requests'
            },
            vaultServiceUrlBase: {
                type: 'string',
                title: 'url',
                description: 'the service URL for requests'
            },
            vaultServiceToken: {
                type: 'string',
                title: 'token',
                description: 'the service token for requests'
            }
        },
        required: ['iotTrackingUrlBase', 'vaultServiceUrlBase', 'vaultServiceToken']
    }
}
