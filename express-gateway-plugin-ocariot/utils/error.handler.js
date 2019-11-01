module.exports = (code, res) => {
    let message = {}
    switch (code) {
        case 400:
            message = {
                code: 401,
                message: 'UNAUTHORIZED',
                description: 'Authentication failed for lack of authentication credentials.'
            }
            break
        case 403:
            message = {
                code: 403,
                message: 'FORBIDDEN',
                description: 'Authorization failed due to insufficient permissions.'
            }
            break
        default:
            return {
                code: 500,
                message: 'An internal server error has occurred.'
            }
    }
    res.status(code).send(message)
}

