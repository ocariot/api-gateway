const swaggerUi = require('swagger-ui-express');

module.exports = function (expressGatewayApp) {
  const options = {
    swaggerUrl: 'https://api.swaggerhub.com/apis/nutes.ocariot/OCARIoT/1.0.0/swagger.json',
    customCss: `.swagger-ui .topbar { 
                    background-color: #0097a7;  
                    padding: 14px 0; 
                }
                .swagger-ui .topbar .topbar-wrapper a span { 
                  display: none; 
                }
                .swagger-ui .topbar .topbar-wrapper a { 
                    display: none;
                }
                .swagger-ui .topbar .topbar-wrapper:before { 
                  content: url(http://www.ocariot.com.br/wp-content/uploads/2018/08/cropped-512-32x32.png);
                  margin-left: -5px;
              }
                .swagger-ui .topbar .topbar-wrapper:after {  
                    content: 'OCARIoT'; 
                    margin: 0;
                    padding: 0 10px;
                    font-size: 1.7em;
                    font-weight: 700;
                    color: #fff; 
                }`,
    customfavIcon: 'http://www.ocariot.com.br/wp-content/uploads/2018/08/cropped-512-32x32.png',
    customSiteTitle: `API Reference | OCARIoT`
  }
  expressGatewayApp.get('/', (req, res) => {
    res.redirect('/v1/reference');
  });

  expressGatewayApp.use('/v1/reference', swaggerUi.serve, (req, res) => {
    swaggerUi.setup(null, options)(req, res);
  });
};