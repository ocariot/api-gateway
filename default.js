
module.exports = {
    NODE_ENV:"development", // execution environment,
    
    API_GATEWAY_SERVICE:"https://localhost:443", //URI used to connect to the API Gateway public API
    PORT_HTTP:8080, // HTTP port used to expose API Gateway public API
    PORT_HTTPS:443, // HTTPS port used to expose API Gateway public API
    
    ACTIVITY_SERVICE:"http://localhost:3000", //URI used to connect to the activity tracking service
    MISSION_SERVICE:"http://localhost:4000", // URI used to connect to the mission service
    ACCOUNT_SERVICE:"http://localhost:5000", // URI used to connect to the account service
    QUESTIONNAIRE_SERVICE:"http://localhost:6000", // URI used to connect to the questinnaire service
    GAMIFICATION_SERVICE:"http://localhost:7000", // URI used to connect to the gamification service

    HOST_REDIS:"localhost", // If using REDIS database (EMULATE_REDIS=false), it defines the database
    PORT_REDIS:6379, // If using REDIS database (EMULATE_REDIS=false), it defines the database
    EMULATE_REDIS:true, // emulated database, all the data is be lost if the gateway is restarted
    

    ISSUER:"ocariot", // issuer used to validate the JWT token sent into the requests
    CERT_PATH:"./.certs", // Path to store  certificates (HTTPS certificates and JWT public key, etc.) 
    JWT_PUBLIC_KEY_PATH:"./.certs/jwt.pem", // JWT public key used for token verification 
    SSL_PRIVATE_KEY_PATH:"./.certs/tls.key", // SSL certificate private key
    SSL_CERT_PATH:"./.certs/tls.pem", // SSL certificate (public key0)
    HTTPS_DOMAIN: "ocariot.nutes.uepb.edu.br", // Domain used to generate HTTPS certificates in production environment
    HTTPS_MAIL: "ocariot.nutes@nutes.uepb.edu.br" // Email used to generate HTTPS certificates in production environment
}