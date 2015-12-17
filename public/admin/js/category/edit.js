$(function(){
	var edit_node={
		init:function(){
			$("#submit_btn").click(function(){
				editCategory();
			});
		}
	};

	//添加分类
	function editCategory(){
		var id=$("#id").val();
		if($.trim(id)==""){
			alert("请输入分类ID！");
			return;
		}
		var categoryCode=$("#categoryCode").val();
		if($.trim(categoryCode)==""){
			alert("请输入分类代码！");
			return;
		}
		var categoryName=$("#categoryName").val();
		if($.trim(categoryName)==""){
			alert("请输入分类名称！");
			return;
		}
		$("#category_form").submit();
		/*var params={"categoryCode":categoryCode,"categoryName":categoryName,"id":id};
		$.ajax({
		   type: "POST",
		   url: "/admin/category/edit",
		   data: params,
		   dataType:"json",
		   success: function(msg){
		     if(msg.status=="success"){
		     	window.location.href="/admin/category/list";
		     }else if(msg.status=="error"){
		     	alert("编辑分类失败！");
		     }else{
		     	alert("编辑分类失败！");
		     }
		   },
		   error:function(msg){
		   	 console.log(msg);
		   }
		 });*/
	}

	$(document).ready(function(){
		edit_node.init();
	});
});