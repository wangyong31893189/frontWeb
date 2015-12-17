/**
 * Created by huanliu on 2015/10/9.
 */


    //文本框默认提示文字
    //function textFocus(el) {
    //    if (el.defaultValue == el.value) { el.value = ''; el.style.color = '#333'; }
    //}
    //function textBlur(el) {
    //    if (el.value == '') { el.value = el.defaultValue; el.style.color = '#999'; }
    //}

$(function(){
    //$("#merId").blur(function(){
    //
    //});

    //用户信息设置页面验证
    $('#userInfo_form :input').blur(function(){
        var $parent = $(this).parent();
        $parent.find(".formtips").remove();
        //验证用户名
        if( $(this).is('#nickName') ){
            if( this.value==""  ){
                var errorMsg = '请输入昵称.';
                //alert("值为："+$(this).val());
                $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
            }else{

                var okMsg = '输入正确.';
                $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
            }
        }

        //验证邮件
        if( $(this).is('#email') ){
            if( this.value!="" && !/.+@.+\.[a-zA-Z]{2,4}$/.test(this.value)  ){
                var errorMsg = '请输入正确的E-Mail地址.';
                $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
            }else{
                //var okMsg = '输入正确.';
                //$parent.removeChild()
                $parent.append('<span class="formtips onSuccess">'+'</span>');
            }
        }

    }).keyup(function(){
        $(this).triggerHandler("blur");
    }).focus(function(){
        $(this).triggerHandler("blur");
    });//end blur


    //重置
    $('#userInfo_form #res').click(function(){
        $(".formtips").remove();
        $('form :input').val("");
    });


    //用户管理-用户编辑页面
    $("#userAccountEdit_form :input").blur(function(){
        var $parent = $(this).parent();
        $parent.find(".formtips").remove();
        //验证用户名
        if( $(this).is('#userName') ){
            if( this.value==""  ){
                var errorMsg = '请输入用户名.';
                //alert("值为："+$(this).val());
                $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
            }else{

                var okMsg = '输入正确.';
                $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
            }
        }

        //验证用户名
        if( $(this).is('#nickName') ){
            if( this.value=="" ){
                var errorMsg = '请输入昵称.';
                $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
            }else{
                var okMsg = '输入正确.';
                //$parent.removeChild()
                $parent.append('<span class="formtips onSuccess">'+'</span>');
            }
        }

    }).keyup(function(){
        $(this).triggerHandler("blur");
    }).focus(function(){
        $(this).triggerHandler("blur");
    });//end blur



    //用户管理-修改密码页面密码验证
    $('#userAccount_form :input').blur(function(){
        var $parent = $(this).parent();
        $parent.find(".formtips").remove();

        var newPassword=$("#newPassword").val();
        //验证用户名
        if( $(this).is('#repeatPassword') ){
            if( this.value.length>0){
                if(this.value==newPassword){
                    ////var okMsg = '输入密码一致.';
                    //$parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
                }else{
                    var errorMsg = '两次输入密码不一致.';
                    //alert("值为："+$(this).val());
                    $parent.append('<span class="formtips onError">'+errorMsg+'</span>');

                }
            }

        }

    }).keyup(function(){
        var newPassword=$("#newPassword").val();
        if(this.value.length>0 && this.value.length >=newPassword.length ){
            $(this).triggerHandler("blur");
        }

    }).focus(function(){
        $(this).triggerHandler("blur");
    });//end blur

})

