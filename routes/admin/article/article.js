var express = require('express');
var router = express.Router();
var path = require("path"); //����pathģ��
var formidable = require('formidable');
var fs = require('fs');//�ļ�����
var ARTICLE_UPLOAD_FOLDER="/upload/article/";//����ͼƬ���·��
var gm = require('gm');
var Common=require('../common/common');
var Article=require("../../../models/article");
var CategoryModel=require("../../../models/category");
var Pager=require("../common/pager");
var logger = require("../../../conf/log4j").helper;

 /* GET home page. */
var localMenu="article";//����ȫ�ֱ���  ��ǰҳ�����ӵĹؼ���
router.get('/admin/article/list', function(req, res) {
	if(Common.authentication({req:req,res:res})){
		logger.info('��ת�������б�ҳ�棡');
		//var localMenu="article";
		CategoryModel.findAll({callback:function(err,categorys){
			if(err){
				logger.error("��ѯ������Ϣ����"+err);
			}
			var categoryCode=req.query.categoryCode;
			var keyword=req.query.keyword;
			var options={
				pageIndex:req.query.pageIndex,
				pageSize:req.query.pageSize,
				keyword:keyword,
				categoryCode:categoryCode,
				callback:function(err,result){
					var pagerResult=new Pager({href:'/admin/article/list?categoryCode='+categoryCode+'&keyword='+keyword,pageIndex:result.pageIndex,pageIndexName:"pageIndex",totalRows:result.totalCount,pageSize:15}).getPager();
					res.render('admin/article/list', { title: '�����б�',layout:"admin/common/layout",categorys:categorys,articles:result.rows,pagerResult:pagerResult,user:req.session.user,keyword:keyword,categoryCode:categoryCode,localMenu:localMenu});
				}
			}
			Article.findByPage(options);
		}});
		//Article.findById(options);
	};


});



//��������   //ͨ�� ���·����ֶε���������category�����ݣ������У�id���ķ��࣬����ͨ��list��ҳ��ȡ�����ݣ���Ϊֻ��ȡ����ǰҳ������ݣ�������
//router.get('/admin/article/add', function(req, res) {
router.route('/admin/article/add').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		logger.info('��ת���������ҳ�棡');

		var options={callback:function(err,rows){
			res.render('admin/article/add',{title: '�������',categorys:rows,user:req.session.user,localMenu:localMenu});
		}};
		CategoryModel.findAll(options);//������еķ����б�


		//��������ʾҳ�� ����Ҫcategroy������
		//res.render('admin/article/add',{title: '�������',layout:"admin/common/layout",categorys:rows,user:req.session.user});
		//Article.findById(options);
	}
}).post(function(req,res){
	var date=new Date();
    //var time=date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+"";
    var time=date.getTime();
	var form = new formidable.IncomingForm();   //�ļ��ϴ����м��
    form.encoding = 'utf-8';        //����
    form.uploadDir = 'public' + ARTICLE_UPLOAD_FOLDER;    //�ϴ�Ŀ¼
    form.keepExtensions = true;  //�Ƿ���Ҫ��׺
    form.maxFieldsSize = 2 * 1024 * 1024;   //�ļ���С

    //logger.log("req.files====="+req.files);
    //logger.log("req.body====="+JSON.stringify(req.body));
    var user=req.session.user;
    form.parse(req, function(err, fields, files) {
        if (err) {
            // res.locals.error = err;
            logger.error("error---------------"+err);
            //res.render('admin/article/add', { title: TITLE });
            //res.end('{"success":0,"message":"�ļ��ϴ�ʧ�ܣ�"}');//�ļ��ϴ�ʧ��
            //return;
        }
        var inputFile = files['articlePic'];
        var articlePicShow=fields.articlePicShow;
        var picPath="";
        if(articlePicShow){
	        var extName = '';  //�ļ���չ��
	        switch (inputFile.type) {
	            case 'image/pjpeg':
	                extName = 'jpg';
	                break;
	            case 'image/jpeg':
	                extName = 'jpg';
	                break;
	            case 'image/png':
	                extName = 'png';
	                break;
	            case 'image/x-png':
	                extName = 'png';
	                break;
	        }

	        var fileName=time+ '.' + extName;
	        var newPath = form.uploadDir +fileName;
	        picPath=ARTICLE_UPLOAD_FOLDER+fileName;
	        logger.debug(picPath);
	        fs.renameSync(inputFile.path, newPath);  //�������ļ�

	        logger.debug("�ļ�����ɹ���");
	        var thumbnailPath=form.uploadDir+"thumbnail/"+fileName;
	        generatePic(path.resolve(newPath),path.resolve(thumbnailPath));
	        /*var thumbnailPath=form.uploadDir+"/thumbnail/"+fileName;
	        //��������ͼ
	        imageMagick(newPath)
		    .resize(280, 150, '!') //��('!')ǿ�а�ͼƬ���ųɶ�Ӧ�ߴ�280*150��
		    .autoOrient()
		    .write(thumbnailPath, function(err){
		      if (err) {
		        logger.log(err);
		        //res.end();
		      }
		      fs.unlink(path, function() {
		        return res.end('3');
		      });
		    });*/
    	}
        var categorys=fields.categoryName.split("|||");
		var options={
			//articleCode:req.body.articleCode,
			// author:fields.author,
			articleCode:"article_"+time,
			title:fields.title,
			categoryName:categorys[1],
			categoryCode:categorys[0],
			content:fields.content,
			articlePic:picPath,
			//author:user.userName,
			author:fields.author,
			callback:function(err,rows){
				//res.render('admin/article/list', { title: '�����б�',layout:"admin/common/layout",articles:result});
				if(err){
					logger.error("error"+err);
					//res.end(JSON.stringify({"status":"error","msg":"�����������ʧ�ܣ�"}));
					//return;
				}
				// res.end(JSON.stringify({"status":"success"}));
				res.redirect("/admin/article/list");
				return;
			}
		};
		logger.info("article post success!");
		Article.add(options);
    });
});

