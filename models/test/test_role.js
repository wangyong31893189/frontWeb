var assert = require("assert");
var entityDAO = require("../role.js");
describe('role unit test', function() {
    var newEntityId = 1;
    var newEntity;
    var mockData = {
        roleName: 'test roleName',
        desc: 'test desc'
    };

    var mockData_update = {
        roleName: 'update roleName',
        desc: 'update desc'
    };

    describe('testing function: add', function() {
        it('should return latest id', function(done) {
            entityDAO.add([mockData,mockData], function(result) {
                assert.notEqual(result,undefined);
                //newEntityId = result.insertId;
                done();
            });
        });
    });

    /*describe('testing function: findOne', function() {
        it('should return role by id', function(done) {
            entityDAO.findOne(newEntityId, function(result) {
                assert.notEqual(result, undefined);
                assert.equal(result.id, newEntityId);
                assert.equal(result.roleName, mockData.roleName);
                newEntity = result;
                done();
            });
        });
    });

    describe('testing function: update', function() {
        it('should return role by id', function(done) {
            entityDAO.update(newEntityId, mockData_update, function(result) {
                entityDAO.findOne(newEntityId, function(result) {
                    assert.notEqual(result, undefined);
                    assert.equal(result.id, newEntityId);
                    assert.equal(result.roleName, mockData_update.roleName);
                    newEntity = result;
                    done();
                });
            });
        });
    });

    describe('testing function: del', function() {
        it('should delete role successfully', function(done) {
            entityDAO.del(newEntityId, function(result) {
                entityDAO.findOne(newEntityId, function(result2) {
                    assert.equal(result2, undefined);
                    done();
                });
            });
        });
    });*/
});
