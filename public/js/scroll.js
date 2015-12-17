$(function(){
	/**
		create by eric  2015-07-11
		广告滑动
	*/
	var Slider=function(options){
		this.options={
			id:"slider",
			width:1200,
			scroll:true,
			direction:"right",
			intervalTime:null,
			container:"sliderContainer",
			scrollEnd:function(index){
				console.log("dsfsafsa");
			},
			sliderTime:5000
		}
		for (var i in options) {
			this.options[i]=options[i];
		};
		//if(this.options.direction=="left"){
			this.moveBy="margin-left";
		//}else{
		//	this.moveBy="margin-right";
		//}
		this.index=0;
		this.init();
	};

	Slider.prototype={
		init:function(){//初始化函数
			var that=this;
			var $slider=that.$slider=$("#"+that.options.id);
			$slider.html($slider.html()+$slider.html());
			var $lis=$slider.find("li");
			var length=that.length=$lis.length;
			$slider.css({"width":that.options.width*length});
			if(that.options.scroll&&length/2>1){
				that.autoScroll();
			}
			$("#sliderContainer").hover(function(){
				clearInterval(that.options.intervalTime);
			},function(){
				that.autoScroll();
			});
		},
		autoScroll:function(){//自动滚动函数
			var that=this;
			var $slider=that.$slider;
			that.options.intervalTime=setInterval(function(){
				if(that.options.direction=="left"){
					if(that.index==0){
						that.$slider.css(that.moveBy,-(that.options.width*that.length/2));
					}
					that.index--;
				}else{
					that.index++;
				}
				if(that.index>that.length/2){
					that.index=0;
				}
				if(that.index<0){
					that.index=that.length/2-1;
				}
				that.move();
			},that.options.sliderTime);
		},
		next:function(){//下一张
			var that=this;
			that.index++;
			if(that.index>that.length/2){
				that.index=0;
			}
			/*var options={};
			options[that.moveBy]=-(that.options.width*that.index);
			that.$slider.animate(options,function(){
				that.options.scrollEnd(that.index);
			});*/
			that.move();
		},
		prev:function(){//上一张
			var that=this;
			if(that.index==0){
				that.$slider.css(that.moveBy,-(that.options.width*that.length/2));
			}
			that.index--;
			if(that.index<0){
				that.index=that.length/2-1;
			}
			/*var options={};
			options[that.moveBy]=-(that.options.width*that.index);
			that.$slider.animate(options,function(){
				that.options.scrollEnd(that.index);
			});*/
			that.move();
		},
		sliderTo:function(index){//定位到某一张
			var that=this;
			that.index=index;
			that.move();
		},
		move:function(){//滑动函数
			var that=this;
			var options={};
			options[that.moveBy]=-(that.options.width*that.index);
			that.$slider.animate(options,function(){
				if(that.index>that.length/2-1){
					that.$slider.css(that.moveBy,0);
					that.index=0;
					//that.options.scrollEnd(that.index);
				}
				if(that.index<0){
					that.$slider.css(that.moveBy,-(that.options.width*that.length/2));
					that.index=that.length/2;
					//that.options.scrollEnd(that.index);
				}
				that.options.scrollEnd(that.getIndex());
			});
		},
		getIndex:function(){//获取索引
			var that=this;
			var index=that.index;
			if(that.index>that.length/2-1){
				index=0;
			}
			return index;
		}
	};

	window.Slider=Slider;
});