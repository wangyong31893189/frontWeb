var express = require('express');
var router = express.Router();
var md5=require("md5");
var multiparty = require('multiparty');//实现头像图片上传模块
var util = require('util');//实现文件上传
var fs = require('fs');

var Common=require("../common/common");
var User=require("../../../models/user");
var Ldap=require("./ldap");
var logger = require("../../../conf/log4j").helper;

var UserAccount=require("../../../models/userAccount");//用户管理 account 表 继承baseDAO
var User_new=require("../../../models/user_new");//用户管理 user表 关联表 继承baseDAO
var Role = require("../../../models/role");
var Pager=require("../common/pager");


 /* GET home page. */
var localMenu="user";//定义全局变量  当前页面链接的关键字

router.get('/admin', function(req, res) {
   	if(Common.authentication({req:req,res:res,authUrl:"noverify"})){
   // res.render('admin/index', { title: '用户中心',layout:"admin/common/layout"});
   	    logger.log("跳转到个人信息页！");
   		res.redirect('/admin/user/info');
	}
});

router.route('/admin/login').get(function(req, res,next) {
	logger.log("跳转到登录页！");
 	res.render('admin/login', {title:'用户登录',layout:"admin/common/layout"});
 	//next();
}).post(function(req, res) {
	var userName=req.body.userName;
	if(!userName){
		logger.error("请输入用户名！");
		res.render('admin/login', { title: '用户登录',layout:"admin/common/layout",msg:"请输入用户名！"});
		return;
	}
	var password=req.body.password;
	if(!userName){
		logger.error("请输入密码！");
		res.render('admin/login', { title: '用户登录',layout:"admin/common/layout",msg:"请输入密码！"});
		return;
	}
	var user={
	    userName: userName,
	    password: md5(password),
	    callback:function(user,err){
	    	if(Common.error(err,res)){
	    		if(user){
	    			req.session.user = user;
	    			var referUrl=req.session.referUrl;
	    			if(referUrl){
	    				logger.debug("当前重定向URL="+referUrl);
	    				res.redirect(referUrl);
	    			}else{
	    				res.redirect('/admin/user/info');
	    			}
	    		}else{
	    			/*Ldap.login(req,res,function(err,rows){
	    				if(err){
	    					return res.render('admin/login', { title: '用户登录',layout:"admin/common/layout",msg:"用户名或密码不正确！"});
	    				}
	    				req.session.user = rows;
	    				res.redirect('/admin/category/list');
	    			});*/
					res.render('admin/login', { title: '用户登录',layout:"admin/common/layout",msg:"用户名或密码不正确！"});
	    			// return
	    		}
			}
	    }
	}
	User.login(user);
});

router.get('/admin/logout', function(req, res) {
 	req.session.user = null;
 	req.session.referUrl = null;
    res.redirect('/admin/login');
});

router.get('/admin/common/error', function(req, res) {
	res.render('admin/common/error', {title:"错误页面",message:"用户信息设置失败！"});
});


