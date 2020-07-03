module.exports = (code, res, req, err) => {
    if (err) {
        if (err.code === 404) {
            let message = {}
            if (req.params.child_id) {
                message = {
                    code: 400,
                    message: `There is no registered Child with ID: ${req.params.child_id} on the platform!`,
                    description: 'Please register the Child and try again...'
                }
            } else if (req.params.user_id) {
                message = {
                    code: 400,
                    message: `There is no registered Child with ID: ${req.params.user_id} on the platform!`,
                    description: 'Please register the Child and try again...'
                }
            } else {
                message = {
                    code: 400,
                    message: `There is no registered Institution with ID: ${req.params.institution_id} on the platform!`,
                    description: 'Please register the Institution and try again...'
                }
            }
            res.status(400).send(message)
        } else res.status(err.code).send(err)
    } else {
        let message = {}
        switch (code) {
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
            case 404:
                message = {
                    code: 404,
                    message: `${req.path} not found.`,
                    description: `Specified resource: ${req.path} was not found or does not exist.`
                }
                break
            default:
                message = {
                    code: 500,
                    message: 'An internal server error has occurred.'
                }
        }
        res.status(code).send(message)
    }
}

