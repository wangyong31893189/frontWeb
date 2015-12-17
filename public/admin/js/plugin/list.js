/**
 * Created by huanliu on 2015/11/2.
 */
$(function(){
    var list={
        init:function(){
            $("#add_btn").click(function(){
                window.location.href="/admin/plugin/add";
            });

            $("#datalist").find(".del-btn").click(function(){
                var $that=$(this);

                new Message({
                    //title:"",
                    content:"确认删除该插件？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        var id=$that.attr("data-id")
                        if(id){
                            delPlugin(id);
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
                    content:"确认删除选中的插件吗？",
                    type:"confirm",
                    closeFunc:function(){
                        //alert("关闭");
                    },
                    sureFunc:function(){
                        deleteMultPlugin();//删除多个插件
                    }
                })
            });


            $(".verify-btn").click(function(){
                var id=$(this).attr("data-id");
                new Message({
                    title:"审核插件",
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
                window.location.href="/admin/plugin/list?keyword="+keyword;
            });
        }
    }

    //多删 多个数据如何传输数据
    function deleteMultPlugin(){//如何获取多个数据的id？
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
                content:"请至少选择一个插件！"
            })
        }
    }

    function  deleteMult(ids){
        //var ids=JSON.stringify(ids);
        var params={ids:ids};
        $.ajax({
            type:"post",
            url:'/admin/plugin/del',//post方式
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    window.location.href='/admin/plugin/list';
                }else if(msg.status=='error'){
                    new Message({
                        content:"删除（多个）插件失败!!"
                    });
                }else{
                    new Message({
                        content:"删除（多个）插件失败!!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"删除（多个）插件失败!"
                });
                console.log(msg);
            }
        })
    }

    //单个删除
    function delPlugin(id){
        var params={};
        $.ajax({
            type:"get",
            url:"/admin/plugin/del/"+id,
            data:params,
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    // window.location.href='/admin/article/list';
                    window.location.reload();
                }else if(msg.status=='error'){
                    // alert('删除插件失败!');
                    new Message({
                        content:"删除插件失败!"
                    });
                }else{
                    new Message({
                        content:"删除插件失败!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"删除插件失败!"
                });
                console.log(msg);
            }
        })
    }


    //审核插件
    function verify(id,status){
        $.ajax({
            type:"post",
            url:'/admin/plugin/verify',//post方式
            data:{id:id,status:status},
            dataType:"json",
            success:function(msg){
                if(msg.status=='success'){
                    window.location.reload();
                }else if(msg.status=='error'){
                    new Message({
                        content:"审核插件出错!"
                    });
                }else if(msg.status=='login'){
                    window.location.href='/admin/login';
                }else{
                    new Message({
                        content:"审核插件出错!"
                    });
                }
            },
            error:function(msg){
                new Message({
                    content:"审核插件出错!"
                });
                console.log(msg);
            }
        });
    }

    $(document).ready(function(){
        list.init();
    })
})