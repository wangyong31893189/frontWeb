$(function(){
    var menu_code={
        init:function(){
            var temp=null;
            var localMenu=$("#localMenu").val();
            //console.log($(".menu-list>li>a"));
            //��ȡ����ҳ�洫�������ӹؼ��ֵĵ�ǰ�˵�����
            $(".menu-list>li>a").each(function(){
                var that=$(this);
                var href=that.attr("data_localMenu");
                console.log(href);
                //if(href.indexOf(localMenu)!=-1){//�˵����Ƿ���������ӹؼ���
                if(href===localMenu){
                    temp=that.parent().index();//����� �ʹ�ȡ��ǰ�˵����� ������ѭ��
                    console.log(temp);
                    $(".menu-list>li").eq(temp).addClass("active").siblings().removeClass("active");
                    return;
                }
            })

            //if(temp||temp==0){
           // }

            //$(".menu-list>li").click(function(){
            //    ////var that=$(this)
            //    //temp=$(this).index();
            //    ////$(this).addClass("active").siblings().removeClass("active");
            //    //$(".menu-list>li").eq(temp).addClass("active").siblings().removeClass("active");
            //    //console.log( $(".menu-list>li"))
            //})

        }
    }
    $(document).ready(function(){
        menu_code.init();
    })
})