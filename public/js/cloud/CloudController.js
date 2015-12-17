define("CloudController", ["CloudService", "jquery", "editormd", "moment", "lodash", "../js/cloud/CommentController"], function (service, $, editormd, moment, _, CommentController) {
    return function (uku) {
        var self = this;
        var commentCtrl = null;
        var currentCategory = null;
        this.navigations = [];
        this.pageNo = 1;
        this.pageSize = 12;
        this.categories = [];
        this.articles = [];
        this.isLastPage = false;
        this.currentArticle = {};
        this.articleListStatus = "display:block";
        this.articleDetailStatus = "display:none";
        this.previousArticle = null;
        this.nextArticle = null;
        this.init = function () {
            service.getCategories(function (result) {
                if (result.length > 0) {
                    var categoryName="";
                    if(location.hash){
                        categoryName=location.hash.substr(1);
                    }
                    currentCategory = result[0];
                    result[0].className="active";
                    result.forEach(function(item){
                        if(categoryName==item.categoryName){
                            item.className="active";
                            currentCategory = item;
                        }else{
                            item.className="";
                        }
                    });
                    self.categories = result;
                    loadArticleList(currentCategory);
                }

                uku.refresh("cloudCtrl");
            });
        };

        this.navigationChanged = function (nav) {
            if (nav.type === "category") {
                this.categoryItemClickHandler(nav.data);
            } else if (nav.type === "article") {
                this.articleItemClickHandler(nav.data);
            }
        };

        this.categoryItemClickHandler = function (category) {
            currentCategory = category;
            this.isLastPage = false;
            this.pageNo = 1;
            this.articles = [];
            loadArticleList(currentCategory);
            swtichArticleViewStatus("list");
        };

        this.gotoPrevPage = function () {
            if (this.pageNo > 1) {
                this.pageNo--;
                loadArticleList(currentCategory);
            }
        };

        this.gotoNextPage = function () {
            if (this.isLastPage === false) {
                this.pageNo++;
                loadArticleList(currentCategory);
            }
        };

        this.articleItemClickHandler = function (article) {
            if (!article || !article.id) {
                return
            }
            if (!commentCtrl) {
                commentCtrl = new CommentController(uku);
                uku.registerController("commentCtrl", commentCtrl);
                var dom = document.getElementById("commentPanel");
                uku.dealWithElement(dom);
            }
            commentCtrl.init(article.id);
            getSiblingAricles(article);
            service.getArticleById(article.id, function (result) {
                if (result) {
                    if (result.id !== self.currentArticle.id) {
                        clearMardown();
                        self.currentArticle = result;
                        self.currentArticle.timeLabel = moment(result.createTime).format("YYYY-MM-DD");
                        renderMardown(self.currentArticle.content);
                        swtichArticleViewStatus("detail");
                    } else {
                        swtichArticleViewStatus("detail");
                    }
                    if (self.navigations) {
                        if (self.navigations.length == 2) {
                            self.navigations[1] = {
                                title: result.title,
                                type: 'article',
                                data: self.currentArticle
                            };
                        } else if (self.navigations.length == 1) {
                            self.navigations.push({
                                title: result.title,
                                type: 'article',
                                data: self.currentArticle
                            });
                        }
                    }
                    uku.refresh("cloudCtrl");
                }
            });
        };

        function getSiblingAricles(article) {
            var articleIndex = _.indexOf(self.articles, article);
            if (articleIndex > 0) {
                self.previousArticle = self.articles[articleIndex - 1];
            } else {
                service.getSiblingArticle(article.id, article.categoryName, "previous", function (result) {
                    if (result) {
                        self.previousArticle = result;
                    } else {
                        self.previousArticle = {
                            title: "无"
                        };
                    }
                    uku.refresh("cloudCtrl");
                });

            }
            if (articleIndex < self.articles.length - 1 && articleIndex > -1) {
                self.nextArticle = self.articles[articleIndex + 1];
            } else {
                service.getSiblingArticle(article.id, article.categoryName, "next", function (result) {
                    if (result) {
                        self.nextArticle = result;
                    } else {
                        self.nextArticle = {
                            title: "无"
                        };
                    }
                    uku.refresh("cloudCtrl");
                });
            }
        }

        function renderMardown(markdown) {
            testEditormdView = editormd.markdownToHTML("test-editormd-view", {
                markdown: markdown,
                htmlDecode: "style,script,iframe", // you can filter tags decode
                tocm: false, // Using [TOCM]
                emoji: true,
                taskList: true,
                tex: true, // 默认不解析
                flowChart: true, // 默认不解析
                sequenceDiagram: true // 默认不解析
            });
        }

        function clearMardown() {
            $("#test-editormd-view").html("");
        }

        function loadArticleList(category) {
            var pager = {
                pageNo: self.pageNo,
                pageSize: self.pageSize
            };
            self.navigations = [{
                title: category.categoryName,
                type: 'category',
                data: category
            }];
            service.getArticalsByCategory(category.categoryName, pager, function (result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        item.timeLabel = moment(item.createTime).format("YYYY-MM-DD");
                        if (item.articlePic) {
                            var arr = item.articlePic.split("/");
                            var picName = arr.pop();
                            arr.push("thumbnail");
                            arr.push(picName);
                            item.thumbnail = arr.join("/");
                        }

                    }
                    self.articles = result;
                }
                if (result.length < self.pageSize) {
                    self.isLastPage = true;
                } else {
                    self.isLastPage = false;
                }
                if (result.length === 0) {
                    self.isLastPage = true;
                    if (self.pageNo > 1) {
                        self.pageNo--;
                    }
                }
                classNameFunc(category);
                uku.refresh("cloudCtrl");
                location.hash=category.categoryName;
            });
        }

        function classNameFunc(category){
            self.categories.forEach(function(item){
                item.className="";
            });
            category.className="active";
        }

        function swtichArticleViewStatus(status) {
            if (status === "list") {
                self.articleListStatus = "display:block";
                self.articleDetailStatus = "display:none";
            } else if (status === "detail") {
                self.articleListStatus = "display:none";
                self.articleDetailStatus = "display:block";
            }
        }
    };
});