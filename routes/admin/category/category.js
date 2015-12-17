var express = require('express');
var router = express.Router();
var Common=require("../common/common");
var CategoryModel=require("../../../models/category");
var Pager=require("../common/pager");
var logger = require("../../../conf/log4j").helper;

 /* GET home page. */
var localMenu="category";//定义全局变量  当前页面链接的关键字

router.get('/admin/category/list', function(req, res) {
   if(Common.authentication({req:req,res:res})){
   	    logger.log("跳转到分类列表页！");
	   	var options={
	   		pageIndex:req.query.pageIndex,
	   		pageSize:req.query.pageSize,
	   		keyword:req.query.keyword,
	   		callback:function(err,result){
	   			if(Common.error(err,res)){
	   				logger.log(JSON.stringify(req.session.user));
					var pagerResult=new Pager({href:"/admin/category/list",pageIndex:result.pageIndex,pageIndexName:"pageIndex",totalRows:result.totalCount,pageSize:15}).getPager();
	   				res.render('admin/category/list',{title:'分类列表',layout:"admin/common/layout",pagerResult:pagerResult,categorys:result.rows,user:req.session.user,keyword:req.query.keyword,localMenu:localMenu});
	   			}
	   		}
	   	};
	  	CategoryModel.findAllByPage(options);//查出所有的分类列表
	}
});

router.route('/admin/category/add').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		logger.debug("转向到分类添加页！");
	 	res.render('admin/category/add', {title: '分类添加',layout:"admin/common/layout",user:req.session.user,localMenu:localMenu});
	 }
}).post(function(req, res) {
	var options={
	    categoryCode:req.body.categoryCode,//分类代码
		categoryName:req.body.categoryName,//分类名称
	    callback:function(err,rows){
	    	if(err){
	    		logger.error("分类添加-----------error"+err);
	    		res.end(JSON.stringify({"status":"error","msg":err}));
	    		return;
	    	}
	    	//if(Common.error(err,res)){
	    	// res.redirect('/admin/category/list');
			//}
			res.end(JSON.stringify({"status":"success"}));
	    	return;
	    }
	}
	CategoryModel.add(options);//添加分类
});

//转向编辑路由
router.get('/admin/category/edit/:id',function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var options={
			id:req.params.id,//分类ID
		    callback:function(err,rows){
		    	if(Common.error(err,res)){
		    		res.render('admin/category/edit', { title: '分类编辑',layout:"admin/common/layout",category:rows[0],user:req.session.user,localMenu:localMenu});
				}
		    }
		}
		CategoryModel.getCategoryById(options);//根据ID查询分类
	}
});
//编辑分类
router.post("/admin/category/edit",function(req, res) {
	var options={
		id:req.body.id,//分类ID
		categoryCode:req.body.categoryCode,//分类代码
		categoryName:req.body.categoryName,//分类名称
	    callback:function(err,rows){
	    	if(Common.error(err,res)){
	    		res.redirect('/admin/category/list');
			}
	    }
	}
	CategoryModel.update(options);//编辑分类
});

router.get('/admin/category/view/:id', function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var options={
			id:req.params.id,//分类ID
		    callback:function(err,rows){
		    	if(Common.error(err,res)){
		    		res.render('admin/category/view', {title: '查看分类',layout:"admin/common/layout",category:rows[0],user:req.session.user,localMenu:localMenu});
				}
		    }
		}
		CategoryModel.getCategoryById(options);//根据ID查询分类
	}
});

//删除分类
router.delete('/admin/category/del/:id', function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var options={
			id:req.params.id,//分类ID
		    callback:function(err,rows){
		    	if(Common.error(err,res)){
		    		res.end(JSON.stringify({"status":"success"}));
		    		return;
				}
				res.end(JSON.stringify({"status":"error","msg":"分类删除失败！"}));
		    	return;
		    }
		}
		CategoryModel.del(options);//根据ID查询分类
	}
});


//多删
//router.route('/admin/article/del').get(function(req, res) {// 使用get方式也是只需配置前面的  localhost:3009/admin/article/del?ids=7
router.route('/admin/category/del').post(function(req, res) {
	// Common.authentication(req,res);
	//res.render('admin/article/add',{title: '文章添加',layout:"admin/common/layout",user:req.session.user});
	options={
		ids:req.body.ids,//post方式获取数据
		//id:req.query.ids,//get 方式获取数据
		callback:function(err,rows){
			if(Common.error(err,res)){
				res.end(JSON.stringify({"status":'success'}))
				return;
			}
			res.end(JSON.stringify({"status":'error',msg:"分类删除失败"}));
			return;
		}
	}
	//logger.log(req.url);//   /admin/article/del
	//logger.log(req.pathname);//undefined//  只指的 /index.html

	CategoryModel.delAll(options);


})
module.exports = router;
