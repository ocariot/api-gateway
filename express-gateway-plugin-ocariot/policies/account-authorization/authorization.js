const service = require('./../../services/http-client')
const errorHandler = require('./../../utils/error.handler')
const UserType = require('./../../utils/constants').UserType

module.exports = function (actionParams) {
    return (req, res, next) => {
        // DELETE /v1/users/{user_id} [users:delete]
        if (/^(\/v1\/users\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
            userDeleteRules(req, res, next)
        }
        // PUT /v1/users/{user_id}/password ['applications:update', 'children:update', 'educators:update', 'families:update', 'healthprofessionals:update']
        else if (/^(\/v1\/users\/)[a-fA-F0-9]{24}\/password\/{0,1}$/.test(req.originalUrl) && req.method === 'PUT') {
            userUpdatePassRules(req, res, next)
        }
        // GET /v1/institutions/{institution_id} ['institutions:read’]
        else if (/^(\/v1\/institutions\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getInstitutionByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        } else {
            next()
        }
    }
}

/**
 * Checks if user is authorized to delete user.
 *
 * RULES:
 * 1. Only the Admin user can delete any other users. ✓
 * 2. He Admin user cannot delete himself.
 */
function userDeleteRules(req, res, next) {
    if (!equalUsers(req)) {
        next()
        return
    }
    errorHandler(403, res)
}

/**
 * Checks if user is allowed to update password.
 *
 * RULES:
 * 1. Admin, Family, Educator, and Health Professional users can update their own password only.
 */
function userUpdatePassRules(req, res, next) {
    if ((req.user.sub_type === UserType.ADMIN ||
        req.user.sub_type === UserType.FAMILY ||
        req.user.sub_type === UserType.EDUCATOR ||
        req.user.sub_type === UserType.HEALTH_PROFESSIONAL) && equalUsers(req)) {
        next()
        return
    }
    errorHandler(403, res)
}

/**
 * Checks that the user has permission to view Institution data.
 *
 * RULES:
 *  1. User Admin, Educator, Health Professional, and Application can list information from any institution. ✓
 *  2. Child and Family users can only list information from the institution to which they belong.
 */
function getInstitutionByIdRules(urlBase, req, res, next) {
    console.log('getInstitutionByIdRules', req.user.sub_type, req.user.sub, req.params.institution_id)
    if (req.user.sub_type !== UserType.CHILD &&
        req.user.sub_type !== UserType.FAMILY) {
        next()
        return
    }

    service
        .get(urlBase.concat(`/v1/${req.user.sub_type === UserType.CHILD ? 'children' : 'families'}/${req.user.sub}`))
        .then(result => result.data)
        .then(result => {
            if (result.institution_id !== req.params.institution_id) {
                errorHandler(403, res)
                return
            }
            next()
        })
        .catch(e => {
            console.log(e.response.data)
            errorHandler(500, res)
        })
}

function equalUsers(req) {
    return req.params.user_id === req.user.sub
}


