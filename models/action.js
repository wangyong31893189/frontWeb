/**
 * @author Huibin Zheng
 * created by Huibin on 2015/12/8
 */
var pool = require('./pool');
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');

function Action() {
    this.findAll = function(callback) {
        var sql = "SELECT * FROM url_action";
        this.executeSQL(sql, callback);
    }

    this.getAllActionByRoleId = function(roleId, callback) {
        var sql = "SELECT b.id,b.url,b.`desc`,b.`code` FROM role_action as a, url_action as b WHERE a.actionId = b.id and a.roleId = " + roleId;
        this.executeSQL(sql, callback);
    };

    this.assignActions = function(roleId, actionIds, callback) {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err){
                if (err) {
                    throw err;
                }
                var batchDeleteSQL = 'DELETE FROM role_action WHERE roleId = ?';
                connection.query(batchDeleteSQL, roleId, function(err, result) {
                    if (err) {
                        callback && callback(undefined,err);
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    var tempArr = [];
                    for (var i = 0; i < actionIds.length; i++) {
                        var actionId = actionIds[i];
                        tempArr.push('('+roleId+','+actionId+')');
                    }
                    var values = tempArr.join(',');
                    var batchInsertSQL = 'INSERT INTO role_action (roleId,actionId) VALUES' + values;
                    connection.query(batchInsertSQL,function(err, result){
                        if(err){
                            callback && callback(undefined,err);
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        connection.commit(function(err){
                            if (err) {
                                callback && callback(undefined,err);
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            callback && callback();
                        });
                    });
                });
            });
        });
    };
}

Action.prototype = new BaseDAO('role_action');
Action.prototype.constructor = Action;


var action = new Action();
module.exports = action;
