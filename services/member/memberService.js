var express = require('express');
var router = express.Router();
var userModel = require("../../models/user");
//insert
router.get("/member/user", function (res, req) {
    var options = ['realName','picPath','userDesc','sex'];
    userModel.find(options,function(err, rows){
        if(err){
            console.error(err);
        }else{
            req.send(rows);
        }
    });
});

module.exports = router;