router.get('/admin/user/info',function(req, res) {
	if(Common.authentication({req:req,res:res,authUrl:"noverify"})){
		logger.log("跳转到个人信息设置页面！");
		var localMenu="user";
		var user=req.session.user;
		var options={
			userName:user.userName,
			callback:function(err,rows){
				var tempUser={};
				if(rows&&rows.length>0){
					tempUser=rows[0];
					tempUser.urls=user.urls;
				}
				if(Common.error(err,res)){
					res.render('admin/user/info', {title:"个人信息",layout:"admin/common/layout",user:tempUser,localMenu:localMenu});
				}
			}
		}
		User.query(options);
	}
}).post("/admin/user/info",function(req,res){//"",
	logger.log(">>>>>>>>/admin/user/info");
	//var options={
	//	userName:req.body.userName,
	//	nickName:req.body.nickName,
	//	realName:req.body.realName,
	//	email:req.body.email,
	//	picPath:req.body.picPath,
	//	userDesc:req.body.userDesc,
	//	birth:req.body.birth,
	//	sex:req.body.sex,
	//	province:req.body.province,
	//	city:req.body.city,
	//	district:req.body.district,
	//	address:req.body.address,
	//	callback:function(err,row) {
	//		logger.log("user update>>>>>>>>row");
	//		logger.log(row);
	//		if (Common.error(err, res)) {
	//			if (row && row.affectedRows == 1) {
	//				req.session.user = {
	//					userName: options.userName,
	//					nickName: options.nickName,
	//					picPath: options.picPath
	//				};
	//				res.end(JSON.stringify({"status": 'success'}))
	//				return;
	//			}
	//		}
	//		res.end(JSON.stringify({"status":'error',msg:'用户信息设置失败'}))
	//		return;
	//	}
	//}
	//User.update(options);//编辑分类

	//信息设置页面的数据通过multiparty插件获取  主要为了解决文件上传功能
	var form = new multiparty.Form({uploadDir: './public/files/'});//public下新建一个文件夹files
	//下载后处理
	logger.debug("post  >>>>> /admin/user/info");
	form.parse(req, function(err, fields, files) {

		var filesTmp = JSON.stringify(files,null,2);//获取inputFile对象

		if(err){
			logger.error('parse error: ' + err);
		} else {
			logger.info('parse files: ' + filesTmp);

			var inputFile = files.inputFile[0];
			//用户是否更改头像信息
			if(inputFile.originalFilename&& inputFile.originalFilename!=''){
				var uploadedPath = inputFile.path;//文件上传到服务器路径 编码后的文件名称
				logger.info("上传到服务器路径:"+uploadedPath);
				var dstPath = './public/files/' + inputFile.originalFilename;//实际地址和实际文件名
				//重命名为真实文件名
				fs.rename(uploadedPath, dstPath, function (err) {
					if (err) {
						logger.error('rename error: ' + err);
					} else {
						logger.log('rename ok');
					}
				});
				fields.picPath=['/files/'+inputFile.originalFilename]
			}else{
				fields.picPath=[req.session.user.picPath];
			}
			logger.log("表单页面数据fields："+JSON.stringify(fields));//获取提交页面表单所有数据
			var formData = JSON.stringify(fields).replace(/\[/g, '').replace(/\]/g, '');
			logger.log("formData:"+formData);
			var options = {
					form_data:JSON.parse(formData),
					callback:function (err, row) {
							logger.log("user update>>>>>>>>row");
							logger.log(row);
							if (Common.error(err, res)) {
								if (row && row.affectedRows == 1) {
									req.session.user = {
										userName: options.form_data.userName,
										nickName: options.form_data.nickName,
										picPath: options.form_data.picPath
									};
									logger.log("affectedRows == 1之后内容");
									logger.log(req.session.user);
									//res.end(JSON.stringify({"status": 'success'}))
									res.redirect("/admin/user/info");
									return;
								}

							}
							//用户信息设置失败！
							res.redirect('/admin/common/error');

					}
			}

			User.update(options);//编辑分类

		}
	})
})

//用户管理
router.get('/admin/user/list',function(req,res){
	if(Common.authentication({req:req,res:res})){
		var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		//

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
			//fields:['userName','content','tags']
			fields:['userName']
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
		//var userAccount=[{"id":1,"username":"sss"},{"id":2,"username":"eeee"}];
		UserAccount.getTotalNumber(keywords,function(result,err){//返回的数据总条数Number
			if(err){
				logger.error(err);
			}

			console.log(result);
			var totalRows=result;
			UserAccount.findAllLiteByPage(keywords,page,function(result,err){//返回查询当前页的所有数据对象
				var pagerResult=new Pager({href:"/admin/user/list",pageIndex:pageIndex,pageIndexName:"pageIndex",totalRows:totalRows,pageSize:15}).getPager();
				res.render('admin/user/list',{title:'用户列表',layout:"admin/common/layout",user:req.session.user,userAccount:result,keyword:keyword_val,pagerResult:pagerResult,localMenu:localMenu});

			})

		})


	}
});


//添加用户
router.route('/admin/user/add').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		logger.debug("转向到用户添加页！");
		//var localMenu="plugin";
		res.render('admin/user/add', {title: '用户添加',layout:"admin/common/layout",user:req.session.user,localMenu:localMenu});
	}
}).post(function(req,res){
	var user=req.session.user;

	var userAccountInfo={
		userName:req.body.userName,
		password:md5(req.body.password)

	};
    //
	UserAccount.add(userAccountInfo,function(result,err){
		/*logger.info(result);
		if(Common.error(err,res)){
			res.end(JSON.stringify({"status":'success'}))
			return;
		}
		res.end(JSON.stringify({"status":'error',msg:"添加用户失败"}));
		return;*/
		//表account添加成功后 给关联的表user添加数据
		var userInfo={
			accountId:result.insertId
		};
		User_new.add(userInfo,function(result,err){
			if(Common.error(err,res)){
				res.end(JSON.stringify({"status":'success'}))
				return;
			}
			res.end(JSON.stringify({"status":'error',msg:"添加用户失败"}));
			return;
		})
	})

	//var options={
	//	userName:req.body.userName,
	//	password:md5(req.body.password),
	//	callback:function(err,rows){
	//		if(Common.error(err,res)){
	//					res.end(JSON.stringify({"status":'success'}))
	//					return;
	//		}
	//		res.end(JSON.stringify({"status":'error',msg:"添加用户失败"}));
	//		return;
    //
	//	}
    //
	//}
	//User.addUser(options)
});

