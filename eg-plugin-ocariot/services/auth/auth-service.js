/**
 * Service created to request user authentication in the account service
 */

const rp = require('request-promise');

const s = {};

s.auth = function (urlservice, credentials) {
        var options = {
            method: 'POST',
            uri: urlservice,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            body: credentials, 
            resolveWithFullResponse: true, // Get the full response instead of just the body 
            rejectUnauthorized: false, // Accept HTTPS self-signed certificates
            json: true // Automatically parses the JSON string in the response
        };

        return rp(options);
}

module.exports = s;
