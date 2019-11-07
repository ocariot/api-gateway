const service = require('./../../services/http-client')
const errorHandler = require('./../../utils/error.handler')
const UserType = require('./../../utils/constants').UserType

module.exports = function (actionParams) {
    return (req, res, next) => {
        /**
         * ####### CHILDREN.PHYSICALACTIVITIES #######
         */
        // POST /v1/children/{child_id}/physicalactivities ['physicalactivities:create']
        if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/physicalactivities\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
            postActivityByChildIdRules(actionParams.accountServiceUrlBase, req, res, next)
        }

        // // GET /v1/children/{child_id}/physicalactivities/{physicalactivity_id} ['physicalactivities:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/physicalactivities\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // // DELETE /v1/children/{child_id}/physicalactivities/{physicalactivity_id} ['physicalactivities:delete']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/physicalactivities\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/physicalactivities ['physicalactivities:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/physicalactivities/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }

        /**
         * ####### CHILDREN.SLEEP #######
         */
        // // POST /v1/children/{child_id}/sleep ['sleep:create']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/sleep\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/sleep/{sleep_id} ['sleep:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/sleep\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // // DELETE /v1/children/{child_id}/sleep/{sleep_id} ['sleep:delete']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/sleep\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/sleep ['sleep:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/sleep/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // /**
        //  * ####### CHILDREN.LOGS #######
        //  */
        // // POST /v1/children/{child_id}/logs/{resource} ['physicalactivities:create']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/logs\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/logs/date/{date_start}/{date_end} ['physicalactivities:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/logs\/date\/\d{4}-(0[1-9]|1[0-2])-\d\d\/\d{4}-(0[1-9]|1[0-2])-\d\d\/{0,1}$/.test(req.originalUrl)
        //     && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/logs/{resource}/date/{date_start}/{date_end} ['physicalactivities:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/logs\/date\/\d{4}-(0[1-9]|1[0-2])-\d\d\/\d{4}-(0[1-9]|1[0-2])-\d\d\/{0,1}$/.test(req.originalUrl)
        //     && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // /**
        //  * ####### CHILDREN.WEIGHTS #######
        //  */
        // // POST /v1/children/{child_id}/weights ['measurements:create']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/weights\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/weights/{weight_id} ['measurements:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/weights\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // // DELETE /v1/children/{child_id}/weights/{weight_id} ['measurements:delete']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/weights\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/weights ['measurements:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/weights/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // /**
        //  * ####### CHILDREN.BODYFATS #######
        //  */
        // // POST /v1/children/{child_id}/bodyfats ['measurements:create']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/bodyfats\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/bodyfats/{bodyfat_id} ['measurements:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/bodyfats\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // // DELETE /v1/children/{child_id}/bodyfats/{bodyfat_id} ['measurements:delete']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/bodyfats\/[a-fA-F0-9]{24}\/{0,1}$/.test(req.originalUrl) && req.method === 'DELETE') {
        //     rules(req, res, next)
        // }
        //
        // // GET /v1/children/{child_id}/bodyfats ['measurements:read']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/bodyfats/.test(req.originalUrl) && req.method === 'GET') {
        //     rules(req, res, next)
        // }
        //
        // /**
        //  * ####### ENVIRONMENTS #######
        //  */
        // // POST /v1/environments ['environment:create']
        // else if (/^(\/v1\/children\/)[a-fA-F0-9]{24}\/bodyfats\/{0,1}$/.test(req.originalUrl) && req.method === 'POST') {
        //     rules(req, res, next)
        // }

        else {
            next()
        }
    }
}

// ####### CHILDREN.PHYSICALACTIVITIES #######
/**
 * Checks if the user has permission to create Activity data.
 *
 * RULES:
 *  1. Application users can register physical activity for any child as long as the Child exists.
 *  2. A Child can register physical activity only for herself.
 *  3. An Educator can register a physical activity for any Child who exists and belongs to one of their groups.
 *  4. A Family user can register a physical activity for any Child who exists and is associated with it.
 */
function postActivityByChildIdRules(urlBase, req, res, next) {
    if (searchChildById(urlBase, req.params.child_id)) {
        if (req.user.sub_type === UserType.APPLICATION) {
            next()
            return
        }
    } else errorHandler(400, res, req)
}

function searchChildById(urlBase, req) {
    service
        .get(urlBase.concat(`/v1/children`))
        .then(result => result.data)
        .then(result => {
            result.forEach(child => {
                if (child.id === req.params.child_id) return true
            })
            return false
        })
        .catch(e => {
            console.log(e.response.data)
            return false
        })
}
