const swaggerUi = require('swagger-ui-express')

module.exports = function (app) {
    const options = {
        swaggerUrl: 'https://api.swaggerhub.com/apis/nutes.ocariot/OCARIoT/v1/swagger.json',
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
                  content: url(/images/logo-32x32.png);
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
        customfavIcon: '/images/favicon-16x16.png',
        customSiteTitle: 'API Reference | OCARIoT'
    }

    app.get('/', (req, res, next) => {
        if (req.hostname === (process.env.API_GATEWAY_HOSTNAME || '')) {
            return res.redirect('/v1/reference')
        }
        next()
    })

    app.use('/v1/reference', swaggerUi.serve, (req, res) => {
        swaggerUi.setup(null, options)(req, res)
    })
}
