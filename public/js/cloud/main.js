require.config({
    baseUrl:"/libs",
    paths: {
        "Ukulele": 'ukulelejs/dist/ukulele',
        "domReady": 'domReady/domReady',
        "jquery": 'jquery/dist/jquery.min',
        "CloudController": '/js/cloud/CloudController',
        "CloudService": '/js/cloud/CloudService',
        "marked": 'editor.md/lib/marked.min',
        "prettify": 'editor.md/lib/prettify.min',
        "raphael": 'editor.md/lib/raphael.min',
        "underscore": 'editor.md/lib/underscore.min',
        "sequenceDiagram": 'editor.md/lib/sequence-diagram.min',
        "flowchart": 'editor.md/lib/flowchart.min',
        "jqueryflowchart": 'editor.md/lib/jquery.flowchart.min',
        "katex": '//cdn.bootcss.com/KaTeX/0.1.1/katex.min',
        "editormd": 'editor.md/editormd.amd',
        "moment": 'moment/min/moment.min',
        "validator":'validator-js/validator.min',
        "lodash": 'lodash/lodash.min'
    },
    shim: {
        "jqueryflowchart":{
            deps:["jquery","flowchart"]
        },
        "sequenceDiagram":{
            deps:["raphael"]
        }
    }
});

require(["domReady", "Ukulele","CloudController"], function (domReady, Ukulele, CloudController,editormd) {
    var uku;
    domReady(function () {
        uku = new Ukulele();
        var cloudCtrl = new CloudController(uku)
        uku.registerController("cloudCtrl", cloudCtrl);
        uku.init();

        uku.initHandler = function (element) {
            cloudCtrl.init();
        };
    });
});