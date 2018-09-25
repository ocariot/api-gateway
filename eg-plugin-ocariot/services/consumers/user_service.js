const s = {};
const axios = require('axios');
const usersSrv = require('express-gateway/lib/services').user;

s.createUser = function (userData) {

   return axios.request ({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/users',
        data: userData
    }).then (function (response) {
        var apiGatewayUser = {username: response.data._id, isActive: 'true'};
        return usersSrv.insert(apiGatewayUser).then(user => {
            console.log('User created on API gateway: ' + JSON.stringify(response.data));
            return response.data;
        });
    }).catch (function (error) {
        console.log(`Error creating user on API Gateway: ` + error.message);
        return `Error creating user on API Gateway: ` + error.message;
    });

}

module.exports = s;