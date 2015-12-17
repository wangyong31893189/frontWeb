var assert = require("assert");
var entityDAO = require("../action.js");
describe('role unit test', function() {
    var roleId = 14;

    describe('testing function: getAllActionByRoleId', function() {
        it('should return actions', function(done) {
            entityDAO.getAllActionByRoleId(roleId, function(result) {
                assert.equal(result.length,6);
                //assert.equal(result[0].url,'/admin/article/del');
                done();
            });
        });
    });

    describe('testing function: assignActions', function() {
        it('should return actions', function(done) {
            entityDAO.assignActions(roleId,[1,2,3,4,5,6],function(result,err) {
                if(!err){
                    entityDAO.getAllActionByRoleId(roleId, function(result2) {
                        assert.equal(result2.length,6);
                        //assert.equal(result2[0].url,'/admin/article/add');
                        done();
                    });
                }else{
                    done();
                }
            });
        });
    });
});