//查看用户
router.get('/admin/user/view/:id',function(req,res){
	if(Common.authentication({req:req,res:res})){
		logger.log("跳转至查看页面！");
		var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		var id=req.params.id;
		//UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,userName:"zz",password:"vv"}
		User_new.findOne_relational_table(id,function(result,err){//查询两个关联表的数据
			logger.log("result--------"+JSON.stringify(result));
			//if(result){
			//    res.render("admin/plugin/view",{title:"查看插件",layout:"admin/common/layout",user:req.session.user,plugin:result});
			//}
			if(Common.error(err,res)){
				res.render("admin/user/view",{title:"查看插件",layout:"admin/common/layout",user:req.session.user,userAccount:result[0],localMenu:localMenu});
				return;
			}
		});
	}
});

//分配角色
router.get("/admin/user/assign/:id",function(req,res){
	if(Common.authentication({req:req,res:res})){
		var id=req.params.id;
	    User_new.findOne_relational_table(id,function(result,err){
			if(Common.error(err,res)){
	            var user = result[0];
	            Role.findAll(function(result,err){
	                result = Array.prototype.slice.call(result);
	                result.unshift({id:-1,roleName:'暂不分配角色'});
	                res.render("admin/user/assign",{title:"分配角色",layout:"admin/common/layout",user:req.session.user,userAccount:user,roles:result,localMenu:localMenu});
	    			return;
	            });
			}
		});
	}
});

//更改密码
router.get("/admin/user/changePassword/:id",function(req,res){
	var localMenu="password";
	if(Common.authentication({req:req,res:res,authUrl:"noverify"})){
		logger.log("跳转至更改密码页面！");
		//var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		var id=req.params.id;
		UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,username:"zz",password:"vv"}
			logger.log("result--------");
			if(Common.error(err,res)){
				res.render("admin/user/changePassword",{title:"更改密码",layout:"admin/common/layout",user:req.session.user,userAccount:result,localMenu:localMenu});

			}
		});
	}
}).post("/admin/user/changePassword",function(req,res){
	//var localMenu="password";
	var id=req.body.id;
	console.log("编辑插件的id:"+id);
	var userName=req.body.userName;
	var password=md5(req.body.password);

	//var flag=false;//是否允许更改密码  //输入原始密码错误时，不允许更改密码
	UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,username:"zz",password:"vv"}
		logger.log("result--------"+result["password"]);
		if(Common.error(err,res)){
			if(result.password===password){//允许更改密码
				//logger.log("输入原始密码正确，允许更改密码！");
				//logger.log("新密码为："+password);
				var UserAccountInfo={
					userName:userName,
					password:md5(req.body.newPassword)
				}
				UserAccount.update(id,UserAccountInfo,function(result,err){
					logger.info("密码更改成功！");
					if(Common.error(err,res)){
						//res.redirect("/admin/user/list");
						res.end(JSON.stringify({"status":"success"}));
						return;
					}
					res.end(JSON.stringify({"status":'error',msg:"更改密码失败！"}));
					return;

				})

			}else{
				res.end(JSON.stringify({"status":'error',msg:"输入的原始密码不正确!"}));
				logger.log("原始密码不对");
				return ;
			}
		}
		//res.end(JSON.stringify({"status":'error',msg:"操作失败!"}));
		//return ;

	})

});

//重置密码
router.get("/admin/user/resetPass/:id",function(req,res){
	if(Common.authentication({req:req,res:res})){
		logger.log("跳转至更改密码页面！");
		var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		var id=req.params.id;
		UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,username:"zz",password:"vv"}
			logger.log("result--------");
			if(Common.error(err,res)){
				res.render("admin/user/resetPass",{title:"更改密码",layout:"admin/common/layout",user:req.session.user,userAccount:result,localMenu:localMenu});

			}
		});
	}
}).post("/admin/user/resetPass",function(req,res){

	var id=req.body.id;
	console.log("编辑插件的id:"+id);
	var userName=req.body.userName;
	var password=md5(req.body.password);

	//var flag=false;//是否允许更改密码  //输入原始密码错误时，不允许更改密码
	UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,username:"zz",password:"vv"}
		logger.log("result--------"+result["password"]);
		if(Common.error(err,res)){
			if(result.password===password){//允许更改密码
				//logger.log("输入原始密码正确，允许更改密码！");
				//logger.log("新密码为："+password);
				var UserAccountInfo={
					userName:userName,
					password:md5(req.body.newPassword)
				}
				UserAccount.update(id,UserAccountInfo,function(result,err){
					logger.info("密码更改成功！");
					if(Common.error(err,res)){
						//res.redirect("/admin/user/list");
						res.end(JSON.stringify({"status":"success"}));
						return;
					}
					res.end(JSON.stringify({"status":'error',msg:"更改密码失败！"}));
					return;

				})

			}else{
				res.end(JSON.stringify({"status":'error',msg:"输入的原始密码不正确!"}));
				logger.log("原始密码不对");
				return ;
			}
		}
		//res.end(JSON.stringify({"status":'error',msg:"操作失败!"}));
		//return ;

	})

});



