const service = require('./../../services/http-client')
const errorHandler = require('./../../utils/error.handler')
const UserType = require('./../../utils/constants').UserType

module.exports = function (actionParams) {
    return (req, res, next) => {
        /**
         * ####### CHILDREN.PHYSICALACTIVITIES #######
         */
        // POST /v1/children/{child_id}/physicalactivities ['physicalactivities:create']
        if (/^((\/v1\/children\/)[^\W_]{1,}\/physicalactivities\/{0,1})$/.test(req.originalUrl) && req.method === 'POST') {
            postResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/physicalactivities/{physicalactivity_id} ['physicalactivities:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/physicalactivities\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // DELETE /v1/children/{child_id}/physicalactivities/{physicalactivity_id} ['physicalactivities:delete']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/physicalactivities\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'DELETE') {
            deleteResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/physicalactivities ['physicalactivities:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/physicalactivities)/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### CHILDREN.SLEEP #######
         */
        // POST /v1/children/{child_id}/sleep ['sleep:create']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/sleep\/{0,1})$/.test(req.originalUrl) && req.method === 'POST') {
            postResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/sleep/{sleep_id} ['sleep:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/sleep\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl)
            && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // DELETE /v1/children/{child_id}/sleep/{sleep_id} ['sleep:delete']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/sleep\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl)
            && req.method === 'DELETE') {
            deleteResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/sleep ['sleep:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/sleep)/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### CHILDREN.LOGS #######
         */
        // POST /v1/children/{child_id}/logs/{resource} ['physicalactivities:create']
        else if (/^((\/v1\/children\/)[^\W_]{1,}(\/logs\/)(steps|calories|active_minutes|lightly_active_minutes|sedentary_minutes)\/{0,1})$/.test(req.originalUrl)
            && req.method === 'POST') {
            postResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/logs/date/{date_start}/{date_end} ['physicalactivities:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/logs\/date\/\d{4}-(0[1-9]|1[0-2])-\d\d\/\d{4}-(0[1-9]|1[0-2])-\d\d\/{0,1})$/.test(req.originalUrl)
            && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/logs/{resource}/date/{date_start}/{date_end} ['physicalactivities:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}(\/logs\/)(steps|calories|active_minutes|lightly_active_minutes|sedentary_minutes)(\/date\/\d{4}-(0[1-9]|1[0-2])-\d\d\/\d{4}-(0[1-9]|1[0-2])-\d\d)\/{0,1})$/.test(req.originalUrl)
            && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### CHILDREN.WEIGHTS #######
         */
        // POST /v1/children/{child_id}/weights ['measurements:create']
        else if (/^(\/v1\/children\/)[^\W_]{1,}\/weights\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
            postResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/weights/{weight_id} ['measurements:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/weights\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // DELETE /v1/children/{child_id}/weights/{weight_id} ['measurements:delete']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/weights\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'DELETE') {
            deleteResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/weights ['measurements:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/weights)/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### CHILDREN.BODYFATS #######
         */
        // POST /v1/children/{child_id}/bodyfats ['measurements:create']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/bodyfats\/{0,1})$/.test(req.originalUrl) && req.method === 'POST') {
            postResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/bodyfats/{bodyfat_id} ['measurements:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/bodyfats\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // DELETE /v1/children/{child_id}/bodyfats/{bodyfat_id} ['measurements:delete']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/bodyfats\/[^\W_]{1,}\/{0,1})$/.test(req.originalUrl) && req.method === 'DELETE') {
            deleteResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // GET /v1/children/{child_id}/bodyfats ['measurements:read']
        else if (/^((\/v1\/children\/)[^\W_]{1,}\/bodyfats)/.test(req.originalUrl) && req.method === 'GET') {
            getResourceByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        /**
         * ####### ENVIRONMENTS #######
         */
        // POST /v1/environments ['environment:create']
        else if (/^(\/v1\/environments\/{0,1})$/.test(req.originalUrl) && req.method === 'POST') {
            postEnvironmentRules(actionParams.accountServiceUrlBase, req, res, next)
        } else {
            next()
        }
    }
}

// ####### RULES FUNCTIONS #######
/**
 * Checks if the user has permission to create {resource} data.
 *
 * RULES:
 *  1. Application users can register {resource} for any child as long as the Child exists.
 *  2. A Child can register {resource} only for herself.
 *  3. An Educator can register a {resource} for any Child who exists and belongs to one of their groups.
 *  4. A Family user can register a {resource} for any Child who exists and is associated with it.
 *
 *  NOTE:
 *
 *  {resource} - Can be Physical Activity, Sleep, Weight, or Body Fat
 */
async function postResourceByChildIdRules(urlBase, req, res, next) {
    if (await searchChildById(urlBase, req)) {
        if (req.user.sub_type === UserType.APPLICATION) next()
        else if (req.user.sub_type === UserType.CHILD && req.params.child_id === req.user.sub) next()
        else if (req.user.sub_type === UserType.EDUCATOR && await isAssociatedChild(urlBase, req)) next()
        else if (req.user.sub_type === UserType.FAMILY && await isAssociatedChild(urlBase, req)) next()
        else errorHandler(403, res, req)
    } else errorHandler(400, res, req)
}

/**
 * Checks if the user has permission to list {resource} data of a Child.
 *
 * RULES:
 *  1. Admin and Application users can view {resource} of any child.
 *  2. A Child can view his {resource}.
 *  3. An Educator as well as a Health Professional can list {resource} of any Child
 *     as long as the Child belongs to one of their groups.
 *  4. A Family user can list all {resource} of any Child associated with him.
 *
 *  NOTE:
 *
 *  {resource} - Can be Physical Activity, Sleep, Weight, or Body Fat
 */
async function getResourceByChildIdRules(urlBase, req, res, next) {
    if (await searchChildById(urlBase, req)) {
        if (req.user.sub_type === UserType.ADMIN || req.user.sub_type === UserType.APPLICATION) next()
        else if (req.user.sub_type === UserType.CHILD && req.params.child_id === req.user.sub) next()
        else if ((req.user.sub_type === UserType.EDUCATOR || req.user.sub_type === UserType.HEALTH_PROFESSIONAL)
            && await isAssociatedChild(urlBase, req)) next()
        else if (req.user.sub_type === UserType.FAMILY && await isAssociatedChild(urlBase, req)) next()
        else errorHandler(403, res, req)
    } else errorHandler(400, res, req)
}

/**
 * Checks if the user has permission to delete a {resource} data of a Child.
 *
 * RULES:
 *  1. Application users can delete any {resource} of any child.
 *  2. An Educator can delete any {resource} of any Child as long as the Child belongs to one of their groups.
 *  3. A Family user can delete any {resource} of any Child associated with him.
 *
 *  NOTE:
 *
 *  {resource} - Can be Physical Activity, Sleep, Weight, or Body Fat
 */
async function deleteResourceByChildIdRules(urlBase, req, res, next) {
    if (await searchChildById(urlBase, req)) {
        if (req.user.sub_type === UserType.APPLICATION) next()
        else if (req.user.sub_type === UserType.EDUCATOR && await isAssociatedChild(urlBase, req)) next()
        else if (req.user.sub_type === UserType.FAMILY && await isAssociatedChild(urlBase, req)) next()
        else errorHandler(403, res, req)
    } else errorHandler(400, res, req)
}

/**
 * Checks if the user has permission to create Environment data.
 *
 * RULES:
 *  1. Application users can register an Environment and associate it with an Institution
 *     (institution_id present in the request body) as long as that Institution exists.
 */
async function postEnvironmentRules(urlBase, req, res, next) {
    if (await searchInstitutionById(urlBase, req)) next()
    else errorHandler(400, res, req)
}

// ####### AUXILIAR FUNCTIONS #######
function searchChildById(urlBase, req) {
    return new Promise((resolve, reject) => {
        service
            .get(urlBase.concat(`/v1/children`))
            .then(result => result.data)
            .then(result => {
                result.forEach(child => {
                    if (child.id === req.params.child_id) return resolve(true)
                })
                return resolve(false)
            })
            .catch(e => {
                console.log(e)
                return resolve(false)
            })
    })
}

function searchInstitutionById(urlBase, req) {
    return new Promise((resolve, reject) => {
        service
            .get(urlBase.concat(`/v1/institutions`))
            .then(result => result.data)
            .then(result => {
                result.forEach(institution => {
                    if (institution.id === req.body.institution_id) return resolve(true)
                })
                return resolve(false)
            })
            .catch(e => {
                console.log(e)
                return resolve(false)
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
                        if (child.id === req.params.child_id) return resolve(true)
                    })
                    return resolve(false)
                })
                .catch(e => {
                    console.log(e.response.data)
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
                            if (child.id === req.params.child_id) return resolve(true)
                        })
                    })
                    return resolve(false)
                })
                .catch(e => {
                    console.log(e.response.data)
                    return resolve(false)
                })
        }
    })
}
