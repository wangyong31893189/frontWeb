/**
 * Created by huanliu on 2015/9/28.
 */
$(function(){
    var edit_node={
        init:function(){

            //�����ı�����Ϊ������ֹ�ύ��ť��Ĭ����Ϊ
            $("button[type='submit']").click(function(){
                //alert("����submit");
                $("#userInfo_form :input.required").trigger('blur');//��֤���������Ƿ���д����
                var numError = $('#userInfo_form .onError').length;//��֤�Ƿ��д�����ʾ
                if(numError) {
                    alert('����д����������');
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