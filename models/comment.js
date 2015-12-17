/**
 * @author Huibin Zheng
 * @description DAO of comment
 */

var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');

function Comment(){
    this.findByArticleId = function (articleId,page, callback) {		
		var sql = 'SELECT * FROM '+this.table;
		var whereStr = SQLStringUtil.whereSQL([{key:'articleId',opt:'=',value:articleId}]);
        var sortStr = SQLStringUtil.sortSQL({id:'ASC'});
        var limitStr = SQLStringUtil.limitSQL(page);
        sql = sql + whereStr + sortStr + limitStr;
		logger.debug(sql);
		this.executeSQL(sql,callback);
    };
};
Comment.prototype = new BaseDAO('comment');
Comment.prototype.constructor = Comment;
var comment = new Comment();
module.exports = comment;