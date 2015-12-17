/**
* @description 组装相关工具类
* @ author eric
* @ create by  2015-11-10
**/

var AssembleUtil={
	/****
	 * comments数组重装
	**/
	assembleComments:function(comments,format){//comments 为重组的评论数组 {Array}
		if(!format){
			format=function(item){
				var textArr=[];
				for(var i in item){
					textArr.push(i+"="+item[i]);
				}
				return {text:textArr.join(",")};
			};
		}
		var tree={comments:[]};
		function walk (key, value) {
	        var i = 0;
	        var comment = comments[i];
	        while (comment) {
	            var parentID = comment["commentId"] ? comment["commentId"] : "";
	            // console.log("parentID="+parentID+",======"+comment["commentId"]+",key="+key);
	            if (parentID == key) {
	                //var child = {};
	                //var childKey = comment.id;
	                var childValue = format(comment);
	                comment.toStr=function(){
	                	return format(comment);
	                };
	                if(!comment.comments){
	                	comment.comments = [];
	            	}
	                // child[childKey] = childValue;
	                value.comments.push(comment);
	                walk(comment.id, comment);
	            }
	            comment = comments[++i];
	        }
	    }

	    walk("",tree);
	    return tree.comments;
	},
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	formatDate:function(date,fmt)
	{ //author: meizz
	  if(!date){
	  	return "";
	  }
	  var o = {
	    "M+" : date.getMonth()+1,                 //月份
	    "d+" : date.getDate(),                    //日
	    "h+" : date.getHours(),                   //小时
	    "m+" : date.getMinutes(),                 //分
	    "s+" : date.getSeconds(),                 //秒
	    "q+" : Math.floor((date.getMonth()+3)/3), //季度
	    "S"  : date.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt))
	    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)
	    if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	  return fmt;
	}
}

module.exports = AssembleUtil;