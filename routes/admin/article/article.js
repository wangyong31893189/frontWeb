var express = require('express');
var router = express.Router();
var path = require("path"); //引入path模块
var formidable = require('formidable');
var fs = require('fs');//文件处理
var ARTICLE_UPLOAD_FOLDER="/upload/article/";//文章图片存放路径
var gm = require('gm');
var Common=require('../common/common');
var Article=require("../../../models/article");
var CategoryModel=require("../../../models/category");
var Pager=require("../common/pager");
var logger = require("../../../conf/log4j").helper;

 /* GET home page. */
var localMenu="article";//定义全局变量  当前页面链接的关键字
router.get('/admin/article/list', function(req, res) {
	if(Common.authentication({req:req,res:res})){
		logger.info('跳转至文章列表页面！');
		//var localMenu="article";
		CategoryModel.findAll({callback:function(err,categorys){
			if(err){
				logger.error("查询分类信息出错！"+err);
			}
			var categoryCode=req.query.categoryCode;
			var keyword=req.query.keyword;
			var options={
				pageIndex:req.query.pageIndex,
				pageSize:req.query.pageSize,
				keyword:keyword,
				categoryCode:categoryCode,
				callback:function(err,result){
					var pagerResult=new Pager({href:'/admin/article/list?categoryCode='+categoryCode+'&keyword='+keyword,pageIndex:result.pageIndex,pageIndexName:"pageIndex",totalRows:result.totalCount,pageSize:15}).getPager();
					res.render('admin/article/list', { title: '文章列表',layout:"admin/common/layout",categorys:categorys,articles:result.rows,pagerResult:pagerResult,user:req.session.user,keyword:keyword,categoryCode:categoryCode,localMenu:localMenu});
				}
			}
			Article.findByPage(options);
		}});
		//Article.findById(options);
	};


});



//发布文章   //通过 文章分类字段的数据来自category的数据，即所有（id）的分类，不能通过list分页来取得数据，因为只是取到当前页面的数据，不完整
//router.get('/admin/article/add', function(req, res) {
router.route('/admin/article/add').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		logger.info('跳转至文章添加页面！');

		var options={callback:function(err,rows){
			res.render('admin/article/add',{title: '文章添加',categorys:rows,user:req.session.user,localMenu:localMenu});
		}};
		CategoryModel.findAll(options);//查出所有的分类列表


		//单纯的显示页面 不需要categroy的数据
		//res.render('admin/article/add',{title: '文章添加',layout:"admin/common/layout",categorys:rows,user:req.session.user});
		//Article.findById(options);
	}
}).post(function(req,res){
	var date=new Date();
    //var time=date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+"";
    var time=date.getTime();
	var form = new formidable.IncomingForm();   //文件上传表单中间件
    form.encoding = 'utf-8';        //编码
    form.uploadDir = 'public' + ARTICLE_UPLOAD_FOLDER;    //上传目录
    form.keepExtensions = true;  //是否需要后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    //logger.log("req.files====="+req.files);
    //logger.log("req.body====="+JSON.stringify(req.body));
    var user=req.session.user;
    form.parse(req, function(err, fields, files) {
        if (err) {
            // res.locals.error = err;
            logger.error("error---------------"+err);
            //res.render('admin/article/add', { title: TITLE });
            //res.end('{"success":0,"message":"文件上传失败！"}');//文件上传失败
            //return;
        }
        var inputFile = files['articlePic'];
        var articlePicShow=fields.articlePicShow;
        var picPath="";
        if(articlePicShow){
	        var extName = '';  //文件扩展名
	        switch (inputFile.type) {
	            case 'image/pjpeg':
	                extName = 'jpg';
	                break;
	            case 'image/jpeg':
	                extName = 'jpg';
	                break;
	            case 'image/png':
	                extName = 'png';
	                break;
	            case 'image/x-png':
	                extName = 'png';
	                break;
	        }

	        var fileName=time+ '.' + extName;
	        var newPath = form.uploadDir +fileName;
	        picPath=ARTICLE_UPLOAD_FOLDER+fileName;
	        logger.debug(picPath);
	        fs.renameSync(inputFile.path, newPath);  //重命名文件

	        logger.debug("文件保存成功！");
	        var thumbnailPath=form.uploadDir+"thumbnail/"+fileName;
	        generatePic(path.resolve(newPath),path.resolve(thumbnailPath));
	        /*var thumbnailPath=form.uploadDir+"/thumbnail/"+fileName;
	        //生成缩略图
	        imageMagick(newPath)
		    .resize(280, 150, '!') //加('!')强行把图片缩放成对应尺寸280*150！
		    .autoOrient()
		    .write(thumbnailPath, function(err){
		      if (err) {
		        logger.log(err);
		        //res.end();
		      }
		      fs.unlink(path, function() {
		        return res.end('3');
		      });
		    });*/
    	}
        var categorys=fields.categoryName.split("|||");
		var options={
			//articleCode:req.body.articleCode,
			// author:fields.author,
			articleCode:"article_"+time,
			title:fields.title,
			categoryName:categorys[1],
			categoryCode:categorys[0],
			content:fields.content,
			articlePic:picPath,
			//author:user.userName,
			author:fields.author,
			callback:function(err,rows){
				//res.render('admin/article/list', { title: '文章列表',layout:"admin/common/layout",articles:result});
				if(err){
					logger.error("error"+err);
					//res.end(JSON.stringify({"status":"error","msg":"分类文章添加失败！"}));
					//return;
				}
				// res.end(JSON.stringify({"status":"success"}));
				res.redirect("/admin/article/list");
				return;
			}
		};
		logger.info("article post success!");
		Article.add(options);
    });
});

