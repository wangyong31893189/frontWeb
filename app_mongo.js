var express=require("express");
var path=require("path");
var mongoose=require("mongoose");
var _=require("underscore");
var Movie=require("./models/movie");
var bodyParser= require('body-parser');//body-parser插件已经不集成在express内部了，需要自己单独引入
var port=process.env.PORT||3000;
var app=express();

mongoose.connect("mongodb://localhost/nodejs-react-demo");

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
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			_movie=_.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect("/movie/"+movie._id);
			});
		});
	}else{
		_movie=new Movie({
			"doctor":movieObj.doctor,
			"country":movieObj.country,
			"title":movieObj.title,
			"year":movieObj.year,
			"poster":movieObj.poster,
			"language":movieObj.language,
			"flash":movieObj.flash,
			"summary":movieObj.summary
		});
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
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

//list delete movie
app.delete("/admin/del",function(req,res){
	var id=req.query.id;
	// console.log("del"+id);
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({"success":1});
			}
		});
	}
});