const policy = require('../../../../eg-plugin-haniot/policies/authorization/haniot-jwtScopes-policy');
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Policy: haniot-jwtScopes-policy', () => {
    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type');
            assert.equal(policy.name, 'haniot-jwtScopes-policy', 'Policy name other than expected');
        });
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type');
        });
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type');
        });
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/haniot-jwtScopes-policy.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid', () => {
            assert.typeOf(policy.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(policy.schema.type, 'object', '"schema.type" different than expected');
        });
        it('Field "schema.properties" is type valid', () => {
            assert.typeOf(policy.schema.properties, 'object', '"schema.properties" is not object type');
        });
    });

    describe('Functionality', () => {
        it('should return a function(req,res,next)', () => {
            assert.typeOf(policy.policy(), 'function', '"policy" does not return a function');
            const actionParams = {};
            assert.equal(policy.policy(actionParams).length, 3, 'Function different than expected');
        });

        context('should validate scopes', () => {
            it('when user has scope, should call next()', function (done) {
                const req = {
                    user: {
                        sub: '5b996a956cdde90039922dde',
                        iss: 'haniot',
                        scope: 'users:readAll'
                    },
                    egContext: {
                        apiEndpoint: {
                            scopes: ['users:readAll']
                        }
                    }
                };

                const res = {};

                const next = sinon.spy();

                // Executando a politica
                mid_policy = policy.policy();
                mid_policy(req, res, next);

                sinon.assert.called(next);

                done();


            });
            it('when user does not have scope, should return 403', function (done) {
                const req = {
                    user: {
                        sub: '5b996a956cdde90039922dde',
                        iss: 'haniot',
                        scope: 'users:readAll'
                    },
                    egContext: {
                        apiEndpoint: {
                            scopes: ['users:register']
                        }
                    }
                };

                const res = {
                    send: sinon.spy(),
                    status: sinon.stub()
                };

                res.status.withArgs().returns(res);
                const next = sinon.spy();

                // Executando a politica
                mid_policy = policy.policy();
                mid_policy(req, res, next);

                sinon.assert.calledOnce(res.send);
                sinon.assert.calledWith(res.status, 403);
                sinon.assert.notCalled(next);

                done();

            });
        });

    });
});