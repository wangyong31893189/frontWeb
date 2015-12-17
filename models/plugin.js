/**
 * @author Huibin Zheng
 * @Created by Huibin on 2015/11/2
 */
var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');
function Plugin(){
    /**
     * @description 根据过滤条件以分页形式获取Plugin列表，返回id，title，author,status,isDelete字段
     * @param {Object} filter e.g. {keywords:['分页插件','pagination','jquery'],fields:['title','content','tags']}
     * @param {Object} page     e.g. {index:0,size:5} 
     * @param {Function} callback 回调函数 返回参数类型 Array
     */
    this.findAllLiteByPage = function(filter,page,callback){
        var sql = 'SELECT id,title,author,status,isDelete FROM '+this.table + ' WHERE isDelete=0 ';
        var regStr = SQLStringUtil.fuzzyREGEXP(filter);
		regStr && (regStr=' AND'+ regStr);
        var sortStr = SQLStringUtil.sortSQL({id:'DESC'});
        var limitStr = SQLStringUtil.limitSQL(page);
        sql = sql + regStr + sortStr + limitStr;
		logger.debug(sql);
        this.executeSQL(sql,callback);
    };
	/**
     * @description 根据过滤条件返回plugin总条数
     * @param {Object} filter e.g. {keywords:['分页插件','pagination','jquery'],fields:['title','content','tags']}
     * @param {Function} callback 回调函数 返回参数类型 Number;
     */
	this.getTotalNumber = function(filter,callback){
		var sql = 'SELECT COUNT(*) AS total FROM '+this.table + ' WHERE isDelete=0 ';
        var regStr = SQLStringUtil.fuzzyREGEXP(filter);
		regStr && (regStr=' AND'+ regStr);
        sql = sql + regStr;
		logger.debug(sql);
        this.executeSQL(sql,function(result,error){
			if(result && result.length == 1){
				var total = result[0].total;
				callback(total);
			}else if(error){
				callback(null,error);
			}
		});
	};
    /**
     * @description 更新plugin状态
     * @param {Number} id       plugin的id
     * @param {Number} status   plugin的状态 0为未审核   1为已审核   2为未通过
     * @param {Function} callback 回调函数 无返回值
     */
    this.updateStatus = function(id,status,callback){
        this.update(id,{'status':status},callback);  
    };
    
    /**
     * @description 逻辑删除plugin
     * @param {Number} id       plugin的id
     * @param {Function} callback 回调函数 无返回值
     */
    this.remove = function(id,callback){
        this.update(id,{'isDelete':1},callback);      
    };
    /**
     * @description 批量逻辑删除plugin
     * @param {Array} ids      plugin id的集合 e.g. [1,2,3,4,5]
     * @param {Function} callback 回调函数 无返回值
     */
    this.batchRemove = function(ids,callback){
        var sql = 'UPDATE '+this.table + ' SET isDelete=1 WHERE ';
        var inStr = SQLStringUtil.inSQL({id:ids});
        sql = sql + inStr;
        this.executeSQL(sql,callback);
    };
    /**
     * @description 审核通过
     * @param {Number} id       plugin的id
     * @param {Function} callback 回调函数 无返回值
     */
    this.verifyEnable = function(id,callback){
        this.update(id,{status:1},callback);    
    };
    /**
     * @description 审核不通过
     * @param {Number} id       plugin的id
     * @param {Function} callback 回调函数 无返回值
     */
    this.verifyDisable = function(id,callback){
        this.update(id,{status:2},callback);    
    };

    /**
     * @name getPluginsForTitle
     * @description 根据条件获取插件列表的title ,id字段
     * @param {Function} callback 回调函数 返回参数类型 Array
     */
    this.getPluginsForTitle = function(callback){
        var sql = 'SELECT id,title FROM '+this.table + ' WHERE isDelete=0 and status=1 ';
        var sortStr = SQLStringUtil.sortSQL({id:'DESC'});
        sql = sql +sortStr;
		logger.debug(sql);
        this.executeSQL(sql,callback);
    };
}
Plugin.prototype = new BaseDAO('plugins');
Plugin.prototype.constructor = Plugin;

var plugin = new Plugin();

module.exports = plugin;