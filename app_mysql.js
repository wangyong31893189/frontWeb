var express=require("express");//引入express模块
var path=require("path"); //引入path模块
var mysql=require("mysql");//引入mysql模块
var _=require("underscore");//引入underscore模块
var Movie=require("./models/movie_mysql");
var bodyParser= require('body-parser');//body-parser插件已经不集成在express内部了，需要自己单独引入
var port=process.env.PORT||3000;
var app=express();

app.set("views","./views/pages");
app.set("view engine","jade");
//app.use(express.bodyParser());
// app.use(bodyParser());//将传入参数进行轮换成json
// app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({extended:true}));//上面的这个新版本已经不适用了
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));//上面的这个新版本已经不适用了
app.use(express.static(path.join(__dirname,"public")));
app.listen(port);

/*
var db_config = {
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	port: '3306',
	database: 'nodejs-react-demo'
};

var connection;
function handleDisconnect() {
	connection = mysql.createConnection(db_config);
	connection.connect(function(err) {
		if(err){
			console.log('进行断线重连：' + new Date());
			setTimeout(handleDisconnect, 2000);   //2秒重连一次
			return;
		}
		console.log('连接成功');
	});
	connection.on('error', function(err) {
		console.log('db error', err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST') {
				handleDisconnect();
			} else {
				throw err;
			}
		});
}
handleDisconnect();
*/
console.log("demo started on port "+port);

//index page
app.get("/",function(req,res){
	Movie.fetch(function(err,movies){
		res.render("index",{
			title:"demo 首页",
			movies:movies
		});
	});
});

//detail page
app.get("/movie/:id",function(req,res){
	var id=req.params.id;
	Movie.findById(id,function(err,movie){
		res.render("detail",{
			title:"demo 详情页"+movie.title,
			movie:movie
		});

	});
});


//admin page
app.get("/admin/movie",function(req,res){
	res.render("admin",{
		title:"demo 后台录入页",
		movie:{
			"doctor":"",
			"country":"",
			"title":"",
			"year":"",
			"poster":"",
			"language":"",
			"flash":"",
			"summary":""
		}
	});
});

//admin update movie
app.get("/admin/update/:id",function(req,res){
	var id=req.params.id;
	if(id!=="undefined"){
		Movie.findById(id,function(err,movie){
			res.render("admin",{
				title:"demo 后台更新页",
				movie:movie
			});
		});
	}
});


//admin post movie
app.post("/admin/movie/new",function(req,res){
	// console.log(req.body);
	var movieObj=req.body.movie;
	// console.log("movieObj"+movieObj);
	var id=movieObj._id;//获取请求的_id参数
	var _movie=null;
	if(id!=="undefined"){
		//Movie.findById(id,function(err,movie){
		//	if(err){
		//		console.log(err);
		//	}
		//	_movie=_.extend(movie,movieObj);
			Movie.update(movieObj,function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect("/movie/"+movieObj._id);
			});
		//});
	}else{
		_movie={
			"doctor":movieObj.doctor,
			"country":movieObj.country,
			"title":movieObj.title,
			"year":movieObj.year,
			"poster":movieObj.poster,
			"language":movieObj.language,
			"flash":movieObj.flash,
			"summary":movieObj.summary
		};
		Movie.save(_movie,function(err,movie){
			//console.log("app_mysql----"+err);
			if(err){
				//console.log(err);
				return;
			}
			res.redirect("/movie/"+movie._id);
		});
	}
});

//list page
app.get("/admin/list",function(req,res){
	Movie.fetch(function(err,movies){
		res.render("list",{
			title:"demo 列表页",
			movies:movies
		});
	});
});

//list page 包含react的例子
app.get("/admin/list/react",function(req,res){
	Movie.fetch(function(err,movies){
		res.render("list-react",{
			title:"demo react 列表页",
			movies:movies
		});
	});
});


//list delete movie
app.delete("/admin/del",function(req,res){
	var id=req.query.id;
	// console.log("del"+id);
	if(id){
		Movie.remove(id,function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({"success":1});
			}
		});
	}
});