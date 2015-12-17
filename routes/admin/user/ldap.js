var ldap = require('ldapjs');
var ldapCon = require('../../../conf/ldapCon');
var logger = require("../../../conf/log4j").helper;
var User=require("../../../models/user");
var md5=require("md5");

function login(request,response,callback){
	var username=request.body.userName;
	var password=request.body.password;

	logger.log("用户名为="+username+",password="+password);
	var client = ldap.createClient({
	  url: ldapCon.protocal+ldapCon.server+":"+ldapCon.port
	});

	var opts = {
	 filter: ldapCon.filter+username, //查询条件过滤器，查找uid=kxh的用户节点
	 scope: 'sub',    //查询范围
	 timeLimit: 500    //查询超时
	};

	//将client绑定LDAP Server
	//第一个参数：是用户，必须是从根节点到用户节点的全路径
	//第二个参数：用户密码
	//var path="CN=勇 王,OU=技术架构,OU=技术研发部,OU=技术平台,OU=user1,DC=99wuxian,DC=com";
	// var path="OU=user1,DC=99wuxian,DC=com";
	client.bind(ldapCon.userBase,ldapCon.password, function (err, res) {
	  logger.log("err="+err+",res="+res);
	  if(err){
	    	return redirectLogin(response);
	  }
	  //开始查询0
	  //第一个参数：查询基础路径，代表在查询用户信心将在这个路径下进行，这个路径是由根节开始
	  //第二个参数：查询选项
	  client.search(ldapCon.searchBase, opts, function (err2, res2) {
	    //logger.log("err2="+err2+",res2="+JSON.stringify(res2));
	    if(err2){
	    	return redirectLogin(response);
	    }
	    var user=null;
	    //查询结果事件响应
	    res2.on('searchEntry', function (entry) {
	      	// logger.log(entry);
	     	//获取查询的对象
	      	user = entry.object;
	      	//var userText = JSON.stringify(user,null,2);
	      	// logger.log(userText);
	      	logger.log(user.dn);
	    });

	    res2.on('searchReference', function(referral) {
	      logger.log('referral: ' + referral.uris.join());
	    });

	    //查询错误事件
	    res2.on('error', function(err) {
	      logger.error('error: ' + err.message);
	      //unbind操作，必须要做
	      client.unbind();
	    });

	    //查询结束
	    res2.on('end', function(result) {
	      	logger.log('search status: ' + result.status);
		    if (user) {
	            if(user.dn){
		      		var client1 = ldap.createClient({
					  url: ldapCon.protocal+ldapCon.server+":"+ldapCon.port
					});
		      		client1.bind(user.dn,password, function (err3, res3) {
      					//var options={userName:username,password:md5(password),email:user.mail,realName:user.name};
		      			/*if(callback){
	      					callback(err3,options);
	      				}*/
	      				/*if(err){
	      					logger.error(err);
	      					return;
	      				}*/
		      			// User.addUser(opts);
		      			client1.search(ldapCon.searchBase, opts, function (err4, res4) {
						    //logger.log("err2="+err2+",res2="+JSON.stringify(res2));
						    //查询结果事件响应
						    var realUser=null;
						    res4.on('searchEntry', function (entry) {
						    	// logger.info(entry);
						    	realUser = entry.object;
						    });

						    res4.on('searchReference', function(referral) {
						      logger.log('referral: ' + referral.uris.join());
						    });

						    //查询错误事件
						    res4.on('error', function(err) {
						      logger.error('error: ' + err.message);
						      //unbind操作，必须要做
						      client.unbind();
						      return redirectLogin(response);
						    });

						    res4.on("end",function(result){
						    	logger.log('search status: ' + result.status);
						    	if(realUser){
							    	var options={userName:username,password:md5(password),email:realUser.mail,realName:realUser.name};
					      			if(callback){
				      					callback(err,options);
				      				}
					      			User.addUser(options);
				      			}else{
				      				return redirectLogin(response);
				      			}
						    });
						});
		      		});
		  		}
	        }else {
	            return redirectLogin(response);
	        }

	      //unbind操作，必须要做
	      client.unbind();
	    });

	  });

	});
}

function redirectLogin(res){
	res.render('admin/login', { title: '用户登录',layout:"admin/common/layout",msg:"用户名或密码不正确！"});
}

module.exports={login:login};