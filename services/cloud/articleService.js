/*
 *@author huibin Zheng
 *@description article restful service
 */
var express = require('express');
var router = express.Router();
var articleModel = require("../../models/article");
var commentModel = require("../../models/comment");

router.get("/cloud/article/:id", function (req, res) {
    var _id = req.params.id;
    var options = {
        id: _id
    };
    articleModel.findOne(options, function (err, rows) {
        if (err) {
            console.error(err);
        } else if (rows.length === 1) {
            res.send(rows[0]);
        } else {
            res.send(null);
        }
    })
});

router.get("/cloud/category/:name/article/:id/:direction", function (req, res) {
    var _id = req.params.id;
    var _categoryName = req.params.name;
    var _direction = req.params.direction;
    var options = {
        id: _id,
        categoryName: _categoryName,
    };
    if (_direction === "next") {
        articleModel.findNextAritcleLite(options, function (err, rows) {
            if (err) {
                console.error(err);
            } else if (rows.length === 1) {
                res.send(rows[0]);
            } else {
                res.send(null);
            }
        });
    } else if (_direction === "previous") {
        articleModel.findPreviousAritcleLite(options, function (err, rows) {
            if (err) {
                console.error(err);
            } else if (rows.length === 1) {
                res.send(rows[0]);
            } else {
                res.send(null);
            }
        });
    }
});

router.get("/cloud/article/:id/comment", function (req, res) {
    var _articelId = req.params.id;
    var _pageNo = req.query.pageNo;
    var _pageSize = req.query.pageSize;
    var _startIndex = (_pageNo - 1) * _pageSize;
    if (!_startIndex) {
        _startIndex = 0;
    }
    if (!_pageSize) {
        _pageSize = 10;
    }
    commentModel.findByArticleId(_articelId,{index:_startIndex,size:_pageSize}, function (result, err) {
        if (err) {
            console.error(err);
        } else if (result.length > 0) {
            res.send(result);
        } else {
            res.send([]);
        }
    })
});

module.exports = router;