define("CloudService", ["jquery"], function ($) {
    return {
        getCategories: function (retFunc) {
            $.get('/cloud/category', function (result) {
                retFunc(result);
            });
        },
        getArticalsByCategory: function (categoryName, pager, retFunc) {
            $.get('cloud/category/' + categoryName + '/article', pager, function (result) {
                retFunc(result);
            });
        },
        
        getArticleById: function (id, retFunc) {
            $.get('cloud/article/' + id, function (result) {
                retFunc(result);
            });
        },
        
        getSiblingArticle: function(id,categoryName,direction, retFunc){
            $.get('cloud/category/'+categoryName+'/article/' + id+'/'+direction, function (result) {
                retFunc(result);
            }); 
        },
        getCommentsById: function (id, pager, retFunc) {
            $.get('cloud/article/' + id + "/comment", pager, function (result) {
                retFunc(result);
            });
        },
        
        publishComment: function(comment, retFunc){
            $.post('cloud/comment',comment, function(result){
                retFunc(result);    
            });
        }
    };
});