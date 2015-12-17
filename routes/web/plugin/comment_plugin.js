/**
 * @author eric
 * @description 前端官网--前台展示--插件相关路由配置
 * 插件库(path:/plugin/*)
*/
var express = require('express');
var router = express.Router();
var PluginCommentsModel=require("../../../models/comment_plugin");
var logger = require("../../../conf/log4j").helper;
var AssembleUtil = require("../../../utils/assembleUtil");

/**
 * 添加评论  发布评论
 */
router.post("/plugin/comment/add", function (req, res) {
    logger.debug("发布评论！");
    var comment = req.body;
    var userId="";
    logger.debug("用户信息是否存在！user="+req.session.user);
    if(req.session.user){
        logger.info("用户信息是否存在！");
        userId=req.session.user.id;
    }
    var options = {
        content:comment.content,
        nickName:comment.nickName,
        email:comment.email,
        pluginId:comment.pluginId
    };
    if(userId){
        options.userId=userId;
    }
    if(comment.commentId){
        options.commentId=comment.commentId;
    }
    PluginCommentsModel.addComment(options,function(comment,err){
        if(err){
            res.json({"status":"-1","msg":"评论发布失败！"});
            return;
        }
        comment.createTime=AssembleUtil.formatDate(comment.createTime,"yyyy-MM-dd hh:mm:ss");
        comment.updateTime=AssembleUtil.formatDate(comment.updateTime,"yyyy-MM-dd hh:mm:ss");
        /*var id="";
        if(result&&result.insertId){
            id=result.insertId;
        }*/
        res.json({"status":"0","msg":"评论发布成功！","comment":comment});
    });
});

/**
 * 获取插件下的评论列表 return plugins[{title:"'xx",id:1}]
 */
router.get('/plugin/comment/list/:pluginId', function (req, res, next) {
    console.log("get plugin comments!");
    var pluginId=req.params.pluginId;
    var callback=function(result,err){
    	if(err){
    		logger.err("查询发生异常，err="+err);
    		res.json({"status":-1,"msg":"查询发生异常！"});
    		return;
    	}
        var comments=AssembleUtil.assembleComments(result);
    	res.json({"status":0,"msg":"查询成功！",comments:comments,length:result.length});
    };
	PluginCommentsModel.findCommentsByPluginId(pluginId,callback);
});

module.exports = router;