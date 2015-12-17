$(function(){
	var edit={
		init:function(){
			$("#submit_btn").click(function(){
				updateRole();
			});

            $("#checkall").change(function(){
				var $ids=$("#datalist").find("input[name='ids']");
				if(this.checked){
					$ids.attr("checked",true);
				}else{
					$ids.attr("checked",false);
				}
			});
		}
	};

	//添加分类
	function updateRole(){
		var roleId = $("#roleId").val();
		var roleName = $("#roleName").val();
        var description = $("#description").val();
		if($.trim(roleName)==""){
			new Message({
					content:"请输入角色名称!"
				});
			return;
		}
        var actionIds = [];
        $("input[name='ids']:checkbox").each(function() { //遍历所有的name为ids的 checkbox
            if ($(this).attr("checked")) { //判断是否选中
                actionIds.push($(this).val()); //将选中的值 添加到 array中
            }
        })

		var params={"id":roleId,"roleName":roleName,"desc":description,"actionIds":actionIds};
		$.ajax({
		   type: "PUT",
		   url: "/admin/role",
		   data: params,
		   dataType:"json",
		   success: function(result){
		     if(result.status === "success"){
		     	window.location.href="/admin/authority/list";
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
		edit.init();
	});
});
