/**
 * Created by huanliu on 2015/12/8.
 */
var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');
function UserAccount(){
    this.findAllLiteByPage = function(filter,page,callback){
        var contTable=" as a,user as u WHERE a.id = u.accountId AND u.isDelete = 1";
        var sql = 'SELECT a.id,a.userName FROM '+this.table+ contTable;
        var regStr = SQLStringUtil.fuzzyREGEXP(filter);
        regStr && (regStr=' AND'+ regStr);
        var sortStr = SQLStringUtil.sortSQL({id:'DESC'});
        var limitStr = SQLStringUtil.limitSQL(page);
        sql = sql + regStr + sortStr + limitStr;
        logger.debug(sql);
        this.executeSQL(sql,callback);
    };
    this.getTotalNumber = function(filter,callback){
        //console.log("this.table指的是啥："+this.table);
        //console.log("this.table.id指的是啥："+this.table.id);
        var contTable=" as a,user as u WHERE a.id = u.accountId AND u.isDelete = 1";
        var sql = 'SELECT COUNT(*) AS total FROM '+this.table+contTable ;
        //SELECT COUNT(*) FROM account as a,user as u WHERE a.id = u.accountId AND u.isDelete = 1
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
     * @description 逻辑删除userAccount
     * @param {Number} id       userAccount的id
     * @param {Function} callback 回调函数 无返回值
     */
  /*  this.remove = function(id,callback){
        this.update(id,{'isDelete':2},callback);
    };*/  //因为是关联表user 所以这个方法写在user_new里
    /**
     * @description 批量逻辑删除userAccount
     * @param {Array} ids      userAccount id的集合 e.g. [1,2,3,4,5]
     * @param {Function} callback 回调函数 无返回值
     */
    this.batchRemove = function(ids,callback){
        var sql = 'UPDATE '+this.table + ' SET isDelete=1 WHERE ';
        var inStr = SQLStringUtil.inSQL({id:ids});
        sql = sql + inStr;
        this.executeSQL(sql,callback);
    };
}
UserAccount.prototype=new BaseDAO("account");
UserAccount.prototype.constructor=UserAccount;

var userAccount=new UserAccount();

module.exports=userAccount;