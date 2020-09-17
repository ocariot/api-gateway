module.exports = {
    name: 'iot-device-authorization',
    policy: require('./authorization'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/iot-device-authorization.json',
        type: 'object',
        properties: {
            accountServiceUrlBase: {
                type: 'string',
                title: 'url',
                description: 'the service URL for requests'
            },
            iotServiceUrlBase: {
                type: 'string',
                title: 'url',
                description: 'the service URL for requests'
            }
        },
        required: ['accountServiceUrlBase', 'iotServiceUrlBase']
    }
}
