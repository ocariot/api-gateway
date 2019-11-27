const service = require('./../../services/http-client')
const errorHandler = require('./../../utils/error.handler')
const UserType = require('./../../utils/constants').UserType

module.exports = function (actionParams) {
    return (req, res, next) => {
        /**
         * ####### USERS.FITBIT.AUTH #######
         */
        // POST /v1/users/{user_id}/fitbit/auth ['external:sync']
        if (/^(\/v1\/users\/)[^\W_]{24}\/fitbit\/auth\/{0,1}$/.test(req.path) && req.method === 'POST') {
            requestResourceByUserIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // GET /v1/users/{user_id}/fitbit/auth ['external:sync']
        else if (/^(\/v1\/users\/)[^\W_]{24}\/fitbit\/auth\/{0,1}$/.test(req.path) && req.method === 'GET') {
            requestResourceByUserIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // POST /v1/users/{user_id}/fitbit/auth/revoke ['external:sync']
        else if (/^(\/v1\/users\/)[^\W_]{24}\/fitbit\/auth\/revoke\/{0,1}$/.test(req.path) && req.method === 'POST') {
            requestResourceByUserIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### USERS.FITBIT.SYNC #######
         */
        // POST /v1/users/{user_id}/fitbit/sync ['external:sync']
        else if (/^(\/v1\/users\/)[^\W_]{24}\/fitbit\/sync\/{0,1}$/.test(req.path) && req.method === 'POST') {
            requestResourceByUserIdRules(actionParams.accountServiceUrlBase, req, res, next)
        } else {
            next()
        }
    }
}

// ####### RULES FUNCTION #######
/**
 * Checks that the user has permission to access a route with the given user ID.
 *
 * RULES:
 *  1. Application User can access one of the mapped routes with any user ID as long as that user (Child) exists.
 *  2. Child user can access one of the mapped routes only with their own ID.
 *  3. Educator and HealthProfessional users can access one of the routes mapped with any user ID as long as this
 *     user (Child) is part of one of their groups.
 *  4. Family user can access one of the mapped routes with any user ID as long as that user (Child) is associated with it.
 */
async function requestResourceByUserIdRules(urlBase, req, res, next) {
    if (req.user.sub_type === UserType.CHILD && req.params.user_id !== req.user.sub) errorHandler(403, res, req)
    else {
        resultSearch = await searchChildById(urlBase, req)
        if (resultSearch === true) {
            if (req.user.sub_type === UserType.APPLICATION || req.user.sub_type === UserType.CHILD) next()
            else if ((req.user.sub_type === UserType.EDUCATOR || req.user.sub_type === UserType.HEALTH_PROFESSIONAL)
                && await isAssociatedChild(urlBase, req)) next()
            else if (req.user.sub_type === UserType.FAMILY && await isAssociatedChild(urlBase, req)) next()
            else errorHandler(403, res, req)
        } else errorHandler(-1, res, req, resultSearch)
    }
}

// ####### FUNCTIONS #######
function searchChildById(urlBase, req) {
    return new Promise((resolve, reject) => {
        service
            .get(urlBase.concat(`/v1/children/${req.params.user_id}`))
            .then(result => {
                if (result.status === 200) return resolve(true)
            })
            .catch(e => {
                return resolve(e.response.data)
            })
    })
}

function isAssociatedChild(urlBase, req) {
    return new Promise((resolve, reject) => {
        if (req.user.sub_type === UserType.FAMILY) {
            service
                .get(urlBase.concat(`/v1/families/${req.user.sub}/children`))
                .then(result => result.data)
                .then(result => {
                    result.forEach(child => {
                        if (child.id === req.params.user_id) return resolve(true)
                    })
                    return resolve(false)
                })
                .catch(e => {
                    return resolve(false)
                })
        } else {
            service
                .get(urlBase.concat(`/v1/${req.user.sub_type === UserType.EDUCATOR ? 'educators' :
                    'healthprofessionals'}/${req.user.sub}/children/groups`))
                .then(result => result.data)
                .then(result => {
                    result.forEach(childrenGroup => {
                        childrenGroup.children.forEach(child => {
                            if (child.id === req.params.user_id) return resolve(true)
                        })
                    })
                    return resolve(false)
                })
                .catch(e => {
                    return resolve(false)
                })
        }
    })
}
