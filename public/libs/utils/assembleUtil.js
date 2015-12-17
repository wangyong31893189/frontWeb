/**
* @description 组装相关工具类
* @ author eric
* @ create by  2015-11-10
**/
/*;(function(){
if (typeof define === 'function' && define.amd) {
        define('AssembleUtil', [], function() {
            return AssembleUtil;
        });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = AssembleUtil;
        }
        exports.AssembleUtil = AssembleUtil;
    } else {
        window['AssembleUtil'] = AssembleUtil;
    }*/
(function (name, definition) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
})('AssembleUtil', function (AssembleUtil) {
	'use strict';
 AssembleUtil={
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
	}
}

return AssembleUtil;
});