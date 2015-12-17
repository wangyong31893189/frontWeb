/**
 * Created by huanliu on 2015/12/8.
 */
$(function(){
    var list={
        init:function(){
            $("#add_btn").click(function(){
                window.location.href="/admin/user/add";
            });

            $("#search_btn").click(function(){
                var keyword=$("#keyword").val();
                window.location.href="/admin/user/list?keyword="+keyword;
            });

            $("#datalist").find(".del-btn").click(function(){
                var $that=$(this);

                new Message({
                    //title:"",
                    content:"确认删除该用户？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        var id=$that.attr("data-id")
                        if(id){
                            delUserAccount(id);
                        }

                    }
                });

            });

            var $ids=$("#datalist").find('input[name="ids"]');
            $("#checkall").change(function(){
                if($(this).attr("checked")){
                    $ids.attr("checked",true);
                }else{
                    $ids.attr("checked",false);
                }
            })
            $("#del_all_btn").click(function(){
                new Message({
                    content:"确认删除选中的用户吗？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        deleteMultuseAccount();//删除多个插件
                    }
                })
            });

        }
    };

    function delUserAccount(id){
        var params={};
        $.ajax({
            type:"get",
            url:"/admin/user/del/"+id,
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    // window.location.href='/admin/article/list';
                    window.location.reload();
                }else if(msg.status=='error'){
                    // alert('删除用户失败!');
                    new Message({
                        content:"删除用户失败!"
                    });
                }else{
                    new Message({
                        content:"删除用户失败!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"删除用户失败!"
                });
                console.log(msg);
            }
        })
    }


    //多删
    //多删 多个数据如何传输数据
    function deleteMultuseAccount(){//如何获取多个数据的id？
        var array=new Array();//用于保存 选中的那一条数据的ID
        var flag=false;//判断是否一个未选
        $("input[name='ids']:checkbox").each(function(){//遍历所有的name为ids的 checkbox
            if($(this).attr("checked")){//判断是否选中
                flag=true;//只要有一个被选择 设置为 true
                return false;//跳出each
            }
        });
        if(flag){
            $("input[name='ids']:checkbox").each(function(){//遍历所有的name为ids的 checkbox
                if($(this).attr("checked")){//判断是否选中
                    array.push($(this).val())//将选中的值 添加到 array中
                }
            });

            //return  array;//不需要返回
            //将要集体删除的数据 传递给action处理
            deleteMult(array);

        }else{
            new Message({
                content:"请至少选择一个用户！"
            })
        }
    }


    function  deleteMult(ids){
        //var ids=JSON.stringify(ids);
        var params={ids:ids};
        $.ajax({
            type:"post",
            url:'/admin/user/del',//post方式
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    window.location.href='/admin/user/list';
                }else if(msg.status=='error'){
                    new Message({
                        content:"删除（多个）用户失败!!"
                    });
                }else{
                    new Message({
                        content:"删除（多个）用户失败!!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"删除（多个）用户失败!"
                });
                console.log(msg);
            }
        })
    }


    $(document).ready(function(){
        list.init();
    })
})