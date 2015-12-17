var express = require('express');
var router = express.Router();
var roleModel = require("../../models/role");
var userModel = require("../../models/user_new");
var actionModel = require("../../models/action");
var logger = require("../../conf/log4j").helper;

router.route('/admin/role/:id').get(function(req, res){
    //获得某个角色
    var id = req.params.id;
    roleModel.findOne(id, function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send(result);
        }
    });
}).delete(function(req, res){
    //删除某个角色
    var id = req.params.id;
    roleModel.deleteRoleAndActions(id,function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send({"status":"success"});
        }
    });
});

router.route('/admin/role').get(function(req, res) {
    //获得角色列表
    roleModel.findAll(function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send(result);
        }
    });
}).post(function(req, res){
    //新建一个角色
    var newRoleName = req.body.roleName;
    var desc = req.body.desc;
    var actionIds = req.body.actionIds;
    roleModel.findByRoleName(newRoleName,function(result){
        if(!result || result.length === 0){
            roleModel.add({roleName:newRoleName,desc:desc},function(result,err){
                if(err){
                    res.send({"status":"error","msg":err});
                }else{
                    var newId = result.insertId;
                    actionModel.assignActions(newId,actionIds,function(result,err){
                        if(err){
                            res.send({"status":"error","msg":err});
                        }else{
                            res.send({"status":"success"});
                        }
                    });
                }
            });
        }else{
            res.send({"status":"warning","msg":"角色名已存在"});
        }
    });
}).put(function(req, res){
    var roleId = req.body.id;
    var roleName = req.body.roleName;
    var desc = req.body.desc;
    var actionIds = req.body.actionIds;
    roleModel.update(roleId,{roleName:roleName,desc:desc},function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            actionModel.assignActions(roleId,actionIds,function(result,err){
                if(err){
                    res.send({"status":"error","msg":err});
                }else{
                    res.send({"status":"success"});
                }
            });
        }
    });
}).delete(function(req, res){
    var roleIds = req.body.roleIds;
    if(roleIds && roleIds.length > 0){
        roleModel.batchDeleteRoles(roleIds, function(result, err){
            if(err){
                res.send({"status":"error","msg":err});
            }else{
                res.send({"status":"success"});
            }
        });
    }
});

router.route('/admin/role/:id/action').get(function(req, res){
    //获得某角色所有权限
    var id = req.params.id;
    actionModel.getAllActionByRoleId(id,function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send(result);
        }
    });

}).post(function(req, res){
    //为某角色分配权限
    var id = req.params.id;
    var actionIds = req.body.actions;
    actionModel.assignActions(id,actionIds,function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send({"status":"success"});
        }
    });
});

router.route('/admin/user/:id/role').put(function(req, res){
    var id = req.params.id;
    var role = req.body.role;
    userModel.update(id,{"roleId":role.id},function(result,err){
        if(err){
            res.send({"status":"error","msg":err});
        }else{
            res.send({"status":"success"});
        }
    });
});
module.exports = router;
