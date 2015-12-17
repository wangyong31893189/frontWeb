var logger = require("../../../conf/log4j").helper;
var URL = require('url');
var Common={
	error:function(err,res,msg,ajax){
		if(err){
			logger.error("common.js----->>error----->>"+err);
			// res.redirect('/admin/error');
			if(!msg){
				msg="出错了";
			}
			//var error={message:err};
			if(ajax&&ajax==true){
	        	return false;
	    	}else{
				res.render('admin/common/error', {title:"出错了",layout:"admin/common/layout",message:err});
			}
			return false;
		}else{
			return true;
		}
	},authentication:function (options) {
		var req=options.req, res=options.res,ajax=options.ajax,authUrl=options.authUrl;
		var user=req.session.user;
		var p = URL.parse(req.url);
	    if (!user) {
	    	//req.session.error='请先登录!';
	    	var href=p.href;
	    	req.session.referUrl=href;
	    	logger.error("还未登录，请先登录!");
	    	if(ajax&&ajax==true){
	        	return false;
	    	}else{
	        	return res.redirect('/admin/login');
	    	}
	    }else {
			logger.info("common.js----->>>>authentication---->>>start!");
			if(!authUrl){
				authUrl="verify";
			}
			if(authUrl!=="noverify"){
				var urls=user.urls;
				if(urls){
					var pathname=p.pathname;
					var flag=false;
					for (var i in urls) {
						var url=urls[i];
						if(pathname.indexOf(url)>=0){
							flag=true;
							break;
						}
					}
					if(!flag){
						res.render('admin/common/error', {title:"链接无权限",layout:"admin/common/layout",message:"当前url{"+pathname+"},没有访问权限，请联系管理员！"});
						return false;
					}
				}
			}
			logger.info("common.js----->>>>authentication---->>>success!");
			return true;
		}
	}
}

module.exports=Common;