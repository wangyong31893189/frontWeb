require.config({
    baseUrl:"/libs",
    paths: {
    	"react":"react/react.min",
        "jquery":"jquery/dist/jquery.min",
        "assembleUtil": 'utils/assembleUtil',
        "pluginModel": '/js/plugins/model',
        "pluginView": '/js/plugins/view',
        "pluginController": '/js/plugins/controller',
        "validator": 'validator-js/validator.min',
        "marked": 'editor.md/lib/marked.min',
        "prettify": 'editor.md/lib/prettify.min',
        "raphael": 'editor.md/lib/raphael.min',
        "underscore": 'editor.md/lib/underscore.min',
        "sequenceDiagram": 'editor.md/lib/sequence-diagram.min',
        "flowchart": 'editor.md/lib/flowchart.min',
        "jqueryflowchart": 'editor.md/lib/jquery.flowchart.min',
        "katex": '//cdn.bootcss.com/KaTeX/0.1.1/katex.min',
        "editormd": 'editor.md/editormd.amd'
    },
    shim: {

    }
});

require(["jquery","pluginController"], function ($,pluginController) {
    $(document).ready(function(){
    	pluginController.init();
    });
});