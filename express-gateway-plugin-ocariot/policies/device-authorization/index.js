module.exports = {
    name: 'device-authorization',
    policy: require('./authorization'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/device-authorization.json',
        type: 'object',
        properties: {},
        required: []
    }
}
