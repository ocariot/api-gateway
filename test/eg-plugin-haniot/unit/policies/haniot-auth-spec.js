const policy = require('../../../../eg-plugin-haniot/policies/auth/haniot-auth-policy');
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Policy: haniot-auth-policy', () => {
    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type');
            assert.equal(policy.name, 'haniot-auth-policy', 'Policy name other than expected');
        });
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type');
        });
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type');
        });
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/haniot-auth-policy.json', '"schema.$id" different than expected');
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
        it('Field "schema.properties.urlauthservice" is type valid', () => {
            assert.typeOf(policy.schema.properties.urlauthservice, 'object', '"schema.properties.urlauthservice" is not object type');
            assert.equal(policy.schema.properties.urlauthservice.type, 'string', '"schema.properties.urlauthservice" different than expected');
        });
    });

    describe('Functionality', () => {
        it('should return a function(req,res,next)', () => {
            const actionParams = { secretOrPublicKey: 'mysecret', issuer: 'haniot', urlauthservice: 'http://localhost:5000' };
            assert.typeOf(policy.policy(actionParams), 'function', '"policy" does not return a function');
            assert.equal(policy.policy(actionParams).length, 3, 'Function different than expected');
        });

        context('when the credentials are valid', () => {
            it('should create user gateway', function () {
                const req = {
                    body: { email: "email@mail.com", password: "password" }
                };
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs().returns(res);

                const next = {};

                const authService = {
                    auth() { }
                }
                const fakeResponseAuthService = {
                    status: 200,
                    data: {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTE2MjM5MDIyfQ.mpjuoOQ0jMYGBx6fOAi-SUkC7bZKyRPc_rEMu972mNI"
                    }
                }
                const promiseAuthService = Promise.resolve(fakeResponseAuthService);
                const auth = sinon.stub(authService, 'auth');
                auth.withArgs("http://localhost:3000/users/auth", { email: "email@mail.com", password: "password" }).returns(promiseAuthService);

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const services = {
                    user: {
                        find() { },
                        insert() { }
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert);
                const promiseServicesFind = Promise.resolve(false);

                const find = sinon.stub(services.user, 'find');
                find.withArgs('1234567890').returns(promiseServicesFind);
                const insert = sinon.stub(services.user, 'insert');
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlauthservice: "http://localhost:3000/users/auth",
                    secretOrPublicKey: "mysecret",
                    issuer: "haniot"                   
                }

                md_policy = policy.policy(actionParams,authService,services);
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(auth);
                        sinon.assert.calledWith(find, '1234567890');
                        sinon.assert.calledWith(insert, { username: '1234567890' });
                        sinon.assert.calledWith(res.status, 200);

                        auth.restore();
                        find.restore();
                        insert.restore();
                    });


            });

            it('should not create user gateway', function (done) {
                const req = {
                    body: { email: "email@mail.com", password: "password" }
                };
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs().returns(res);

                const next = {};

                const authService = {
                    auth() { }
                }
                const fakeResponseAuthService = {
                    status: 200,
                    data: {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoiaGFuaW90IiwiaWF0IjoxNTE2MjM5MDIyfQ.mpjuoOQ0jMYGBx6fOAi-SUkC7bZKyRPc_rEMu972mNI"
                    }
                }
                const promiseAuthService = Promise.resolve(fakeResponseAuthService);
                const auth = sinon.stub(authService, 'auth');
                auth.withArgs("http://localhost:3000/users/auth", { email: "email@mail.com", password: "password" }).returns(promiseAuthService);

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const services = {
                    user: {
                        find() { },
                        insert() { }
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert);
                const promiseServicesFind = Promise.resolve(fakeUserInsert);

                const find = sinon.stub(services.user, 'find');
                find.withArgs('1234567890').returns(promiseServicesFind);
                const insert = sinon.stub(services.user, 'insert');
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlauthservice: "http://localhost:3000/users/auth",
                    secretOrPublicKey: "mysecret",
                    issuer: "haniot"                   
                }

                md_policy = policy.policy(actionParams,authService,services);
                md_policy(req, res, next)

                sinon.assert.calledOnce(auth);
                sinon.assert.notCalled(insert);
                setTimeout(() => {
                    sinon.assert.calledWith(find, '1234567890');
                    sinon.assert.calledWith(res.status, 200);
                    
                    auth.restore();
                    find.restore();
                    insert.restore();
                    done();
                });

            });
        });

        context('when the credentials not are valid', () => {
            it('should return 401', function () {
                const req = {
                    body: { email: "email@mail.com", password: "password" }
                };
                const res = {
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs().returns(res);

                const next = {};

                const authService = {
                    auth() { }
                }
                const fakeResponseAuthService = {
                    status: 401,
                    data: {
                        'message': 'Credentials no found or invalid'
                    }
                }
                const promiseAuthService = Promise.resolve(fakeResponseAuthService);
                const auth = sinon.stub(authService, 'auth');
                auth.withArgs("http://localhost:3000/users/auth", { email: "email@mail.com", password: "password" }).returns(promiseAuthService);

                const fakeUserInsert = {
                    username: 'FakeName'
                }

                const services = {
                    user: {
                        find() { },
                        insert() { }
                    }
                }
                const promiseServiceInsert = Promise.resolve(fakeUserInsert);
                const promiseServicesFind = Promise.resolve(false);

                const find = sinon.stub(services.user, 'find');
                find.withArgs('1234567890').returns(promiseServicesFind);
                const insert = sinon.stub(services.user, 'insert');
                insert.withArgs().returns(promiseServiceInsert)

                const actionParams = {
                    urlauthservice: "http://localhost:3000/users/auth",
                    secretOrPublicKey: "mysecret",
                    issuer: "haniot"                    
                }

                md_policy = policy.policy(actionParams,authService,services);
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(auth);
                        sinon.assert.notCalled(find);
                        sinon.assert.notCalled(insert);
                        sinon.assert.calledWith(res.status, 401);

                        auth.restore();
                        find.restore();
                        insert.restore();

                    });



            });
        });

    });
});