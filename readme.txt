
	* bin——存放命令行程序。
	* node_modules——存放所有的项目依赖库。
	* public——存放静态文件，包括css、js、img等。
	* routes——存放路由文件。
	* views——存放页面文件（ejs模板）。
	* app*.js——程序启动文件。
	* package.json——项目依赖配置及开发者信息。

	缩略图处理需要安装 ImageMagick 的应用程序
	
	出现{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' } 问题解决
	
	frontWeb/node_modules/connect-mongodb/node_modules/mongodb/node_modules/bson/ext/index.js   将路径  bson = require('../build/Release/bson');  改成bson = require('../browser_build/bson');
	
	
环境服务器：用户名密码：hpued  & hpued@99wuxian
管理员   root  & auto@handpay
mysql   test  & root

linux 工具软件安装地址   
node   /opt/下
mysql  /usr/local/mysql
mongodb /usr/hpued/mongodb

部署目录   /var/frontWeb	
	
	
运行	node ./bin/app


登录设计：
访问路径页面描述
/admin	index.html不需要登录，可以直接访问。
/admin/index  index.html必须用户登录以后，才可以访问。
/admin/login  login.html登录页面，用户名密码输入正确，自动跳转到home.html。
/admin/logout  无退出登录后，自动跳转到index.html。
