const s = {};
const axios = require('axios');
const usersSrv = require('express-gateway/lib/services').user;

s.createUser = function (userData) {

    return axios.request({
        method: 'POST',
        url: 'http://accountservice:5000/api/v1/users',
        data: userData
    }).then (response => {
        var apiGatewayUser = { username: response.data._id, isActive: 'true' };
        return usersSrv.insert(apiGatewayUser)
        .then (user => {
            console.log('User created on API gateway: ' + JSON.stringify(response.data));
            return response.data;
        }).catch (error => {
            console.log(`Error creating API Gateway user: ${error.message}`);
            // remove account user
            this.deleteUser(response.data._id);
            // build error message
            throw buildInternalError (error);
        });
    }).catch (error => {
        console.log(`Error creating Account user: ${error.message}`);
        if (error.response) {
           throw buildAccountError (error);
        }
        throw (error);
    });

}

s.deleteUser = function (user_id) {

    return axios.request({
        method: 'DELETE',
        url: 'http://accountservice:5000/api/v1/users/' + user_id
    }).then (response => {
        console.log('User removed from Account Service.');
        return usersSrv.findByUsernameOrId(user_id).then(userSaved => {
            if (userSaved) {
                return usersSrv.remove(userSaved.id).then(result => {
                    console.log('User removed from API Gateway: ' + result);
                }).catch (error => {
                    console.log('Error removing API Gateway user: ' + error.message);
                    // build error message
                   throw buildInternalError (error);
                });
            }
        });
    }).catch (error => {
        console.log(`Error removing Account user: ${error.message}`);
        if (error.response) {
            throw buildAccountError (error);
        }
        throw (error);
    });

}

module.exports = s;

function buildInternalError (_error) {
    let err = new Error();
    err.status = 500;
    err.data = _error.message;
    err.message = _error.message;
    return err;
}

function buildAccountError (_error) {
    let err = new Error();
    err.status = _error.response.data.code;
    err.data = _error.response.data.message;
    err.message = err.data;
    return err;
}

