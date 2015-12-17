/*
 *@author huibin Zheng
 *@description category restful service
 */
var express = require('express');
var router = express.Router();
var categoryModel = require("../../models/category");
var articleModel = require("../../models/article");

/*
 *@description get all categories
 */
router.get("/cloud/category", function (req, res) {
    console.log(req.baseUrl);
    var options = {
        callback: function (err, rows) {
            if (err) {
                console.error(err);
            } else {
                res.send(rows);
            }
        }
    };
    categoryModel.findAll(options);
});

/*
 *@description get articles under category
 *e.g. http://localhost:3000/cloud/category/编码技术/article?pageNo=2&pageSize=5
 */
router.get("/cloud/category/:name/article", function (req, res) {
    var _name = req.params.name;
    var _pageNo = req.query.pageNo;
    var _pageSize = req.query.pageSize;
    var _startIndex = (_pageNo - 1) * _pageSize;
    if (!_startIndex) {
        _startIndex = 0;
    }
    if (!_pageSize) {
        _pageSize = 30;
    }
    var options = {
        categoryName: _name,
        startIndex: _startIndex,
        pageSize: _pageSize
    };
    articleModel.findAritcleLiteByCategoryName(options, function (err, rows) {
        if (err) {
            console.error(err);
        } else {
            res.send(rows);
        }
    });
});

module.exports = router;