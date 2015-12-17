define("pluginController",["pluginView","pluginModel"],function(pluginView,pluginModel){
	return {
		init:function(){
			this.getPluginsHandler(function(data){
				pluginView.initShow(data);
			});//初始化界面显示
		},
		getPluginContentHandler:function(id,callback){//根据名称获取插件内容
			pluginModel.getPluginContentService(id,callback);
		},
		getPluginsHandler:function(callback){//获取所有插件
			pluginModel.getPluginsService(callback);
			/*if(callback){
				callback({plugins:plugins});
			}*/
			//return plugins;
		}
	}
})