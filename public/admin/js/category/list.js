$(function(){
	var list={
		init:function(){
			$("#search_btn").click(function(){
				var keyword=$("#keyword").val();
				window.location.href="/admin/category/list?keyword="+keyword;
			});
			$("#checkall").change(function(){
				var $ids=$("#datalist").find("input[name='ids']");
				if(this.checked){
					$ids.attr("checked",true);
				}else{
					$ids.attr("checked",false);
				}
			});

			$("#del_all_btn").click(function(){
				//alert("del_all_btn");
				new Message({
					//title:"提示信息",
					content:"确认删除选中的分类吗？",
					type:"confirm",
					closeFunc:function(){
						//alert("关闭");
					},
					sureFunc:function(){
						deleteMultCategory();//删除多个分类
					}
				});
			});
			$("#datalist").find(".del-btn").click(function(){
				var $that=$(this);
				new Message({
					//title:"提示信息",
					content:"确认删除该分类？",
					type:"confirm",
					closeFunc:function(){
						//alert("关闭");
					},
					sureFunc:function(){
						var id=$that.attr("data-id");
						if(id){
							delCategory(id);
						}
					}
				});
			});
			$("#add_btn").click(function(){
				//alert("add_btn");
				window.location.href="/admin/category/add";
			});
		}
	};

	//删除多个分类
	function deleteMultCategory(){
		var array = new Array(); //用于保存 选中的那一条数据的ID
        var flag=false; //判断是否一个未选
        $("input[name='ids']:checkbox").each(function() { //遍历所有的name为ids的 checkbox
            if ($(this).attr("checked")) { //判断是否选中
                flag = true; //只要有一个被选择 设置为 true
                return false;//跳出each
            }
        });
        if (flag) {
            $("input[name='ids']:checkbox").each(function() { //遍历所有的name为ids的 checkbox
                if ($(this).attr("checked")) { //判断是否选中
                    //alert($(this).val());
                    array.push($(this).val()); //将选中的值 添加到 array中
                    //str+=$(this).val()+",";

                }
            })
            //将要集体删除的数据 传递给action处理
            deleteMult(array);
        } else {
            // alert("请至少选择一个用户");
            new Message({
                //title:"提示信息",
                content:"请至少选择一篇文章!"
            });
        }
	}

	function deleteMult(ids){
		var ids=JSON.stringify(ids);
        var params={"ids":ids};
        $.ajax({
            type:"post",
            //url:'/admin/article/del?ids='+ids, //get方式
            url:'/admin/category/del',//post方式
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    window.location.href='/admin/category/list';
                }else if(msg.status=='error'){
                    new Message({
                        content:"删除（多条）文章失败!!"
                    });
                }else{
                    new Message({
                        content:"删除（多条）文章失败!!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"删除（多条）文章失败!"
                });
                console.log(msg);
            }
        })
	}

	//添加分类
	function delCategory(id){
		//$("#category_form").submit();
		var params={};
		$.ajax({
		   type: "delete",
		   url: "/admin/category/del/"+id,
		   data: params,
		   dataType:"json",
		   success: function(msg){
		     if(msg.status=="success"){
		     	window.location.href="/admin/category/list";
		     }else if(msg.status=="error"){
		     	new Message({
					//title:"提示信息",
					content:"删除分类失败!"
				});
		     }else{
		     	new Message({
					//title:"提示信息",
					content:"删除分类失败!"
				});
		     }
		   },
		   error:function(msg){
		   	 console.log(msg);
		   }
		 });
	}


	$(document).ready(function(){
		list.init();
	});
});