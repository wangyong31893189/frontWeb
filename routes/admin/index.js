var express = require('express');
var router = express.Router();

 /* GET home page. */
router.get('/', function(req, res) {
   authentication(req,res);
   res.render('admin/index', { title: '用户中心',layout:"common/admin-layout"});
});

router.route('/admin/login').get(function(req, res) {
 	res.render('admin/login', { title: '用户登录',layout:"common/admin-layout"});
}).post(function(req, res) {
	var user={
	    username: 'admin',
	    password: '123456'
	}
	if(req.body.username === user.username && req.body.password === user.password){
		req.session.user = user;
	    res.redirect('/admin/index');
	}else{
		req.session.error='用户名或密码不正确';
		console.error("用户名或密码不正确");
	 	res.redirect('/admin/login');
	}
});

router.get('/admin/logout', function(req, res) {
 	req.session.user = null;
    res.redirect('/admin/login');
});

router.get('/admin/index', function(req, res) {
	authentication(req,res);
    var user={
        username:'admin',
        password:'123456'
    }
	var localMenu="index";
    res.render('admin/index', { title: 'Home', user: user,layout:"common/admin-layout",localMenu:localMenu });
});


function authentication(req, res) {
    if (!req.session.user) {
    	req.session.error='请先登录!';
    	console.error("请先登录!");
        return res.redirect('/admin/login');
    }
}


module.exports = router;

