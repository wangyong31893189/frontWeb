var assert = require("assert");
var pluginModel = require("../plugin.js");
describe('plugin unit test', function () {
    var newPluginId = 1;
    var newPlugin;
    var mockData = {
        title: 'test title',
        content: 'test content',
        author: 'test author',
        demoUrl: 'test demoUrl',
        gitUrl: 'test gitUrl',
        tags: 'tag1,tag2,tags'
    };
    
    var mockData_update = {
        title: 'update title',
        content: 'update content',
        author: 'update author',
        demoUrl: 'update demoUrl',
        gitUrl: 'update gitUrl',
        tags: 'tag1,tag2,tags,update',
        status: 1,
        isDelete: 0
    };
    
    
	describe('testing function: findAllLiteByPage', function () {
        it('should return records', function (done) {
            pluginModel.findAllLiteByPage({keywords:['test','jquery'],fields:['title','content','tags']},{index:0,size:10},function (result) {
                assert.equal(result.length,10);
                done();
            });
        });
    });
	
	describe('testing function: getTotalNumber', function () {
        it('should return records’ number', function (done) {
            pluginModel.getTotalNumber({keywords:['test','jquery'],fields:['title','content','tags']},function (result) {
                assert.equal(result,39);
                done();
            });
        });
    });
    /*describe('testing function: batchRemove', function () {
        it('should batchRemove successfully', function (done) {
            pluginModel.batchRemove({id:[47,48,49]},function (result) {
                pluginModel.findOne(48,function(result2){
                    assert.equal(result2[0].isDelete,1);
                    done();
                });
            });
        });
    });*/
    /*describe('testing function: updateStatus', function () {
        it('should updateStatus successfully', function (done) {
            pluginModel.updateStatus(49,2,function (result) {
                pluginModel.findOne(49,function(result2){
                    assert.equal(result2.length, 1);
                    assert.equal(result2[0].status, 2);
                    done();
                });
            });
        });
    });*/
    
    /*describe('testing function: findAllLiteByPage', function () {
        it('should return lite plugins', function (done) {
            pluginModel.findAllLiteByPage({title:'test',author:'uth'},{index:0,size:15}, function (result) {
                assert.equal(result.length, 15);
                done();
            });
        });
    });*/
    
    /*describe('testing function: add', function () {
        it('should return latest id', function (done) {
            pluginModel.add(mockData, function (result) {
                assert.equal(result.length, 1);
                newPluginId = result[0].id;
                done();
            });
        });
    });
    
    describe('testing function: findOne', function () {
        it('should return plugin by id', function (done) {
            pluginModel.findOne(newPluginId, function (result) {
                assert.equal(result.length, 1);
                assert.equal(result[0].id, newPluginId);
                assert.equal(result[0].content, mockData.content);
                newPlugin = result[0];
                done();
            });
        });
    });
    
    describe('testing function: update', function () {
        it('should return plugin by id', function (done) {
            pluginModel.update(newPluginId,mockData_update,function (result) {
                pluginModel.findOne(newPluginId, function (result) {
                    assert.equal(result.length, 1);
                    assert.equal(result[0].id, newPluginId);
                    assert.equal(result[0].content, mockData_update.content);
                    newPlugin = result[0];
                    done();
                });
            });
        });
    });
    
    describe('testing function: findAllLite', function () {
        it('should return list plugins', function (done) {
            pluginModel.findAllLite(function (result) {
                assert.notEqual(result.length, 0);
                done();
            });
        });
    });
    
    describe('testing function: del', function () {
        it('should delete plugin successfully', function (done) {
            pluginModel.del(newPluginId, function (result) {
                pluginModel.findOne(newPluginId, function (result2) {
                    assert.equal(result2.length, 0);
                    done();
                });
            });
        });
    });*/
});