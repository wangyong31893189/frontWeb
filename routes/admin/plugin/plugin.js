/**
 * Created by huanliu on 2015/11/2.
 */
var express = require('express');
var router = express.Router();
var Common=require('../common/common');
var Pager=require("../common/pager");
var logger = require("../../../conf/log4j").helper;
var Plugin=require("../../../models/plugin");
//var url = require('url');

/* GET home page. */
var localMenu="plugin";//定义全局变量  当前页面链接的关键字

router.get('/admin/plugin/list', function(req, res) {
    if(Common.authentication({req:req,res:res})){
        logger.log("跳转到插件列表页！");


        var keyword_val=req.query.keyword;
        var keywordArray=null;
        if(keyword_val){
            var keyword_val=keyword_val.replace(/(^\s*)|(\s*$)/g, "");
            keyword_val=keyword_val.replace(/\s{2,}/g," ");
            keywordArray=keyword_val.split(" ");
            logger.debug("生成的keywordArray:"+keywordArray)
        }
        var keywords={
            keywords:keywordArray,
            fields:['title','content','tags']
        }

        var pageIndex=req.query.pageIndex;
        var pageSize=req.query.pageSize;
        if(!pageIndex){
            pageIndex=1;
        }
        if(!pageSize){
            pageSize=15;
        }

        var page={
            index:(pageIndex-1)*pageSize,
            size:pageSize
        }
        //var options={
        //    pageIndex:req.body.pageSize,
        //    pageSize:req.body.pageSize,
        //    keyword:keyword,
        //    callback:function(err,result){
        //        var pageResult=new Pager({href:"/admin/plugin/list?keyword="+keyword,pageIndex:result.pageIndex,pageIndexName:"pageIndex",totalRows:result.totalCount,pageSize:15}).getPager();
        //        res.render("admin/article/list",{title:"插件列表",layout:"admin/common/layout",plugin:result.rows,pageResult:pageResult,user:req.session.user,keyword:keyword});
        //    }
        //}

        Plugin.getTotalNumber(keywords,function(result,err){//返回的数据总条数Number
            if(err){
                logger.error(err);
            }

            logger.log(result);
            var totalRows=result;
            Plugin.findAllLiteByPage(keywords,page,function(result,err){//返回查询当前页的所有数据对象
                if(Common.error(err,res)){
                    logger.log(result);
                    var pagerResult=new Pager({href:"/admin/plugin/list",pageIndex:pageIndex,pageIndexName:"pageIndex",totalRows:totalRows,pageSize:15}).getPager();
                    res.render('admin/plugin/list',{title:'插件列表',layout:"admin/common/layout",plugin:result,keyword:keyword_val,user:req.session.user,pagerResult:pagerResult,localMenu:localMenu});
                }

            });
        })

        //this.savePlugin({xxxx},callback){
        //    Plugin.add({xxxx}, function (result){
        //        var newId = result.id;
        //        Plugin.findOne(newId,function(result){
        //            var newPlugin = result[0];
        //            callback（newPlugin);
        //        })
        //    });
        //});
    }
});

//插件添加
router.route('/admin/plugin/add').get(function(req, res) {
    if(Common.authentication({req:req,res:res})){
        logger.debug("转向到插件添加页！");
        //var localMenu="plugin";
        res.render('admin/plugin/add', {title: '插件添加',layout:"admin/common/layout",user:req.session.user,localMenu:localMenu});
    }
}).post(function(req,res){
    var user=req.session.user;
    var tags=req.body.tags;

    logger.log(tags);
    var pluginInfo={
        title:req.body.title,
        author:req.body.author,
        demoUrl:req.body.demoUrl,
        gitUrl:req.body.gitUrl,
        tags:tags,
        content:req.body.content

    };
    //logger.log(pluginInfo);
    //logger.log(1111);
    Plugin.add(pluginInfo,function(result,err){
        logger.info(result);
        if(Common.error(err,res)){
            res.end(JSON.stringify({"status":'success'}))
            return;
        }
        res.end(JSON.stringify({"status":'error',msg:"添加插件失败"}));
        return;
    })
});





