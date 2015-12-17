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
			var Title=React.createClass({
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
						<li onClick={this.handleClick} id={refs_li}>
							<a href="#">{this.props.text}</a>
						</li>
					);
				}
			});

			var TitleList=React.createClass({
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
							<Title key={key} renderPluginContent={renderPluginContent} text={item.title} id={item.id}/>
						);
					});
					return (
						<ul className="menu">
							{titleNodes}
						</ul>
					);
				}
			});

			var SecondComment=React.createClass({
				render:function(){
					var comment=this.props.comment;
					return (
						<li className="first">
                            <div className="left">
                                <img src="/web/images/user.jpg"/>
                            </div>
                            <div className="right">
                                <p className="name">{comment.nickName}</p>
                                <p className="comment-content">{comment.content}</p>
                                <p><span className="time">{comment.createTime}</span></p>
                            </div>
                        </li>
					);
				}
			});

			var Comment=React.createClass({
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
							<SecondComment key={key} comment={comment}/>
						);
					});
					if(!comment.comments||comment.comments.length<1){
						secondCommentNodes="";
					}else{
						secondCommentNodes=(
							<ul className="sec-comment-list">
								{secondCommentNodes}
							</ul>
						);
					}
					var user=this.props.user;
					var replayButton="";
					if(user&&user.id){
						replayButton=(
							<span className="replay" onClick={this.showReplayHandler}><i className="ico ico-replay"></i>回复</span>
						);
					}
					return (
						<li className="first">
	                        <div className="left">
	                            <img src="/web/images/user.jpg"/>
	                        </div>
	                        <div className="right">
	                            <p className="name">{comment.nickName}</p>
	                            <p className="comment-content">{comment.content}</p>
	                            <p><span className="time">{comment.createTime}</span>{replayButton}</p>
	                            <div className="replay-box" style={{display:this.state.display}}>
	                                <textarea className="replay-content" ref="content"></textarea>
	                                <div style={{clear:"both"}}>
						            	<label className="errorMessage" style={{display:this.state.contentState}}>{this.state.contentMsg}</label>
		                                <button type="button" className="replay-btn" onClick={this.replayHandler}>回复</button>
	                                </div>
	                            </div>
	                            {secondCommentNodes}
	                        </div>
	                    </li>
                    );
				}
			});

			var CommentForm=React.createClass({
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
						<div className="publish-comment">
                        <div className="left">
                            <i className="ico ico-user"></i>
                        </div>
                        <div className="right">
                        	<div style={{float:"left"}}>
	                            <input type="text" className="nickname" placeholder="昵称（必填）" ref="nickName" value={this.props.user.nickName}/>
	                            <label className="errorMessage" style={{display:this.state.nickState}}>{this.state.nickMsg}</label>
                            </div>
                            <div style={{float:"left"}}>
	                            <input type="text" className="email" placeholder="邮箱（必填）"  ref="email" value={this.props.user.email}/>
	                            <label className="errorMessage" style={{display:this.state.emailState}}>{this.state.emailMsg}</label>
                            </div>
                            <div style={{float:"left"}}>
								<input type="text" className="website" placeholder="站点" ref="website"/>
								<label className="errorMessage" style={{display:this.state.websiteState}}>{this.state.websiteMsg}</label>
                            </div>
                        </div>
                        <div className="left">

                        </div>
                        <div className="right">
                            <textarea className="publish-content" ref="content" placeholder="吐个嘈呀~"></textarea>
                            <div style={{clear:"both"}}>
					            <label className="errorMessage" style={{display:this.state.contentState}}>{this.state.contentMsg}</label>
                            	<button className="publish-btn" type="button" onClick={this.publishClickHandler}>发布</button>
					        </div>
                        </div>
                </div>
					);
				}
			});

			var CommentList=React.createClass({
				render:function(){
					// console.log(Object.prototype.toString.call(this.props.comments));
					var comments=this.props.commentObj.comments;
					var user=this.props.user;
					var publishCommentHandler=this.props.publishCommentHandler;
					var commentNodes=comments.map(function(comment,key){
						return (
							<Comment comment={comment} key={key} publishCommentHandler={publishCommentHandler} user={user}/>
						);
					});
					console.log(this.props.commentObj.length);
					return (
						<div>
						<p className="total">全部评论（<span>{this.props.commentObj.length}</span>）</p>
                		<ul className="comment-list">
							{commentNodes}
						</ul>
						<CommentForm user={user} publishCommentHandler={publishCommentHandler}/>
						</div>
					);
				}
			});

			/**
			右边内容
			**/
			var Content=React.createClass({
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
								html=(<div>git地址：<a href={url} target="_blank">{url}</a></div>);
							}
							return html;
						};
						var demoUrl=function(){
							var url=that.props.plugin?that.props.plugin.demoUrl:"";
							var html="";
							if(url){
								html=(<div>实例地址：<a href={url} target="_blank">{url}</a></div>);
							}
							return html;
						};
						return (
							<div className="right-content">
								<div className="content-box">
									<div dangerouslySetInnerHTML={this.createMarkup()} className="markdown-body editormd-html-preview">

									</div>
									{demoUrl()}
									{gitUrl()}
								</div>
								<CommentList commentObj={this.props.commentObj} user={user} publishCommentHandler={this.publishCommentHandler}/>
							</div>
						);
					// }
				}
			});

			var Plugin=React.createClass({
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
						<div>
							<TitleList data={data.plugins} renderPluginContent={this.renderPluginContent}/>
							<Content plugin={this.state.plugin} commentObj={this.state.commentObj} setStateComments={this.setStateComments} user={data.user}/>
						</div>
					);
				}
			});



			React.render(<Plugin data={data}/>,document.getElementById("plugins_page"));
		}
	};
});
