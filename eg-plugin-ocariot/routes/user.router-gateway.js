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
      res.status(409).send(err.message);
    });
  });

  app.delete('/api/v1/users/:user_id',(req, res) => {
    console.log('Delete user: ' + req.params.user_id);
    res.json({deleteUrl: req.url});
  });
};
