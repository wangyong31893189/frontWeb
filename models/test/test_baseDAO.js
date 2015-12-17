var assert = require("assert");
var BaseDAO = require("../baseDAO.js");
describe('baseDAO unit test', function () {
    var baseDAO = new BaseDAO('plugins');
    var newEntityId = 1;
    var newEntity;
    var mockData = {
        title: 'test title',
        content: 'test content',
        author: 'test author',
        demoUrl: 'test demoUrl',
        gitUrl: 'test gitUrl',
        tags: 'tag1,tag2,tags',
        createTime: new Date()
    };

    var mockData_update = {
        title: 'update title',
        content: 'update content',
        author: 'update author',
        demoUrl: 'update demoUrl',
        gitUrl: 'update gitUrl',
        tags: 'tag1,tag2,tags,update',
        updateTime: new Date(),
        status: 1,
        isDelete: 1
    };

   describe('testing function: add', function () {
        it('should return latest id', function (done) {
            baseDAO.add(mockData, function (result) {
                if(!isNaN(result)){
					newEntityId = result;
					assert.equal(1,1);
				}else{
					assert.equal(1,2);
				}
                
                done();
            });
        });
    });

    describe('testing function: query', function () {
        it('should return entity by id', function (done) {
            var conditions = [{key:'id',opt:'=',value:newEntityId}];
            baseDAO.query(['*'], conditions, function (result) {
                assert.equal(result.length, 1);
                assert.equal(result[0].id, newEntityId);
                assert.equal(result[0].content, mockData.content);
                newEntity = result[0];
                done();
            });
        });
    });

   describe('testing function: update', function () {
        it('should update entity', function (done) {
            baseDAO.update(newEntityId,mockData_update, function (err, result) {
                var conditions = [{key:'id',opt:'=',value:newEntityId}];
                baseDAO.query(['*'], conditions, function (result) {
                    assert.equal(result.length, 1);
                    assert.equal(result[0].id, newEntityId);
                    assert.equal(result[0].content, mockData_update.content);
                    newEntity = result[0];
                    done();
                });
            });
        });
    });
    
    describe('testing function: findOne', function () {
        it('should fine entity by id', function (done) {
            baseDAO.findOne(newEntityId,function(result){
                assert.equal(result.id, newEntityId);
                assert.equal(result.content, mockData_update.content);
                newEntity = result;
                done();
            });
        });
    });
    
    describe('testing function: del', function () {
        it('should delete entity successfully', function (done) {
            baseDAO.del(newEntityId, function (result) {
                var conditions = [{key:'id',opt:'=',value:newEntityId}];
                baseDAO.query(['*'], conditions, function (result2) {
                    assert.equal(result2.length, 0);
                    done();
                })
            });
        });
    });
});