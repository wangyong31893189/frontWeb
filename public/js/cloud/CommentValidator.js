define(["validator"],function(validator){
    return {
            showNickNameValidator: "display:none",
            msgNickName: "",
            showEmailValidator: "display:none",
            msgEmail: "",
            showContentValidator: "display:none",
            msgContent: "",
            validateAll: function (comment) {
                if(this.validateNickname(comment) && this.validateEmail(comment) && this.validateContent(comment)){
                    return true; 
                }
                return false;
            },
            validateNickname: function(comment){
                if(!comment.nickname){
                    this.showNickNameValidator = "display:block";
                    this.msgNickName = "请输入昵称";
                    return false;
                }else if(comment.nickname.length > 30){
                    this.showNickNameValidator = "display:block";
                    this.msgNickName = "昵称过长";
                    return false;
                }else{
                    this.showNickNameValidator = "display:none";
                    return true;
                }
            },
            validateEmail: function(comment){
                if(!comment.email){
                    this.showEmailValidator = "display:block";
                    this.msgEmail = "请输入邮箱";
                    return false;
                }else{
                    if(!validator.isEmail(comment.email)){
                        this.showEmailValidator = "display:block";
                        this.msgEmail = "邮箱格式不正确";
                        return false;
                    }else if(comment.email.length > 30){
                        this.showEmailValidator = "display:block";
                        this.msgEmail = "邮箱过长";
                        return false;
                    }
                    else{
                        this.showEmailValidator = "display:none";
                        return true;
                    }
                }
            },
            validateContent: function(comment){
                if(!comment.content){
                    this.showContentValidator = "display:block";
                    this.msgContent = "请吐槽";
                    return false;
                }else if(comment.content.lineNumbers > 2000){
                    this.showContentValidator = "display:block";
                    this.msgContent = "你吐得太多了，请小于2000字";
                    return false;
                }else{
                    this.showContentValidator = "display:none";
                    return true;
                }
            },
            clear: function(){
                this.showNickNameValidator = "display:none";
                this.msgNickName = "";
                this.showEmailValidator = "display:none";
                this.msgEmail = "";
                this.showContentValidator = "display:none";
                this.msgContent = "";
            }
        };
});