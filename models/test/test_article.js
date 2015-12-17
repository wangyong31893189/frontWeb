var assert = require("assert");
var articaleModel = require("../article.js");
describe('article unit test', function () {
    var newAtricleId;

    before(function (done) {
        var options = {
            author: "test_author",
            articleName: "test_articleName",
            categoryName: "test_categoryName",
            desc: "test_desc"
        };

        articaleModel.addArticle(options, function (err, rows) {
            console.log(err, rows);
            if (!err) {
                console.log("before function finished");
                done();
            }

        });
    });

    describe('testing function: findLatestAritcle', function () {
        it('should return latest records', function (done) {
            var count = 5;
            var options = {
                limit: count
            }
            var rows = [1, 2, 3, 4, 5];

            articaleModel.findLatestArticle(options, function (err, rows) {
                if (rows.length > 0) {
                    newAtricleId = rows[0].id;
                    console.log(rows);
                    console.log("newAtricleId: " + newAtricleId);
                }
                assert.equal(rows[0].articleName, "test_articleName");
                done();
            });
        });
    });

    describe('testing function: findAritcleLiteByCategoryName', function () {
        it('should return one or more than one records', function (done) {
            var options = {
                categoryName: "test_categoryName",
                startIndex: 0,
                pageSize: 5
            };
            articaleModel.findAritcleLiteByCategoryName(options, function (err, rows) {
                if (!err) {
                    for (var i = 0; i < rows.length; i++) {
                        assert.equal(rows[i].categoryName, "test_categoryName");
                    }
                    done();
                }
            });
        });
    });

    after(function (done) {
        var options = {
            id: newAtricleId
        }
        articaleModel.delArticle(options, function (err, rows) {
            if (!err) {
                console.log("clean the test records");
                done();
            }
        });
    });
});