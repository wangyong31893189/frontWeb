$(function(){
	var assign={
		init:function(){
			$("#submit_btn").click(function(){
				assginRole();
			});
		}
	};

	//添加分类
	function assginRole(){
        var userId = $("#userId").val();
		var roleId = $("#roleId").val();
		var params={"role":{"id":roleId}};
		$.ajax({
		   type: "PUT",
		   url: "/admin/user/"+userId+"/role",
		   data: params,
		   dataType:"json",
		   success: function(result){
		     if(result.status === "success"){
		     	//window.location.href="/admin/user/list";
                history.back();
            }else if(result.status === "error"){
		     	new Message({
					content:result.msg
				});
            }else if(result.status === "warning"){
		     	new Message({
					content:result.msg
				});
		     }
		   },
		   error:function(result){
		   	 new Message({
					content:result.msg
				});
		   }
		 });
	}

	$(document).ready(function(){
		assign.init();
	});
});
