/**
 * Created by huanliu on 2015/12/8.
 */
$(function(){
   var  add_node={
       init:function(){
           $("#submit_btn").click(function(){
               addUserAccount();
           });
       }


   }

    function addUserAccount(){
        var userName=$("#userName").val();
        if($.trim(userName)==""){
            new Message({
                content:"请输入用户名!"
            });
            return;
        }

        var password=$("#password").val();
        if($.trim(password)==""){
            new Message({
                content:"请输入密码!"
            });
            return;
        }

        var userName=$("#userName").val();
        var password=$("#password").val();
        var params={"userName":userName,"password":password};
        $.ajax({
            type: "POST",
            url: "/admin/user/add",
            data: params,
            dataType:"json",
            success: function(msg){
                if(msg.status=="success"){
                    window.location.href="/admin/user/list";
                }else if(msg.status=="error"){
                    new Message({
                        content:msg.msg
                    });
                }else{
                    new Message({
                        content:"添加用户失败！!"
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
    })
})