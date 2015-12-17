/**
 * Created by huanliu on 2015/8/27.
 */
var pool = require("./pool"); //引入连接池模块
var logger = require("../conf/log4j").helper;
var Article = {
    findAllCount: function (options) {
        var sql = ['select count(id) as count from article where isDelete=0'];
        var params = [];
        if (options.keyword) {
            params.push("%" + options.keyword + "%");
            sql.push(' and (articleCode like ?');
            params.push("%" + options.keyword + "%");
            sql.push(' or articleName like ?)');
        }
        if (options.categoryCode) {
            sql.push(" and categoryCode=? ");
            params.push(options.categoryCode);
        }
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>findAllCont>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>>>findAllCount>>>>>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    if (rows && rows.length > 0) {
                        options.callback(err, rows[0].count);
                    }
                }
            });
            connection.release();
            logger.debug(query.sql);
        });

    },
    findByPage: function (options) {
        var that = this;
        logger.info("article.js>>>>>findByPage>>>>>>>传入的参数options为:" + JSON.stringify(options));
        var options_temp = {
            keyword:options.keyword,
            pageSize:options.pageSize,
            pageIndex:options.pageIndex,
            categoryCode:options.categoryCode,
            callback: function (countErr, countRow) {
                var sql = ['select * from article where isDelete=0 '];
                pool.getConnection(function (err, connection) {
                    logger.debug("article.js>>>>>findByPage>>>>>>>传入的参数options为:" + JSON.stringify(options));
                    if (!options.pageIndex) {
                        options.pageIndex = 1;
                    }
                    if (!options.pageSize) {
                        options.pageSize = 15;
                    }
                    var params = [];
                    if (options.keyword) {
                        params.push("%" + options.keyword + "%");
                        sql.push(' and (articleCode like ?');
                        params.push("%" + options.keyword + "%");
                        sql.push(' or articleName like ?)');
                    }
                    if (options.categoryCode) {
                        sql.push(" and categoryCode=? ");
                        params.push(options.categoryCode);
                    }
                    sql.push(' limit ?,?');
                    params.push((options.pageIndex - 1) * options.pageSize);
                    params.push(options.pageSize);
                    logger.debug("article.js>>>>>>>>>findByPage>>>>>>>>>传入参数params为：" + JSON.stringify(params))
                        //'select * form article where 1=1 and (articleCode like ? or articleName like ? ) limit 0 ,15'
                    var query = connection.query(sql.join(''), params, function (err, rows) {
                        if (err) {
                            logger.error("article.js>>>>>>>>" + err);
                        }
                        logger.debug("article.js>>>>>>>>findByPage>>>>>>>>>" + JSON.stringify(rows));
                        if (options.callback) {
                            var result = {};
                            result.rows = rows;
                            result.totalCount = countRow; //给分页设置对象
                            result.pageIndex = options.pageIndex;
                            result.pageSize = options.pageSize;
                            options.callback(err, result)
                        }

                        connection.release();
                    });
                    logger.debug(query.sql);
                });
            }
        };
        that.findAllCount(options_temp);
    },
    findAll: function (options) {
        var sql = 'select * from article where isDelete=0';
        var params = {};
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>findById>>>>>" + err);
                }
                logger.debug(rows);
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();

            });
            logger.debug(query.sql);
        })
    },

    getArticleById: function (options) {
        var sql = 'select * from article where id=? ';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>getArticleById>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>getArticleById>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);

                }
                connection.release();
            });
            logger.debug(query.sql);
        })
    },
    getArticle: function (options) {
        var sql = ['select * from article  where articleCode=? ']; //通过articleCode这个字段作为标识 检查有无已经存在的文章
        var params = [options.articleCode];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>getArticle>>>>>" + err);
                }
                logger.debug("article.js>>>>getArticle>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql)
        })
    },
    add: function (options) {//添加文章
        //add的思路  增加一条数据用除id以外的一个字段来避免有重复的文章插入
        var that = this;
        var options_temp = {
            //articleCode:options.articleCode,
            callback: function (err, result) {
                if (err) {
                    logger.error(err);
                    if (options.callback) {
                        options.callback(err, result);
                    }
                    return;
                }

                //避免添加相同的文章
                //if(result&&result.length>0){
                //    if(options.callback){
                //        options.callback("文章代码已经存在！",result);
                //    }
                //    return;
                //}

                //无错也没有categoryCode为输入的条数据则插入数据
                var sql='insert into article set author=?,title=?,articleName=?,articleCode=?,articlePic=?,categoryCode=?,categoryName=?,content=?,createTime=now(),status=0,isDelete=0 ';//这里是插入一组数据 不是设置一个值 比如某个属性= ?
                var params=[options.author,options.title,options.title,options.articleCode,options.articlePic,options.categoryCode,options.categoryName,
                options.content];
                pool.getConnection(function(err, connection) {
                    var query= connection.query(sql,params,function(err,rows){
                        if(err){
                            logger.error("article.js>>>>>>>>>"+err);
                        }
                        logger.debug("article.js>>>>>>>>>add>>>>>>>>>" + JSON.stringify(rows));
                        if (options.callback) {
                            options.callback(err, rows);
                        }
                        connection.release();
                    });
                    logger.debug(query.sql);
                })

            }
        }
        that.getArticle(options_temp);
    },
    del: function (options) {//删除文章
        var sql = 'update article set isDelete=1 where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>del>>>>>" + err);
                }
                logger.debug("article.js>>>>>del>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    },
    delAll: function (options) {//删除一个组的文章
        var sql = 'update article set isDelete=1 where id in'
        var str = options.ids;
        logger.debug("article.js>>>>>delAll >>>>>>>的str：" + str);
        str = str.replace('[', '(').replace(']', ')');
        sql = sql + str;
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>delAll>>>>>" + err);
                }
                logger.debug("article.js>>>>>delAll>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })

    },
    update:function(options){//更新文章
        var sql='update article set content=?,categoryName=?,categoryCode=?,articlePic=?,updateTime=now(),title=? where id=? ';
        var params=[options.content,options.categoryName,options.categoryCode,options.articlePic,options.title,options.id];
        pool.getConnection(function(err,connection){
            var query=connection.query(sql,params,function(err,rows){
                if(err){
                    logger.error('article.js>>>>>>>update>>>>>>>'+err);
                }
                logger.debug("article.js>>>>>>>update>>>>>>>"+JSON.stringify(rows));
                if(options.callback){
                    options.callback(err,rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    },
    updateStatus:function (options,callback) {//修改文章状态   、
        var sql='update article set status=? where id=? ';
        var params=[options.status,options.id];
        pool.getConnection(function(err,connection){
            var query=connection.query(sql,params,function(err,rows){
                if(err){
                    logger.error('article.js>>>>>>>updateStatus>>>>>>>'+err);
                }
                logger.debug("article.js>>>>>>>updateStatus>>>>>>>"+JSON.stringify(rows));
                if(options.callback){
                    options.callback(err,rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    },
    //updated by huibin Zheng ,2015-10-14
    addArticle: function (options, callback) {
        var sql = 'insert into article set ? '; //这里是插入一组数据 不是设置一个值 比如某个属性= ?
        var params = {
            "author": options.author,
            "articleName": options.articleName,
            "categoryName": options.categoryName,
            "desc": options.desc
        };
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>>>addArticle>>>>>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql);
        })
    },
    findLatestArticle: function (options, callback) {
        var sql = ['select * from article where isDelete=0 ORDER BY id desc limit ?'];
        var params = [options.limit];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>getLatestArticle>>>>>" + err);
                }
                logger.debug("article.js>>>>getLatestArticle>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql);
        });
    },
    findAritcleLiteByCategoryName: function (options, callback) {
        var sql = ['select id,title,articlePic,author,createTime,categoryName,`desc` from article where categoryName=? and isDelete=0 and status=1 ORDER BY id desc LIMIT ?,?'];
        var params = [options.categoryName,parseInt(options.startIndex),parseInt(options.pageSize)];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>findAllByCategoryName>>>>>" + err);
                }
                logger.debug("article.js>>>>findAllByCategoryName>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql)
        });
    },
    delArticle: function (options,callback) {
        var sql = 'update article set isDelete=1 where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>del>>>>>" + err);
                }
                logger.debug("article.js>>>>>del>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    },
    findOne: function(options,callback) {
        var sql = 'select * from article where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>findOne>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>findOne>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql);
        });
    },
    findPreviousAritcleLite: function(options,callback){
        var sql = 'select id,title,articlePic,author,createTime,categoryName,`desc` from article where categoryName=? and isDelete=0 and id>? and status=1 ORDER BY id asc limit 1';
        var params = [options.categoryName,options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>findPreviousAritcleLite>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>findPreviousAritcleLite>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql);
        });
    },
    findNextAritcleLite: function(options,callback){
        var sql = 'select id,title,articlePic,author,createTime,categoryName,`desc` from article where categoryName=? and isDelete=0 and id<? and status=1 ORDER BY id desc limit 1';
        var params = [options.categoryName,options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>>>findPreviousAritcleLite>>>>>" + err);
                }
                logger.debug("article.js>>>>>>>findPreviousAritcleLite>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            logger.debug(query.sql);
        });
    },
    /**
     * 审核文章通过
     * 输入参数  status 状态   id文章id
     **/
    verifyEnable: function (options,callback) {
        var sql = 'update article set status=1 where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>verifyEnable>>>>>" + err);
                }
                logger.debug("article.js>>>>>verifyEnable>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    },
    /**
     * 审核文章不通过
     * 输入参数  status 状态为2   id文章id
     **/
    verifyDisable: function (options,callback) {
        var sql = 'update article set status=2 where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    logger.error("article.js>>>>>verifyDisable>>>>>" + err);
                }
                logger.debug("article.js>>>>>verifyDisable>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            })
            logger.debug(query.sql);
        })
    }
}
module.exports = Article;
