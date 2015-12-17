/**
 *
 * 使用例子
 * String href="getCounterGoodsList.html";
 * int pageIndex=1;
 * String pageIndexName="pageIndex";
 * int totalRows=60;
 * int pageSize=15;
 * PagerUtil pagerUtil=new PagerUtil(href,pageIndex,pageIndexName,totalRows,pageSize);
 * String pagerResult=pagerUtil.getPager();
 *
 * href=<请求的连接，后可带参数>，pageIndex=<当前页码>，pageIndexName=<当前页码字段名>，
 * pageSize=<每页的记 录数>， totalRows=<数据库中的总记录数>
 */
var logger = require("../../../conf/log4j").helper;
var Pager=function(options){
	this.totalRows=1;
	this.pageSize=15;
	this.pageIndex=1;
	this.totalPage=1;
	this.pageIndexName="pageIndex";
	this.javaScriptName="";
	for(var i in options){
		this[i]=options[i];
	}
};

Pager.prototype={
	getPager:function(){
		var that=this;
		var sb=[];
		var href=that.processParameterUrl(that.href);
		var totalRows=that.totalRows,pageIndexName=that.pageIndexName,pageSize=that.pageSize,pageIndex=that.pageIndex,totalPage=that.totalPage,javaScriptName=that.javaScriptName;
		logger.info("pager.js>>>>>>>>>getPager>>>>>>>>>that.options："+JSON.stringify(that));
		if(totalRows>0&&pageSize>0){
			if(pageIndex<=0){
				pageIndex=1;
			}
			totalPage=parseInt(totalRows/pageSize,10);
			var mod=totalRows%pageSize;
			if(mod>0){
				totalPage++;
			}
			if(pageIndex>totalPage){
				pageIndex=totalPage;
			}
			if(totalPage>100){
				totalPage=100;
			}
			var javaScriptFlag=false;//是否用javaScript跳转
			if(javaScriptName!=null&&!""==javaScriptName){
				javaScriptFlag=true;
			}
			if(href.indexOf('?')==-1){
				href=href+'?';
			}else{
				href=href+'&';
			}
			sb.push('<form action="'+href+'" method="post" id="pager_form"><ul>');
			logger.log("pager.js-------------->pageIndex="+pageIndex+",totalPage="+totalPage);
			if(pageIndex==1){
				sb.push('<li><a href="#"><i class="ico ico-page-prev"></i></a></li>');
				//sb.push('<li class="disable"><a href="javascript:void(0)" style="color:#999;cursor: default;">上一页</a></li>');
			}else{
				if(javaScriptFlag){
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex-1)+');"><i class="ico ico-page-prev"></i></a></li>');
//					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex-1)+');">上一页</a></li>');
				}else{
					sb.push('<li><a href="'+href+pageIndexName+'='+(pageIndex-1)+'"><i class="ico ico-page-prev"></i></a></li>');
//					sb.push('<li><a href='+href+pageIndexName+'='+(pageIndex-1)+'>上一页</a></li>');
				}
			}
			//sb.push('<li>');
			if(totalPage<=10){
				for(var i=0;i<totalPage;i++){
					if((i+1)==pageIndex){
						sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
						i=i+1;
						if(pageIndex==totalPage){
							break;
						}
					}
					if(javaScriptFlag){
						sb.push('<li><a href="javascript:'+javaScriptName+'('+(i+1)+');">'+(i+1)+'</a></li>');
					}else{
						sb.push('<li><a href='+href+pageIndexName+'='+(i+1)+'>'+(i+1)+'</a></li>');
					}
				}
			}else if(totalPage<=20){
				var lPage = 0;
	            var rPage = 0;
	            if(pageIndex<5){
	            	lPage=pageIndex-1;
	            	rPage=10-lPage-1;
	            }else if(totalPage-pageIndex<5){
	            	rPage=totalPage-pageIndex;
	            	lPage=10-1-rPage;
	            }else{
	            	lPage=4;
	            	rPage=5;
	            }
	            var tmp=pageIndex-lPage;
	            for(var i=tmp;i<tmp+10;i++){
	            	if(i==pageIndex){
	            		sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
	            		i=i+1;
	            		if(pageIndex==totalPage){
							break;
						}
	            	}
	            	if(javaScriptFlag){
	            		sb.push('<li><a href="javascript:'+javaScriptName+'('+i+');">'+i+'</a></li>');
	            	}else{
	            		sb.push('<li><a href="'+href+pageIndexName+'='+i+'">'+i+'</a></li>');
	            	}
	            }
			}else if(pageIndex<7){
				for(var i=0;i<7;i++){
					if(i+1==pageIndex){
						sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
						i=i+1;
					}
					if(javaScriptFlag){
						sb.push('<li><a href="javascript:'+javaScriptName+'('+(i+1)+');">'+(i+1)+'</a></li>');
					}else{
						sb.push('<li><a href="'+href+pageIndexName+'='+(i+1)+'">'+(i+1)+'</a></li>');
					}
				}
				sb.push('<li><a href="javascript:void(0)" class="dot">...</a></li>');
				if(javaScriptFlag){
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(totalPage-1)+');">'+(totalPage-1)+'</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+totalPage+');">'+totalPage+'</a></li>');
				}else{
					sb.push('<li><a href="'+href+pageIndexName+'='+(pageIndex-1)+'">'+(totalPage-1)+'</a></li>');
					sb.push('<li><a href="'+href+pageIndexName+'='+totalPage+'">'+totalPage+'</a></li>');
				}
			}else if(pageIndex>totalPage-6){
				if(javaScriptFlag){
					sb.push('<li><a href="javascript:'+javaScriptName+'(1);">1</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'(2);">2</a></li>');
				}else{
					sb.push('<li><a href='+href+pageIndexName+'=1>1</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'=2>2</a></li>');
				}
				sb.push('<li><a href="javascript:void(0)"  class="dot">...</a></li>');
				for(var i=totalPage-7;i<totalPage;i++){
					if(i+1==pageIndex){
						sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
						i=i+1;
	            		if(pageIndex==totalPage){
							break;
						}
					}
					if(javaScriptFlag){
						sb.push('<li><a href="javascript:'+javaScriptName+'('+(i+1)+');">'+(i+1)+'</a></li>');
					}else{
						sb.push('<li><a href="'+href+pageIndexName+'='+(i+1)+'">'+(i+1)+'</a></li>');
					}
				}
			}else{
				if(javaScriptFlag){
					sb.push('<li><a href="javascript:'+javaScriptName+'(1);">1</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'(2);">2</a></li>');
					sb.push('<li><a href="javascript:void(0)">...</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex-2)+');">'+(pageIndex-2)+'</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex-1)+');">'+(pageIndex-1)+'</a></li>');
					sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex+1)+');">'+(pageIndex+1)+'</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex+2)+');">'+(pageIndex+2)+'</a></li>');
					sb.push('<li><a href="javascript:void(0)">...</a></li>');
					sb.push('<li><a href="javascript:'+javaScriptName+'('+totalPage+');">'+totalPage+'</a></li>');
				}else{
					sb.push('<li><a href='+href+pageIndexName+'=1>1</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'=2>2</a></li>');
					sb.push('<li><a href="javascript:void(0)">...</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'='+(pageIndex-2)+'>'+(pageIndex-2)+'</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'='+(pageIndex-1)+'>'+(pageIndex-1)+'</a></li>');
					sb.push('<li><a href="javascript:void(0)" class="active">'+pageIndex+'</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'='+(pageIndex+1)+'>'+(pageIndex+1)+'</a></li>');
					sb.push('<li><a href='+href+pageIndexName+'='+(pageIndex+2)+'>'+(pageIndex+2)+'</a></li>');
					sb.push('<li><a href="javascript:void(0)">...</a></li>');
					sb.push('<li><a href="'+href+pageIndexName+'='+totalPage+'">'+totalPage+'</a></li>');
				}
			}
//			sb.push('</li>');
			//<li><a href="#" class="page-next">›</a></li>
			if(pageIndex==totalPage){
				sb.push('<li class="disable"><a href="javascript:void(0)"><i class="ico ico-page-next"></i></a></li>');
//				sb.push('<li><a href="javascript:void(0)">尾页</a></li>');
			}else{
				if(javaScriptFlag){
					sb.push('<li><a href="javascript:'+javaScriptName+'('+(pageIndex+1)+');"><i class="ico ico-page-next"></i></a></li>');
					//sb.push('<li class="last png"><a href="javascript:'+javaScriptName+'('+(totalPage)+');">尾页</a></li>');
				}else{
					sb.push('<li><a href="'+href+pageIndexName+'='+(pageIndex+1)+'"><i class="ico ico-page-next"></i></a></li>');
					//sb.push('<li class="last png"><a href='+href+pageIndexName+'='+totalPage+'>尾页</a></li>');
				}
			}
			//sb.push('<li class="page-total">共'+totalPage+'页</li>');
			//sb.push('<li class>到第<input type="text" name="page" class="page-no"/>页</li>');
			//sb.push('<li><button type="button" onclick="document.forms[\'pager_form\'].submit()" class="page-sure-btn">确定</button></li>');
			sb.push('</ul></form>');
		}
		return sb.join('');
	},processParameterUrl:function(href) {
		href=href.replace(/null/g, '').replace(/NULL/g, '');
		return href;
	}

}

module.exports = Pager;