function generatePic(oldPath,thumbnailPath){
	var imageMagick = gm.subClass({ imageMagick : true });
	var dir = path.dirname(thumbnailPath);
	if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    //��������ͼ
    imageMagick(oldPath)
    .resize(280, 150,"!") //��('!')ǿ�а�ͼƬ���ųɶ�Ӧ�ߴ�280*150��
    .autoOrient()
    .write(thumbnailPath, function(err){
    	logger.debug("����==="+oldPath+"--------"+thumbnailPath);  //����Ļ� �ǵ�Ҫ�Ƚ���������ͼ���ļ�Ŀ¼
      if (err) {
        logger.error(err);
        //res.end();
      }
      /*fs.unlink(path, function() {
        return res.end('3');
      });*/
    });
}

//ɾ������ ͨ��ajax��ʽ
//http://localhost:3000/admin/article/del/7   idֱ��д�ں���
router.route('/admin/article/del/:id').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		//res.render('admin/article/add',{title: '�������',layout:"admin/common/layout",user:req.session.user});
		options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
					res.end(JSON.stringify({"status":'success'}))
					return;
				}
				res.end(JSON.stringify({"status":'error',msg:"����ɾ��ʧ��"}));
				return;
			}
		}
		Article.del(options);
	}
});

//��ɾ
//router.route('/admin/article/del').get(function(req, res) {// ʹ��get��ʽҲ��ֻ������ǰ���  localhost:3009/admin/article/del?ids=7
router.route('/admin/article/del').post(function(req, res) {
	//Common.authentication(req,res);
	//res.render('admin/article/add',{title: '�������',layout:"admin/common/layout",user:req.session.user});
	options={
		ids:req.body.ids,//post��ʽ��ȡ����
		//id:req.query.ids,//get ��ʽ��ȡ����
		callback:function(err,rows){
			if(Common.error(err,res)){
				res.end(JSON.stringify({"status":'success'}))
				return;
			}
			res.end(JSON.stringify({"status":'error',msg:"����ɾ��ʧ��"}));
			return;
		}
	}
	//logger.log(req.url);//   /admin/article/del
	//logger.log(req.pathname);//undefined//  ָֻ�� /index.html

	Article.delAll(options);


})

