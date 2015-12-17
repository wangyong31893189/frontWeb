var assert = require("assert");
var expect = require('expect.js');
var commentModel = require("../comment.js");
describe('comment unit test', function () {
    var newCommentId = 1;
    var newComment;

    var mockData = {
        content: "test content",
        nickName: "test nickname",
        email: "test@163.com",
        articleId: 148,
        commentId: null,
        userId: null
    }

    describe('testing function: add', function () {
        it('should return latest id', function (done) {
            commentModel.add(mockData, function (result, err) {
                assert.notEqual(result, undefined);
				assert.notEqual(result, null);
				assert.notEqual(result, '');
                newCommentId = result;
                done();
            });
        });
    });

    describe('testing function: findOne', function () {
        it('should return comment by id', function (done) {
            commentModel.findOne(newCommentId, function (result, err) {
                assert.equal(result.id, newCommentId);
                assert.equal(result.content, mockData.content);
                newComment = result;
                done();
            });
        });
    });

    describe('testing function: update', function () {
        it('should update comment', function (done) {
            newComment.content = "new content";
            commentModel.update(newComment.id,newComment, function (result, err) {
                if (!err) {
                    commentModel.findOne(newCommentId, function (result2,err2) {
                        assert.equal(result2.id, newCommentId);
                        assert.equal(result2.content, newComment.content);
                        newComment = result2;
                        done();
                    })
                }
            });
        });
    });

    describe('testing function: del', function () {
        it('should delete comment successfully', function (done) {
            commentModel.del(newComment.id, function (result,err) {
                if (!err) {
                    commentModel.findOne(newComment.id, function (result2, err2) {
                        assert.equal(result2,undefined);
                        done();
                    });
                }
            });
        });
    });

    describe('testing function: findByArticleId', function () {
        it('should return recode by pager', function (done) {
            commentModel.findByArticleId(mockData.articleId,{index:0,size:5}, function (result,err) {
				expect(result.length).to.be.within(0,5);
                done();
            });
        });
    });
});