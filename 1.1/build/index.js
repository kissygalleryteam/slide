/*
combined files : 

gallery/slide/1.1/slide-util
gallery/slide/1.1/kissy2yui
gallery/slide/1.1/base
gallery/slide/1.1/index

*/
KISSY.add('gallery/slide/1.1/slide-util',function(S){

	"use strict";

	// Node 增补方法
	
	S.mix(S,{
		setHash : function(sUrl, data){
			var url;
			var i;
			if(typeof sUrl == 'object'){
				url = window.location.href;
				data = sUrl;
			}else{
				url = sUrl;
			}
			if(url.indexOf("#") < 0){
				url+='#';
			}
			var o = this.getHash(url);
			for(i in data){
				o[i] = data[i];
			}
			url = url.split("#")[0]+'#';
			for(i in o){
				url+=i+'='+o[i]+'&';
			}
			url = url.substr(0,url.length-1);
			return url;
		},
		getHash : function(sUrl){
			var url = sUrl || window.location.href;
			if(url.indexOf("#") < 0){
				return {};
			}else{
				var hash = url.split('#')[1];
				if(hash === '')return {};
				if(hash[hash.length-1] == '&')hash = hash.substr(0, hash.length-1);
				hash = hash.replace(/"/ig,'\'');
				// hash = hash.replace(/=/ig,'":"');
				hash = hash.replace(/=/ig,'":"');
				hash = hash.replace(/&/ig,'","');
				hash += '"';
				hash = "{\""+ hash + "}";
				var o = S.JSON.parse(hash);
				return o;
			}
		},
			
		_globalEval : function(data){
			if (data && /\S/.test(data)) {
				var head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0],
					script = document.createElement('script');

				// 神奇的支持所有的浏览器
				script.text = data;

				head.insertBefore(script, head.firstChild);
				setTimeout(function(){
					head.removeChild(script);
				},1);
			}
		},
		// 一段杂乱的html片段，执行其中的script脚本
		execScript:function(html){
			var self = this;
			var re_script = new RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/ig); // 防止过滤错误

			var hd = S.one('head').getDOMNode(),
				match, attrs, srcMatch, charsetMatch,
				t, s, text,
				RE_SCRIPT_SRC = /\ssrc=(['"])(.*?)\1/i,
				RE_SCRIPT_CHARSET = /\scharset=(['"])(.*?)\1/i;

			re_script.lastIndex = 0;
			while ((match = re_script.exec(html))) {
				attrs = match[1];
				srcMatch = attrs ? attrs.match(RE_SCRIPT_SRC) : false;
				// 通过src抓取到脚本
				if (srcMatch && srcMatch[2]) {
					s = document.createElement('script');
					s.src = srcMatch[2];
					// 设置编码类型
					if ((charsetMatch = attrs.match(RE_SCRIPT_CHARSET)) && charsetMatch[2]) {
						s.charset = charsetMatch[2];
					}
					s.async = true; // hack gecko
					hd.appendChild(s);
				}
				// 如果是内联脚本
				else if ((text = match[2]) && text.length > 0) {
					self._globalEval(text);
				}
			}
		},
		// 判断当前环境是否是daily环境
		isDaily:function(){
			var self = this;
			if(/daily\.taobao\.net/.test(window.location.hostname)){
				return true;
			}else{
				return false;
			}
		}
		
	});

},{
	requires:[
		'node',
		'sizzle',
		'json',
		'event'
	]	
});

/*jshint browser:true,devel:true */

KISSY.add('gallery/slide/1.1/kissy2yui',function(S){

	"use strict";

	// KISSY 2 YUI3
	S.augment(S.Node,{

		_delegate:function(){
			var self = this;
			if(S.isFunction(arguments[1])){
				self.delegate(arguments[0],arguments[2],arguments[1]);
			}else {
				self.delegate.apply(self,arguments);
			}
			return self;
		},

		// IndexOf 原生节点
		indexOf : function(node){
			var self = this;
			if(S.isUndefined(node)){
				return null;
			}
			if(node[0]){
				node = node[0];
			}
			var i = 0;
			self.each(function(el,index){
				if(el[0] === node){
					i = index;
				}
			});
			return i;

		},
		
		size:function(){
			return this.length;
		},

		set:function(k,v){
			if(k === 'innerHTML') {
				this.html(v);
			} else {
				this.attr(k,v);
			}
			return this;
		},

		get : function(k){
			var self = this;
			var o = {
				'innerHTML':function(){
					return self.html();
				},
				'region':function(){
					return {
						'height':self.height(),
						'width':self.width()
					};
				}

			};
			if(k in o){
				return o[k]();
			}
		},

		appendChild:function(){
			this.append.apply(this,arguments);
			return this;
		},
		
		setStyle : function(k,v){
			this.css.apply(this,arguments);
			return this;
		},
		
		setStyles: function(o){
			this.css.apply(this,arguments);
			return this;
		},

		cloneNode: function(){
			return this.clone.apply(this,arguments);
		}
	});

	S.Node.create = function(str){
		return S.Node(str);
	};

},{
	requires:['node','event']
});


/**
 * @file base.js
 * @brief Slide
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2013-01-08
 */

/*jshint smarttabs:true,browser:true,devel:true,sub:true,evil:true */

KISSY.add('gallery/slide/1.1/base',function(S){

	"use strict";

	// $ is $
	var $ = S.Node.all;

	// BSlide构造器
	// TODO BSlide工厂
	var BSlide = function(){

		// TODO 如何传参?
		if (!(this instanceof BSlide)) {
			throw new Error('please use "new Slide()"');
		}

		this.init.apply(this,arguments);
	};

	// TODO 抽离切换“机制”和实现的方法
	BSlide.plug = function(fn){
		var self = this;
	};

	// 扩充BSlide
	S.augment(BSlide,S.Event.Target,{

		// 构造函数
		init:function(selector,config){

			var self = this;

			if(S.isObject(selector)){
				self.con = selector;
			}else if(/^#/i.test(selector)){
				self.con = S.one(selector);
			}else if(S.one("#"+selector)){
				self.con = S.one("#"+selector);
			}else if(S.one(selector)){
				self.con = S.one(selector);
			}else {
				throw new Error('Slide Container Hooker not found');
			}
			//接受参数
			self.buildParam(config);
			//构造函数
			self.buildHTML();
			//绑定事件
			self.bindEvent();
			
			// TODO:这句话永远无法触发ready事件
			self.fire('ready',{
				index:0,
				navnode:self.tabs.item(0),
				pannelnode:self.pannels.item(0)
			});

			if(self.reverse){
				var _t ;
				_t = self.previous;
				self.previous = self.next;
				self.next = _t;
			}

			// 在移动终端中的优化
			if(self.carousel){
				for(var i = 0;i<self.colspan;i++){
					self.fix_for_transition_when_carousel(i*2);
				}
			}

			self.fixSlideSize();

			// LayerSlide 效果增强
			if(self.layerSlide){
				self.initLayer();
			}

			// 渲染当前帧的lazyload的内容
			self.renderPannelTextarea(self.currentTab);

			return this;
		},

		// offset 1,-1
		setWrapperSize:function(offset){
			var self = this;

			if(S.isUndefined(offset)){
				offset = 0;
			}

			self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
			self.length = self.pannels.length;

			var reHandleSize = {
				'none':function(){
				},
				'vSlide':function(){
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.animwrap.setStyles({
						'height': (self.length+offset) * animconRegion.height / self.colspan + 'px'
					});

				},
				'hSlide':function(){
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.animwrap.setStyles({
						'width': (self.length+offset) * animconRegion.width / self.colspan + 'px'
					});
				},
				'fade':function(){
				}

			};

			reHandleSize[self.effect]();

			// 如果传入offset 说明仅仅计算wrapper的宽度
			if(!S.isUndefined(offset)){
				self.relocateCurrentTab();
			}

			return this;
		},

		// 添加一个帧，index为添加到的索引，默认添加到最后
		add: function(node,index){
			var self = this;

			if(S.isUndefined(index) || index > self.length){
				index = self.length;
			}

			if(S.isString(node)){
				node = S.one(node);
			}

			/*
			node.css({
				float:'left'	
			});
			*/

			// bugfix pad/phone中避免闪屏
			/*
			 * pad/phone中容器宽度>=641时，dom上的样式改变会有reflow，小于时，没有reflow
			 * 在phone中会比较平滑，不会有闪屏
			 *
			 */
			if(self.transitions){
				node.css({
					visibility:'hidden'
				});
			}

			if(index == self.length){
				// bugfix，防止在webkit中因为设置了backface属性，导致dom操作渲染延迟，slide操作会有闪烁
				setTimeout(function(){
					self.setWrapperSize(1);
				},0);
				node.insertAfter(self.pannels[index - 1]);
			}else{
				node.insertBefore(self.pannels[index]);
			}

			self.setWrapperSize();

			self.fixSlideSize(self.currentTab);

			// bugfix pad/phone中避免闪屏
			if(self.transitions){
				node.css({
					visibility:''
				});
			}

			if(self.transitions){
			}

			return this;

			// TODO 添加面板的时候，没有添加导航
		},
		remove:function(index){
			var self = this;

			if(self.length === 1){
				return;
			}

			// 删除当前帧和之前帧时，currentTab需-1
			if(index <= self.currentTab){
				self.currentTab --;
				self.length --;
			}

			// bugfix,防止移动设备中的闪屏
			if(self.transitions){
				self.con.css({
					display:'none'
				});
			}

			S.one(self.pannels[index]).remove();

			self.setWrapperSize();

			// bugfix,防止移动设备中的闪屏
			if(self.transitions){
				self.con.css({
					display:'block'
				});
			}

			self.fixSlideSize(self.currentTab);

			// TODO 删除面板的时候，没有删除导航
			return this;
		},
		// 删除最后一帧
		removeLast:function(){
			var self = this;
			self.remove(self.length - 1);
			return self;
		},

		//渲染textarea中的内容，并放在与之相邻的一个div中，若有脚本，执行其中脚本
		renderLazyData:function(textarea){
			var self = this;
			textarea.setStyle('display','none');
			if(textarea.attr('lazy-data')=='1'){
				return ;
			}
			textarea.attr('lazy-data','1');
			var	id = S.stamp(div),
				html = textarea.get('innerHTML').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>'),
				div = S.Node.create('<div>'+html+'</div>');
			S.DOM.insertBefore(div,textarea);
			S.execScript(html);
		},
		// 渲染第index个pannel的延迟渲染的textarea
		renderPannelTextarea:function(index){
			var self = this;
			if(!self.pannels.item(index)){
				return;
			}

			var renderOnePannelT = function(index){
				var con = S.one(self.pannels.item(index));

				var scriptsArea = self.pannels.item(index).all('.data-lazyload');
				if(scriptsArea){
					scriptsArea.each(function(node,i){
						self.renderLazyData(node);
					});
				}
			};

			for(var i = 0;i<self.colspan;i++){
				renderOnePannelT(index+i);
			}
		},

		// 如果是动画效果，则构建Wrap
		buildWrap: function(){
			var self = this;

			self.animwrap = S.Node.create('<div style="position:absolute;"></div>');
			self.animwrap.set('innerHTML', self.animcon.get('innerHTML'));
			self.animcon.set('innerHTML', '');
			self.animcon.appendChild(self.animwrap);
			self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);

			return self;

		},

		// 各种动画效果的初始化行为
		// TODO 应当从BSLide中抽取出来
		doEffectInit: function(){

			var self = this;

			var effectInitFn = {
				'none':function(){

					self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
					self.pannels.setStyles({
						display:'none'	
					});

					self.pannels.item(self.defaultTab).setStyles({
						'display':'block'	
					});

				},
				'vSlide':function(){
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.pannels.setStyles({
						'float': 'none',
						'overflow': 'hidden'
					});
					self.animwrap.setStyles({
						'height': self.length * animconRegion.height / self.colspan + 'px',
						'overflow': 'hidden',
						'top': -1 * self.defaultTab * animconRegion.height + 'px'
					});
				},

				'hSlide':function(){
					self.buildWrap();
					//统一容器和item的宽高及选中默认值
					var animconRegion = self.animcon.get('region');
					self.pannels.setStyles({
						'float': 'left',
						'overflow': 'hidden'
					});
					self.animwrap.setStyles({
						'width': self.length * animconRegion.width / self.colspan + 'px',
						'overflow': 'hidden',
						'left': -1 * self.defaultTab * animconRegion.width + 'px'
					});
				},
				'fade':function(){

					self.pannels = self.con.all('.' + self.contentClass + ' .' + self.pannelClass);
					self.pannels.setStyles({
						'position': 'absolute',
						'zIndex': 0
					});
					self.pannels.each(function(node, i){
						if (i == self.defaultTab) {
							//node.removeClass('hidden');
							node.setStyles({
								'opacity': 1,
								'display': 'block'
							});
						} else {
							//node.addClass('hidden');
							node.setStyles({
								'opacity':0,
								'diaplay':'none'	
							});
						}
					});
				}
			};

			effectInitFn[self.effect]();

			return this;
		},
		//构建html结构的全局函数
		buildHTML: function() {
            var self = this;
			var con = self.con;
            self.tabs = con.all('.' + self.navClass + ' '+self.triggerSelector);

            var tmp_pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
            self.length = tmp_pannels.size();

			if(!con.one('.'+self.navClass)){
				S.Node('<ul class="'+self.navClass+'" style="display:none"></ul>').appendTo(self.con);
			}

            if (self.tabs.size() === 0) {
                //nav.li没有指定，默认指定1234
                var t_con = con.all('.' + self.navClass);
				var t_str = '';
                for (var i = 0; i < self.length; i++) {
                    var t_str_prefix = '';
                    if (i === 0) {
                        t_str_prefix = self.selectedClass;
                    }
                    t_str += '<li class="' + t_str_prefix + '"><a href="javascript:void(0);">' + (i + 1) + '</a></li>';
                }
                t_con.set('innerHTML', t_str);
            }
            self.tabs = con.all('.' + self.navClass + ' '+self.triggerSelector);
            self.animcon = con.one('.' + self.contentClass);
            self.animwrap = null;

			self.doEffectInit();

			self.fixSlideSize(self.currentTab);
            //添加选中的class
			self.hightlightNav(self.getWrappedIndex(self.currentTab));
            //是否自动播放
            if (self.autoSlide === true) {
                self.play();
            }
            return this;
        },
		getCurrentPannel:function(){
			var self = this;
			return S.one(self.pannels[self.currentTab]);
		},


		// 重新渲染slide内页(pannels)的宽度
		renderWidth:function(){
			var self = this;
			//有可能animcon没有定义宽度
			var width = self.animcon.get('region').width;
			if(self.effect == 'hSlide'){
				width /= self.colspan;
			}
			self.pannels.setStyles({
				width:width + 'px'
			});
			return this;
		},
		
		//重新渲染slide内页(pannels)的高度
		renderHeight :function(){
			var self = this;
			//有可能animcon没有定义高度
			var height = self.animcon.get('region').height;
			if(self.effect == 'vSlide'){
				height /= self.colspan;
			}
			self.pannels.setStyles({
				height:height + 'px'
			});
			return this;
		},

		//当当前帧的位置不正确时，重新定位当前帧到正确的位置,无动画
		relocateCurrentTab:function(index){
			var self = this;
			if(S.isUndefined(index)){
				index = self.currentTab;
			}
			if(self.effect != 'hSlide'){
				return;
			}

			if(self.transitions){
				self.animwrap.setStyles({
					'-webkit-transition-duration': '0s',
					'-webkit-transform':'translate3d('+(-1 * index * self.animcon.get('region').width / self.colspan)+'px,0,0)',
					'-webkit-backface-visibility':'hidden'
				});
			}else{
				self.animwrap.setStyles({
					left: -1 * index * self.animcon.get('region').width / self.colspan
					
				});
			}

			self.currentTab = index;
			
			return this;
		},

		//根据配置条件修正控件尺寸
		// 重新渲染slide的尺寸，
		// 根据go到的index索引值渲染当前需要的长度和宽度
		fixSlideSize:function(index){
			var self = this;
			if(self.adaptive_fixed_width){
				self.renderWidth();
			}
			if(self.adaptive_fixed_height){
				self.renderHeight();
			}
			if(self.adaptive_fixed_size){
				self.renderHeight().renderWidth();
			}
			self.resetSlideSize(index);
			return this;
		},

		// timmer 是指的动态监控wrapperCon高度的定时器
		// wrapperCon在很多时候高度是可变的
		// 这时就需要timmer来监听了
		removeHeightTimmer: function(){
			var self = this;
			if(!S.isNull(self.heightTimmer)){
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}
		},
		addHeightTimmer: function(){
			var self = this;
			if(!S.isNull(self.heightTimmer)){
				clearInterval(self.heightTimmer);
				self.heightTimmer = null;
			}

			var resetHeight = function(){
				if(self.effect == 'hSlide'){
					self.animcon.setStyles({
						height:self.pannels.item(self.currentTab).get('region').height+'px'
					});
				}
			};
			self.heightTimmer = setInterval(resetHeight,100);
			resetHeight();
		},

		//在before_switch和windowResize的时候执行，根据spec_width是否指定，来决定是否重置页面中的适配出来的宽度和高度并赋值
		// index是go的目标tab-pannel的索引
		// 这个函数主要针对横向滚动时各个pannel高度不定的情况
		resetSlideSize:function(index){
			var self = this;
			var width,height;
			if(typeof index == 'undefined' || index === null){
				index = self.currentTab;
			}
			// 如果没有开关，或者没有滑动特效，则退出函数
			if(self.effect != 'hSlide' && self.effect != 'vSlide'){
				return;
			}
			//var width = self.spec_width();
			
			if(self.effect == 'hSlide'){
				width = self.adaptive_width ? 
										self.adaptive_width():
										self.animcon.get('region').width;
				height = self.pannels.item(index).get('region').height;

				width /= self.colspan;

				// pannels的高度是不定的，高度是根据内容
				// 来撑开的因此不能设置高度，而宽度则需要设置
				self.pannels.setStyles({
					width:width+'px',
					display:'block'
				});

				self.animcon.setStyles({
					width:width * self.colspan +'px',
					overflow:'hidden'
				});

				if(self.animWrapperAutoHeightSetting){
					self.animcon.setStyles({
						height:height+'px'
						//强制pannel的内容不超过动画容器的范围
					});
				}
			}

			if(self.effect == 'vSlide'){
				width = self.pannels.item(index).get('region').width;
				height = self.adaptive_height ? 
										self.adaptive_height():
										self.animcon.get('region').height;
				height /= self.colspan;

				self.pannels.setStyles({
					height:height * self.colspan +'px',
					display:'block'
				});

				self.animcon.setStyles({
					height:height * self.colspan +'px',
					overflow:'hidden'
				});

				if(self.animWrapperAutoHeightSetting){
					self.animcon.setStyles({
						width:width +'px'
						//强制pannel的内容不超过动画容器的范围
					});
				}

			}

			return this;
		},

		// 得到tabnav应当显示的当前index索引，0,1,2,3...
		getWrappedIndex:function(index){
			var self = this,wrappedIndex = 0;

			if(index === 0){
				//debugger;
			}
			if(self.carousel){
				
				if(index < self.colspan){
					wrappedIndex = self.length - self.colspan * 3 + index; 
				} else if(index >= self.length - self.colspan) {
					wrappedIndex = index - (self.length - self.colspan);
				} else {
					wrappedIndex = index - self.colspan;
				}

			}else{
				wrappedIndex = index;
			}
			return wrappedIndex;
		},

		getMousePosition:function(){
			var self = this;
			var domousemove = function(e){
				self._t_mouseX = e.clientX;
				self._t_mouseY = e.clientY;
			};
			S.Event.on(window,'mousemove',domousemove);
			setTimeout(function(){
				S.Event.detach(window,'mouseover',domousemove);
			},self.triggerDelay);
		},
		// 大量触碰事件的处理，带上延时的过滤，防止频繁处理切换
		massTrigger:function(cb,el){
			var self = this;
			if(!S.inArray(self.eventType,['mouseover','mouseenter'])){
				cb();
				return;
			}
			self.getMousePosition();
			if(S.isUndefined(self._fired) || S.isNull(self._fired)){
				self._fired = setTimeout(function(){
					if(self.inRegion([self._t_mouseX,self._t_mouseY],S.one(el))){
						cb();	
					}
					self._fired = null;
				},self.triggerDelay);
			} else {
				clearTimeout(self._fired);
				self._fired = setTimeout(function(){
					if(self.inRegion([self._t_mouseX,self._t_mouseY],S.one(el))){
						cb();	
					}
					self._fired = null;
				},self.triggerDelay);
			}

		},

		// 获取当前subLayer退出动画的delay最大值、
		getMaxAnimDelay: function(index) {
			var self = this,
				max = 0;

			if (!self.sublayers) {
				return;
			}

			S.each(self.sublayers[index], function(sublayer) {
				if (sublayer.durationout + sublayer.delayout > max) {
					max = sublayer.durationout + sublayer.delayout;
				}
			});

			return max;
		},

		// 判断一个点是否在某个区域内
		inRegion:function(point,el){
			var offset = el.offset();
			var layout = {
				width:el.width(),
				height:el.height()
			};
			if(point[0] >= offset.left && point[0] <= offset.left + layout.width){
				if(point[1] >= offset.top && point[1] <= offset.top + layout.height){
					return true;
				}
			}
			return false;
		},

		// 绑定默认事件
		bindEvent:function(){
			var self = this;
			if(	S.inArray(self.eventType,['click','mouseover','mouseenter'] )) {
				self.con._delegate(self.eventType,function(e){
					//e.halt();
					e.preventDefault();
					self.massTrigger(function(){
						var ti = Number(self.tabs.indexOf(e.currentTarget));
						if(self.carousel){
							ti = (ti + 1) % self.length;
						}
						self.go(ti);
						if(self.autoSlide){
							self.stop().play();
						}
					},e.currentTarget);
				},'.'+self.navClass+' '+self.triggerSelector);
			}

			// 是否支持鼠标悬停停止播放
			if(self.hoverStop){
				self.con._delegate('mouseover',function(e){
					//e.halt();
					if(self.autoSlide)self.stop();
				},'.'+self.contentClass+' .'+self.pannelClass);
				self.con._delegate('mouseout',function(e){
					//e.halt();
					if(self.autoSlide)self.play();
				},'.'+self.contentClass+' .'+self.pannelClass);
			}

			// 绑定窗口resize事件 
			try {
				S.Event.on('resize',function(e){
					self.fixSlideSize(self.currentTab);
					self.relocateCurrentTab();
				},window);
			} catch(e){}

			// 绑定判断switch发生的时机
			self.on('beforeSwitch',function(o){
				if(this.layerSlide && this.isAming()){
					return false;
				}
			});

			//终端事件触屏事件绑定
			// TODO 触屏设备目前和ie6的降级方案实现一样,目前没实现降级
			// TODO 需要将触屏支持抽离出BSlide
			if ( 'ontouchstart' in document.documentElement ) {

				if(!self.touchmove){
					return this;
				}

				self.con._delegate('touchstart',function(e){
					self.stop();
					self.touching = true;
					if(self.is_last() && self.carousel){
						self.fix_next_carousel();
					}
					if(self.is_first() && self.carousel){
						self.fix_pre_carousel();
					}
					self.startX = e.changedTouches[0].clientX;
					self.startY = e.changedTouches[0].clientY;
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s'
					});
					self.startT = Number(new Date());//如果快速手滑，则掠过touchmove，因此需要计算时间
				},'.'+self.contentClass); 

				self.con._delegate('touchend',function(e){
					self.touching = false;
					var endX  = e.changedTouches[0].clientX;
					var width = Number(self.animcon.get('region').width);
					self.deltaX = Math.abs(endX - self.startX);//滑过的距离
					var swipeleft = (Math.abs(endX) < Math.abs(self.startX));//是否是向左滑动
					var swiperight = !swipeleft;
					//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
					var anti = self.carousel ? false : ( self.is_last() && swipeleft || self.is_first() && swiperight );

					//复位
					var reset = function(){
						self.animwrap.setStyles({
							'-webkit-transition-duration': (Number(self.speed) / 2) + 's',
							'-webkit-transform':'translate3d('+(-1 * self.currentTab * self.animcon.get('region').width / self.colspan)+'px,0,0)'
						});
					};

					//根据手势走向上一个或下一个
					var goswipe = function(){
						var colwidth = self.animcon.get('region').width / self.colspan;
						var span = parseInt( (self.deltaX - colwidth / 2) / colwidth , 10);
						// 滑动距离超过一帧
						if(swipeleft){//下一帧
							if(span >= 1 && self.length >2){
								//  +1 是为了在向右滑动时，始终保持前进一档，不会出现后退一格
								self.currentTab += span + 1;
								if(self.currentTab >= (self.length - self.colspan)){
									self.currentTab  = self.length - self.colspan - 1;
								}
							}
							self.next();
						}else{//上一帧
							if(span >= 1 && self.length > 2){
								//  -1 是为了在向左滑动时，始终保持向左划，不会出现回弹
								self.currentTab += -1 * span -1;
								// 如果滑动到起始位置，就不需要再减一了
								if(self.currentTab <= 0){
									self.currentTab = 1;
								}
							}
							self.previous();
						}
					};

					//如果检测到是上下滑动，则复位并return
					/*
					if(self.isScrolling){
						reset();
						return;
					}
					*/

					//如果滑动物理距离太小，则复位并return
					//这个是避免将不精确的点击误认为是滑动
					if(self.touchmove && self.deltaX < 30){
						reset();
						return;
					}


					if(		!anti && (
								// 支持touchmove，跑马灯效果，任意帧，touchmove足够的距离
								( self.touchmove && (self.deltaX > width / 3) ) ||
								// 不支持touchmove，跑马灯
								( !self.touchmove && self.carousel ) ||
								// 正常tab，支持touchmove，横向切换
								( !self.carousel && self.touchmove && self.effect == 'hSlide' ) || 
								// 不支持touchmove，不支持跑马灯
								( !self.touchmove && !self.carousel) ||
								//快速手滑
								( Number(new Date()) - self.startT < 550 )
							)
						
						){

							//根据根据手滑方向翻到上一页和下一页
							goswipe();

					}else{
						//复位
						reset();
					}

					if(self.autoSlide){
						self.play();
					}
				},'.'+self.contentClass);


				//处理手指滑动事件相关
				if(self.touchmove){

					// TODO 网页放大缩小时，距离计算有误差


					self.con._delegate('touchmove',function(e){
						// 确保单手指滑动，而不是多点触碰
						if(e.touches.length > 1 ) return;


						//deltaX > 0 ，右移，deltaX < 0 左移
						self.deltaX = e.touches[0].clientX- self.startX; 

						//判断是否在边界反滑动，true，出现了反滑动，false，正常滑动
						var anti = ( self.is_last() && self.deltaX < 0 || self.is_first() && self.deltaX > 0 );

						if(!self.carousel && self.effect == 'hSlide' && anti){
							self.deltaX = self.deltaX / 3; //如果是边界反滑动，则增加阻尼效果
						}

						// 判断是否需要上下滑动页面


						self.isScrolling = ( Math.abs(self.deltaX) < Math.abs(e.touches[0].clientY- self.startY) ) ? true: false;

						if(!self.isScrolling){

							// 阻止默认上下滑动事件
							//e.halt();
							e.preventDefault();

							self.stop();
							var width = Number(self.animcon.get('region').width / self.colspan);
							var dic = self.deltaX - self.currentTab * width;

							// 立即跟随移动
							self.animwrap.setStyles({
								'-webkit-transition-duration': '0s',
								'-webkit-transform':'translate3d('+dic+'px,0,0)'
							});

						}
						
					},'.'+self.contentClass); 

					// TODO 触屏设备中的AnimEnd事件的实现
					self.animwrap.on('webkitTransitionEnd',function(){
						
						/*
						self.fire('afterSwitch',{
							index: index,
							navnode: self.tabs.item(self.getWrappedIndex(index)),
							pannelnode: self.pannels.item(index)
							
						});	
						*/
					}); 
				}

			}

			return this;

		},

		// 初始化所有的SubLayer
		// TODO 从BSlide中抽离出来

		/*
		 * SubLayer存放在:
		 *
		 * self {
		 *		sublayers:[
		 *			[],	// 第一帧的sublay数组,可以为空数组
		 *			[], // ...
		 *			[]
		 *		]
		 * }
		 *
		 * */
		
		initLayer: function(){
			var self = this;

			// 在触屏设备中layer功能暂时去掉
			// TODO 应当加上触屏支持
			if ( 'ontouchstart' in document.documentElement ) {
				return;
			}

			if(S.UA.ie > 0 && S.UA.ie < 9){
				return;
			}

			// 过滤rel中的配置项
			var SubLayerString = [
				"durationin",
				"easingin",
				"durationout",
				"easingout",
				"delayin",
				"delayout",
				"slideindirection",
				"slideoutdirection",
				"offsetin",
				"offsetout",
				"alpha",
				
				"easeInStrong",
				"easeOutStrong",
				"easeBothStrong",
				"easeNone",
				"easeIn",
				"easeOut",
				"easeBoth",
				"elasticIn",
				"elasticOut",
				"elasticBoth",
				"backIn",
				"backOut",
				"backBoth",
				"bounceIn",
				"bounceOut",
				"bounceBoth",
				"left",
				"top",
				"right",
				"bottom"
			];

			// sublay的默认配置项，参照文件顶部文档说明
			var SubLayerConfig = {
				"durationin":			1000,
				"easingin":				'easeIn',
				"durationout":			1000,
				"easingout":			'easeOut',
				"delayin":				300,
				"delayout":				300,
				"slideindirection":		'right',
				"slideoutdirection":	'left',
				"alpha":				true,	
				"offsetin":				50,	
				"offsetout":			50
			};

			// SubLayer 构造器,传入单个el，生成SubLayer对象
			var SubLayer = function(el){

				var that = this;
				var _sublayer_keys = [];
				
				// 如果sublayer配置的书写格式不标准，则这里会报错
				// TODO 错误捕捉处理
				var json = el.attr('rel').replace(/"'/ig,'').replace(new RegExp('('+SubLayerString.join('|')+')',"ig"),'"$1"');

				var o = S.JSON.parse('{'+json+'}');
				
				function setParam(def, key){
					var v = o[key];
					// null 是占位符
					that[key] = (v === undefined || v === null) ? def : v;
				}

				
				S.each(SubLayerConfig,setParam);

				this.el = el;

				// el.offset 计算高度不准确，不知为何，改用css()
				// TODO 寻找原因
				/*
				this.left = el.offset().left;
				this.top = el.offset().top;
				*/
				this.left = Number(el.css('left').replace('px',''));
				this.top = Number(el.css('top').replace('px',''));

				// sublayer.animIn()，某个sublayer的进入动画
				this.animIn = function(){

					var that = this;

					// 记录进入偏移量和进入方向
					var offsetIn = that.offsetin;
					var inType = that.slideindirection;

					// 动画开始之前的预处理
					var prepareEl = {
						left:function(){
								 that.el.css({
									 'left':that.left-offsetIn
								 });
							 },
						top:function(){
								that.el.css({
									'top':that.top-offsetIn
								});
							},
						right:function(){
								  that.el.css({
									  'left':that.left+offsetIn
								  });
							  },
						bottom:function(){
								   that.el.css({
									   'top':that.top+offsetIn
								   });
							   }
					};

					prepareEl[inType]();

					setTimeout(function(){


						var SlideInEffectTo = {
							left:	{
										left:that.left// + offsetIn
									},
							top:	{
										top:that.top// - offsetIn
									},
							bottom:	{
										top:that.top// + offsetIn,
									},
							right:	{
										left:that.left// - offsetIn
									}
						};



						// 动画结束的属性
						var to = {};

						S.mix(to,SlideInEffectTo[inType]);

						// 如果开启alpha，则从透明动画到不透明
						if(that.alpha){
							S.mix(to,{
								opacity:1	
							});
						}


						// 执行动画
						S.Anim(that.el,to,that.durationin/1000,that.easingin,function(){
							// TODO 动画结束后的回调事件
							// 寻找最后的动画结束时间
						}).run();
						
					},that.delayin);

					if(that.alpha){
						that.el.css({
							opacity:0	
						});
					}


				};
				// TODO 仿效animIn来实现
				this.animOut = function(){
					var that = this;

					// 记录退出偏移量和退出方向
					var offsetOut = that.offsetout;
					var outType = that.slideoutdirection;

					// 动画开始之前的预处理
					var prepareEl = {
						left:function(){
								 that.el.css({
									 'left':that.left
								 });
							 },
						top:function(){
								that.el.css({
									'top':that.top
								});
							},
						right:function(){
								  that.el.css({
									  'left':that.left
								  });
							  },
						bottom:function(){
								   that.el.css({
									   'top':that.top
								   });
							   }
					};

					prepareEl[outType]();

					setTimeout(function(){
						var SlideOutEffectTo = {
							left:	{
										left:that.left + offsetOut
									},
							top:	{
										top:that.top + offsetOut
									},
							bottom:	{
										top:that.top - offsetOut
									},
							right:	{
										left:that.left - offsetOut
									}
						};



						// 动画结束的属性
						var to = {};

						S.mix(to,SlideOutEffectTo[outType]);

						// 如果开启alpha，则从透明动画到不透明
						if(that.alpha){
							S.mix(to,{
								opacity:0	
							});
						}


						// 执行动画
						S.Anim(that.el,to,that.durationout/1000,that.easingout,function(){
							// TODO 动画结束后的回调事件
							// 寻找最后的动画结束时间
						}).run();
						
					},that.delayout);
					
					if(that.alpha){
						that.el.css({
							opacity:1
						});
					}

				};

			};

			self.sublayers = [];

			self.pannels.each(function(node,index){

				if(self.effect == 'vSlide'||self.effect == 'hSlide'){
					node.css({
						position:'relative'	
					});
				}

				if(node.all('[alt="sublayer"]').length === 0){
					self.sublayers[index] = [];
					return;
				}
				if(self.sublayers[index] === undefined){
					self.sublayers[index] = [];
				}

				node.all('[alt="sublayer"]').each(function(el,j){
					self.sublayers[index].push(new SubLayer(el));
				});
				
			});

			self.on('beforeSwitch',function(o){
				if(o.index === self.currentTab){
					return false;
				}
				self.subLayerRunin(o.index);
			});

			self.on('beforeTailSwitch',function(o){
				//if(self.isTailSwitching === true) {
				//	return false;
				//}

				//self.isTailSwitching = true;
				self.subLayerRunout(o.index);	
				// 同时，返回需要delay的最长时间
				return self.getMaxAnimDelay(o.index);
			});

		},

		// 执行某一帧的进入动画
		subLayerRunin : function(index){

			var self = this;
			
			var a = self.sublayers[index];

			S.each(a,function(o,i){
				o.animIn();
			});
		},

		// 执行某一帧的移出动画
		subLayerRunout : function(index){
			var self = this;

			var a = self.sublayers[index];

			S.each(a,function(o,i){
				o.animOut();
			});

		},

		// 构建BSlide全局参数列表
		buildParam:function(o){

			var self = this;

			if(o === undefined || o === null){
				o = {};
			}

			function setParam(def, key){
				var v = o[key];
				// null 是占位符
				self[key] = (v === undefined || v === null) ? def : v;
			}

			S.each({
				autoSlide:		false,
				speed:			500,//ms
				timeout:		3000,
				effect:			'none',
				eventType:		'click',
				easing:			'easeBoth',
				hoverStop:		true,
				selectedClass:	'selected',
				conClass:		't-slide',
				navClass:		'tab-nav',
				triggerSelector:'li',
				contentClass:	'tab-content',
				pannelClass:	'tab-pannel',
				// before_switch:	new Function,
				carousel:		false,
				reverse:		false,
				touchmove:		false,
				adaptive_fixed_width:false,
				adaptive_fixed_height:false,
				adaptive_fixed_size:false,
				adaptive_width:	false,
				adaptive_height:false,
				defaultTab:		0,
				layerSlide:		false,
				layerClass:		'tab-animlayer',
				colspan:		1,
				animWrapperAutoHeightSetting:true,// beforeSwitch不修改wrappercon 宽高
				webkitOptimize	:true,
				triggerDelay:	300 	// added by jayli 2013-05-21，触碰延时
				
			},setParam);

			S.mix(self,{
				tabs:			[],
				animcon:		null,
				pannels:		[],
				timmer:			null,
				touching:		false
			});

			self.speed = self.speed / 1000;

			if(self.defaultTab !== 0){
				self.defaultTab = Number(self.defaultTab) - 1; // 默认隐藏所有pannel
			}

			// 如果是跑马灯，则不考虑默认选中的功能，一律定位在第一页,且只能是左右切换的不支持上下切换
			if(self.carousel){
				self.defaultTab = self.colspan; //跑马灯显示的是真实的第二项
				self.effect = 'hSlide';// TODO 目前跑马灯只支持横向滚动
			}

			self.currentTab = self.defaultTab;//0,1,2,3...

			//判断是否开启了内置动画
			self.transitions = ( "webkitTransition" in document.body.style && self.webkitOptimize );

            return self;
		},
		//针对移动终端的跑马灯的hack
		//index 移动第几个,0,1,2,3
		fix_for_transition_when_carousel: function(index){
			var self = this;
			if(typeof index == 'undefined'){
				index = 0;
			}
			var con = self.con;
            self.animcon = self.con.one('.' + self.contentClass);
			self.animwrap = self.animcon.one('div');
			self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			if(self.effect == 'hSlide'){
				var width = Number(self.animcon.get('region').width / self.colspan);
				var height = Number(self.animcon.get('region').height);
				self.animwrap.setStyle('width',self.pannels.size() * width + 2 * width);
				var first = self.pannels.item(index).cloneNode(true);
				var last = self.pannels.item(self.pannels.size()- 1 - index).cloneNode(true);
				self.animwrap.append(first);
				self.animwrap.prepend(last);
				if(self.transitions){
					//这步操作会手持终端中造成一次闪烁,待解决
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+(-1 * width * (index/2 + 1))+'px,0,0)',
						'-webkit-backface-visibility':'hidden',
						'left':'0'
					});
				}else {
					self.animwrap.setStyle('left',-1 * width * (index/2 + 1));
				}
			}
			//重新获取重组之后的tabs
			self.pannels = con.all('.' + self.contentClass + ' .' + self.pannelClass);
			self.length = self.pannels.size();

			return this;

		},

		// 是否在做动画过程中
		isAming : function(){
			var self = this;
			if(self.anim){
				return self.anim.isRunning();
			} else {
				return false;
			}
		},

		//上一个
		previous:function(callback){
			var self = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(self.isAming() && self.carousel){
					return this;
				}
			}catch(e){}
			var _index = self.currentTab+self.length-1 - (self.colspan - 1);
			if(_index >= (self.length - self.colspan + 1)){
				_index = _index % (self.length - self.colspan + 1);
			}

			if(self.carousel){

				if(self.is_first()){
					self.fix_pre_carousel();
					self.previous.call(self);
					// arguments.callee.call(self);
					return this;
				}
			}
			self.go(_index,callback);
			return this;
		},
		//判断当前tab是否是最后一个
		is_last:function(){
			var self = this;
			if(self.currentTab == (self.length - (self.colspan - 1) - 1)){
				return true;
			}else{
				return false;
			}
		},
		//判断当前tab是否是第一个
		is_first:function(){
			var self = this;
			if(self.currentTab === 0){
				return true;
			}else{
				return false;
			}
		},
		//下一个
		next:function(callback){
			var self = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(self.isAming() && self.carousel){
					return this;
				}
			}catch(e){}
			var _index = self.currentTab+1;
			if(_index >= (self.length - self.colspan + 1)){
				_index = _index % (self.length - self.colspan + 1);
			}
			if(self.carousel){

				if(self.is_last()){
					self.fix_next_carousel();
					self.next.call(self);
					// arguments.callee.call(self);
					return this;

				}

			}
			self.go(_index,callback);
			return this;
		},
		// 修正跑马灯结尾的滚动位置
		fix_next_carousel:function(){
			var self = this;

			self.currentTab = self.colspan;
			var con = self.con;
			if(self.effect != 'none'){
				self.pannels = con.all('.'+self.contentClass+' .'+self.pannelClass);
			}

			//目标offset，'-234px'
			var dic = '-' + Number(self.animcon.get('region').width ).toString()+'px';

			if(self.effect == 'hSlide'){

				if(self.transitions){
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+dic+',0,0)'
					});

				}else{
					self.animwrap.setStyle('left',dic);
				}
			} else if (self.effect == 'vSlide'){
				// 暂不支持纵向跑马灯的滚动

			}

			return;

		},

		// 修正跑马灯开始的滚动位置
		fix_pre_carousel:function(){
			var self = this;

			// jayli 这里需要调试修正，继续调试
			self.currentTab = self.length - 1 - self.colspan * 2 + 1;
			var con = self.con;
			if(self.effect != 'none'){
				self.pannels = con.all('.'+self.contentClass+' .'+self.pannelClass);
			}
			// 目标offset,是一个字符串 '-23px'
			var dic = '-' + (Number(self.animcon.get('region').width / self.colspan) * (self.currentTab)).toString() + 'px';

			if(self.effect == 'hSlide'){
				if(self.transitions){
					self.animwrap.setStyles({
						'-webkit-transition-duration': '0s',
						'-webkit-transform':'translate3d('+dic +',0,0)'
					});

				}else{
					self.animwrap.setStyle('left',dic);
				}
			}else if (self.effect == 'vSlide'){
				//竖向滚动暂时未实现

			}

			return;

		},
		//高亮显示第index(0,1,2,3...)个nav
		hightlightNav:function(index){
			var self = this;
			// 同时是跑马灯，且一帧多元素，则不允许存在Nav
			if(self.carousel && self.colspan > 1){
				return this;
			}
			if(self.tabs.item(index)){
				self.tabs.removeClass(self.selectedClass);
				self.tabs.item(index).addClass(self.selectedClass);
			}
			return this;
		},
		//切换至index,这里的index为真实的索引
		switch_to:function(index,callback){
			var self = this;

			// 切换是否强制取消动画
			if(callback === false){
				var doeffect = false;
			} else {
				var doeffect = true;
			}

			var afterSwitch = function(){
				if(S.isFunction(callback)){
					callback.call(self,self);
				}
				self.fire('afterSwitch',{
					index: self.currentTab,
					navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
					pannelnode: self.pannels.item(self.currentTab)
				});
			};
			

			// tailSwitch 是秒数
			var tailSwitch = self.fire('beforeTailSwitch',{
				index: self.currentTab,
				navnode: self.tabs.item(self.getWrappedIndex(self.currentTab)),
				pannelnode: self.pannels.item(self.currentTab)
			});

			self.fixSlideSize(index);
			if(self.autoSlide){
				self.stop().play();
			}
            if (index >= self.length) {
                index = index % self.length;
            }
            if (index == self.currentTab) {
                return this;
            }

			if (self.anim) {
				try {
					self.anim.stop();
					//fix IE6下内存泄露的问题，仅支持3.2.0及3.3.0,3.1.0及3.0.0需修改Y.Anim的代码
					//modified by huya
					// self.anim.destroy();
					self.anim = null;
				} catch (e) {}
			}

			// TODO 帧切换动画的实现应当从Bslide中抽离出来
			var animFn = {
				'none':function(index){

					self.pannels.setStyles({
						'display':'none'	
					});

					self.pannels.item(index).setStyles({
						'display':'block'	
					});

					afterSwitch();

				},
				'vSlide':function(index){

					if(self.transitions){
						self.animwrap.setStyles({
							'-webkit-transition-duration': (doeffect ? self.speed : '0') + 's',
							'-webkit-transform':'translate3d(0,'+(-1 * index * self.animcon.get('region').height / self.colspan)+'px,0)',
							'-webkit-backface-visibility':'hidden'
						});
						if(doeffect){
							self.anim = S.Anim(self.animwrap,{
								opacity:1
							},self.speed ,self.easing,function(){
								afterSwitch();
							});
							self.anim.run();
						} else {
							afterSwitch();
						}
					} else {
						/*
						self.anim = new S.Anim({
							node: self.animwrap,
							to: {
								top: -1 * index * self.animcon.get('region').height
							},
							easing: self.easing,
							duration: self.speed
						});
						self.anim.run();
						*/
						if(doeffect){
							self.anim = S.Anim(self.animwrap,{
								top: -1 * index * self.animcon.get('region').height / self.colspan
							},self.speed,self.easing,function(){
								afterSwitch();
							});
							self.anim.run();
						} else {
							self.animwrap.css({
								top: -1 * index * self.animcon.get('region').height / self.colspan
							});
							afterSwitch();
						}
					}

				},
				'hSlide':function(index){

					if(self.transitions){

						self.animwrap.setStyles({
							'-webkit-transition-duration': (doeffect ? self.speed : '0') + 's',
							'-webkit-transform':'translate3d('+(-1 * index * self.animcon.get('region').width / self.colspan)+'px,0,0)',
							'-webkit-backface-visibility':'hidden'
						});
						if(doeffect){
							self.anim = S.Anim(self.animwrap,{
								opacity:1
							},self.speed ,self.easing,function(){
								afterSwitch();
							});
							self.anim.run();
						} else {
							afterSwitch();
						}
					}else{

						if(doeffect){
							self.anim = S.Anim(self.animwrap,{
								left: -1 * index * self.animcon.get('region').width / self.colspan
							},self.speed,self.easing,function(){
								afterSwitch();
							});

							self.anim.run();
						} else {
							self.animwrap.css({
								left: -1 * index * self.animcon.get('region').width / self.colspan
							});
							afterSwitch();
						}
					}

				},
				'fade':function(index){
					//重写fade效果逻辑
					//modified by huya
					var _curr = self.currentTab;

					self.anim = S.Anim(self.pannels.item(index),{
						opacity: 1
					},doeffect ? self.speed : 0.01,self.easing,function(){

						self.pannels.item(_curr).setStyle('zIndex', 0);
						self.pannels.item(index).setStyle('zIndex', 1);
						self.pannels.item(_curr).setStyle('opacity', 0);
						self.pannels.item(_curr).setStyles({
							'display':'none'	
						});
						afterSwitch();
						/*
						self.fire('afterSwitch',{
							index: index,
							navnode: self.tabs.item(self.getWrappedIndex(index)),
							pannelnode: self.pannels.item(index)
						});
						*/
					});

					//动画开始之前的动作
					self.pannels.item(index).setStyles({
						'display':'block'	
					});
					self.pannels.item(index).setStyle('opacity', 0);
					self.pannels.item(_curr).setStyle('zIndex', 1);
					self.pannels.item(index).setStyle('zIndex', 2);

					self.anim.run();

				}

			};

			var doSwitch = function(){
				
				var goon = self.fire('beforeSwitch', {
					index:index,
					navnode:self.tabs.item(index),
					pannelnode:self.pannels.item(index)
				});

				if(goon !== false){
					//发生go的时候首先判断是否需要整理空间的长宽尺寸
					//self.renderSize(index);

					if(index + self.colspan > self.pannels.size()){
						index = self.pannels.size() - self.colspan;
					}
					animFn[self.effect](index);

					self.currentTab = index;
					self.hightlightNav(self.getWrappedIndex(index));
					// TODO，讨论switch的发生时机
					self.fire('switch', {
						index: index,
						navnode: self.tabs.item(self.getWrappedIndex(index)),
						pannelnode: self.pannels.item(index)
					});

					//延迟执行的脚本
					self.renderPannelTextarea(index);
				}
			};

			if(S.isNumber(tailSwitch)){
				setTimeout(function(){
					doSwitch();
					//self.isTailSwitching = false;
				},tailSwitch);
			} else /*if(tailSwitch !== false)*/{
				doSwitch();
				//self.isTailSwitching = false;
			}


		},
		//去往任意一个,0,1,2,3...
		"go":function(index,callback){
			var self = this;

			self.switch_to(index,callback);

			return this;

		},
		//自动播放
		play:function(){
			var self = this;
			if(self.timer !== null){
				clearTimeout(self.timer);
			}
			self.timer = setTimeout(function(){
				self.next().play();
			},Number(self.timeout));
			return this;
		},
		//停止自动播放
		stop:function(){
			var self = this;
			clearTimeout(self.timer);
			self.timer = null;
			return this;
		}
	});

	return BSlide;

},{
	requires:['node','event','json','./slide-util','./kissy2yui']	
});




