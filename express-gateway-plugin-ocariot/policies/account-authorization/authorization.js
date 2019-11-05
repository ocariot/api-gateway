const service = require('./../../services/http-client')
const errorHandler = require('./../../utils/error.handler')
const UserType = require('./../../utils/constants').UserType

module.exports = function (actionParams) {
    return (req, res, next) => {
        /**
         * ####### USERS #######
         */
        // DELETE /v1/users/{user_id} [users:delete]
        if (/^(\/v1\/users\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
            userDeleteRules(req, res, next)
        }
        // PUT /v1/users/{user_id}/password ['applications:update', 'children:update', 'educators:update', 'families:update', 'healthprofessionals:update']
        else if (/^(\/v1\/users\/)[a-fA-F0-9]{24}\/password\/{0,1}$/.test(req.originalUrl) && req.method === 'PUT') {
            userUpdatePassRules(req, res, next)
        }

        /**
         * ####### INSTITUTIONS #######
         */
        // GET /v1/institutions/{institution_id} ['institutions:read']
        else if (/^(\/v1\/institutions\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getInstitutionByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // PATCH /v1/institutions/{institution_id} ['institutions:update']
        else if (/^(\/v1\/institutions\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchInstitutionByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### CHILDREN #######
         */
        // GET /v1/children/{child_id} ['children:read']
        else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getChildByIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### FAMILIES #######
         */
        // GET /v1/families/{family_id} ['families:read']
        else if (/^(\/v1\/families\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getFamilyByIdRules(req, res, next)
        }
        // PATCH /v1/families/{family_id} ['families:update']
        else if (/^(\/v1\/families\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchFamilyByIdRules(req, res, next)
        }
        // GET /v1/families/{family_id}/children ['families:read']
        else if (/^(\/v1\/families\/)[a-fA-F0-9]{24}\/children/.test(req.originalUrl) && req.method === 'GET') {
            getFamilyChildrenByIdRules(req, res, next)
        }

        /**
         * ####### EDUCATORS #######
         */
        // GET /v1/educators/{educator_id} ['educators:read']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getEducatorByIdRules(req, res, next)
        }
        // PATCH /v1/educators/{educator_id} ['educators:read']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchEducatorByIdRules(req, res, next)
        }
        // POST /v1/educators/{educator_id}/children/groups ['childrengroups:create']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/children\/groups\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
            postGroupByEducatorIdRules(req, res, next)
        }
        // GET /v1/educators/{educator_id}/children/groups/{group_id}
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/children\/groups\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl)) {
            // ['childrengroups:read']
            if (req.method === 'GET') getGroupByIdAndEducatorIdRules(actionParams.accountServiceUrlBase, req, res, next)
            // ['childrengroups:update']
            else if (req.method === 'PATCH') patchGroupByIdAndEducatorIdRules(actionParams.accountServiceUrlBase, req, res, next)
            // ['childrengroups:delete']
            else if (req.method === 'DELETE') deleteGroupByIdAndEducatorIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // GET /v1/educators/{educator_id}/children/groups ['childrengroups:read']
        else if (/^(\/v1\/educators\/)[a-fA-F0-9]{24}\/children\/groups/.test(req.originalUrl) && req.method === 'GET') {
            getGroupsByEducatorIdRules(req, res, next)
        }

        /**
         * ####### HEALTHPROFESSIONALS #######
         */
        // GET /v1/healthprofessionals/{healthprofessional_id} ['healthprofessionals:read']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getHealthProfByIdRules(req, res, next)
        }
        // PATCH /v1/healthprofessionals/{healthprofessional_id} ['healthprofessionals:read']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'PATCH') {
            patchHealthProfByIdRules(req, res, next)
        }
        // POST /v1/healthprofessionals/{healthprofessional_id}/children/groups ['childrengroups:create']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/children\/groups\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
            postGroupByHealthProfIdRules(req, res, next)
        }
        // GET /v1/healthprofessionals/{healthprofessional_id}/children/groups/{group_id}
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/children\/groups\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl)) {
            // ['childrengroups:read']
            if (req.method === 'GET') getGroupByIdAndHealthProfIdRules(actionParams.accountServiceUrlBase, req, res, next)
            // ['childrengroups:update']
            else if (req.method === 'PATCH') patchGroupByIdAndHealthProfIdRules(actionParams.accountServiceUrlBase, req, res, next)
            // ['childrengroups:delete']
            else if (req.method === 'DELETE') deleteGroupByIdAndHealthProfIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }
        // GET /v1/healthprofessionals/{healthprofessional_id}/children/groups ['childrengroups:read']
        else if (/^(\/v1\/healthprofessionals\/)[a-fA-F0-9]{24}\/children\/groups/.test(req.originalUrl) && req.method === 'GET') {
            getGroupsByHealthProfIdRules(req, res, next)
        }

        /**
         * ####### APPLICATIONS #######
         */
        // GET /v1/applications/{application_id} ['applications:read']
        else if (/^(\/v1\/applications\/)[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
            getApplicationByIdRules(req, res, next)
        }


        else {
            next()
        }
    }
}

