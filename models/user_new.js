/**
 * Created by huanliu on 2015/12/10.
 */
var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');
function User_new(){

        this.remove_relational_table = function(id,callback){
            //this.update(id,{'isDelete':2},callback);
            //直接执行语句  通过id删除account里的数据 ===等价于  设置user表里的accountId=id（account表里里的id）isDelete=2
            var sql="update user set isDelete=2 where accountId="+id;
            this.executeSQL(sql,callback);
        };
        this.batchRemove_relational_table  = function(ids,callback){
            //console.log("多删传进的ids为："+JSON.stringify(ids));
            var sql = 'UPDATE '+this.table + ' SET isDelete=2 WHERE accountId in ('+ids+')';
            this.executeSQL(sql,callback);
        };

        this.findOne_relational_table =function(id,callback){//通过id 查询 关联表的数据
            //var contTable=" as a,user as u WHERE a.id = u.accountId AND u.isDelete = 1";
            //var sql = 'SELECT a.id,a.userName FROM '+this.table+ contTable;
           // "select * from user as u,account as a where u.accountId=a.id and a.id=10"
            var sql="select *,u.id as userId from user as u,account as a where u.accountId=a.id and a.id="+id;
            this.executeSQL(sql,callback);
        }

        this.update_relational_table =function(options,callback){
            //var sql="update user u, account a set u.realName=?,u.nickName=?,u.picPath=?,u.email=?,u.userDesc=?,u.birth=?,u.sex=?,u.province=?,u.city=?,u.district=?,u.address=?,u.website=?,u.county=?,a.userName=? where u.accountId=a.id and a.id=";
            var sql="update user u, account a set u.realName='"+options.realName+"',u.nickName='"+options.nickName+"',u.picPath='"+options.picPath+"',u.email='"+options.email+"',u.userDesc='"+options.userDesc+"',u.birth='"+options.birth+"',u.sex='"+options.sex+
                "',u.province='"+options.province+"',u.city='"+options.city+"',u.district='"+options.district+"',u.address='"+options.address+"',u.website='"+options.website+"',a.userName='"+options.userName+"' where u.accountId=a.id and a.id='"+options.id+"'";
            //var sql="update user u, account a set u.realName='"+options.realName+"',u.nickName='"+options.nickName+"',a.userName='"+options.userName+"' where u.accountId=a.id and a.id='"+options.id+"'";

            this.executeSQL(sql,callback)
        }
}
User_new.prototype=new BaseDAO("user");
User_new.prototype.constructor=User_new;

var User_new=new User_new();

module.exports=User_new;