//编辑用户
router.get("/admin/user/edit/:id",function(req,res){
	if(Common.authentication({req:req,res:res})){
		logger.log("跳转至编辑页面！");
		var localMenu="userAccount";//定义局部变量 获取当前链接的关键字
		var id=req.params.id;
		//UserAccount.findOne(id,function(result,err){//返回该条数据对象{id:1,username:"zz",password:"vv"}
		User_new.findOne_relational_table(id,function(result,err){ //查询两个关联表中的数据
			logger.log("result--------");
			if(Common.error(err,res)){
				res.render("admin/user/edit",{title:"用户编辑",layout:"admin/common/layout",user:req.session.user,userAccount:result[0],localMenu:localMenu});

			}
		});
	}
}).post("/admin/user/edit",function(req,res){

	//var id=req.body.id;
	//console.log("编辑插件的id:"+id);

	//信息设置页面的数据通过multiparty插件获取  主要为了解决文件上传功能
	var form = new multiparty.Form({uploadDir: './public/files/'});//public下新建一个文件夹files
	//下载后处理
	logger.debug("post  >>>>> /admin/user/info");
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);//获取inputFile对象

		if(err){
			logger.error('parse error: ' + err);
		} else {
			logger.info('parse files: ' + filesTmp);

			var inputFile = files.inputFile[0];
			//用户是否更改头像信息
			if(inputFile.originalFilename&& inputFile.originalFilename!=''){
				var uploadedPath = inputFile.path;//文件上传到服务器路径 编码后的文件名称
				logger.info("上传到服务器路径:"+uploadedPath);
				var dstPath = './public/files/' + inputFile.originalFilename;//实际地址和实际文件名
				//重命名为真实文件名
				fs.rename(uploadedPath, dstPath, function (err) {
					if (err) {
						logger.error('rename error: ' + err);
					} else {
						logger.log('rename ok');
					}
				});
				fields.picPath=['/files/'+inputFile.originalFilename]
			}else{
				fields.picPath=[req.session.user.picPath];
			}
			logger.log("表单页面数据fields："+JSON.stringify(fields));//获取提交页面表单所有数据
			var formData = JSON.stringify(fields).replace(/\[/g, '').replace(/\]/g, '');
			logger.log("formData:"+formData);

			var UserAccountInfo=JSON.parse(formData);;
			console.log("UserAccountInfo内容为：");
			console.log(UserAccountInfo);
			//console.log(UserAccountInfo.id);



			//需要修改关联表里的数据
			//UserAccount.update(id,UserAccountInfo,function(result,err){
			User_new.update_relational_table(UserAccountInfo,function(result,err){
				logger.info("编辑用户信息成功！");
				if(Common.error(err,res)){

						//if (result && result.changedRows == 1) {
							//req.session.user = {
							//	userName: UserAccountInfo.userName,
							//	nickName: UserAccountInfo.nickName,
							//	picPath: UserAccountInfo.picPath
							//};//这里不需要
							logger.log("affectedRows == 1之后内容");
							//logger.log(req.session.user);
							//res.end(JSON.stringify({"status": 'success'}))
							res.redirect("/admin/user/list");
							return;

						//}
				}
				//用户信息设置失败！
				res.redirect('/admin/common/error');

			})

		}
	})


});


//删除用户 单删
router.route("/admin/user/del/:id").get(function(req,res){
	if(Common.authentication({req:req,res:res})){
		logger.log("跳转至删除页面！");
		var id= req.params.id;//ID
		User_new.remove_relational_table(id,function(result,err){
			if(Common.error(err,res)){
				res.end(JSON.stringify({"status":"success"}));
				return;
			}
			res.end(JSON.stringify({"status":'error',msg:"用户删除失败"}));
			return;
		});
	}
})

//删除用户 多删
router.route("/admin/user/del").post(function(req, res) {
	//Common.authentication({req:req,res:res})
	logger.log("跳转至（多）删除页面！");

	var ids=req.body.ids;
	logger.log(ids);

	User_new.batchRemove_relational_table(ids,function(result,err){
		if(Common.error(err,res)){
			res.end(JSON.stringify({"status":"success"}));
			return;
		}
		res.end(JSON.stringify({"status":'error',msg:"文章删除（多删）失败"}));
		return;
	});//删除插件
});



module.exports = router;