//编辑插件
router.get('/admin/plugin/edit/:id',function(req, res) {
   if(Common.authentication({req:req,res:res})){
        logger.log("跳转至编辑页面！");
        //var pathname = url.parse(req.url).pathname;// /admin/plugin/edit/19
        //var localMenu="plugin";
        //logger.log("pathname：>>>>>>>"+pathname);

        Common.authentication(req,res);
        var id=req.params.id;
        Plugin.findOne(id,function(result,err){//返回该条数据对象{id:1,title:"zz",content:"vv"}
            logger.log("result--------");
            if(Common.error(err,res)){
                res.render("admin/plugin/edit",{title:"插件编辑",layout:"admin/common/layout",user:req.session.user,plugin:result,localMenu:localMenu});

            }
        });
    }
}).post("/admin/plugin/edit",function(req,res){

    var id=req.body.id;
    logger.log("编辑插件的id:"+id);
    var tags=req.body.tags;

    logger.info(tags);
    var pluginInfo={
        title:req.body.title,
        author:req.body.author,
        demoUrl:req.body.demoUrl,
        gitUrl:req.body.gitUrl,
        tags:tags,
        content:req.body.content

    };

    Plugin.update(id,pluginInfo,function(result,err){
        logger.info("更新成功！");
        if(Common.error(err,res)){
            res.redirect("/admin/plugin/list");
            return;
        }

    })
});

//插件查看
router.get('/admin/plugin/view/:id', function(req, res) {
    if(Common.authentication({req:req,res:res})){
        logger.log("跳转至编辑页面！");
        //res.render('admin/plugin/view', {title: '查看插件',layout:"admin/common/layout",user:req.session.user});
        var id=req.params.id;
        Plugin.findOne(id,function(result,err){//返回该条数据对象{id:1,title:"zz",content:"vv"}
            logger.log("result--------");
            //if(result){
            //    res.render("admin/plugin/view",{title:"查看插件",layout:"admin/common/layout",user:req.session.user,plugin:result});
            //}
            if(Common.error(err,res)){
                res.render("admin/plugin/view",{title:"查看插件",layout:"admin/common/layout",user:req.session.user,plugin:result,localMenu:localMenu});
                return;
            }
        });
    }
});


//删除插件 单删
router.route('/admin/plugin/del/:id').get(function(req, res) {
    if(Common.authentication({req:req,res:res})){
        logger.log("跳转至删除页面！");
        var id= req.params.id;//ID
        //Plugin.remove(id,function(){
        //    res.end(JSON.stringify({"status":"success"}));
        //    return;
        //});
        Plugin.remove(id,function(result,err){
            if(Common.error(err,res)){
                res.end(JSON.stringify({"status":"success"}));
                return;
            }
            res.end(JSON.stringify({"status":'error',msg:"文章删除失败"}));
            return;
        });
    }
});


//删除插件 多删
router.route("/admin/plugin/del").post(function(req, res) {

    // Common.authentication(req,res);
    logger.log("跳转至（多）删除页面！");

    var ids=req.body.ids;
    logger.log(ids);

    Plugin.batchRemove(ids,function(result,err){
        if(Common.error(err,res)){
            res.end(JSON.stringify({"status":"success"}));
            return;
        }
        res.end(JSON.stringify({"status":'error',msg:"文章删除（多删）失败"}));
        return;
    });//删除插件
});


//审核插件
router.post("/admin/plugin/verify",function(req,res,next){
    if(!Common.authentication({req:req,res:res,ajax:true})){
        return res.end(JSON.stringify({"status":'login'}));
    }
    logger.log("跳转至审核页面！");
    var status=req.body.status;
    var id=req.body.id;


    if(status==1){
        Plugin.verifyEnable(id,function(result,err){
            if(Common.error(err,res)){
                res.end(JSON.stringify({"status":'success'}))
                return;
            }
            res.end(JSON.stringify({"status":'error',msg:"文章审核失败"}));
            return;
        });
    }else if(status==2){
        Plugin.verifyDisable(id,function(result,err){
            if(Common.error(err,res)){
                res.end(JSON.stringify({"status":'success'}))
                return;
            }
            res.end(JSON.stringify({"status":'error',msg:"文章审核失败"}));
            return;
        })
    }

});




module.exports = router;

