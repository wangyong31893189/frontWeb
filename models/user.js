var pool=require("./pool");//引入连接池模块
var logger = require("../conf/log4j").helper;

//
var BaseDAO = require('./baseDAO');
var logger = require('../conf/log4j').helper;
var SQLStringUtil = require('../utils/sqlStringUtil');
/*
var User={
	findAll:function(options){
		var sql="select * from user order by updateTime desc";
	      //直接使用
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql, function(err, rows) {
	         	if(err){
	           		logger.error("user.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("user.js>>>>>>>>>findAll>>>>>>>>>"+JSON.stringify(rows));
	          	if(options.callback){
	        		options.callback(err,rows);
	      		}
	          // And done with the connection.
	          connection.release();
	          // Don't use the connection here, it has been returned to the pool.
	        });
	        logger.debug(query.sql);
	    });
	},
	login:function(options){
		var sql="select a.userName,a.password,u.realName,u.picPath,u.id,u.website,u.nickName,u.email,u.userDesc,date_format(u.birth,'%Y%m%d') as birth,u.sex,u.province,u.city,u.district ,u.address from account a left JOIN user u on a.id=u.accountId where  a.userName=? and a.password=? ";
	    var params=[options.userName,options.password];
	    logger.debug("user.js>>>>>>>>>login>>>>>>>>>传入参数为："+JSON.stringify(params));
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql,params,function(err, rows) {
	         	if(err){
	            	logger.error("user.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("user.js>>>>>>>>>login>>>>>>>>>"+JSON.stringify(rows));

	          	var user={};
	          	if(rows&&rows.length>0){
	          		user=rows[0];
	          	}
	          	var rolesql="select ua.url,ua.`code` from role r,role_action ra,url_action ua where r.id=ra.roleId and ra.actionId=ua.id and r.id=?";
				connection.query(rolesql,[user.roleId],function(err1, rows1) {
					if(err1){
						logger.error("user.js>>>>>query roles >>>>"+err1);
					}

					if(options.callback){
						if(rows1&&rows1.length>0){
							user.actions=rows1;
						}
						logger.debug("user.js>>>>>query roles >>>>"+JSON.stringify(user));
		        		options.callback(err1,user);
		      		}
					// And done with the connection.
		          	connection.release();
		          	// Don't use the connection here, it has been returned to the pool.
				});
	        });
	        logger.debug(query.sql);
	    });
	},
	query:function(options){
		var sql="select a.userName,a.password,u.realName,u.picPath,u.website,u.nickName,u.email,u.userDesc,date_format(u.birth,'%Y-%m-%d') as birth,u.sex,u.province,u.city,u.district,u.address from account a left JOIN user u on a.id=u.accountId where  a.userName=? ";
		var params=[options.userName];
		logger.debug("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(params));
		pool.getConnection(function(err, connection) {
			// Use the connection
			var query=connection.query(sql,params,function(err, rows) {
				if(err){
					logger.error("user.js>>>>>>>>>"+err);
				}
				logger.debug("user.js>>>>>>>>>query>>>>>>>>>"+JSON.stringify(rows));
				if(options.callback){
					options.callback(err,rows);
				}
				// And done with the connection.
				connection.release();
				// Don't use the connection here, it has been returned to the pool.
			});
			logger.debug(query.sql);
		});
	},
	update:function(options){
		//console.log("options.formData>>>>>>>");
		//console.log(options.form_data);
		var sql="update user u, account a set u.realName=?,u.nickName=?,u.picPath=?,u.email=?,u.userDesc=?,u.birth=?,u.sex=?,u.province=?,u.city=?,u.district=?,u.address=?,u.website=? where a.userName=? and a.id=u.accountId";
		//"update student s, city c
		//set s.city_name = c.name
		//where s.city_code = c.code;"
		var params=[options.form_data.realName,options.form_data.nickName,options.form_data.picPath,options.form_data.email,options.form_data.userDesc,options.form_data.birth,options.form_data.sex,options.form_data.province,options.form_data.city,options.form_data.district,options.form_data.address,options.form_data.website,options.form_data.userName];
		pool.getConnection(function(err,connection){
			var query=connection.query(sql,params,function(err,rows){
				if(err){
					logger.error('user.js>>>>>>>update>>>>>>>'+err);
				}
				logger.debug("user.js>>>>>>>update>>>>>>>"+JSON.stringify(rows));
				//if(rows&&rows.affectedRows==1){
				//	var optionstmp=options;
				//	that.query(optionstmp);
				//}



				if(options.callback){
					options.callback(err,rows);
				}
				connection.release();
			})
			logger.debug(query.sql);
		})
	},
	**添加用户   用户名，密码，邮箱**
	addUser:function(options){
		var sql="insert into account set userName=?,password=?";
		var params=[options.userName,options.password];
		console.log("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(params));
		pool.getConnection(function(err, connection) {
			// Use the connection
			var query=connection.query(sql,params,function(err, rows) {
				if(err){
					console.log("user.js>>>>>>>>>"+err);
					return;
				}
				console.log("user.js>>>>>>>>>addUser>>>>>>>>>"+JSON.stringify(rows));
				var opts=[rows.insertId,
					options.email,
					options.realName];//yuanlai

				var sql="insert into user set accountId=?,email=?,realName=?";

				console.log("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(opts));
				pool.getConnection(function(err, connection) {
					// Use the connection
					var query=connection.query(sql,opts,function(err, rows) {
						if(err){
							console.log("user.js>>>>>>>>>"+err);
							return;
						}
						console.log("user.js>>>>>>>>>addUser>>>>>>>>>"+JSON.stringify(rows));
						});
						console.log(query.sql);
					if (options.callback) {
						options.callback(err, rows);
					}
				});
				// And done with the connection.
				connection.release();
				// Don't use the connection here, it has been returned to the pool.
			});
			console.log(query.sql);
		});
	},
	addUserAccount:function(options){
		var sql="insert into account set userName=?,password=?";
		var params=[options.userName,options.password];
		console.log("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(params));
		pool.getConnection(function(err, connection) {
			// Use the connection
			var query=connection.query(sql,params,function(err, rows) {
				if(err){
					console.log("user.js>>>>>>>>>"+err);
					return;
				}
				console.log("user.js>>>>>>>>>addUser>>>>>>>>>"+JSON.stringify(rows));
				//var opts=[rows.insertId,
				//	options.email,
				//	options.realName];//yuanlai
				var opts=[rows.insertId
				];
				//var sql="insert into user set accountId=?,email=?,realName=?";
				var sql="insert into user set accountId=?";
				console.log("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(opts));
				//pool.getConnection(function(err, connection) {
				//	// Use the connection
				//	var query=connection.query(sql,opts,function(err, rows) {
				//		if(err){
				//			console.log("user.js>>>>>>>>>"+err);
				//			return;
				//		}
				//		console.log("user.js>>>>>>>>>addUser>>>>>>>>>"+JSON.stringify(rows));
				//	});
				//	console.log(query.sql);
				//	if (options.callback) {
				//		options.callback(err, rows);
				//	}
				//});
				// And done with the connection.
				if (options.callback) {
							options.callback(err, rows);
				}
				connection.release();
				// Don't use the connection here, it has been returned to the pool.
			});
			console.log(query.sql);
		});
	},
    find:function(options,callback){
        var sql="select ? from user";
        var fields = options.join(",");
        sql = sql.replace('?',fields);
	      //直接使用
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql, function(err, rows) {
	         	if(err){
	           		logger.error("user.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("user.js>>>>>>>>>find>>>>>>>>>"+JSON.stringify(rows));
	          	if(callback){
	        		callback(err,rows);
	      		}
	          // And done with the connection.
	          connection.release();
	          // Don't use the connection here, it has been returned to the pool.
	        });
	        logger.debug(query.sql);
	    });
    }
};*/

