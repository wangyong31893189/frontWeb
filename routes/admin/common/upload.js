var express = require('express');
var router = express.Router();
var URL = require('url');
var formidable = require('formidable');
var fs = require('fs'),
    AVATAR_UPLOAD_FOLDER = '/upload/img/';
//router.route('/admin/uploadImg').get(function(req,res){
//    res.render('admin/article/add', { title: TITLE });
//})
router.post('/admin/uploadImg',function(req, res,next) {
    console.log("start----------------");
    var form = new formidable.IncomingForm();   //�ļ��ϴ����м��
    form.encoding = 'utf-8';        //����
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;    //�ϴ�Ŀ¼
    form.keepExtensions = true;  //�Ƿ���Ҫ��׺
    form.maxFieldsSize = 2 * 1024 * 1024;   //�ļ���С
    //console.log("req.files====="+req.files);
    //console.log("req.body====="+JSON.stringify(req.body));
    form.parse(req, function(err, fields, files) {
        var inputFile = files['editormd-image-file'];
        if (err) {
            // res.locals.error = err;
            console.log("error---------------");
            //res.render('admin/article/add', { title: TITLE });
            res.end('{"success":0,"message":"�ļ��ϴ�ʧ�ܣ�"}');//�ļ��ϴ�ʧ��
            return;
        }
        // console.log("fields====="+JSON.stringify(fields));
        console.log("files====="+JSON.stringify(files));

        console.log("inputFile====="+JSON.stringify(inputFile));
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

        if(extName.length == 0){
           res.end('{"success":"0","message":"�ļ��ϴ�ʧ�ܣ�"}');//�ļ��ϴ�ʧ�ܣ�
            //res.render('index', { title: TITLE });
            return;
        }
        // var date=new Date();
        var fileName=Math.random() + '.' + extName;
        var avatarName ="";//date.getFullYear()+""+date.getMonth()+""+date.getDate()+"/";
       /* fs.mkdir(form.uploadDir + avatarName,function(err){
            if(err){
                console.error("����Ŀ¼ʧ�ܣ�");
            }
        });*/
        var newPath = form.uploadDir + avatarName+fileName;
        var outPath=AVATAR_UPLOAD_FOLDER+ avatarName+fileName;
        console.log(newPath);
        fs.renameSync(inputFile.path, newPath);  //�������ļ�
        var requestUrl= URL.parse(req.url);
        // console.log("req.url--------"+req.url+"--requestUrl="+requestUrl);
        // console.log("req.url--------"+req.url+"--requestUrl="+JSON.stringify(requestUrl));
            // outPath=requestUrl.protocol+"//"+requestUrl.host+"/"+outPath;
        // res.locals.success = '�ϴ��ɹ�';
        //msg = "{\"success\":\"" + true + "\",\"file_path\":\"" + newPath + "\"}";
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        var jsonStr=JSON.stringify({"success":1,"message":"�ϴ��ɹ�","url":outPath});
        res.end(jsonStr);//�ϴ��ɹ�
        return;
    });
});

module.exports = router;