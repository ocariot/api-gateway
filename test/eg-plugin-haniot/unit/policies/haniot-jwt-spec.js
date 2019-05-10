const policy = require('../../../../eg-plugin-haniot/policies/authentication/haniot-jwt-policy');
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Policy: haniot-jwt-policy', () => {

    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type');
            assert.equal(policy.name, 'haniot-jwt-policy', 'Policy name other than expected');
        });
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type');
        });
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type');
        });
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/haniot-jwt-policy.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid', () => {
            assert.typeOf(policy.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(policy.schema.type, 'object', '"schema.type" different than expected');
        });
        it('Field "schema.properties" is type valid', () => {
            assert.typeOf(policy.schema.properties, 'object', '"schema.properties" is not object type');
        });
        it('Field "schema.properties.secretOrPublicKey" is type valid', () => {
            assert.typeOf(policy.schema.properties.secretOrPublicKey, 'object', '"schema.properties.secretOrPublicKey" is not object type');
            assert.equal(policy.schema.properties.secretOrPublicKey.type, 'string', '"schema.properties.secretOrPublicKey" different than expected');
        });
        it('Field "schema.properties.secretOrPublicKeyFile" is type valid', () => {
            assert.typeOf(policy.schema.properties.secretOrPublicKeyFile, 'object', '"schema.properties.secretOrPublicKeyFile" is not object type');
            assert.equal(policy.schema.properties.secretOrPublicKeyFile.type, 'string', '"schema.properties.secretOrPublicKeyFile" different than expected');
        });
        it('Field "schema.properties.issuer" is type valid', () => {
            assert.typeOf(policy.schema.properties.issuer, 'object', '"schema.properties.issuer" is not object type');
            assert.equal(policy.schema.properties.issuer.type, 'string', '"schema.properties.issuer" different than expected');
        });
    });

    describe('Functionality', () => {
        it('should return a function(req,res,next)', function () {
            const services = {
                auth: {
                    validateConsumer() { }
                }
            }
            const actionParams = {
                secretOrPublicKey: 'mysecret',
                issuer: 'haniot'
            };
            const testContext = {
                services: services
            }
            assert.typeOf(policy.policy(actionParams, testContext), 'function', '"policy" does not return a function');
            assert.equal(policy.policy(actionParams, testContext).length, 3, 'Function different than expected');
        });

        context('should validate token', () => {
            it('when the token and consumer is valid, should call next()', function (done) {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Yjk5NmE5NTZjZGRlOTAwMzk5MjJkZGUiLCJpc3MiOiJoYW5pb3QiLCJpYXQiOjE1NDI2NTIyMTExMDcsInNjb3BlIjoidXNlcnM6cmVhZEFsbDIifQ.jO75z9t35RJanZ1-Eh7Wk0nlOFd6XuAqcz4z2KmVXXU'
                    }
                };

                const res = {
                    end: sinon.spy()
                };

                const next = sinon.spy();

                const fakeConsumer = {
                    sub: '5b996a956cdde90039922dde',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer() { }
                    }
                }

                const promisevalidateConsumer = Promise.resolve(fakeConsumer);

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer');
                validateConsumer.withArgs('5b996a956cdde90039922dde').returns(promisevalidateConsumer);

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy;
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next();
                                }
                            }
                            this.strategy._verify({
                                sub: "5b996a956cdde90039922dde",
                                iss: "haniot",
                                iat: 1542652211107,
                                scope: "users:readAll2"
                            }, done);
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: 'mysecret',
                    issuer: 'haniot'
                };

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }

                // Executando a politica
                const mid = policy.policy(actionParams, testContext);

                mid(req, res, next);

                return setTimeout(() => {
                    sinon.assert.calledWith(validateConsumer, '5b996a956cdde90039922dde');
                    sinon.assert.called(next);
                    done();
                }, 0);

            });

            it('when the token is valid but the consumer was not found or is inactive, should not call next ()', function (done) {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Yjk5NmE5NTZjZGRlOTAwMzk5MjJkZGUiLCJpc3MiOiJoYW5pb3QiLCJpYXQiOjE1NDI2NTIyMTExMDcsInNjb3BlIjoidXNlcnM6cmVhZEFsbDIifQ.jO75z9t35RJanZ1-Eh7Wk0nlOFd6XuAqcz4z2KmVXXU'
                    }
                };

                const res = {
                    end: sinon.spy()
                };

                const next = sinon.spy();

                const fakeConsumer = {
                    sub: '5b996a956cdde90039922dde',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer() { }
                    }
                }

                const promisevalidateConsumer = Promise.resolve(false);

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer');
                validateConsumer.withArgs('5b996a956cdde90039922dde').returns(promisevalidateConsumer);

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy;
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next();
                                }
                            }
                            this.strategy._verify({
                                sub: "5b996a956cdde90039922dde",
                                iss: "haniot",
                                iat: 1542652211107,
                                scope: "users:readAll2"
                            }, done);
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: 'mysecret',
                    issuer: 'haniot'
                };

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }

                // Executando a politica
                const mid = policy.policy(actionParams, testContext);

                mid(req, res, next);

                return setTimeout(() => {
                    sinon.assert.calledWith(validateConsumer, '5b996a956cdde90039922dde');
                    sinon.assert.notCalled(next);
                    done();
                }, 0);

            });

            it('when the token is not valid, should return Unauthorized with statusCode 401', function (done) {

                const req = {
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Yjk5NmE5NTZjZGRlOTAwMzk5MjJkZGUiLCJpc3MiOiJoYW5pb3QiLCJpYXQiOjE1NDI2NTIyMTExMDcsInNjb3BlIjoidXNlcnM6cmVhZEFsbDIifQ.jO75z9t35RJanZ1-Eh7Wk0nlOFd6XuAqcz4z2KmVXXU'
                    }
                };

                const res = {
                    statusCode: 0,
                    end: sinon.spy()
                };

                const next = sinon.spy();

                const fakeConsumer = {
                    sub: '5b996a956cdde90039922dde',
                    username: 'fakeConsumer'
                }

                const services = {
                    auth: {
                        validateConsumer() { }
                    }
                }

                const promisevalidateConsumer = Promise.resolve(fakeConsumer);

                const validateConsumer = sinon.stub(services.auth, 'validateConsumer');
                validateConsumer.withArgs('5b996a956cdde90039922dde').returns(promisevalidateConsumer);

                const passport = {
                    strategy: null,
                    use(strategy) {
                        this.strategy = strategy;
                    },
                    authenticate(name, opts) {

                        return (req, res, next) => {
                            const done = (opts, user, msg) => {
                                if (user) {
                                    next();
                                }
                            }
                            res.statusCode = 401;
                            res.end('Unauthorized');
                        }
                    }
                }

                const actionParams = {
                    secretOrPublicKey: 'mysecret',
                    issuer: 'haniot'
                };

                const testContext = {
                    isTest: true,
                    services: services,
                    passport: passport
                }

                // Executando a politica
                const mid = policy.policy(actionParams, testContext);

                mid(req, res, next);

                return setTimeout(() => {
                    sinon.assert.notCalled(next);
                    sinon.assert.calledWith(res.end, 'Unauthorized');
                    assert.equal(res.statusCode, 401);
                    done();
                },0);
            });

        });

    });
});