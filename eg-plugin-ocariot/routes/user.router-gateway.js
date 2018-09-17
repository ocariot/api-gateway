var bodyParser = require('body-parser');

module.exports = app => {
  const middlewares = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
  ];

  app.use('/api/v1/users', middlewares);

  app.post('/api/v1/users',(req, res) => {
    console.log('POST users: ' + JSON.stringify(req.body));
    res.json({postUrl: req.url});
  });

  app.delete('/api/v1/users/:user_id',(req, res) => {
    console.log('Delete user: ' + req.params.user_id);
    res.json({deleteUrl: req.url});
  });
};
