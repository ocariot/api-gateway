const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

module.exports = function (gatewayExpressAdminApp) {
  const documentSwagger = YAML.load('node_modules/express-gateway/lib/rest/swagger-doc.yaml');
  gatewayExpressAdminApp.use('/api-docs', swaggerUi.serve, (req,res)=>{
    swaggerUi.setup(documentSwagger)(req,res);
  });
};