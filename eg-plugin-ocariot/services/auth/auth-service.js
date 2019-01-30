/**
 * Service created to request user authentication in the account service
 */

const s = {};
const axios = require('axios');

s.auth = function (urlservice, credentials) {
    return axios.
    request({
        method: 'POST',
        url: urlservice,
        // "Authorization":"Basic QWRhbGNpbm86SnVuaW9y",
        data: credentials
    });
}

module.exports = s;