function generatePic(oldPath,thumbnailPath){
	var imageMagick = gm.subClass({ imageMagick : true });
	var dir = path.dirname(thumbnailPath);
	if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    //生成缩略图
    imageMagick(oldPath)
    .resize(280, 150,"!") //加('!')强行把图片缩放成对应尺寸280*150！
    .autoOrient()
    .write(thumbnailPath, function(err){
    	logger.debug("测试==="+oldPath+"--------"+thumbnailPath);  //报错的话 记得要先建立好缩略图的文件目录
      if (err) {
        logger.error(err);
        //res.end();
      }
      /*fs.unlink(path, function() {
        return res.end('3');
      });*/
    });
}

//删除文章 通过ajax方式
//http://localhost:3000/admin/article/del/7   id直接写在后面
router.route('/admin/article/del/:id').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		//res.render('admin/article/add',{title: '文章添加',layout:"admin/common/layout",user:req.session.user});
		options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
					res.end(JSON.stringify({"status":'success'}))
					return;
				}
				res.end(JSON.stringify({"status":'error',msg:"文章删除失败"}));
				return;
			}
		}
		Article.del(options);
	}
});

//多删
//router.route('/admin/article/del').get(function(req, res) {// 使用get方式也是只需配置前面的  localhost:3009/admin/article/del?ids=7
router.route('/admin/article/del').post(function(req, res) {
	//Common.authentication(req,res);
	//res.render('admin/article/add',{title: '文章添加',layout:"admin/common/layout",user:req.session.user});
	options={
		ids:req.body.ids,//post方式获取数据
		//id:req.query.ids,//get 方式获取数据
		callback:function(err,rows){
			if(Common.error(err,res)){
				res.end(JSON.stringify({"status":'success'}))
				return;
			}
			res.end(JSON.stringify({"status":'error',msg:"文章删除失败"}));
			return;
		}
	}
	//logger.log(req.url);//   /admin/article/del
	//logger.log(req.pathname);//undefined//  只指的 /index.html

	Article.delAll(options);


})

