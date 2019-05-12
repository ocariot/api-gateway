module.exports = {
    NODE_ENV: 'development', // execution environment,

    PORT_HTTP: 8080, // HTTP port used to expose API Gateway public API
    PORT_HTTPS: 443, // HTTPS port used to expose API Gateway public API

    API_GATEWAY_SERVICE: 'https://localhost:443',   // URI used to connect to the API Gateway public API
    ACCOUNT_SERVICE: 'https://localhost:3001',       // URI used to connect to the account service
    ACTIVITY_SERVICE: 'https://localhost:4001',      // URI used to connect to the activity tracking service
    MISSION_SERVICE: 'https://localhost:5001',       // URI used to connect to the mission service
    QUESTIONNAIRE_SERVICE: 'https://localhost:6001', // URI used to connect to the questionnaire service
    GAMIFICATION_SERVICE: 'https://localhost:7001',  // URI used to connect to the gamification service

    HOST_REDIS: 'localhost', // If using REDIS database (EMULATE_REDIS=false), it defines the database
    PORT_REDIS: 6379, // If using REDIS database (EMULATE_REDIS=false), it defines the database
    EMULATE_REDIS: true, // emulated database, all the data is be lost if the gateway is restarted

    ISSUER: 'ocariot', // issuer used to validate the JWT token sent into the requests
    CERT_PATH: './.certs', // Path to store  certificates (HTTPS certificates and JWT public key, etc.)
    JWT_PUBLIC_KEY_PATH: './.certs/jwt.key.pub', // JWT public key used for token verification
    SSL_KEY_PATH: './.certs/tls.key', // SSL certificate private key
    SSL_CERT_PATH: './.certs/tls.pem', // SSL certificate (public key0)
    HTTPS_DOMAIN: ['ocariot.nutes.uepb.edu.br', 'www.ocariot.nutes.uepb.edu.br'], // Domain used to generate HTTPS certificates in production environment
    HTTPS_MAIL: 'ocariot.nutes@nutes.uepb.edu.br' // Email used to generate HTTPS certificates in production environment
}
