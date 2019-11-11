module.exports = {
    name: 'account-authorization',
    policy: require('./authorization'),
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/account-authorization.json',
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
