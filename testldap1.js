var ldap = require('ldapjs');
var assert = require('assert');
var client = ldap.createClient({
  url: 'ldap://180.153.177.112:33389'
});

console.log("连接成功启动！");

//创建LDAP查询选项
//filter的作用就是相当于SQL的条件
var opts = {
 filter: 'sAMAccountName=whzou', //查询条件过滤器，查找uid=kxh的用户节点
 scope: 'sub',    //查询范围
 timeLimit: 500    //查询超时
};

//将client绑定LDAP Server
//第一个参数：是用户，必须是从根节点到用户节点的全路径
//第二个参数：用户密码
var path="CN=邹伟华,OU=技术架构,OU=技术研发部,OU=技术平台,OU=user1,DC=99wuxian,DC=com";
// var path="OU=user1,DC=99wuxian,DC=com";
client.bind(path,'weihuachina76!', function (err1, res1) {
  console.log(path+"err1="+err1+",res1="+res1);
  //开始查询0
  //第一个参数：查询基础路径，代表在查询用户信心将在这个路径下进行，这个路径是由根节开始
  //第二个参数：查询选项
  client.search('OU=User1,DC=99wuxian,DC=com', opts, function (err2, res2) {
    //console.log("err2="+err2+",res2="+JSON.stringify(res2));
    //查询结果事件响应
    var user=null;
    res2.on('searchEntry', function (entry) {
      // console.log(entry);
      //获取查询的对象
      user = entry.object;
      var userText = JSON.stringify(user,null,2);
      // console.log(userText);
      console.log(user.dn);

    });

    res2.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });

    //查询错误事件
    res2.on('error', function(err) {
      console.error('error: ' + err.message);
      //unbind操作，必须要做
      client.unbind();
    });

    //查询结束
    res2.on('end', function(result) {
      //console.log('search status: ' + result.status);
        /*if (user) {
            client.bind(ldapres.dn, password, function (err) {
                if (err) {
                    res.send('Wrong password');
                }
                else {
                    res.send('You are logged');
                }
            });
        }else {
            res.send('Invalid username');
        }*/
      //unbind操作，必须要做
      client.unbind();
    });

  });

});

