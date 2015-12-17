$(function(){
	var add_node={
		init:function(){
			$("#submit_btn").click(function(){
				addCategory();
			});
		}
	};

	//添加分类
	function addCategory(){
		var categoryCode=$("#categoryCode").val();
		if($.trim(categoryCode)==""){
			new Message({
					content:"请输入分类代码!"
				});
			return;
		}
		var categoryName=$("#categoryName").val();
		if($.trim(categoryName)==""){
			alert("请输入分类名称！");
			new Message({
					content:"请输入分类代码!"
				});
			return;
		}
		//$("#category_form").submit();
		var params={"categoryCode":categoryCode,"categoryName":categoryName};
		$.ajax({
		   type: "POST",
		   url: "/admin/category/add",
		   data: params,
		   dataType:"json",
		   success: function(msg){
		     if(msg.status=="success"){
		     	window.location.href="/admin/category/list";
		     }else if(msg.status=="error"){
		     	new Message({
					content:msg.msg
				});
		     }else{
		     	new Message({
					content:"添加分类失败！!"
				});
		     }
		   },
		   error:function(msg){
		   	 new Message({
					content:msg
				});
		   }
		 });
	}

	$(document).ready(function(){
		add_node.init();
	});
});