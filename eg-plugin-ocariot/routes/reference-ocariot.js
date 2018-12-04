const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

module.exports = function (expressGatewayApp) {    
  const documentSwagger = YAML.load('./assets/swagger/nutes.ocariot-api-ocariot-v1.yaml');
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: 'http://nutes.uepb.edu.br/wp-content/uploads/2014/01/icon.fw_.png',
    customSiteTitle: `API Reference | OCARIoT`
  }  
  expressGatewayApp.get('/', (req, res) => {
    res.redirect('/v1/reference');
  });
  expressGatewayApp.use('/v1/reference', swaggerUi.serve, (req, res) => {
    swaggerUi.setup(documentSwagger, options)(req, res);
  });  
};