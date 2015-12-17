/**
 * @author eric
 * @description 前端官网--前台展示--插件相关路由配置
 * 插件库(path:/plugin/*)
*/
var express = require('express');
var router = express.Router();
var PluginModel=require("../../../models/plugin");
var logger = require("../../../conf/log4j").helper;

/**
 * 获取插件名称列表 return plugins[{title:"'xx",id:1}]
 */
router.get('/plugin/list', function (req, res, next) {
    console.log("get plugin titles!");
    var callback=function(result,err){
    	if(err){
    		logger.err("查询发生异常，err="+err);
    		res.json({"status":-1,"msg":"查询发生异常！"});
    		return;
    	}
    	res.json({"status":0,"msg":"查询成功！",plugins:result,user:req.session.user});
    };
	PluginModel.getPluginsForTitle(callback);
});

/**
 * 获取插件名称列表 return plugins[{title:"'xx",id:1}]
 */
router.get('/plugin/:id', function (req, res, next) {
    console.log("get plugin titles!");
    var id=req.params.id;
    var callback=function(result,err){
    	if(err){
    		logger.err("查询发生异常，err="+err);
    		res.json({"status":-1,"msg":"查询发生异常！"});
    		return;
    	}
    	res.json({"status":0,"msg":"查询成功！",plugin:result});
    };
	PluginModel.findOne(id,callback);
});

module.exports = router;