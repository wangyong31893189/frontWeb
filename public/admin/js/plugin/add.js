/**
 * Created by huanliu on 2015/11/2.
 */
$(function(){

    var add_node={

        init:function(){
            var $that=this;
            $("#submit_btn").click(function(){
                addPlugin();
            });

            //过滤tags
            $('#tags').blur(function(){
                var val=$(this).val();
                filterStr(val,$(this));
            })
            //    .keyup(function(){
            //    $(this).triggerHandler("blur");
            //})
            // .focus(function(){
            //    $(this).triggerHandler("blur");
            //});//end blur

            $that.initEditor();
        },
        initEditor:function(){
            // You can custom Emoji's graphics files url path
            editormd.emoji     = {
                path  : "http://www.emoji-cheat-sheet.com/graphics/emojis/",
                ext   : ".png"
            };
            // Twitter Emoji (Twemoji)  graphics files url path
            editormd.twemoji = {
                path : "http://twemoji.maxcdn.com/72x72/",
                ext  : ".png"
            };

            editor = editormd("editormd", {
                width: "90%",
                height: 640,
                markdown : "",
                path : '/libs/editor.md/lib/',
                toc : true,
                emoji : true,       // Support Github emoji, Twitter Emoji(Twemoji), fontAwesome, Editor.md logo emojis.
                taskList : true,
                saveHTMLToTextarea : true,
                //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为 true
                //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为 true
                //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为 true
                //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为 0.1
                //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为 #fff
                imageUpload : true,
                imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL : "/admin/uploadImg"
                /*
                 上传的后台只需要返回一个 JSON 数据，结构如下：
                 {
                 success : 0 | 1,           // 0 表示上传失败，1 表示上传成功
                 message : "提示的信息，上传成功或上传失败及错误信息等。",
                 url     : "图片地址"        // 上传成功时才返回
                 }
                 */
            });
        }
    }


    //过滤字符 tag 标签 以中文字符逗号分开
    function  filterStr(val,object){
        if(val){
            //val=val.replace(/(^\s*)|(\s*$)/g, "");//去除字符串前后空格.replace(/(^\s*)|(\s*$)/g, "");//去除字符串前后空格
            val=val.replace(/\s{1,}/g,"");//鼠标离开后多余空格删除
            val=val.replace(/\，{1,}/g,",");//将中文逗号替换成英文逗号
            val=val.replace(/\,{2,}/g,",");//将2个以上,号替换成一个,
            //val=val.replace(/\,*$/g, "");//去除末尾逗号
            val=val.replace(/(^\,*)|(^\s*)|(\s*$)|(\,*$)/g, "");//去除字符串前后空格和,号

        }
        object.val(val);
        console.log(val);
    }

    //添加插件
    function addPlugin(){
        var title=$("#title").val();
        if($.trim(title)==""){
            new Message({
                content:"请输入插件名称!"
            });
            return;
        }

        var content=editor.getMarkdown();//获取markdown html源码
        if($.trim(content)==''){//

            new Message({
                content:"请输入正文!"
            });
            return;
        }
        //$("#category_form").submit();

        var author=$("#author").val();
        var demoUrl=$("#demoUrl").val();
        var gitUrl=$("#gitUrl").val();
        var tags=$("#tags").val();

        var params={"title":title,"content":content,"author":author,"demoUrl":demoUrl,"gitUrl":gitUrl,"tags":tags};
        $.ajax({
            type: "POST",
            url: "/admin/plugin/add",
            data: params,
            dataType:"json",
            success: function(msg){
                if(msg.status=="success"){
                    window.location.href="/admin/plugin/list";
                }else if(msg.status=="error"){
                    new Message({
                        content:msg.msg
                    });
                }else{
                    new Message({
                        content:"添加插件失败！!"
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