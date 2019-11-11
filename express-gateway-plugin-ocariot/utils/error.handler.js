module.exports = (code, res, req) => {
    let message = {}
    switch (code) {
        case 400:
            if (req.params.child_id) {
                message = {
                    code: 400,
                    message: `There is no registered Child with ID: ${req.params.child_id} on the platform!`,
                    description: 'Please register the Child and try again...'
                }
                break
            } else {
                message = {
                    code: 400,
                    message: `There is no registered Institution with ID: ${req.body.institution_id} on the platform!`,
                    description: 'Please register the Institution and try again...'
                }
                break
            }
        case 401:
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

