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

s.deleteUser = function (user_id) {

    return axios.request ({
        method:'DELETE',
        url: 'http://localhost:5000/api/v1/users/' + user_id
    }).then(function (response) {
        console.log('User removed from Account Service.');
        return usersSrv.remove(user_id).then(result => {
            console.log('User removed from API Gateway: ' + result);
        });
    }).catch (function (error) {
        console.log('Error removing user on Account Service: ' + error.message);
        return 'Error removing user on Account Service: ' + error.message;
    });

}

module.exports = s;