KISSY.add('gallery/slide/1.1/index',function(S,BSlide){

	return BSlide;

},{
	requires:['./base']	
});


/**
 * @fileOverview KISSY Slide
 * @author  bachi@taobao.com
 * 		幻灯/Tab/Carousel...
 * 		Demo:	配host，访问：http://a.tbcdn.cn/apps/ks/zoo/slide/demo/tab.html
 *
 * @param 参数列表
 * 		autoSlide : {boolean} 	是否自动播放，默认为false
 * 		speed:		{float}		帧切换的速度，默认为500(ms)
 * 		timeout:	{Number}	帧切换的时间间隔，默认为1000(ms)
 * 		effect:		{String}	帧切换类型，默认为'none',取值： * 								none:无特效
 * 								fade:渐隐
 * 								hSlide:水平切换
 * 								vSlide:垂直切换
 * 		eventType:	{String}	触发tab切换的nav上的事件类型，默认为'click'，推荐使用：
 * 								click:点击
 * 								mouseover:鼠标经过(这个可能会多次触发切换事件)
 * 								mouseenter:鼠标进入
 * 		easing:		{String}	帧切换的缓动值，默认为'easeBoth'，取值请参照KISSY.Anim
 * 							http://docs.kissyui.com/docs/html/api/core/anim/index.html
 * 		hoverStop:	{boolean}	鼠标悬停在面板上是否停止自动播放，默认为true
 * 		selectedClass:{String}	tab选中时的className，默认为't-slide'，目前未实现
 * 		navClass:	{String}	tab容器的className，默认为'tab-nav'
 * 		triggerSelector:{String}tab容器中的触碰元素的选择器，默认为'li'
 * 		contentClass:{String}	tab内容容器的className,默认为tab-content
 * 		pannelClass:{String}	tab面板的className，默认为tab-pannel
 * 		id:			{String}	hook，直接写id，比如"J_id"(正确)，"#J_id"(错误)
 * 		carousel:	{Boolean}	是否以跑马灯形式播放，默认为false
 * 		touchmove:	{Boolean}	是否支持手指滑动切换，默认为false
 * 		adaptive_fixed_width:{boolean} 屏幕是否根据控件的宽度改变重新渲染尺寸，默认为false，主要在组件定宽高的场景中，保证resize时tab-pannel尺寸正确
 * 		adaptive_fixed_height:{boolean} 屏幕是否根据控件的高度改变重新渲染尺寸，默认为false,主要在组件定宽高的场景中，保证resize时tab-pannel尺寸正确
 * 		adaptive_fixed_size:{boolean} 屏幕是否根据控件的宽度和高度改变重新渲染尺寸，默认为false,主要在组件定宽高的场景中，保证resize时tab-pannel尺寸正确
 * 		defaultTab:	{Number}	默认定位在某个帧，默认为0，即第一帧
 * 		layerSlide:	{Boolean}	是否开启分层动画，默认为false
 * 		layerClass:	{String}	subLayer的className，未实现，默认用alt="sublayer"来标识
 * 		reverse:	{boolean} 	"播放下一个"和"播放上一个"对调，默认为false
 * 		adaptive_height:{function},同下
 * 		adaptive_width:{function}，如果是百分比设置容器的宽度的话，需要指定这个函数，返回一个宽度值，动态的得到可变化的宽度,默认为false，代码示例:
 *
 * 						var slide = new Slide('J_tab',{
 * 							adaptive_width:function(){
 * 								return document.body.offsetWidth;
 * 							}
 * 						});
 *
 *
 * 	@event 事件
 * 		ready:		初始化完成后的事件回调，带入上下文this，带入参数为
 * 					{
 *						index:index,		// 当前帧的索引
 *						navnode:navnode,	// 当前导航的节点
 *						pannelnode:pannelnode//当前面板的节点
 * 					}
 * 		switch:		切换发生时的事件，特指切换动作必然发生时的时刻，回调上下文和参数同上
 *		beforeSwitch:	“切换至”的事件，回调返回false可以阻止切换事件的发生
 *		beforeTailSwitch:从某一帧的角度看，这一帧切换到下一帧之前发生的事件,参数同上
 *		afterSwitch:	切换完成的动作，未实现
 *
 *
 *	@mathod 方法
 *		init		初始化，参数为一个对象，带入配置项
 *		previous	切换到上一个，无参数
 *		next		切换到下一个，无参数
 *		go		跳转到指定索引的帧，参数为index:0,1,2,3...
 *		switch_to	纯粹执行切换的动作，不推荐使用，建议使用go
 *		play		开始自动播放
 *		stop		停止自动播放
 *		hightlightNav 高亮某个特定的导航项，参数为索引值index:0,1,2,3...
 *		is_first	是否当前停止在第一帧
 *		is_last		是否当前停止在最后一真
 *		resetSlideSize 可以传入一个索引值为参数，重置第index个Slide的宽度和高度,幻灯尺寸发生动态变化时，需要调用这个方法来重设宽高，内部方法
 *		relocateCurrentTab 无参数，重新修正当前帧的位置，内部方法
 *		initLayer	初始化SubLayer，无参数，非触屏模式下有效 TODO
 *
 *
 *	@subClass 当layerSlide配置为true时，配置sublayer的参数，写法：
 *					
 *					<span alt="sublayer" 
 *						rel="alpha: true,slideindirection: left, durationin: 1000" 
 *						class="sublayer1">SubLayer1</span>
 *
 * 		subLayer配置项：
 * 			durationin		进入动画的缓动速度，默认为1000（毫秒）
 * 			easingin		进入动画的缓动效果，默认为easeIn，具体参照KISSY.Anim
 * 			durationout		移出动画的缓动速度，默认为1000（毫秒）
 * 			easingout		移出动画的缓动效果，默认为easeOut
 * 			delayin			进入动画的延时，默认为300（毫秒）
 * 			delayout		移出动画的延时，默认为300
 * 			slideindirection进入动画的起始方向，默认为'right'，top/right/left/bottom
 * 			slideoutdirection移出动画的起始方向，默认为'left'
 * 			alpha			是否带有透明度变幻，默认为true
 * 			offsetin		进入动画的相对距离，默认为50
 *			offsetout		移出动画的相对距离，默认为50
 */


