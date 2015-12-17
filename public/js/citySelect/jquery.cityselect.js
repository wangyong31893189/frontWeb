/*
Ajax 三级省市联动
日期：2012-7-18

settings 参数说明
-----
url:省市数据josn文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
required:必选项
------------------------------ */
(function($){
	$.fn.citySelect=function(settings){
		console.log(this);

		if(this.length<1){return;};

		//获取页面上数据库的值
		var data_province=$("#province").attr("data-val");
		var data_city=$("#city").attr("data-val");
		var data_district=$("#district").attr("data-val");

		// 默认值
		settings=$.extend({
			//public/js/citySelect/city.min.js
			//prov: null,
			//city:null,
			//dist:null,
			url:"/js/citySelect/city.min.js",
			//扩展 若有传入省份与市级的值 则获取其值
			prov:(data_province) ? data_province : null,
			city:(data_city)?data_city:null,
			dist:(data_district)?data_district:null,
			nodata:null,
			required:true
		},settings);

		var box_obj=this;
		var prov_obj=box_obj.find(".prov");
		var city_obj=box_obj.find(".city");
		var dist_obj=box_obj.find(".dist");
		var prov_val=settings.prov;
		var city_val=settings.city;
		var dist_val=settings.dist;

		var select_prehtml=(settings.required) ? "" : "<option value=''>请选择</option>";

		var city_json;

		// 赋值市级函数
		var cityStart=function(){
			var prov_id=prov_obj.get(0).selectedIndex;
			console.log(settings.required);
			console.log(prov_id);

			if(!settings.required){
				prov_id--;
			};
			city_obj.empty().attr("disabled",true);
			dist_obj.empty().attr("disabled",true);

			if(prov_id<0||typeof(city_json.citylist[prov_id].c)=="undefined"){
				if(settings.nodata=="none"){
					city_obj.parent().hide();
					dist_obj.parent().hide();
					// city_obj.css("display","none");
					// dist_obj.css("display","none");
				}else if(settings.nodata=="hidden"){
					city_obj.css("visibility","hidden");
					dist_obj.css("visibility","hidden");
					city_obj.parent().hide();
					dist_obj.parent().hide();
				};
				return;
			};

			// 遍历赋值市级下拉列表
			temp_html=select_prehtml;
			$.each(city_json.citylist[prov_id].c,function(i,city){
				temp_html+="<option value='"+city.n+"'>"+city.n+"</option>";
			});
			//city_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
			city_obj.html(temp_html).attr("disabled",false).parent().show();
			distStart();
		};

		// 赋值地区（县）函数
		var distStart=function(){
			var prov_id=prov_obj.get(0).selectedIndex;
			var city_id=city_obj.get(0).selectedIndex;
			if(!settings.required){
				prov_id--;
				city_id--;
			};
			dist_obj.empty().attr("disabled",true);

			if(prov_id<0||city_id<0||typeof(city_json.citylist[prov_id].c[city_id].a)=="undefined"){
				if(settings.nodata=="none"){
					// dist_obj.css("display","none");
					dist_obj.parent().hide();
				}else if(settings.nodata=="hidden"){
					dist_obj.css("visibility","hidden");
					dist_obj.parent().hide();
				};
				return;
			};

			// 遍历赋值市级下拉列表
			temp_html=select_prehtml;
			$.each(city_json.citylist[prov_id].c[city_id].a,function(i,dist){
				temp_html+="<option value='"+dist.s+"'>"+dist.s+"</option>";
			});
			// dist_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
			dist_obj.html(temp_html).attr("disabled",false).parent().show();
		};

		var init=function(){
			// 遍历赋值省份下拉列表
			temp_html=select_prehtml;
			console.log("qqqqq")
			console.log(city_json);

			$.each(city_json.citylist,function(i,prov){
				temp_html+="<option value='"+prov.p+"'>"+prov.p+"</option>";
			});
			prov_obj.html(temp_html);

			// 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
			setTimeout(function(){
				if(settings.prov!=null){
					prov_obj.val(settings.prov);
					cityStart();
					setTimeout(function(){
						if(settings.city!=null){
							city_obj.val(settings.city);
							distStart();
							setTimeout(function(){
								if(settings.dist!=null){
									dist_obj.val(settings.dist);
								};
							},1);
						};
					},1);
				};
			},1);

			// 选择省份时发生事件
			prov_obj.bind("change",function(){
				cityStart();
			});

			// 选择市级时发生事件
			city_obj.bind("change",function(){
				distStart();
			});
		};

		// 设置省市json数据
		if(typeof(settings.url)=="string"){

			$.getJSON(settings.url,function(json){
				city_json=json;
				//console.log(city_json);
				init();
			});
		}else{
			city_json=settings.url;
			//console.log(city_json);
			init();
		};
	};
})(jQuery);