$(function(){
    var menu_code={
        init:function(){
            var temp=null;
            var localMenu=$("#localMenu").val();
            //console.log($(".menu-list>li>a"));
            //获取包含页面传来的链接关键字的当前菜单索引
            $(".menu-list>li>a").each(function(){
                var that=$(this);
                var href=that.attr("data_localMenu");
                console.log(href);
                //if(href.indexOf(localMenu)!=-1){//菜单里是否包含有链接关键字
                if(href===localMenu){
                    temp=that.parent().index();//如果有 就存取当前菜单索引 并跳出循环
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