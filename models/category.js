var pool=require("./pool");//引入连接池模块
var logger = require("../conf/log4j").helper;
var Category={
	findAllCount:function(options){//查询总数
		var sql=["select count(id) as count from category where isDelete=0 "];
		var params=[];
		if(options.keyword){
			params.push(options.keyword);
			sql.push(" and (categoryName like %?%");
			params.push(options.keyword);
			sql.push(" or categoryCode like %?%)");
		}
	    //直接使用
	    pool.getConnection(function(err, connection) {
	        var query=connection.query(sql.join(""),params,function(err, rows) {
	         	if(err){
	           		logger.error("category.js>>>>>>>>>findAllCount>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>findAllCount>>>>>>>>>"+JSON.stringify(rows));
	          	if(options.callback){
	          		if(rows&&rows.length>0){
	        			options.callback(err,rows[0].count);
	        		}
	      		}
	          // And done with the connection.
	          connection.release();
	          // Don't use the connection here, it has been returned to the pool.
	        });
	        logger.debug(query.sql);
	    });
	},
	findAllByPage:function(options){
		var that=this;
		logger.log("category.js>>>>>>>>>findAllByPage>>>>>>>>>传入参数options为:"+JSON.stringify(options));
		var options_temp={
			callback:function(countErr,countRow){
				var sql=["select * from category where isDelete=0 "];
			      //直接使用
			    pool.getConnection(function(err, connection) {
			        // Use the connection
			        logger.log("category.js>>>>>>>>>findAllByPage>>>>>>>>>传入参数options为:"+JSON.stringify(options));
			        if(!options.pageIndex){
			        	options.pageIndex=1;
			        }
			        if(!options.pageSize){
			        	options.pageSize=15;
			        }
			        var params=[];
			        if(options.keyword){
						params.push("%"+options.keyword+"%");
						sql.push(" and (categoryName like ?");
						params.push("%"+options.keyword+"%");
						sql.push(" or categoryCode like ?)");
					}
					sql.push(" limit ?,?");
					params.push((options.pageIndex-1)*options.pageSize);
					params.push(options.pageSize);
			        logger.log("category.js>>>>>>>>>findAllByPage>>>>>>>>>传入参数params为："+JSON.stringify(params));
			        var query=connection.query(sql.join(""),params,function(err, rows) {
			         	if(err){
			           		logger.error("category.js>>>>>>>>>"+err);
			          	}
			          	logger.debug("category.js>>>>>>>>>findAllByPage>>>>>>>>>"+JSON.stringify(rows));
			          	if(options.callback){
			          		var result={};
			          		result.rows=rows;
			          		result.totalCount=countRow;
			          		result.pageIndex=options.pageIndex;
			          		result.pageSize=options.pageSize;
			        		options.callback(err,result);
			      		}
			          // And done with the connection.
			          connection.release();
			          // Don't use the connection here, it has been returned to the pool.
			        });
			        logger.debug(query.sql);
			    });
			}
		};
		that.findAllCount(options_temp);
	},
	findAll:function(options){//查询所有分类
		var sql="select * from category where isDelete=0";
	      //直接使用
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql,function(err, rows) {
	         	if(err){
	           		logger.error("category.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>findAll>>>>>>>>>"+JSON.stringify(rows));
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
	getCategoryById:function(options){
		var sql="select * from category where id=?";
	    var params=[options.id];
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql,params,function(err, rows) {
	         	if(err){
	            	logger.error("category.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>getCategoryById>>>>>>>>>"+JSON.stringify(rows));
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
	getCategory:function(options){
		var sql=["select * from category where categoryCode=? "];
	    var params=[options.categoryCode];
	    //if(options.categoryCode){
	   // }
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql.join(""),params,function(err, rows) {
	         	if(err){
	            	logger.error("category.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>getCategory>>>>>>>>>"+JSON.stringify(rows));
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
	add:function(options){
		var that=this;
		var options_temp={
			categoryCode:options.categoryCode,
			callback:function(err,result){
			if(err){
				logger.error(err);
				if(options.callback){
	        		options.callback(err,result);
	      		}
				return;
			}
			if(result&&result.length>0){
				if(options.callback){
	        		options.callback("分类代码已经存在！",result);
	      		}

				return;
			}
			var sql="insert into category set ? ";
		    var params={
			    	categoryCode:options.categoryCode,
			    	categoryName:options.categoryName,
			    	isDelete:0
		   		};
		    pool.getConnection(function(err, connection) {
		        // Use the connection
		        var query=connection.query(sql,params,function(err, rows) {
		         	if(err){
		            	logger.error("category.js>>>>>>>>>"+err);
		          	}
		          	logger.debug("category.js>>>>>>>>>add>>>>>>>>>"+JSON.stringify(rows));

		          	if(options.callback){
		        		options.callback(err,rows);
		      		}
		          	// And done with the connection.
		          	connection.release();
		          	// Don't use the connection here, it has been returned to the pool.
		        });
		        logger.debug(query.sql);
		    });
		}};
		that.getCategory(options_temp);
	},
	/**
	*  更新分类
	*
	**/
	update:function(options){
		var sql="update category set categoryCode=?,categoryName=? where id=?";
	    var params=[options.categoryCode,options.categoryName,options.id];
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql,params,function(err, rows) {
	         	if(err){
	            	logger.error("category.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>update>>>>>>>>>"+JSON.stringify(rows));
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
	/***
	* 传入参数  id  分类ID
	* 删除分类  不做物理删除
	**/
	del:function(options){//删除分类  不做物理删除
		var sql="update category set isDelete=1 where id=?";
	    var params=[options.id];
	    pool.getConnection(function(err, connection) {
	        // Use the connection
	        var query=connection.query(sql,params,function(err, rows) {
	         	if(err){
	            	logger.error("category.js>>>>>>>>>"+err);
	          	}
	          	logger.debug("category.js>>>>>>>>>del>>>>>>>>>"+JSON.stringify(rows));
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
	/***
	* 传入参数  ids  分类ID串
	* 批量删除分类  不做物理删除
	**/
	delAll: function (options) {//删除一个组的分类  不做物理删除
        var sql = 'update category set isDelete=1 where id in';
        var str = options.ids;
        logger.debug("category.js>>>>>delAll >>>>>>>的str：" + str);
        str = str.replace('[', '(').replace(']', ')');
        sql = sql + str;
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    logger.error("category.js>>>>>delAll>>>>>" + err);
                }
                logger.debug("category.js>>>>>delAll>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })

    }
};

module.exports=Category;