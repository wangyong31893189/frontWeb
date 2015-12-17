/**
 * Created by wangyong on 2015/10/19.
 */
$(function(){
    var editor=null;
    var view_node={
        init:function(){
            var that=this;
            that.initEditor();
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
                    imageUploadURL : "http://localhost:3000/admin/uploadImg",
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
    };

    $(document).ready(function(){
        view_node.init();
    });
})