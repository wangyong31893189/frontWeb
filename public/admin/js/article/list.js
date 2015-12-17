/**
 * Created by huanliu on 2015/9/16.
 */
$(function(){
    var list={
        init:function(){
            $("#add_btn").click(function(){
                window.location.href="/admin/article/add";
            });
            $("#category_btn").change(function(){
                var keyword=$("#keyword").val();
                var categoryCode=$(this).val();
                window.location.href="/admin/article/list?keyword="+keyword+"&categoryCode="+categoryCode;
            });
            $("#datalist").find(".del-btn").click(function(){
                var $that=$(this);
                new Message({
                    //title:"提示信息",
                    content:"确认删除该文章？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        var id=$that.attr("data-id");
                        if(id){
                            delArticle(id);
                        }
                    }
                });
            });
            $(".verify-btn").click(function(){
                var id=$(this).attr("data-id");
                new Message({
                    title:"审核文章",
                    content:"请选择通过或者不通过",
                    type:"confirm",
                    sureName:"通过",
                    cancelName:"不通过",
                    closeFunc:function(){
                        verify(id,2);//审核不通过
                    },
                    sureFunc:function(){
                        verify(id,1);//审核通过
                    }
                });
            });
            $("#search_btn").click(function(){
                var keyword=$("#keyword").val();
                var categoryCode=$("#category_btn").val();
                window.location.href="/admin/article/list?keyword="+keyword+"&categoryCode="+categoryCode;
            });
            $("#checkall").change(function(){
                var $ids=$("#datalist").find("input[name='ids']");
                //alert(this);
                if(this.checked){
                    $ids.attr("checked",true);
                }else{
                    $ids.attr("checked",false);
                }
            });
            $("#del_all_btn").click(function(){
                new Message({
                    //title:"提示信息",
                    content:"确认删除选中的文章？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        delMultArticle();//多个删除
                    }
                });
            });
        }
    }

    //审核文章
    function verify(id,status){
         $.ajax({
            type:"post",
            //url:'/admin/article/del?ids='+ids, //get方式
            url:'/admin/article/verify',//post方式
            data:{id:id,status:status},
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    window.location.reload();
                }else if(msg.status=='error'){
                    new Message({
                        content:"审核文章出错!"
                    });
                }else if(msg.status=='login'){
                    window.location.href='/admin/login';
                }else{
                    new Message({
                        content:"审核文章出错!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"审核文章出错!"
                });
                console.log(msg);
            }
        });
    }

    //多个如何传输数据
    function delMultArticle() {
        var array = new Array(); //用于保存 选中的那一条数据的ID
        var flag=false; //判断是否一个未选
        $("input[name='ids']:checkbox").each(function() { //遍历所有的name为ids的 checkbox
            if ($(this).attr("checked")) { //判断是否选中
                flag = true; //只要有一个被选择 设置为 true
                return false;//跳出each
            }
        })
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

    //删除多条数据
    function  deleteMult(ids){
       var ids=JSON.stringify(ids);
        var params={"ids":ids};
        $.ajax({
            type:"post",
            //url:'/admin/article/del?ids='+ids, //get方式
            url:'/admin/article/del',//post方式
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    // window.location.href='/admin/article/list';
                    window.location.reload();
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
                    content:"删除（多条）文章失败!!"
                });
                console.log(msg);
            }
        });
    }

    //删除分类
    function delArticle(id){
        var params={};
        $.ajax({
            type:"get",
            url:'/admin/article/del/'+id,
            data:params,
            dataType:"json",
            success:function(msg){
               if(msg.status=='success'){
                   // window.location.href='/admin/article/list';
                   window.location.reload();
               }else if(msg.status=='error'){
                   // alert('删除文章失败!');
                    new Message({
                        content:"删除文章失败!"
                    });
               }else{
                   new Message({
                        content:"删除文章失败!"
                    });
               }
            },
            error:function(msg){
                new Message({
                        content:"删除文章失败!"
                    });
                console.log(msg);
            }
        })

    }

    $(document).ready(function(){
        list.init();
    })
})