/**
 * @author Huibin Zheng
 * @Created by Huibin on 2015/12/8
 */
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var action = require('./action');
var SQLStringUtil = require('../utils/sqlStringUtil');
function Role(){
    var self = this;
    this.findAll = function(callback){
        this.query(['*'],null,callback);
    };
    //[{key:'id',opt:'=',value:1}]
    this.findByRoleName = function(roleName, callback){
        this.query(['*'],[{key:'roleName',opt:'=',value:roleName}],callback);
    };

    this.deleteRoleAndActions = function(roleId,callback){
        action.getAllActionByRoleId(roleId,function(result,err){
            if(err){
                logger.error('error, when execute getAllActionByRoleId');
            }
            else if(result && result.length > 0){
                var sql = "DELETE a,b FROM role as a,role_action as b WHERE a.id = b.roleId AND a.id = " + roleId;
                this.executeSQL(sql, callback);
            }else{
                self.del(roleId,callback);
            }
        });
    };

    this.batchDeleteRoles = function(roleIds,callback){
        var sql = "DELETE a,b FROM role as a,role_action as b WHERE a.id = b.roleId AND a.id in (" + roleIds.join(',') + " )";
        this.executeSQL(sql, callback);
    };
}
Role.prototype = new BaseDAO('role');
Role.prototype.constructor = Role;

var role = new Role();
module.exports = role;
