define(["CloudService","moment","../cloud/CommentValidator"], function (service, moment,commentValidator) {
    return function (uku) {
        var self = this;
        this.articleId = "";
        this.currentComments = [];
        this.reply = {};
        this.showReplyToWho = "display:none";
        this.commentValidator = commentValidator;
        this.newComment = {
            nickname: "",
            email: "",
            content: ""
        };

        this.init = function (articleId) {
            clearCommentForm();
            this.articleId = articleId;
            loadComments(articleId);
        };
        
        this.publishComment = function () {
            if (validateComment(this.newComment)) {
                this.newComment.articleId = this.articleId;
                this.newComment.replyTo = this.reply.nickName;
                service.publishComment(this.newComment, function (comment) {
                    if (comment) {
                        commentSpecialDealRule(comment);
                        self.currentComments.push(comment);
                        clearCommentForm();
                        uku.refresh("commentCtrl");
                    }
                });
            } else {

            }
        };

        this.replyComment = function (comment) {
            this.reply = comment;
            this.showReplyToWho = "display:block";
        };

        this.cancelReply = function () {
            this.reply = {};
            this.showReplyToWho = "display:none";
        };
        
        this.validateInput = function(target){
            var comment = this.newComment;
            switch(target.toLowerCase()){
                case "nickname":
                    this.commentValidator.validateNickname(comment);
                    break;
                case "email":
                    this.commentValidator.validateEmail(comment);
                    break;
                case "content":
                    this.commentValidator.validateContent(comment);
                    break;
                default:
                    this.commentValidator.validateAll(comment);
            }     
        };

        function clearCommentForm() {
            self.newComment = {
                nickname: "",
                email: "",
                website: "",
                content: ""
            };
            self.reply = {};
            self.showReplyToWho = "display:none";
        }

        function validateComment(comment) {
            var result = self.commentValidator.validateAll(comment);
            return result;
        }

        function loadComments(articleId) {
            var pager = {
                pageNo: 1,
                pageSize: 999
            };
            service.getCommentsById(articleId, pager, function (result) {
                specialDealwithComments(result);
                self.currentComments = result;
                uku.refresh("commentCtrl");
            });

            function specialDealwithComments(list) {
                for (var i = 0; i < list.length; i++) {
                    var comment = list[i];
                    commentSpecialDealRule(comment);
                }
            }
        }

        function commentSpecialDealRule(comment) {
            if (comment.replyTo) {
                comment.showReplyTo = "display:block";
            } else {
                comment.showReplyTo = "display:none";
            }
            if (comment.createTime) {
                comment.timeLabel = moment(comment.createTime).format("YYYY-MM-DD");
            }
        }
        
        function clearCommentForm(){
            self.articleId = "";
            self.currentComments = [];
            self.reply = {};
            self.showReplyToWho = "display:none";
            self.commentValidator = commentValidator;
            self.newComment = {
                nickname: "",
                email: "",
                content: ""
            };
            self.commentValidator.clear();
        }
    };
});