function User(){
	this.findAll=function(options){
	    var sql = 'select * from '+this.table;
        var sortStr = SQLStringUtil.sortSQL({updateTime:'DESC'});
        sql = sql + sortStr + limitStr;
		logger.debug(sql);
        this.executeSQL(sql,options.callback);
	};
	this.login=function(options){
		var sql="select $columns from account a left JOIN user u on a.id=u.accountId where $conditions ";
	    var columns=["a.userName","a.password","u.realName","u.picPath","u.roleId","u.id","u.website","u.nickName","u.email","u.userDesc","date_format(u.birth,'%Y%m%d') as birth","u.sex","u.province","u.city","u.district" ,"u.address"];
	    var conditions=[{key:"a.userName",opt:"=",value:options.userName},{key:"a.password",opt:"=",value:options.password}];
	    logger.debug("user.js--->>>login---->>>>>>"+sql);
	    var that=this;
        that.executeSQLParams(sql,columns,conditions,function(rows,err){
        	if(err){
            	logger.error("user.js--->>>>>login---->>>>"+err);
          	}
        	var user={};
          	if(rows&&rows.length>0){
          		user=rows[0];
          		user.urls={};
          	}else{
          		if(options.callback){
          			options.callback(null,err);
          		}
          		return;
          	}
          	var urlSql="select $columns from role r,role_action ra,url_action ua where r.id=ra.roleId and ra.actionId=ua.id and $conditions";
          	var urlColumns=["ua.url","ua.`code`"];
          	var urlConditions=[{key:"r.id",opt:"=",value:user.roleId}];
          	that.executeSQLParams(urlSql,urlColumns,urlConditions,function(rows1,err1){
          		if(options.callback){
					if(rows1&&rows1.length>0){
						var length=rows1.length;
						var urls={};
						for (var i =0; i <length; i++) {
							var code=rows1[i].code;
							var url=rows1[i].url;
							urls[code]=url;
						}
						user.urls=urls;
					}
					logger.debug("user.js>>>>>query roles >>>>"+JSON.stringify(user));
	        		options.callback(user,err1);
	      		}
	      		return;
          	});
        });
	};
	this.query=function(options){
		var sql="select $columns from account a left JOIN user u on a.id=u.accountId where $conditions ";
	    var columns=["a.userName","a.password","u.realName","u.picPath","u.id","u.website","u.nickName","u.email","u.userDesc","date_format(u.birth,'%Y%m%d') as birth","u.sex","u.province","u.city","u.district" ,"u.address"];
	    var conditions=[{key:"a.userName",opt:"=",value:options.userName}];
	    logger.debug("user.js--->>>query---->>>>>>"+sql);
	    var that=this;
        that.executeSQLParams(sql,columns,conditions,function(rows,err){
        	if(err){
            	logger.error("user.js--->>>>>query---->>>>"+err);
          	}
        	if(options.callback){
				options.callback(err,rows);
			}
        });
	};
	this.update=function(options){
		var sql="update user u, account a set u.realName=?,u.nickName=?,u.picPath=?,u.email=?,u.userDesc=?,u.birth=?,u.sex=?,u.province=?,u.city=?,u.district=?,u.address=?,u.website=? where a.userName=? and a.id=u.accountId";
	    var params=[options.form_data.realName,options.form_data.nickName,options.form_data.picPath,options.form_data.email,options.form_data.userDesc,options.form_data.birth,options.form_data.sex,options.form_data.province,options.form_data.city,options.form_data.district,options.form_data.address,options.form_data.website,options.form_data.userName];
	    logger.debug("user.js--->>>update---->>>>>>"+sql);
	    var that=this;
        that.executeParamsSQL(sql,params,function(rows,err){
        	if(err){
            	logger.error("user.js--->>>>>update---->>>>"+err);
          	}
        	if(options.callback){
				options.callback(err,rows);
			}
        });
	};
	/**添加用户   用户名，密码，邮箱**/
	this.addUser=function(options){
		var sql="insert into account set userName=?,password=?";
		var params=[options.userName,options.password];
		logger.debug("user.js--->>>addUser---->>>>>>"+sql);
	    var that=this;
        that.executeParamsSQL(sql,params,function(rows,err){
        	if(err){
            	logger.error("user.js--->>>>>addUser---->>>>"+err);
          	}
          	var opts=[rows.insertId,
					options.email,
					options.realName];//yuanlai

          	var userSql="insert into user set accountId=?,email=?,realName=?";
			logger.debug("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(opts));
			that.executeParamsSQL(userSql,opts,function(rows1,err1){
				if(err){
					logger.error("user.js>>>>>>>>>"+err1);
					if(options.callback){
						options.callback(err1,rows1);
					}
					return;
				}
			});
        });
	};
	this.addUserAccount=function(options){
		var sql="insert into account set userName=?,password=?";
		var params=[options.userName,options.password];
		logger.debug("user.js--->>>addUser---->>>>>>"+sql);
	    var that=this;
        that.executeParamsSQL(sql,params,function(rows,err){
        	if(err){
            	logger.error("user.js--->>>>>addUser---->>>>"+err);
            	if(options.callback){
					options.callback(err1,rows1);
				}
				return;
          	}
          	var opts=[rows.insertId];//yuanlai

          	var userSql="insert into user set accountId=?";
			logger.debug("user.js>>>>>>>>>query>>>>>>>>>传入参数为："+JSON.stringify(opts));
			that.executeParamsSQL(userSql,opts,function(rows1,err1){
				if(err){
					logger.error("user.js>>>>>>>>>"+err1);
					if(options.callback){
						options.callback(err1,rows1);
					}
					return;
				}
				if(options.callback){
					options.callback(err1,rows1);
				}
			});
        });
	},
    this.find=function(options,callback){
        that.query(options,[],callback);
    }
}

User.prototype = new BaseDAO('user');
User.prototype.constructor = User;

var user = new User();

module.exports=user;