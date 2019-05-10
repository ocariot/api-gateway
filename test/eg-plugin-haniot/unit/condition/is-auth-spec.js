const condition = require('../../../../eg-plugin-haniot/conditions/is-auth');
const assert = require('chai').assert;

describe('Condition: is-auth',()=>{
    describe('Integrity',()=>{
        it('Field "name" is type valid',()=>{
            assert.typeOf(condition.name, 'string', '"name" is not string type');
            assert.equal(condition.name, 'is-auth','Condition name other than expected');        
        });
        it('Field "handler" is type valid',()=>{
            assert.typeOf(condition.handler, 'function', '"handler" is not function type');        
        });
        it('Field "schema" is type valid',()=>{
            assert.typeOf(condition.schema, 'object', '"schema" is not object type');        
        });
        it('Field "schema.$id" is type valid',()=>{
            assert.typeOf(condition.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(condition.schema.$id, 'http://express-gateway.io/schemas/conditions/is-auth.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid',()=>{
            assert.typeOf(condition.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(condition.schema.type, 'object', '"schema.type" different than expected');
        });
        it('Field "schema.properties" is type valid',()=>{
            assert.typeOf(condition.schema.properties, 'object', '"schema.properties" is not object type');
        });
        it('Field "schema.properties.authpath" is type valid',()=>{
            assert.typeOf(condition.schema.properties.authpath,'object', '"schema.properties.authpath" is not object type');
            assert.typeOf(condition.schema.properties.authpath.type,'string', '"schema.properties.authpath" is not object type');
        });  
                  
    });

    describe('Functionality',()=>{
        it('When request is /users/auth',()=>{
            const req = {
                url:'/users/auth',
                method: 'POST'
            };
            const conditionConfig = {
                authpath:'/users/auth'
            }
            assert.equal(true,condition.handler(req,conditionConfig), 'Handler should return "true"');
        });
        it('When request is not /users/auth',()=>{
            const req = {
                url:'/users',
                method: 'POST'
            };
            const conditionConfig = {
                authpath:'/users/auth'
            }
            assert.equal(false,condition.handler(req,conditionConfig), 'Handler should return "false"');
        });
    
    });
});