/**
 * Created by huanliu on 2015/9/28.
 */
$(function(){
    var edit_node={
        init:function(){
            //若表单的必填项为空则阻止提交按钮的默认行为
            $("button[type='submit']").click(function(){
                //alert("触发submit");
                $("#userAccountEdit_form :input.required").trigger('blur');//验证必填数据是否填写完整
                var numError = $('#userAccountEdit_form .onError').length;//验证是否有错误提示
                //if(numError) {
                //    alert('请填写完整表单数据');
                //    return false;
                //}else{
                //    return true;
                //}
                if(numError) {
                    new Message({
                        content:"请填写完整表单数据!"
                    });
                    return false;
                }else{
                    return true;
                }
            })
        }
    }



    $(document).ready(function(){
        edit_node.init();
    })
})