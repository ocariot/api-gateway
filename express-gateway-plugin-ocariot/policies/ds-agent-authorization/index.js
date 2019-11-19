module.exports = {
    name: 'ds-agent-authorization',
    policy: require('./authorization'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/ds-agent-authorization.json',
        type: 'object',
        properties: {
            accountServiceUrlBase: {
                type: 'string',
                title: 'url',
                description: 'the service URL for requests'
            }
        },
        required: ['accountServiceUrlBase']
    }
}
