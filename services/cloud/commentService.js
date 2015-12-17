var express = require('express');
var router = express.Router();
var commentModel = require("../../models/comment");
//insert
router.post("/cloud/comment", function (res, req) {
    var comment = res.body;
	comment.createTime = new Date();
    commentModel.add(comment,function(result,err){
        if(err){
            console.error(err);
        }else{
            if(result){
                var newId = result;
                commentModel.findOne(newId,function(result2,err2){
                    if(err2){
                        console.error(err2);
                    }else{
                        req.send(result2);
                    }
                });
                
            }
        }
    });
});
//update
router.put("/cloud/comment", function (res, req) {
    var comment = res.body;
	comment.updateTime = new Date();
    commentModel.update(comment.id,{content:comment.content},function(result, error){
        if(err){
            console.error(err);
        }else{
            req.send();
        }
    });
});

//delete
router.delete("/cloud/comment/:id",function(res,req){
    var _id = res.params.id;
    commentModel.del(_id,function(result, err){
        if(err){
            console.error(err);
        }else{
            req.send();
        }
    });
});

module.exports = router;