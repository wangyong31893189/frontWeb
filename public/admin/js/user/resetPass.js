/**
 * Created by huanliu on 2015/12/11.
 */
/**
 * Created by huanliu on 2015/9/28.
 */
$(function(){
    var edit_node={
        init:function(){
            $("#submit_btn").click(function(){
                editUserAccount();
            });


        }
    }

    function editUserAccount(){
        var id=$("#id").val();
        var userName=$("#userName").val();
        var password=$("#password").val();
        var newPassword=$("#newPassword").val();
        var repeatPassword=$("#repeatPassword").val();
        if($.trim(userName)==''){//除去前后空格判断输入框内容是否为空
            //alert("请输入插件名称！");
            new Message({
                content:"请输入用户名！"
            })
            return;
        }
        if($.trim(password)==''){//除去前后空格判断输入框内容是否为空
            //alert("请输入插件名称！");
            new Message({
                content:"请输入原始密码！"
            })
            return;
        }
        if($.trim(newPassword)==''){//除去前后空格判断输入框内容是否为空
            //alert("请输入插件名称！");
            new Message({
                content:"请输入新密码！"
            })
            return;
        }
        if($.trim(repeatPassword)==''){//除去前后空格判断输入框内容是否为空
            //alert("请输入插件名称！");
            new Message({
                content:"请再次输入新密码！"
            })
            return;
        }


        var numError = $('#userAccount_form .onError').length;
        if(numError){
            //alert('请填写完整表单数据');
            new Message({
                content:"请填写完整表单数据！"
            })
            return;
        }
        //$("#userAccount_form").submit();//node方式处理返回结果   有的用ajax处理返回结果
        var params={"id":id,"userName":userName,"password":password,"newPassword":newPassword};
        $.ajax({
            type: "POST",
            url: "/admin/user/resetPass",
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
                        content:"编辑用户失败！"
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
        edit_node.init();
    })
})