/**
* Delete user gateway policy
*/

let userServiceGateway = require('express-gateway/lib/services').user;
let axios = require('axios');
const HttpStatus = require('http-status');

module.exports = function (actionParams, userServiceGwTest, axiosTest) {
  /**Test Context
  * userServiceGwTest and axiosTest are mockados services
  */
  if (userServiceGwTest && axiosTest) {
    userServiceGateway = userServiceGwTest;
    axios = axiosTest;
  }

  return (req, res, next) => {
    const index_users = req.url.indexOf('users');
    const id = req.url.substring(index_users).split('/')[1];

    return deleteUserAccount(actionParams.urldeleteservice, id)
      .then(result => {
        /**
         * User excluded from account and gateway service
         */
        return res.status(HttpStatus.NO_CONTENT).send();
      })
      .catch(err => {
        if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "code": 500, "message": "INTERNAL SERVER ERROR", "description": "An internal server error has occurred." });
        } else {
          return res.status(err.response.status).send(err.response.data);
        }
      });
  }
};

/**
 * Function used to exclude the user from the account service and shortly after deleting it from the gateway
 * @param {*} urlAccountService account service url
 * @param {*} user_id id of the user to be excluded
 */
const deleteUserAccount = (urldeleteservice, user_id) => {
  /**
   * Requires the user to be excluded from the account service
   */
  return axios.request({
    method: 'DELETE',
    url: urldeleteservice + '/' + user_id
  }).then(response => {
    /**
     * Search by user at gateway
     */
    return userServiceGateway.findByUsernameOrId(user_id)
      .then(userSaved => {
        if (userSaved) {
          /**
           * Deletes gateway user
           */
          /**
         * Creating routine to keep trying to delete user every second
         */
          const userDeleteGwInterval = setInterval(() => {            
            return userServiceGateway.remove(userSaved.id)
              .then(result => {
                clearInterval(userDeleteGwInterval);
                return result;
              })
              .catch(error => {
                console.error(new Date().toUTCString() + ' | haniot-delete-user | Error removing API Gateway user: ' + error.message);
              });
          }, 5000);
          return userDeleteGwInterval;
        } else {
          /**
           * Case where the excluded user was not registered at the gateway
           * The scenario is when the deleted user had not yet logged into the platform
           */
          return true;
        }
      })
      .catch(error => {
        console.error(new Date().toUTCString() + ' | haniot-delete-user | User not found on gateway:' + error.message);
        return Promise.reject(error);
      });

  }).catch(error => {
    console.error(new Date().toUTCString() + ' | haniot-delete-user | Error removing Account user:' + error.message);
    return Promise.reject(error);
  });
}



