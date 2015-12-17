/**
 * @author Huibin Zheng
 * @description 前端官网前台页面的路由配置
 */
var express = require('express');
var router = express.Router();
var subModules = [{
    name: '首页',
    url: 'main'
}, {
    name: '分享云',
    url: 'cloud'
}, {
    name: '成员',
    url: 'member'
}, {
    name: '插件库',
    url: 'plugin'
}];
/**
 * @description 默认为首页(path:/main)
 */
router.get('/', function (req, res, next) {
    res.render('web/main', {
        title: 'main',
        content: 'main',
        key: 'main',
        user:req.session.user,
        items: subModules
    });
    next();
});
/**
 * @description 首页(path:/main)
 */
router.get('/main', function (req, res, next) {
    res.render('web/main', {
        title: 'main',
        content: 'main',
        key: 'main',
        user:req.session.user,
        items: subModules
    });
});
/**
 * @description 分享云(path:/cloud)
 */
router.get('/cloud', function (req, res, next) {
    res.render('web/cloud', {
        title: 'cloud',
        content: 'cloud',
        key: 'cloud',
        user:req.session.user,
        items: subModules
    });
    next();
});
/**
 * @description 成员(path:/member)
 */
router.get('/member', function (req, res, next) {
    res.render('web/member', {
        title: 'member',
        content: 'member',
        key: 'member',
        user:req.session.user,
        items: subModules
    });
});
/**
 * @description 插件库(path:/plugin)
 */
router.get('/plugin', function (req, res, next) {
    console.log("plugin render");
    res.render('web/plugin', {
        title: '插件展示',
        content: 'plugin',
        key: 'plugin',
        user:req.session.user,
        items: subModules
    });
});

module.exports = router;