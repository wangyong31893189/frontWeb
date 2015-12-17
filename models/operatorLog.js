/**
 * Created by huanliu on 2015/8/27.
 */
var pool = require("./pool"); //引入连接池模块
var OperatorLog = {
    findAllCount: function (options) {
        var sql = ['select count(id) as count from log where 1=1'];
        var params = [];
        if (options.keyword) {
            params.push(options.keyword);
            sql.push(" and (title like %?%");
            params.push(options.keyword);
            sql.push(" or operator like %?%");
            params.push(options.keyword);
            sql.push(" or desc like %?%)");
        }
        pool.getConnection(function (err, connectin) {
            var query = connectin.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>findAllCont>>>>>" + err);
                }
                console.log("article.js>>>>>>>>>findAllCount>>>>>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    if (rows && rows.length > 0) {}
                    options.callback(err, rows[0].count)
                }
            });
            console.log(query.sql);
        })

    },
    findByPage: function (options) {
        var that = this;
        console.log("article.js>>>>>findByPage>>>>>>>传入的参数options为:" + JSON.stringify(options));
        var options_temp = {
            callback: function (countErr, countRow) {
                var sql = ['select * from article where 1=1'];
                pool.getConnection(function (err, connection) {
                    console.log("article.js>>>>>findByPage>>>>>>>传入的参数options为:" + JSON.stringify(options));
                    if (!options.pageIndex) {
                        options.pageIndex = 1;
                    }
                    if (!options.pageSize) {
                        options.pageSize = 15;
                    }
                    var params = [];
                    if (options.keyword) {
                        params.push(options.keyword);
                        sql.push(" and (title like %?%");
                        params.push(options.keyword);
                        sql.push(" or operator like %?%");
                        params.push(options.keyword);
                        sql.push(" or desc like %?%)");
                    }
                    sql.push(' limit ?,?');
                    params.push((options.pageIndex - 1) * options.pageSize);
                    params.push(options.pageSize);
                    console.log("article.js>>>>>>>>>findByPage>>>>>>>>>传入参数params为：" + JSON.stringify(params))
                        //'select * form article where 1=1 and (articleCode like ? or articleName like ? ) limit 0 ,15'
                    var query = connection.query(sql.join(''), params, function (err, rows) {
                        if (err) {
                            console.log("article.js>>>>>>>>" + err);
                        }
                        console.log("article.js>>>>>>>>findByPage>>>>>>>>>" + JSON.stringify(rows));
                        if (options.callback) {
                            var result = {};
                            result.rows = rows;
                            result.totalCount = countRow; //给分页设置对象
                            result.pageIndex = options.pageIndex;
                            result.pageSize = options.pageSize;
                            options.callback(err, result)
                        }

                        connection.release();
                    })
                    console.log(query.sql);
                })
            }
        };
        that.findAllCount(options_temp);
    },
    findAll: function (options) {
        var sql = 'select * from article ';
        var params = {};
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>>>findById>>>>>" + err);
                }
                console.log(rows);
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();

            });
            console.log(query.sql);
        })
    },

    getOperatorLogById: function (options) {
        var sql = 'select * from article where id=? or 1=1';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>>>getOperatorLogById>>>>>" + err);
                }
                console.log("article.js>>>>>>>getOperatorLogById>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);

                }
                connection.release();

            });
            console.log(query.sql);
        })
    },
    getOperatorLog: function (options) {
        var sql = ['select * from article  where articleCode=? ']; //通过articleCode这个字段作为标识 检查有无已经存在的文章
        var params = [options.articleCode];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>getOperatorLog>>>>>" + err);
                }
                console.log("article.js>>>>getOperatorLog>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }


                connection.release();


            });
            console.log(query.sql)
        })
    },
    add: function (options) {
        //add的思路  增加一条数据用除id以外的一个字段来避免有重复的文章插入
        var that = this;
        var options_temp = {
            //articleCode:options.articleCode,
            callback: function (err, result) {
                if (err) {
                    console.error(err);
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
                var sql='insert into article set author=?,title=?,articleName=?,articlePic=?,categoryCode=?,categoryName=?,content=?,createTime=now(),status=0 ';//这里是插入一组数据 不是设置一个值 比如某个属性= ?
                var params=[options.author,options.title,options.title,options.articlePic,options.categoryCode,options.categoryName,
                options.content];
                pool.getConnection(function(err, connection) {
                    var query= connection.query(sql,params,function(err,rows){
                        if(err){
                            console.log("article.js>>>>>>>>>"+err);
                        }
                        console.log("article.js>>>>>>>>>add>>>>>>>>>" + JSON.stringify(rows));
                        if (options.callback) {
                            options.callback(err, rows);
                        }
                        connection.release();
                    });
                    console.log(query.sql);
                })

            }
        }
        that.getOperatorLog(options_temp);
    },
    del: function (options) {
        var sql = 'delete from article where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>del>>>>>" + err);
                }
                console.log("article.js>>>>>del>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            })
            console.log(query.sql);
        })
    },
    delAll: function (options) {
        var sql = 'delete from article where id in'
        var str = options.id;
        console.log("article.js>>>>>delAll >>>>>>>的str：" + str);
        str = str.replace('[', '(').replace(']', ')');
        sql = sql + str;
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>delAll>>>>>" + err);
                }
                console.log("article.js>>>>>delAll>>>>>" + JSON.stringify(rows));
                if (options.callback) {
                    options.callback(err, rows);
                }
                connection.release();
            })
            console.log(query.sql);
        })

    },
    update:function(options){
        var sql='update article set articleCode=?,title=? where id=? ';
        var params=[options.articleCode,options.articleName,options.id];
        pool.getConnection(function(err,connection){
            var query=connection.query(sql,params,function(err,rows){
                if(err){
                    console.log('article.js>>>>>>>update>>>>>>>'+err);
                }
                console.log("article.js>>>>>>>update>>>>>>>"+JSON.stringify(rows));
                if(options.callback){
                    options.callback(err,rows);
                }
                connection.release();
            })
            console.log(query.sql);
        })
    },
    //updated by huibin Zheng ,2015-10-14
    addOperatorLog: function (options, callback) {
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
                    console.log("article.js>>>>>>>>>" + err);
                }
                console.log("article.js>>>>>>>>>addOperatorLog>>>>>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            console.log(query.sql);
        })
    },
    findLatestOperatorLog: function (options, callback) {
        var sql = ['select * from article ORDER BY id desc limit ?'];
        var params = [options.limit];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>getLatestOperatorLog>>>>>" + err);
                }
                console.log("article.js>>>>getLatestOperatorLog>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            console.log(query.sql);
        });
    },
    findAritcleLiteByCategoryName: function (options, callback) {
        var sql = ['select id,title,articlePic,author,createTime,categoryName,`desc` from article where categoryName=? and status=1 ORDER BY id desc LIMIT ?,?'];
        var params = [options.categoryName,parseInt(options.startIndex),parseInt(options.pageSize)];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql.join(''), params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>findAllByCategoryName>>>>>" + err);
                }
                console.log("article.js>>>>findAllByCategoryName>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            console.log(query.sql)
        });
    },
    delOperatorLog: function (options,callback) {
        var sql = 'delete from article where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>del>>>>>" + err);
                }
                console.log("article.js>>>>>del>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            })
            console.log(query.sql);
        })
    },
    findOne: function(options,callback) {
        var sql = 'select * from article where id=?';
        var params = [options.id];
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, params, function (err, rows) {
                if (err) {
                    console.log("article.js>>>>>>>findOne>>>>>" + err);
                }
                console.log("article.js>>>>>>>findOne>>>>>" + JSON.stringify(rows));
                if (callback) {
                    callback(err, rows);
                }
                connection.release();
            });
            console.log(query.sql);
        });
    }
}
module.exports = OperatorLog;
