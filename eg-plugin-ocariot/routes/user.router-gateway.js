var bodyParser = require('body-parser');
var userSrv = require('../services/consumers/user_service.js');
module.exports = app => {
  const middlewares = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
  ];

  app.use('/api/v1/users', middlewares);

  app.post('/api/v1/users', (req, res) => {
    userSrv.createUser(req.body).then(user => {
      res.status(201).send(user);
    }).catch(err => {
      console.log(`Error registering user: ${JSON.stringify(err.message)}`);
      res.status(err.status).send(err.data);
      
    });
  });

  app.delete('/api/v1/users/:user_id', (req, res) => {
    userSrv.deleteUser(req.params.user_id).then(result => {
      res.status(204).send(result);
    }).catch (err => {
      console.log(`Error deleting user: ${JSON.stringify(err.message)}`);
      res.status(err.status).send(err.data); 
    });
  });
};
