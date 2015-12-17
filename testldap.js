/*var ldap = require('ldapjs');
 
ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;
 
var client = ldap.createClient({
  // 服务器和 域节点
  url: 'ldap://10.48.196.80:389/OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn'
});
//// 域节点
var searchBase ="OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn";
 
var opts = {
  //// LDAP搜索过滤器类
  filter: '(sAMAccountName=yongwang)',
  // 搜索控制器  // 设置搜索范围
  scope: 'sub',
  attributes: ['objectGUID','sAMAccountName', 'name']
};
 
client.bind('username', 'password', function (err) {
  client.search('CN=test,OU=Development,DC=Home', opts, function (err, search) {
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user.objectGUID+user.sAMAccountName+user.name);
    });
  });
});*/

/*var ldap = require('ldapjs');

var server = ldap.createServer();

server.search('o=example', function(req, res, next) {
  var obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['organization', 'top'],
      o: 'example'
    }
  };

  if (req.filter.matches(obj.attributes))
    res.send(obj);

  res.end();
});

server.listen(1389, function() {
  console.log('LDAP server listening at %s', server.url);
});*/


// var ldap = require('ldapjs');
// var client = ldap.createClient({
//   url: 'ldap://10.48.196.80:389'
//  // log:"info",
//   //timeout:10000,
//  // maxConnections:10
// });
/*
client.bind('cn=root', 'secret', function(err) {
 // assert.ifError(err);
});

var entry = {
  cn: 'foo',
  sn: 'bar',
  email: ['foo@bar.com', 'foo1@bar.com'],
  objectclass: 'fooPerson'
};
client.add('cn=foo, o=example', entry, function(err) {
 // assert.ifError(err);
});

client.compare('cn=foo, o=example', 'sn', 'bar', function(err, matched) {
  //assert.ifError(err);

  console.log('matched: ' + matched);
});*/

// console.log("连接成功启动！");

/*
var opts = {
  filter: '(&(l=Seattle)(email=*@foo.com))',
  scope: 'sub'
};

client.search('o=example', opts, function(err, res) {
  assert.ifError(err);

  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});*/

/*client.bind('OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn,cn=report', 'china76!',function(err) {
  console.log("bind==="+err);
});*/
/*
var opts = {
  filter: 'objectclass=User',
  scope: 'sub'
};

client.search('cn=report', opts, function(err, res) {
  //assert.ifError(err);
  //console.log(err+"-------"+res);
  console.log("res="+JSON.stringify(res));
  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});*/


/*var ldap = require('ldapjs');

ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

var client = ldap.createClient({
  url: 'ldap://10.48.196.80:389/OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn'
});

var opts = {
  filter: '(objectclass=user)',
  scope: 'sub',
  attributes: ['objectGUID']
};

client.bind('cn=report', 'china76!', function (err) {
  if(err){
    console.log("-------"+err);
  }
  client.search('CN=report,OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn', opts, function (err, search) {
    if(err){
      console.log("-------"+err);
    }
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user.objectGUID);
    });
  });
});*/




/*client.bind('OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn|OU=User1,DC=99wuxian,DC=com', 'secret', function(err) {
  assert.ifError(err);
});*/
/*var opts = {
  filter: 'objectClass=User',
  scope: 'sub',
  attributes: ['dn', 'sn', 'cn']
};

client.search('OU=User Accounts,OU=SH,DC=handpay,DC=com,DC=cn', opts, function(err, res) {
  assert.ifError(err);

  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});*/

var ldap = require('ldapjs');
var assert = require('assert');
var client = ldap.createClient({
  url: 'ldap://180.153.177.112:33389'
});

console.log("连接成功启动！");

//创建LDAP查询选项
//filter的作用就是相当于SQL的条件
var opts = {
 filter: 'sAMAccountName=zqjiang', //查询条件过滤器，查找uid=kxh的用户节点
 scope: 'sub',    //查询范围
 timeLimit: 500,    //查询超时
 attributes: ['objectGUID','sAMAccountName','cn','mail','manager','memberOf']
};

//将client绑定LDAP Server
//第一个参数：是用户，必须是从根节点到用户节点的全路径
//第二个参数：用户密码
var path="CN=勇 王,OU=技术架构,OU=技术研发部,OU=技术平台,OU=user1,DC=99wuxian,DC=com";
// var path="OU=user1,DC=99wuxian,DC=com";
client.bind(path,'q1w2e3r4t5!!', function (err1, res1) {
  console.log(path+"err1="+err1+",res1="+res1);
  //开始查询0
  //第一个参数：查询基础路径，代表在查询用户信心将在这个路径下进行，这个路径是由根节开始
  //第二个参数：查询选项
  client.search('OU=User1,DC=99wuxian,DC=com', opts, function (err2, res2) {
    //console.log("err2="+err2+",res2="+JSON.stringify(res2));
    //查询结果事件响应
    var user=null;
    res2.on('searchEntry', function (entry) {
      console.log("entry="+entry);
      //获取查询的对象
      user = entry.object;
      var userText = JSON.stringify(user,null,2);
      console.log("userText="+userText);
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
      console.log('search status: ' + result.status);
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

