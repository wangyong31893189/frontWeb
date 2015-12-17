var mysql=require("mysql");//引入mysql模块

var pool  = mysql.createPool({
  host     : '10.48.193.201',
  user     : 'test',
  password : 'root',
  port: '3306',
  database: 'hpued'
});

pool.on("connection",function(connection){
    console.log("数据库连接成功！");
});

module.exports=pool;