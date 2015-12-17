var express = require('express');
var router = express.Router();
var roleModel = require("../../../models/role");
var actionModel = require("../../../models/action");
var Common=require('../common/common');
var logger = require("../../../conf/log4j").helper;

var localMenu="authority";
router.get('/admin/authority/list',function(req, res){
    if(Common.authentication({req:req,res:res})){
        roleModel.findAll(function(result,err){
            if(err){
                logger.error("角色添加-----------error"+err);
                res.end(JSON.stringify({"status":"error","msg":err}));
                return;
            }else{
                res.render('admin/authority/list',{title:'权限管理',layout:"admin/common/layout",roles:result,localMenu:localMenu});
            }
        });
    }
});
router.get('/admin/authority/add', function(req , res){
    if(Common.authentication({req:req,res:res})){
        logger.debug("转向到角色添加页！");
        actionModel.findAll(function(result,err){
            if(err){
                logger.error("获得的所有action-----------error"+err);
                res.end(JSON.stringify({"status":"error","msg":err}));
                return;
            }else{
                res.render('admin/authority/add', {title: '角色添加',layout:"admin/common/layout",actions:result,localMenu:localMenu});
            }
        });
    }
});
router.get('/admin/authority/view/:id',function(req, res){
    if(Common.authentication({req:req,res:res})){
        var roleId = req.params.id;
        roleModel.findOne(roleId, function(result, err){
            if(err){
                logger.error("显示角色-----------error"+err);
                res.end(JSON.stringify({"status":"error","msg":err}));
                return;
            }else{
                var role = result;
                actionModel.getAllActionByRoleId(roleId,function(result,err){
                    if(err){
                        logger.error("获取Action-----------error"+err);
                        res.end(JSON.stringify({"status":"error","msg":err}));
                        return;
                    }else{
                        role.actions = result;
                        res.render('admin/authority/view', {title: '显示角色',layout:"admin/common/layout",role:role,localMenu:localMenu});
                    }
                });
            }
        });
    }
});
router.get('/admin/authority/edit/:id',function(req, res){
    if(Common.authentication({req:req,res:res})){
        var roleId = req.params.id;
        roleModel.findOne(roleId, function(result, err){
            if(err){
                logger.error("显示角色-----------error"+err);
                res.end(JSON.stringify({"status":"error","msg":err}));
                return;
            }else{
                var role = result;
                actionModel.getAllActionByRoleId(roleId,function(result,err){
                    if(err){
                        logger.error("获取Action-----------error"+err);
                        res.end(JSON.stringify({"status":"error","msg":err}));
                        return;
                    }else{
                        var existActions = result;
                        actionModel.findAll(function(result,err){
                            if(err){
                                logger.error("获取All Actions-----------error"+err);
                                res.end(JSON.stringify({"status":"error","msg":err}));
                                return;
                            }else{
                                var allActions = result;
                                for (var i = 0; i < allActions.length; i++) {
                                    var action = allActions[i];
                                    for (var j = 0; j < existActions.length; j++) {
                                        var existAction = existActions[j];
                                        if(existAction.id === action.id){
                                            action.checked = true;
                                            break;
                                        }
                                    }
                                }
                                role.actions = allActions;
                                res.render('admin/authority/edit', {title: '编辑角色',layout:"admin/common/layout",role:role,localMenu:localMenu});
                            }

                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