//�鿴����
router.route('/admin/article/view/:id').get(function(req, res) {
	if(Common.authentication({req:req,res:res})){
		//res.render('admin/article/add',{title: '�������',layout:"admin/common/layout",user:req.session.user});
		var options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
				//	res.end(JSON.stringify({"status":'success'}))
				//	return;
				var article=rows[0];//��ѯ�����µ���Ϣ
					logger.debug("��ǰ�ǲ鿴����+"+req.params.id);
					res.render("admin/article/view",{title:"�鿴����",article:article,user:req.session.user,localMenu:localMenu});
				}

			}
		}
		Article.getArticleById(options);
	}
})
//
//�༭����  //����
//localhost:3000/admin/article/edit/6
router.get("/admin/article/edit/:id",function(req, res) {
	if(Common.authentication({req:req,res:res})){
		var options={
			id:req.params.id,
			callback:function(err,rows){
				if(Common.error(err,res)){
					var article=rows[0];//��ѯ�����µ���Ϣ
					logger.debug("article");
					logger.debug(article);
					var options1={
						callback:function(err,rows){//��ѯ�ķ������Ϣ
							res.render('admin/article/edit',{title: '���±༭',user:req.session.user,article:article,categorys:rows,localMenu:localMenu});
						}
					}
					CategoryModel.findAll(options1);
					//res.render('admin/article/edit',{title: '���±༭',layout:"admin/common/layout",user:req.session.user,article:rows[0],categorys:rows});
				}
			}
		}
		Article.getArticleById(options);
	}
}).post("/admin/article/edit",function(req,res){//����ע���post��·����get����ʱ�Ĳ�һ��������Ҫ��дһ��·��
	logger.debug("-----------------edit"+req.body.isEditPic);
	//if(req.body.isEditPic){
		var date=new Date();
	    var time=date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate();
		var form = new formidable.IncomingForm();   //�ļ��ϴ����м��
	    form.encoding = 'utf-8';        //����
	    form.uploadDir = 'public' + ARTICLE_UPLOAD_FOLDER;    //�ϴ�Ŀ¼
	    form.keepExtensions = true;  //�Ƿ���Ҫ��׺
	    form.maxFieldsSize = 2 * 1024 * 1024;   //�ļ���С

	    //logger.log("req.files====="+req.files);
	    //logger.log("req.body====="+JSON.stringify(req.body));

	    var user=req.session.user;
	    form.parse(req, function(err, fields, files) {
	        if (err) {
	            // res.locals.error = err;
	            logger.error("error---------------"+err);
	            //res.render('admin/article/add', { title: TITLE });
	            //res.end('{"success":0,"message":"�ļ��ϴ�ʧ�ܣ�"}');//�ļ��ϴ�ʧ��
	            //return;
	        }
	        var inputFile = files['articlePic'];
	        var isEditPic=false;
	        var articlePicShow=fields.articlePicShow;
	        var articlePicPath=fields.articlePicPath;
	        if(articlePicShow!=articlePicPath){
	        	isEditPic=true;
	        }
	        logger.debug("isEditPic--------"+isEditPic);
	        // logger.log("fields--------"+JSON.stringify(fields)+"------------------------------------------");
	        var picPath="";
	        if(isEditPic){
		        var extName = '';  //�ļ���չ��
		        switch (inputFile.type) {
		            case 'image/pjpeg':
		                extName = 'jpg';
		                break;
		            case 'image/jpeg':
		                extName = 'jpg';
		                break;
		            case 'image/png':
		                extName = 'png';
		                break;
		            case 'image/x-png':
		                extName = 'png';
		                break;
		        }
		        var fileName=date.getTime()+ '.' + extName;
		        var newPath = form.uploadDir +fileName;
		        picPath=ARTICLE_UPLOAD_FOLDER+fileName;
		        logger.debug(picPath);
		        fs.renameSync(inputFile.path, newPath);  //�������ļ�
		        logger.debug("�ļ�����ɹ���");
		        var thumbnailPath=form.uploadDir+"thumbnail/"+fileName;
	        	generatePic(path.resolve(newPath),path.resolve(thumbnailPath));
	    	}else{
	    		picPath=fields.articlePicPath;
	    	}
	        var categorys=fields.categoryName.split("|||");
			var options={
				//articleCode:req.body.articleCode,
				// author:fields.author,
				// articleCode:user.userName+time,
				id:fields.id,
				title:fields.title,
				categoryName:categorys[1],
				categoryCode:categorys[0],
				content:fields.content,
				articlePic:picPath,
				//author:user.userName,
				author:fields.userName,
				callback:function(err,rows){
					//res.render('admin/article/list', { title: '�����б�',layout:"admin/common/layout",articles:result});
					if(err){
						logger.error("error"+err);
						//res.end(JSON.stringify({"status":"error","msg":"�����������ʧ�ܣ�"}));
						//return;
					}
					// res.end(JSON.stringify({"status":"success"}));
					res.redirect("/admin/article/list");
					return;
				}
			};
			logger.info("article post update success!");
			Article.update(options);
	    });
});

//�������
router.post("/admin/article/verfiy",function(req,res,next){
	if(!Common.authentication(req,res,true)){
		return res.end("{'status':'login'}");
	}
	var status=req.body.status;
	var options={
		id:req.body.id,
		status:status
	}
	var callback=function(err,rows){
		logger.debug("article------>"+JSON.stringify(rows)+",err="+err);
		if(Common.error(err,res)){
			//var article=rows[0];//��ѯ�����µ���Ϣ
			//res.redirect("/admin/article/list");
			logger.debug("verfiy----success!id="+req.body.id+",status="+status);
			return res.end(JSON.stringify({'status':'success'}));
			//res.render('admin/article/edit',{title: '���±༭',layout:"admin/common/layout",user:req.session.user,article:rows[0],categorys:rows});
		}else{
			return res.end(JSON.stringify({'status':'error'}));
		}
	};
	if(status==1){
		Article.verifyEnable(options,callback);
	}else if(status==2){
		Article.verifyDisable(options,callback);
	}
});

module.exports = router;

