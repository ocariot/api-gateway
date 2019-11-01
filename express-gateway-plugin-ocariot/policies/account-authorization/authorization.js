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
        // GET /v1/institutions/{institution_id} ['institutions:read']
        else if (/^(\/v1\/institutions\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getInstitutionByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // PATCH /v1/institutions/{institution_id} ['institutions:update']
        else if (/^(\/v1\/institutions\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchInstitutionByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // GET /v1/children/{child_id} ['children:read']
        else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getChildByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // GET /v1/families/{family_id} ['families:read']
        else if (/^(\/v1\/families\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getFamilyByIdRules(req, res, next)
        }
        // PATCH /v1/families/{family_id} ['families:update']
        else if (/^(\/v1\/families\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchFamilyByIdRules(req, res, next)
        }
        // GET /v1/educators/{educator_id} ['educators:read']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getEducatorByIdRules(req, res, next)
        }
        // PATCH /v1/educators/{educator_id} ['educators:read']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchEducatorByIdRules(req, res, next)
        }
        // GET /v1/healthprofessionals/{healthprofessional_id} ['healthprofessionals:read']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getHealthProfessionalByIdRules(req, res, next)
        }
        // PATCH /v1/healthprofessionals/{healthprofessional_id} ['healthprofessionals:read']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchHealthProfessionalByIdRules(req, res, next)
        }
        // GET /v1/applications/{application_id} ['applications:read']
        else if (/^(\/v1\/applications\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getApplicationByIdRules(req, res, next)
        }
        else {
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
    if (!equalUsersPassword(req)) {
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
        req.user.sub_type === UserType.HEALTH_PROFESSIONAL) && equalUsersPassword(req)) {
        next()
        return
    }
    errorHandler(403, res)
}

/**
 * Checks that the user has permission to view Institution data.
 *
 * RULES:
 *  1. Admin, Educator, Health Professional and Application users can list information from any institution. ✓
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

/**
 * Checks that the user has permission to update Institution data.
 *
 * RULES:
 *  1. Admin user can update information from any institution. ✓
 *  2. Educator and Health Professional users can only update information from the institution to which they belong.
 */
function patchInstitutionByIdRules(urlBase, req, res, next) {
    console.log('patchInstitutionByIdRules', req.user.sub_type, req.user.sub, req.params.institution_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    service
        .get(urlBase.concat(`/v1/${req.user.sub_type === UserType.EDUCATOR ? 'educators' : 'healthprofessionals'}/${req.user.sub}`))
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

/**
 * Checks that the user has permission to view Child data.
 *
 * RULES:
 *  1. Admin, Educator and Health Professional users can list information from any child. ✓
 *  2. Child users can only list their own information.
 *  3. Family users can only list information from their own children.
 */
function getChildByIdRules(urlBase, req, res, next) {
    console.log('getChildByIdRules', req.user.sub_type, req.user.sub, req.params.child_id)
    if (req.user.sub_type !== UserType.CHILD &&
        req.user.sub_type !== UserType.FAMILY) {
        next()
        return
    }

    else if (req.user.sub_type === UserType.CHILD) {
        if (!equalUsers(req)) {
            errorHandler(403, res)
            return
        }
        next()
        return
    }

    // Family users
    service
        .get(urlBase.concat(`/v1/families/${req.user.sub}/children`))
        .then(result => result.data)
        .then(result => {
            let hasChild = false
            result.forEach(child => {
                if (child.id === req.params.child_id) hasChild = true
            })
            if (!hasChild) {
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

/**
 * Checks that the user has permission to view Family data.
 *
 * RULES:
 *  1. Admin users can list information from any family. ✓
 *  2. Family users can only list their own information.
 */
function getFamilyByIdRules(req, res, next) {
    console.log('getFamilyByIdRules', req.user.sub_type, req.user.sub, req.params.family_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to update Family data.
 *
 * RULES:
 *  1. Admin users can update information from any family. ✓
 *  2. Family users can only update their own information.
 */
function patchFamilyByIdRules(req, res, next) {
    console.log('patchFamilyByIdRules', req.user.sub_type, req.user.sub, req.params.family_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to view Educator data.
 *
 * RULES:
 *  1. Admin users can list information from any educator. ✓
 *  2. Educator users can only list their own information.
 */
function getEducatorByIdRules(req, res, next) {
    console.log('getEducatorByIdRules', req.user.sub_type, req.user.sub, req.params.educator_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to update Educator data.
 *
 * RULES:
 *  1. Admin users can update information from any educator. ✓
 *  2. Educator users can only update their own information.
 */
function patchEducatorByIdRules(req, res, next) {
    console.log('patchEducatorByIdRules', req.user.sub_type, req.user.sub, req.params.educator_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to view Health Professional data.
 *
 * RULES:
 *  1. Admin users can list information from any health professional. ✓
 *  2. Health Professional users can only list their own information.
 */
function getHealthProfessionalByIdRules(req, res, next) {
    console.log('getHealthProfessionalByIdRules', req.user.sub_type, req.user.sub, req.params.healthprofessional_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to update Health Professional data.
 *
 * RULES:
 *  1. Admin users can update information from any health professional. ✓
 *  2. Health Professional users can only update their own information.
 */
function patchHealthProfessionalByIdRules(req, res, next) {
    console.log('patchHealthProfessionalByIdRules', req.user.sub_type, req.user.sub, req.params.healthprofessional_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

/**
 * Checks that the user has permission to view Application data.
 *
 * RULES:
 *  1. Admin users can list information from any application. ✓
 *  2. Application users can only list their own information.
 */
function getApplicationByIdRules(req, res, next) {
    console.log('getApplicationByIdRules', req.user.sub_type, req.user.sub, req.params.application_id)
    if (req.user.sub_type === UserType.ADMIN) {
        next()
        return
    }

    if (!equalUsers(req)) {
        errorHandler(403, res)
        return
    }

    next()
}

function equalUsersPassword(req) {
    return req.params.user_id === req.user.sub
}

function equalUsers(req) {
    if (req.user.sub_type === UserType.APPLICATION) return req.params.application_id === req.user.sub
    if (req.user.sub_type === UserType.CHILD) return req.params.child_id === req.user.sub
    if (req.user.sub_type === UserType.EDUCATOR) return req.params.educator_id === req.user.sub
    if (req.user.sub_type === UserType.FAMILY) return req.params.family_id === req.user.sub
    if (req.user.sub_type === UserType.HEALTH_PROFESSIONAL) return req.params.healthprofessional_id === req.user.sub
}
