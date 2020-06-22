# OCARIoT API Gateway

[![License][license-image]][license-url] [![Node][node-image]][node-url] [![Dependencies][dependencies-image]][dependencies-url] [![DependenciesDev][dependencies-dev-image]][dependencies-dev-url] [![Vulnerabilities][known-vulnerabilities-image]][known-vulnerabilities-url] [![Commit][last-commit-image]][last-commit-url] [![Releases][releases-image]][releases-url] [![Contributors][contributors-image]][contributors-url]  [![Swagger][swagger-image]][swagger-url] 

OCARIoT Platform APIs Manager. It is responsible for routing requests or blocking access to resources provided by the internal microservices that make up the OCARIoT platform. Express Gateway is used.

## Prerequisites
- [Node 8.0.0+](https://nodejs.org/en/download/)
- [Redis](https://redis.io/download/)

## Set the environment variables
Application settings are defined by environment variables. To define the settings, make a copy of the `.env.example file`, naming for `.env`. After that, open and edit the settings as needed. The following environments variables are available:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `NODE_ENV` | Defines the environment in which the application runs. You can set: `test` _(in this environment, the database defined in `MONGODB_URI_TEST` is used and the logs are disabled for better visualization of the test output)_, `development` _(in this environment, all log levels are enabled)_ and `production` _(in this environment, only the warning and error logs are enabled)_. | `development` |
| `PORT_HTTP` | Port used by the API GATEWAY service to listen for HTTP request. | `80` |
| `PORT_HTTPS` | Port used by the API GATEWAY service to listen for HTTPS request. | `443` |
| `API_GATEWAY_HOSTNAME` | API Gateway Hostname. | `localhost` |
| `API_IOT_HOSTNAME` | API IoT Hostname. | `iot.localhost` |
| `RABBIT_MGT_HOSTNAME` | RabbitMQ Management hostname. | `rabbit.localhost` |
| `ISSUER` | The issuer used to validate the JWT token sent for requests. The value must be provided by the Account service that generates the token. | `ocariot` |
| `SSL_KEY_PATH` | SSL/TLS certificate private key. | `.certs/server.key` |
| `SSL_CERT_PATH` | SSL/TLS certificate. | `.certs/server.crt` |
| `SSL_IOT_KEY_PATH` | Private key for IoT service SSL certificate. | `.certs/iot_server.key` |
| `SSL_IOT_CERT_PATH` | Certificate SSL for IoT service. | `.certs/iot_server.crt` |
| `SSL_IOT_CA_PATH` | CA SSL for IoT service. | `.certs/ca.crt` |
| `JWT_PUBLIC_KEY_PATH` | Public key used to generate and validate JSON Web Token (JWT). The value must be provided by the Account service that generates the token. | `.certs/jwt.key.pub` |
| `ACCOUNT_SERVICE` | URI used to connect to the Account service. | `https://localhost:3001` |
| `IOT_TRACKING_SERVICE` | URI used to connect to the IoT Tracking service. | `https://localhost:4001` |
| `DS_AGENT_SERVICE` | URI used to connect to the Data Sync Agent service. | `https://localhost:5001` |
| `QUESTIONNAIRE_SERVICE` | URI used to connect to the Questinnaire service. | `https://localhost:6001` |
| `GAMIFICATION_SERVICE` | URI used to connect to the Gamification service. | `https://localhost:7001` |
| `MISSION_SERVICE` | URI used to connect to the Mission service. | `https://localhost:8001` |
| `FOOD_SERVICE` | URI used to connect to the Food service. | `https://localhost:9001` |
| `NOTIFICATION_SERVICE` | URI used to connect to the Notification service. | `https://localhost:10001` |
| `RABBIT_MGT_SERVICE` | URI used to connect to the RabbitMQ Management. | `https://localhost:15672` |
| `EMULATE_REDIS` | Signals whether the redis bank will be emulated or not. | `true` |
| `PORT_REDIS` | Redis instance port. | `6379` |
| `HOST_REDIS` | Redis instance hostname. | `localhost` |



## Generate Certificates
For development and testing environments the easiest and fastest way is to generate your own self-signed certificates. These certificates can be used to encrypt data as well as certificates signed by a CA, but users will receive a warning that the certificate is not trusted for their computer or browser. Therefore, self-signed certificates should only be used in non-production environments, that is, development and testing environments. To do this, run the `create-self-signed-certs.sh` script in the root of the repository.
```sh
$ chmod +x ./create-self-signed-certs.sh
$ ./create-self-signed-certs.sh
```
The following files will be created: `ca.crt`, `server.crt` and `server.key`.

Remember that JWT public key `(JWT_PUBLIC_KEY_PATH)` must be the same as used by Account Service.

In production environments its highly recommended to always use valid certificates and provided by a certificate authority (CA). A good option is [Let's Encrypt](https://letsencrypt.org)  which is a CA that provides  free certificates. The service is provided by the Internet Security Research Group (ISRG). The process to obtain the certificate is extremely simple, as it is only required to provide a valid domain and prove control over it. With Let's Encrypt, you do this by using [software](https://certbot.eff.org/) that uses the ACME protocol, which typically runs on your host. If you prefer, you can use the service provided by the [SSL For Free](https://www.sslforfree.com/)  website and follow the walkthrough. The service is free because the certificates are provided by Let's Encrypt, and it makes the process of obtaining the certificates less painful.

## Installation and Execution
#### 1. Install dependencies
```sh  
$ npm install    
```
 
#### 2. Run Server
```sh  
$ npm start
```

Navigate to `https://localhost:{PORT_HTTPS}`


[//]: # (These are reference links used in the body of this note.)
[license-image]: https://img.shields.io/badge/license-Apache%202-blue.svg
[license-url]: https://github.com/ocariot/api-gateway/blob/master/LICENSE
[node-image]: https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg
[node-url]: https://nodejs.org
[known-vulnerabilities-image]: https://snyk.io/test/github/ocariot/api-gateway/badge.svg
[known-vulnerabilities-url]: https://snyk.io/test/github/ocariot/api-gateway
[dependencies-image]: https://david-dm.org/ocariot/api-gateway.svg
[dependencies-url]: https://david-dm.org/ocariot/api-gateway
[dependencies-dev-image]: https://david-dm.org/ocariot/api-gateway/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/ocariot/api-gateway?type=dev
[swagger-image]: https://img.shields.io/badge/swagger-v1-brightgreen.svg
[swagger-url]: https://app.swaggerhub.com/apis/nutes.ocariot/OCARIoT/v1
[last-commit-image]: https://img.shields.io/github/last-commit/ocariot/api-gateway.svg
[last-commit-url]: https://github.com/ocariot/api-gateway/commits
[releases-image]: https://img.shields.io/github/release-date/ocariot/api-gateway.svg
[releases-url]: https://github.com/ocariot/api-gateway/releases
[contributors-image]: https://img.shields.io/github/contributors/ocariot/api-gateway.svg
[contributors-url]: https://github.com/ocariot/api-gateway/graphs/contributors
