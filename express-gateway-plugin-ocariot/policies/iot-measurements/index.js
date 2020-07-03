module.exports = {
    name: 'iot-measurements',
    policy: require('./iot.measurements'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/iot-measurements.json',
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
