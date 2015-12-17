/**
 * @author eric
 * @Created by eric on 2015/11/10
 * @description 插件评论数据模型
 */
var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');

function CommentPlugins(){
    /**
     * @name findCommentsByPluginId
     * @description 根据条件插件ID获取插件的评论
     * @param {Integer} id 插件ID
     * @param {Function} callback 回调函数 返回参数类型 Array
     */
    this.findCommentsByPluginId = function(id,callback){
        var conditions=[{key:"pluginId",opt:"=",value:id}];
		// logger.debug(sql);
        this.queryParams(["id","content","nickName","email","pluginId","commentId","userId","replyTo","isDelete","status","website","DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime","DATE_FORMAT(updateTime,'%Y-%m-%d %H:%i:%s') as updateTime"], conditions,callback);
    };
    this.addComment=function(options,callback){
        options.isDelete=0;
        options.status=0;
        options.createTime=new Date();
        options.updateTime=new Date();
        this.add(options,function(rows,err){
            if(rows&&rows.insertId){
                options.id=rows.insertId;
            }
            callback&&callback(options,err);
        });
    };
}
CommentPlugins.prototype = new BaseDAO('comment_plugins');
CommentPlugins.prototype.constructor = CommentPlugins;

var commentPlugins = new CommentPlugins();

module.exports = commentPlugins;