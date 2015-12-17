/**
 * Created by huanliu on 2015/11/2.
 */

$(function(){
    var EditormdView=null;
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

            EditormdView = editormd.markdownToHTML("editormdView", {
                htmlDecode      : "style,script,iframe",  // you can filter tags decode
                emoji           : true,
                taskList        : true,
                tex             : true,  // 默认不解析
                flowChart       : true,  // 默认不解析
                sequenceDiagram : true // 默认不解析
            });
        }
    };

    $(document).ready(function(){
        view_node.init();
    });
})