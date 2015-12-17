define("pluginView",["pluginModel","react","jquery","assembleUtil","editormd","validator"],function(pluginModel,React,$,assembleUtil,editormd,validator){
	function setTitleClass(liId){
		var $liObj=$("#"+liId);
		var $lisObj=$liObj.parent().children();
		$lisObj.each(function(){
			$(this).removeClass("active");
		});
		$liObj.addClass("active");
	}

	return {
		initShow:function(data){//初始化界面显示
			var Title=React.createClass({displayName: "Title",
				handleClick:function(){
					var that=this;
					var id=this.props.id;
					var liId="li_"+id;
					this.props.renderPluginContent(id,function(){
						setTitleClass(liId);
					});
				},
				getInitialState: function() {
				    return {
				      actived: false
				    };
				},
				/*// 当组件render完成后自动被调用
			    componentDidMount: function() {
			    	var that=this;
			    	var id=that.state.id;
			    	//渲染内容组件
					this.props.renderPluginContent(id)
					//this.setState({fileName:fileName});
			    },*/
				render:function(){
					var refs_li="li_"+this.props.id;
					return (
						React.createElement("li", {onClick: this.handleClick, id: refs_li}, 
							React.createElement("a", {href: "#"}, this.props.text)
						)
					);
				}
			});

			var TitleList=React.createClass({displayName: "TitleList",
				// 当组件render完成后自动被调用
				componentDidMount:function(){
					var that=this;
					var data=this.props.data;
					if(data&&data.length>0){
			    		var id=data[0].id;
						var pluginId=location.hash.substr(1);
						if(pluginId){
							id=pluginId;
						}
			    		var liId="li_"+id;
			    		//渲染内容组件
						this.props.renderPluginContent(id,function(){
							setTitleClass(liId);
						});
					}
				},
				render:function(){
					var renderPluginContent=this.props.renderPluginContent;
					var titleNodes=this.props.data.map(function(item,key){
						return (
							React.createElement(Title, {key: key, renderPluginContent: renderPluginContent, text: item.title, id: item.id})
						);
					});
					return (
						React.createElement("ul", {className: "menu"}, 
							titleNodes
						)
					);
				}
			});

			var SecondComment=React.createClass({displayName: "SecondComment",
				render:function(){
					var comment=this.props.comment;
					return (
						React.createElement("li", {className: "first"}, 
                            React.createElement("div", {className: "left"}, 
                                React.createElement("img", {src: "/web/images/user.jpg"})
                            ), 
                            React.createElement("div", {className: "right"}, 
                                React.createElement("p", {className: "name"}, comment.nickName), 
                                React.createElement("p", {className: "comment-content"}, comment.content), 
                                React.createElement("p", null, React.createElement("span", {className: "time"}, comment.createTime))
                            )
                        )
					);
				}
			});

			var Comment=React.createClass({displayName: "Comment",
				showReplayHandler:function(){
					// active=this
					this.setState({display:"block"});
				},
				replayHandler:function(){
					var that=this;
					var commentId=null;
					var comment=this.props.comment;
					if(comment){
						commentId=comment.id;
					}
					var user=this.props.user;
					if(!user){
						this.setState({contentState:"block","contentMsg":"请登录再回复！"});
						return;
					}
					var nickName=user.nickName;
					var email=user.email;
					var website=user.website;
					var content=this.refs.content.getDOMNode().value;
					var options={nickName:nickName,email:email,content:content,website:website,commentId:commentId};
					// alert("回复"+commentId);
					if(options.content===""){
						this.setState({contentState:"block","contentMsg":"请吐嘈！"});
						return;
					}else{
						this.setState({contentState:"none"});
					}

					this.props.publishCommentHandler(options,function(){
						that.setState({display:"none"});
					});
				},
				getInitialState:function(){
					return {display:"none",contentState:"none"};
				},
				render:function(){
					var comment=this.props.comment;
					var secondCommentNodes=comment.comments.map(function(comment,key){
						return (
							React.createElement(SecondComment, {key: key, comment: comment})
						);
					});
					if(!comment.comments||comment.comments.length<1){
						secondCommentNodes="";
					}else{
						secondCommentNodes=(
							React.createElement("ul", {className: "sec-comment-list"}, 
								secondCommentNodes
							)
						);
					}
					var user=this.props.user;
					var replayButton="";
					if(user&&user.id){
						replayButton=(
							React.createElement("span", {className: "replay", onClick: this.showReplayHandler}, React.createElement("i", {className: "ico ico-replay"}), "回复")
						);
					}
					return (
						React.createElement("li", {className: "first"}, 
	                        React.createElement("div", {className: "left"}, 
	                            React.createElement("img", {src: "/web/images/user.jpg"})
	                        ), 
	                        React.createElement("div", {className: "right"}, 
	                            React.createElement("p", {className: "name"}, comment.nickName), 
	                            React.createElement("p", {className: "comment-content"}, comment.content), 
	                            React.createElement("p", null, React.createElement("span", {className: "time"}, comment.createTime), replayButton), 
	                            React.createElement("div", {className: "replay-box", style: {display:this.state.display}}, 
	                                React.createElement("textarea", {className: "replay-content", ref: "content"}), 
	                                React.createElement("div", {style: {clear:"both"}}, 
						            	React.createElement("label", {className: "errorMessage", style: {display:this.state.contentState}}, this.state.contentMsg), 
		                                React.createElement("button", {type: "button", className: "replay-btn", onClick: this.replayHandler}, "回复")
	                                )
	                            ), 
	                            secondCommentNodes
	                        )
	                    )
                    );
				}
			});

			var CommentForm=React.createClass({displayName: "CommentForm",
				publishClickHandler:function(){
					var nickName=this.refs.nickName.getDOMNode().value;
					var email=this.refs.email.getDOMNode().value;
					var website=this.refs.website.getDOMNode().value;
					var content=this.refs.content.getDOMNode().value;
					var options={nickName:nickName,email:email,content:content,website:website,commentId:""};
					//alert(JSON.stringify(options));
					if(options.nickName===""){
						this.setState({nickState:"block","nickMsg":"请输入昵称！"});
						return;
					}else{
						this.setState({nickState:"none"});
					}
					if(options.email===""){
						this.setState({emailState:"block","emailMsg":"请输入邮箱地址！"});
						return;
					}else if(!validator.isEmail(options.email)){
						this.setState({emailState:"block","emailMsg":"请输入正确的邮箱地址！"});
						return;
					}else{
						this.setState({emailState:"none"});
					}
					if(!validator.isURL(options.website)&&options.website!=""){
						this.setState({"websiteState":"block","websiteMsg":"请输入正确的URL！"});
						return;
					}else{
						this.setState({websiteState:"none"});
					}
					if(options.content===""){
						this.setState({contentState:"block","contentMsg":"请吐嘈！"});
						return;
					}else{
						this.setState({contentState:"none"});
					}
					this.props.publishCommentHandler(options);
				},
				getInitialState:function(){
					return {nickState:"none",emailState:"none",contentState:"none",websiteState:"none"};
				},
				render:function(){
					return (
						React.createElement("div", {className: "publish-comment"}, 
                        React.createElement("div", {className: "left"}, 
                            React.createElement("i", {className: "ico ico-user"})
                        ), 
                        React.createElement("div", {className: "right"}, 
                        	React.createElement("div", {style: {float:"left"}}, 
	                            React.createElement("input", {type: "text", className: "nickname", placeholder: "昵称（必填）", ref: "nickName", value: this.props.user.nickName}), 
	                            React.createElement("label", {className: "errorMessage", style: {display:this.state.nickState}}, this.state.nickMsg)
                            ), 
                            React.createElement("div", {style: {float:"left"}}, 
	                            React.createElement("input", {type: "text", className: "email", placeholder: "邮箱（必填）", ref: "email", value: this.props.user.email}), 
	                            React.createElement("label", {className: "errorMessage", style: {display:this.state.emailState}}, this.state.emailMsg)
                            ), 
                            React.createElement("div", {style: {float:"left"}}, 
								React.createElement("input", {type: "text", className: "website", placeholder: "站点", ref: "website"}), 
								React.createElement("label", {className: "errorMessage", style: {display:this.state.websiteState}}, this.state.websiteMsg)
                            )
                        ), 
                        React.createElement("div", {className: "left"}

                        ), 
                        React.createElement("div", {className: "right"}, 
                            React.createElement("textarea", {className: "publish-content", ref: "content", placeholder: "吐个嘈呀~"}), 
                            React.createElement("div", {style: {clear:"both"}}, 
					            React.createElement("label", {className: "errorMessage", style: {display:this.state.contentState}}, this.state.contentMsg), 
                            	React.createElement("button", {className: "publish-btn", type: "button", onClick: this.publishClickHandler}, "发布")
					        )
                        )
                )
					);
				}
			});

			var CommentList=React.createClass({displayName: "CommentList",
				render:function(){
					// console.log(Object.prototype.toString.call(this.props.comments));
					var comments=this.props.commentObj.comments;
					var user=this.props.user;
					var publishCommentHandler=this.props.publishCommentHandler;
					var commentNodes=comments.map(function(comment,key){
						return (
							React.createElement(Comment, {comment: comment, key: key, publishCommentHandler: publishCommentHandler, user: user})
						);
					});
					console.log(this.props.commentObj.length);
					return (
						React.createElement("div", null, 
						React.createElement("p", {className: "total"}, "全部评论（", React.createElement("span", null, this.props.commentObj.length), "）"), 
                		React.createElement("ul", {className: "comment-list"}, 
							commentNodes
						), 
						React.createElement(CommentForm, {user: user, publishCommentHandler: publishCommentHandler})
						)
					);
				}
			});

			/**
			右边内容
			**/
			var Content=React.createClass({displayName: "Content",
				publishCommentHandler:function(options,callback){
					//alert("添加回复！");
					var that=this;
					var plugin=that.props.plugin;
					options.pluginId=plugin.id;
					pluginModel.addCommentsService(options,function(result){
						var commentObj=that.props.commentObj;
						var comments=commentObj.comments;
						comments.push(result.comment);
						commentObj.comments=assembleUtil.assembleComments(comments);
						commentObj.length++;
						that.props.setStateComments(commentObj);
						if(callback){
							callback();
						}
					});
				},
				renderContent:function(){
					var content=this.props.plugin?this.props.plugin.content:"";
					$(document.body).append("<div id='editormd_view'></div>");
					var editor=editormd.markdownToHTML("editormd_view", {
		                markdown: content,
		                htmlDecode: "style,script,iframe", // you can filter tags decode
		                tocm: false, // Using [TOCM]
		                emoji: true,
		                taskList: true,
		                tex: true, // 默认不解析
		                flowChart: true, // 默认不解析
		                sequenceDiagram: true // 默认不解析
		            });
		            var html=editor.html();
		            editor.remove();
		            return html;
				},
				createMarkup:function(){
					var that=this;
					return {__html:that.renderContent()};
				},
				render:function(){
					// if(this.state.plugin){
						var that=this;
						var user=this.props.user?this.props.user:{};
						console.log("重新渲染！内容！");
						var gitUrl=function(){
							var url=that.props.plugin?that.props.plugin.gitUrl:"";
							var html="";
							if(url){
								html=(React.createElement("div", null, "git地址：", React.createElement("a", {href: url, target: "_blank"}, url)));
							}
							return html;
						};
						var demoUrl=function(){
							var url=that.props.plugin?that.props.plugin.demoUrl:"";
							var html="";
							if(url){
								html=(React.createElement("div", null, "实例地址：", React.createElement("a", {href: url, target: "_blank"}, url)));
							}
							return html;
						};
						return (
							React.createElement("div", {className: "right-content"}, 
								React.createElement("div", {className: "content-box"}, 
									React.createElement("div", {dangerouslySetInnerHTML: this.createMarkup(), className: "markdown-body editormd-html-preview"}

									), 
									demoUrl(), 
									gitUrl()
								), 
								React.createElement(CommentList, {commentObj: this.props.commentObj, user: user, publishCommentHandler: this.publishCommentHandler})
							)
						);
					// }
				}
			});

			var Plugin=React.createClass({displayName: "Plugin",
				getInitialState:function(){
					return {plugin:{},commentObj:{length:0,comments:[]}};
				},
				setStateComments:function(commentObj){
					this.setState({commentObj:commentObj});
				},
				renderPluginContent:function(id,callback){
					var that=this;
					pluginModel.getPluginContentService(id,function(result){//重新渲染插件内容和评论
						console.log("设置li的状态为true");
						that.setState({plugin:result.plugin});
						if(callback){
							callback();
						}
						pluginModel.getCommentsByPluginIdService(id,function(result){
							location.hash=id;
							that.setState({commentObj:result});
						});
					});
				},
				render:function(){
					return (
						React.createElement("div", null, 
							React.createElement(TitleList, {data: data.plugins, renderPluginContent: this.renderPluginContent}), 
							React.createElement(Content, {plugin: this.state.plugin, commentObj: this.state.commentObj, setStateComments: this.setStateComments, user: data.user})
						)
					);
				}
			});



			React.render(React.createElement(Plugin, {data: data}),document.getElementById("plugins_page"));
		}
	};
});