//查看文章
router.route('/admin/article/view/:id').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		//res.render('admin/article/add',{title: '文章添加',layout:"admin/common/layout",user:req.session.user});
		var options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
				//	res.end(JSON.stringify({"status":'success'}))
				//	return;
				var article=rows[0];//查询的文章的信息
					logger.debug("当前是查看文章+"+req.params.id);
					res.render("admin/article/view",{title:"查看文章",article:article,user:req.session.user,localMenu:localMenu});
				}

			}
		}
		Article.getArticleById(options);
	}
})
//
//编辑文章  //这里
//localhost:3000/admin/article/edit/6
router.get("/admin/article/edit/:id",function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
					var article=rows[0];//查询的文章的信息
					logger.debug("article");
					logger.debug(article);
					var options1={
						callback:function(err,rows){//查询的分类的信息
							res.render('admin/article/edit',{title: '文章编辑',user:req.session.user,article:article,categorys:rows,localMenu:localMenu});
						}
					}
					CategoryModel.findAll(options1);
					//res.render('admin/article/edit',{title: '文章编辑',layout:"admin/common/layout",user:req.session.user,article:rows[0],categorys:rows});
				}
			}
		}
		Article.getArticleById(options);
	}
}).post("/admin/article/edit",function(req,res){//这里注意该post的路径和get进来时的不一样，所以要重写一次路径
	logger.debug("-----------------edit"+req.body.isEditPic);
	//if(req.body.isEditPic){
		var date=new Date();
	    var time=date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate();
		var form = new formidable.IncomingForm();   //文件上传表单中间件
	    form.encoding = 'utf-8';        //编码
	    form.uploadDir = 'public' + ARTICLE_UPLOAD_FOLDER;    //上传目录
	    form.keepExtensions = true;  //是否需要后缀
	    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

	    //logger.log("req.files====="+req.files);
	    //logger.log("req.body====="+JSON.stringify(req.body));

	    var user=req.session.user;
	    form.parse(req, function(err, fields, files) {
	        if (err) {
	            // res.locals.error = err;
	            logger.error("error---------------"+err);
	            //res.render('admin/article/add', { title: TITLE });
	            //res.end('{"success":0,"message":"文件上传失败！"}');//文件上传失败
	            //return;
	        }
	        var inputFile = files['articlePic'];
	        var isEditPic=false;
	        var articlePicShow=fields.articlePicShow;
	        var articlePicPath=fields.articlePicPath;
	        if(articlePicShow!=articlePicPath){
	        	isEditPic=true;
	        }
	        logger.debug("isEditPic--------"+isEditPic);
	        // logger.log("fields--------"+JSON.stringify(fields)+"------------------------------------------");
	        var picPath="";
	        if(isEditPic){
		        var extName = '';  //文件扩展名
		        switch (inputFile.type) {
		            case 'image/pjpeg':
		                extName = 'jpg';
		                break;
		            case 'image/jpeg':
		                extName = 'jpg';
		                break;
		            case 'image/png':
		                extName = 'png';
		                break;
		            case 'image/x-png':
		                extName = 'png';
		                break;
		        }
		        var fileName=date.getTime()+ '.' + extName;
		        var newPath = form.uploadDir +fileName;
		        picPath=ARTICLE_UPLOAD_FOLDER+fileName;
		        logger.debug(picPath);
		        fs.renameSync(inputFile.path, newPath);  //重命名文件
		        logger.debug("文件保存成功！");
		        var thumbnailPath=form.uploadDir+"thumbnail/"+fileName;
	        	generatePic(path.resolve(newPath),path.resolve(thumbnailPath));
	    	}else{
	    		picPath=fields.articlePicPath;
	    	}
	        var categorys=fields.categoryName.split("|||");
			var options={
				//articleCode:req.body.articleCode,
				// author:fields.author,
				// articleCode:user.userName+time,
				id:fields.id,
				title:fields.title,
				categoryName:categorys[1],
				categoryCode:categorys[0],
				content:fields.content,
				articlePic:picPath,
				//author:user.userName,
				author:fields.userName,
				callback:function(err,rows){
					//res.render('admin/article/list', { title: '文章列表',layout:"admin/common/layout",articles:result});
					if(err){
						logger.error("error"+err);
						//res.end(JSON.stringify({"status":"error","msg":"分类文章添加失败！"}));
						//return;
					}
					// res.end(JSON.stringify({"status":"success"}));
					res.redirect("/admin/article/list");
					return;
				}
			};
			logger.info("article post update success!");
			Article.update(options);
	    });
});

//审核文章
router.post("/admin/article/verfiy",function(req,res,next){
	if(!Common.authentication(req,res,true)){
		return res.end("{'status':'login'}");
	}
	var status=req.body.status;
	var options={
		id:req.body.id,
		status:status
	}
	var callback=function(err,rows){
		logger.debug("article------>"+JSON.stringify(rows)+",err="+err);
		if(Common.error(err,res)){
			//var article=rows[0];//查询的文章的信息
			//res.redirect("/admin/article/list");
			logger.debug("verfiy----success!id="+req.body.id+",status="+status);
			return res.end(JSON.stringify({'status':'success'}));
			//res.render('admin/article/edit',{title: '文章编辑',layout:"admin/common/layout",user:req.session.user,article:rows[0],categorys:rows});
		}else{
			return res.end(JSON.stringify({'status':'error'}));
		}
	};
	if(status==1){
		Article.verifyEnable(options,callback);
	}else if(status==2){
		Article.verifyDisable(options,callback);
	}
});

module.exports = router;

