var express = require("express"); //引入express模块
var path = require("path"); //引入path模块
//var mysql=require("mysql");//引入mysql模块
var _ = require("underscore"); //引入underscore模块
//var Movie=require("./models/movie_mysql");
// var logger = require('morgan'); //日志中间件

var cookieParser = require('cookie-parser'); //cookie相关模块中间件

var favicon = require('static-favicon'); //网站图标



var bodyParser = require('body-parser'); //body-parser插件已经不集成在express内部了，需要自己单独引入

var partials = require('express-partials'); //布局中间件

var port = process.env.PORT || 3000;


var app = express();

//var router = express.Router(); //引入路由
// app.use(app.router);



//采用connect-mongodb中间件作为Session存储
var session = require('express-session');
console.log("express-session");
var Settings = require('./conf/settings');
console.log("./conf/settings");
var MongoStore = require('connect-mongodb');
console.log("connect-mongodb");
var db = require('./conf/msession');


//让ejs模板文件使用扩展名为html的文件
//app.set('views', path.join(__dirname, 'views'));
//app.engine('html', require('ejs').renderFile);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


console.log("绝对路径测试---" + path.join(__dirname, "views"));


app.use(partials());
app.use(bodyParser.urlencoded({
    extended: true
})); //上面的这个新版本已经不适用了
app.use(favicon());
// app.use(logger('dev'));
app.use(cookieParser());
// app.use(bodyParser({uploadDir:'./upload'}));
// app.use(express.multipart());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));//上面的这个新版本已经不适用了

app.use(express.static(path.join(__dirname, "public")));
// app.listen(port);


//session配置
app.use(session({
    name: 'fme.name', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 30 * 60 * 1000
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    secret: Settings.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ //增加session的数据库存储
        username: Settings.USERNAME,
        password: Settings.PASSWORD,
        url: Settings.URL,
        db: db
    })
}));


app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) {
        res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
    }
    next();
});


console.log("demo started on port " + port);

var webRoute = require('./routes/web');
var userRoute = require('./routes/admin/user/user');
var pluginRoute = require('./routes/web/plugin/plugin');//插件路由
var pluginCommentRoute = require('./routes/web/plugin/comment_plugin');//插件评论路由
var authorityRoute = require('./routes/admin/authority/authority');//用户权限路由

var categoryService = require('./services/cloud/categoryService');
var articleService = require('./services/cloud/articleService');
var commentService = require('./services/cloud/commentService');
var memberService = require('./services/member/memberService');
var authorityService = require('./services/authority/authorityService');
// var users = require('./routes/users');
app.use('/', webRoute);
app.use('/', pluginRoute);//插件路由
app.use('/', pluginCommentRoute);//插件评论路由
app.use('/', authorityRoute);//用户权限路由
app.use('/', categoryService);
app.use('/', articleService);
app.use('/', commentService);
app.use('/', memberService);
app.use('/', authorityService);
//用户模块
app.use('/', userRoute);
//app.use('/userRoutes', userRoutes);
// app.use('/admin/index', userRoute);
//app.use('/admin/login', userRoute);
//app.use('/admin/logout', userRoute);
// app.use('/admin/index', userRoute);

var categoryRoute = require('./routes/admin/category/category');
app.use('/', categoryRoute);
//app.use('/admin/category/list', categoryRoute);
//app.use('/admin/category/add', categoryRoute);
//app.use('/admin/category/edit', categoryRoute);
//app.use('/admin/category/view', categoryRoute);



var articleRoute = require('./routes/admin/article/article');
app.use('/', articleRoute);


var uploadRoute = require('./routes/admin/common/upload');
app.use('/', uploadRoute);


var pluginRoute = require('./routes/admin/plugin/plugin');
app.use('/', pluginRoute);

/*//index page
app.get("/",function(req,res){
	//Movie.fetch(function(err,movies){
		res.render("admin/login",{
			title:"登录",
			layout:"common/admin-layout"
		});
	//});
});

app.get("/login",function(req,res){
	//Movie.fetch(function(err,movies){
		res.render("admin/login",{
			title:"登录",
			layout:"common/admin-layout"
		});
	//});
});
*/
var log = require("./conf/log4j");
var logger = log.helper;
logger.info("哈哈1开始记录日志,今天是" + new Date());
logger.error("出错了，你怎么搞的,今天是" + new Date());
log.use(app);
//app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO,format:':method :url'}));

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('admin/common/error', {
            title: "出错了",
            layout: "admin/common/layout",
            message: err.message,
            error: err
        });
    });
}


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('admin/common/error', {
        title: "出错了",
        layout: "admin/common/layout",
        message: err.message,
        error: err
    });
});

module.exports = app;