// ####### USERS #######
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

// ####### INSTITUTIONS #######
/**
 * Checks if the user has permission to view Institution data.
 *
 * RULES:
 *  1. Admin, Educator, Health Professional and Application users can list information from any institution. ✓
 *  2. Child and Family users can only list information from the institution to which they belong.
 */
function getInstitutionByIdRules(urlBase, req, res, next) {
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
 * Checks if the user has permission to update Institution data.
 *
 * RULES:
 *  1. Admin user can update information from any institution. ✓
 *  2. Educator and Health Professional users can only update information from the institution to which they belong.
 */
function patchInstitutionByIdRules(urlBase, req, res, next) {
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

// ####### CHILDREN #######
/**
 * Checks if the user has permission to view Child data.
 *
 * RULES:
 *  1. Admin, Educator and Health Professional users can list information from any child. ✓
 *  2. Child users can only list their own information.
 *  3. Family users can only list information from their own children.
 */
function getChildByIdRules(urlBase, req, res, next) {
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

// ####### FAMILIES / FAMILIES.CHILDREN #######
/**
 * Checks if the user has permission to view Family data.
 *
 * RULES:
 *  1. Admin users can list information from any family. ✓
 *  2. Family users can only list their own information.
 */
function getFamilyByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to update Family data.
 *
 * RULES:
 *  1. Admin users can update information from any family. ✓
 *  2. Family users can only update their own information.
 */
function patchFamilyByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to view Family children data.
 *
 * RULES:
 *  1. Admin users can list information from any family children. ✓
 *  2. Family users can only list their own children information.
 */
function getFamilyChildrenByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

// ####### EDUCATORS / EDUCATORS.CHILDRENGROUPS #######
/**
 * Checks if the user has permission to view Educator data.
 *
 * RULES:
 *  1. Admin users can list information from any educator. ✓
 *  2. Educator users can only list their own information.
 */
function getEducatorByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to update Educator data.
 *
 * RULES:
 *  1. Admin users can update information from any educator. ✓
 *  2. Educator users can only update their own information.
 */
function patchEducatorByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to create a ChildrenGroup data for an Educator.
 *
 * RULES:
 *  1. Only Educator users can create a ChildrenGroup and for himself.
 */
function postGroupByEducatorIdRules(req, res, next) {
    if (!(req.user.sub_type !== UserType.EDUCATOR || !equalUsers(req))) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to view all ChildrenGroup data from an Educator.
 *
 * RULES:
 *  1. Only Educator users can list their own ChildrenGroup data.
 */
function getGroupsByEducatorIdRules(req, res, next) {
    if (!(req.user.sub_type !== UserType.EDUCATOR || !equalUsers(req))) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to view a specific ChildrenGroup data from an Educator.
 *
 * RULES:
 *  1. Only Educator users can list a ChildrenGroup data that is their own.
 */
async function getGroupByIdAndEducatorIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/educators/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.EDUCATOR, req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to update a specific ChildrenGroup data from an Educator.
 *
 * RULES:
 *  1. Only Educator users can update a ChildrenGroup data that is their own.
 */
async function patchGroupByIdAndEducatorIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/educators/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.EDUCATOR, req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to delete a specific ChildrenGroup data from an Educator.
 *
 * RULES:
 *  1. Only Educator users can delete a ChildrenGroup data that is their own.
 */
async function deleteGroupByIdAndEducatorIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/educators/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.EDUCATOR, req)) next()
    else errorHandler(403, res)
}

// ####### HEALTHPROFESSIONALS / HEALTHPROFESSIONALS.CHILDRENGROUPS #######
/**
 * Checks if the user has permission to view Health Professional data.
 *
 * RULES:
 *  1. Admin users can list information from any health professional. ✓
 *  2. Health Professional users can only list their own information.
 */
function getHealthProfByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to update Health Professional data.
 *
 * RULES:
 *  1. Admin users can update information from any health professional. ✓
 *  2. Health Professional users can only update their own information.
 */
function patchHealthProfByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to create a ChildrenGroup data for a HealthProfessional.
 *
 * RULES:
 *  1. Only HealthProfessional users can create a ChildrenGroup and for himself.
 */
function postGroupByHealthProfIdRules(req, res, next) {
    if (!(req.user.sub_type !== UserType.HEALTH_PROFESSIONAL || !equalUsers(req))) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to view all ChildrenGroup data from a HealthProfessional.
 *
 * RULES:
 *  1. Only HealthProfessional users can list their own ChildrenGroup data.
 */
function getGroupsByHealthProfIdRules(req, res, next) {
    if (!(req.user.sub_type !== UserType.HEALTH_PROFESSIONAL || !equalUsers(req))) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to view a specific ChildrenGroup data from a HealthProfessional.
 *
 * RULES:
 *  1. Only HealthProfessional users can list a ChildrenGroup data that is their own.
 */
async function getGroupByIdAndHealthProfIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/healthprofessionals/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.HEALTH_PROFESSIONAL, req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to update a specific ChildrenGroup data from a HealthProfessional.
 *
 * RULES:
 *  1. Only HealthProfessional users can update a ChildrenGroup data that is their own.
 */
async function patchGroupByIdAndHealthProfIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/healthprofessionals/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.HEALTH_PROFESSIONAL, req)) next()
    else errorHandler(403, res)
}

/**
 * Checks if the user has permission to delete a specific ChildrenGroup data from a HealthProfessional.
 *
 * RULES:
 *  1. Only HealthProfessional users can delete a ChildrenGroup data that is their own.
 */
async function deleteGroupByIdAndHealthProfIdRules(urlBase, req, res, next) {
    url = urlBase.concat(`/v1/healthprofessionals/${req.user.sub}`)
    if (await requestGroupByIdAndUserIdRules(url, UserType.HEALTH_PROFESSIONAL, req)) next()
    else errorHandler(403, res)
}

// ####### APPLICATIONS #######
/**
 * Checks if the user has permission to view Application data.
 *
 * RULES:
 *  1. Admin users can list information from any application. ✓
 *  2. Application users can only list their own information.
 */
function getApplicationByIdRules(req, res, next) {
    if (requestByIdRules(req)) next()
    else errorHandler(403, res)
}

// ####### FUNCTIONS #######
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

function requestByIdRules(req) {
    return req.user.sub_type === UserType.ADMIN ? true : equalUsers(req)
}

function requestGroupByIdAndUserIdRules(url, userType, req) {
    return new Promise((resolve, reject) => {
        if (req.user.sub_type !== userType || !equalUsers(req)) return resolve(false)

        // GET User ChildrenGroups to compare your IDs with ID of ChildrenGroup searched
        service
            .get(url)
            .then(result => result.data)
            .then(result => {
                result.children_groups.forEach(childrenGroup => {
                    if (childrenGroup.id === req.params.group_id) return resolve(true)
                })
                return resolve(false)
            })
            .catch(e => {
                console.log(url, e.response.data)
                return resolve(false)
            })
    })
}
