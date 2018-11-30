const s = {};
const axios = require('axios');

s.auth = function (urlservice, credentials) {
    return axios.
    request({
        method: 'POST',
        url: urlservice,
        headers: {"Authorization":credentials}, // "Authorization":"Basic QWRhbGNpbm86SnVuaW9y",
        data: credentials

    });

}

module.exports = s;
