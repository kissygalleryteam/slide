/*! slide - v1.1 - 2013-05-25 2:00:12 PM
* Copyright (c) 2013 bachi; Licensed  */
KISSY.add("gallery/slide/1.1/slide-util",function(e){"use strict";e.mix(e,{setHash:function(e,t){var n,i;"object"==typeof e?(n=window.location.href,t=e):n=e,0>n.indexOf("#")&&(n+="#");var a=this.getHash(n);for(i in t)a[i]=t[i];n=n.split("#")[0]+"#";for(i in a)n+=i+"="+a[i]+"&";return n=n.substr(0,n.length-1)},getHash:function(t){var n=t||window.location.href;if(0>n.indexOf("#"))return{};var i=n.split("#")[1];if(""===i)return{};"&"==i[i.length-1]&&(i=i.substr(0,i.length-1)),i=i.replace(/"/gi,"'"),i=i.replace(/=/gi,'":"'),i=i.replace(/&/gi,'","'),i+='"',i='{"'+i+"}";var a=e.JSON.parse(i);return a},_globalEval:function(e){if(e&&/\S/.test(e)){var t=document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0],n=document.createElement("script");n.text=e,t.insertBefore(n,t.firstChild),setTimeout(function(){t.removeChild(n)},1)}},execScript:function(t){var n,i,a,s,r,o,l=this,c=RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/gi),u=e.one("head").getDOMNode(),d=/\ssrc=(['"])(.*?)\1/i,h=/\scharset=(['"])(.*?)\1/i;for(c.lastIndex=0;n=c.exec(t);)i=n[1],a=i?i.match(d):!1,a&&a[2]?(r=document.createElement("script"),r.src=a[2],(s=i.match(h))&&s[2]&&(r.charset=s[2]),r.async=!0,u.appendChild(r)):(o=n[2])&&o.length>0&&l._globalEval(o)},isDaily:function(){return/daily\.taobao\.net/.test(window.location.hostname)?!0:!1}})},{requires:["node","sizzle","json","event"]}),KISSY.add("gallery/slide/1.1/kissy2yui",function(e){"use strict";e.augment(e.Node,{_delegate:function(){var t=this;return e.isFunction(arguments[1])?t.delegate(arguments[0],arguments[2],arguments[1]):t.delegate.apply(t,arguments),t},indexOf:function(t){var n=this;if(e.isUndefined(t))return null;t[0]&&(t=t[0]);var i=0;return n.each(function(e,n){e[0]===t&&(i=n)}),i},size:function(){return this.length},set:function(e,t){return"innerHTML"===e?this.html(t):this.attr(e,t),this},get:function(e){var t=this,n={innerHTML:function(){return t.html()},region:function(){return{height:t.height(),width:t.width()}}};return e in n?n[e]():void 0},appendChild:function(){return this.append.apply(this,arguments),this},setStyle:function(){return this.css.apply(this,arguments),this},setStyles:function(){return this.css.apply(this,arguments),this},cloneNode:function(){return this.clone.apply(this,arguments)}}),e.Node.create=function(t){return e.Node(t)}},{requires:["node","event"]}),KISSY.add("gallery/slide/1.1/base",function(e){"use strict";e.Node.all;var t=function(){if(!(this instanceof t))throw Error('please use "new Slide()"');this.init.apply(this,arguments)};return t.plug=function(){},e.augment(t,e.Event.Target,{init:function(t,n){var i=this;if(e.isObject(t))i.con=t;else if(/^#/i.test(t))i.con=e.one(t);else if(e.one("#"+t))i.con=e.one("#"+t);else{if(!e.one(t))throw Error("Slide Container Hooker not found");i.con=e.one(t)}if(i.buildParam(n),i.buildHTML(),i.bindEvent(),i.fire("ready",{index:0,navnode:i.tabs.item(0),pannelnode:i.pannels.item(0)}),i.reverse){var a;a=i.previous,i.previous=i.next,i.next=a}if(i.carousel)for(var s=0;i.colspan>s;s++)i.fix_for_transition_when_carousel(2*s);return i.fixSlideSize(),i.layerSlide&&i.initLayer(),this},setWrapperSize:function(t){var n=this;e.isUndefined(t)&&(t=0),n.pannels=n.con.all("."+n.contentClass+" div."+n.pannelClass),n.length=n.pannels.length;var i={none:function(){},vSlide:function(){var e=n.animcon.get("region");n.animwrap.setStyles({height:(n.length+t)*e.height/n.colspan+"px"})},hSlide:function(){var e=n.animcon.get("region");n.animwrap.setStyles({width:(n.length+t)*e.width/n.colspan+"px"})},fade:function(){}};return i[n.effect](),e.isUndefined(t)||n.relocateCurrentTab(),this},add:function(t,n){var i=this;return(e.isUndefined(n)||n>i.length)&&(n=i.length),e.isString(t)&&(t=e.one(t)),i.transitions&&t.css({visibility:"hidden"}),n==i.length?(setTimeout(function(){i.setWrapperSize(1)},0),t.insertAfter(i.pannels[n-1])):t.insertBefore(i.pannels[n]),i.setWrapperSize(),i.fixSlideSize(i.currentTab),i.transitions&&t.css({visibility:""}),i.transitions,this},remove:function(t){var n=this;if(1!==n.length)return n.currentTab>=t&&(n.currentTab--,n.length--),n.transitions&&n.con.css({display:"none"}),e.one(n.pannels[t]).remove(),n.setWrapperSize(),n.transitions&&n.con.css({display:"block"}),n.fixSlideSize(n.currentTab),this},removeLast:function(){var e=this;return e.remove(e.length-1),e},renderLazyData:function(t){if(t.setStyle("display","none"),"1"!=t.attr("lazy-data")){t.attr("lazy-data","1");var n=(e.stamp(i),t.get("innerHTML").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")),i=e.Node.create("<div>"+n+"</div>");e.DOM.insertBefore(i,t),e.execScript(n)}},buildWrap:function(){var t=this;return t.animwrap=e.Node.create('<div style="position:absolute;"></div>'),t.animwrap.set("innerHTML",t.animcon.get("innerHTML")),t.animcon.set("innerHTML",""),t.animcon.appendChild(t.animwrap),t.pannels=t.con.all("."+t.contentClass+" div."+t.pannelClass),t},doEffectInit:function(){var e=this,t={none:function(){e.pannels=e.con.all("."+e.contentClass+" div."+e.pannelClass),e.pannels.setStyles({display:"none"}),e.pannels.item(e.defaultTab).setStyles({display:"block"})},vSlide:function(){e.buildWrap();var t=e.animcon.get("region");e.pannels.setStyles({"float":"none",overflow:"hidden"}),e.animwrap.setStyles({height:e.length*t.height/e.colspan+"px",overflow:"hidden",top:-1*e.defaultTab*t.height+"px"})},hSlide:function(){e.buildWrap();var t=e.animcon.get("region");e.pannels.setStyles({"float":"left",overflow:"hidden"}),e.animwrap.setStyles({width:e.length*t.width/e.colspan+"px",overflow:"hidden",left:-1*e.defaultTab*t.width+"px"})},fade:function(){e.pannels=e.con.all("."+e.contentClass+" div."+e.pannelClass),e.pannels.setStyles({position:"absolute",zIndex:0}),e.pannels.each(function(t,n){n==e.defaultTab?t.setStyles({opacity:1,display:"block"}):t.setStyles({opacity:0,diaplay:"none"})})}};return t[e.effect](),this},buildHTML:function(){var t=this,n=t.con;t.tabs=n.all("."+t.navClass+" "+t.triggerSelector);var i=n.all("."+t.contentClass+" ."+t.pannelClass);if(t.length=i.size(),n.one("."+t.navClass)||e.Node('<ul class="'+t.navClass+'" style="display:none"></ul>').appendTo(t.con),0===t.tabs.size()){for(var a=n.all("."+t.navClass),s="",r=0;t.length>r;r++){var o="";0===r&&(o=t.selectedClass),s+='<li class="'+o+'"><a href="javascript:void(0);">'+(r+1)+"</a></li>"}a.set("innerHTML",s)}return t.tabs=n.all("."+t.navClass+" "+t.triggerSelector),t.animcon=n.one("."+t.contentClass),t.animwrap=null,t.doEffectInit(),t.fixSlideSize(t.currentTab),t.hightlightNav(t.getWrappedIndex(t.currentTab)),t.autoSlide===!0&&t.play(),this},getCurrentPannel:function(){var t=this;return e.one(t.pannels[t.currentTab])},renderWidth:function(){var e=this,t=e.animcon.get("region").width;return"hSlide"==e.effect&&(t/=e.colspan),e.pannels.setStyles({width:t+"px"}),this},renderHeight:function(){var e=this,t=e.animcon.get("region").height;return"vSlide"==e.effect&&(t/=e.colspan),e.pannels.setStyles({height:t+"px"}),this},relocateCurrentTab:function(t){var n=this;return e.isUndefined(t)&&(t=n.currentTab),"hSlide"==n.effect?(n.transitions?n.animwrap.setStyles({"-webkit-transition-duration":"0s","-webkit-transform":"translate3d("+-1*t*n.animcon.get("region").width+"px,0,0)","-webkit-backface-visibility":"hidden"}):n.animwrap.setStyles({left:-1*t*n.animcon.get("region").width}),n.currentTab=t,this):void 0},fixSlideSize:function(e){var t=this;return t.adaptive_fixed_width&&t.renderWidth(),t.adaptive_fixed_height&&t.renderHeight(),t.adaptive_fixed_size&&t.renderHeight().renderWidth(),t.resetSlideSize(e),this},removeHeightTimmer:function(){var t=this;e.isNull(t.heightTimmer)||(clearInterval(t.heightTimmer),t.heightTimmer=null)},addHeightTimmer:function(){var t=this;e.isNull(t.heightTimmer)||(clearInterval(t.heightTimmer),t.heightTimmer=null);var n=function(){"hSlide"==t.effect&&t.animcon.setStyles({height:t.pannels.item(t.currentTab).get("region").height+"px"})};t.heightTimmer=setInterval(n,100),n()},resetSlideSize:function(e){var t,n,i=this;return(e===void 0||null===e)&&(e=i.currentTab),"hSlide"==i.effect||"vSlide"==i.effect?("hSlide"==i.effect&&(t=i.adaptive_width?i.adaptive_width():i.animcon.get("region").width,n=i.pannels.item(e).get("region").height,t/=i.colspan,i.pannels.setStyles({width:t+"px",display:"block"}),i.animcon.setStyles({width:t*i.colspan+"px",overflow:"hidden"}),i.animWrapperAutoHeightSetting&&i.animcon.setStyles({height:n+"px"})),"vSlide"==i.effect&&(t=i.pannels.item(e).get("region").width,n=i.adaptive_height?i.adaptive_height():i.animcon.get("region").height,n/=i.colspan,i.pannels.setStyles({height:n*i.colspan+"px",display:"block"}),i.animcon.setStyles({height:n*i.colspan+"px",overflow:"hidden"}),i.animWrapperAutoHeightSetting&&i.animcon.setStyles({width:t+"px"})),this):void 0},getWrappedIndex:function(e){var t=this,n=0;return n=t.carousel?t.colspan>e?t.length-3*t.colspan+e:e>=t.length-t.colspan?e-(t.length-t.colspan):e-t.colspan:e},getMousePosition:function(){var t=this,n=function(e){t._t_mouseX=e.clientX,t._t_mouseY=e.clientY};e.Event.on(window,"mousemove",n),setTimeout(function(){e.Event.detach(window,"mouseover",n)},t.triggerDelay)},massTrigger:function(t,n){var i=this;return e.inArray(i.eventType,["mouseover","mouseenter"])?(i.getMousePosition(),e.isUndefined(i._fired)||e.isNull(i._fired)?i._fired=setTimeout(function(){i.inRegion([i._t_mouseX,i._t_mouseY],e.one(n))&&t(),i._fired=null},i.triggerDelay):(clearTimeout(i._fired),i._fired=setTimeout(function(){i.inRegion([i._t_mouseX,i._t_mouseY],e.one(n))&&t(),i._fired=null},i.triggerDelay)),void 0):(t(),void 0)},getMaxAnimDelay:function(t){var n=this,i=0;if(n.sublayers)return e.each(n.sublayers[t],function(e){e.durationout+e.delayout>i&&(i=e.durationout+e.delayout)}),i},inRegion:function(e,t){var n=t.offset(),i={width:t.width(),height:t.height()};return e[0]>=n.left&&e[0]<=n.left+i.width&&e[1]>=n.top&&e[1]<=n.top+i.height?!0:!1},bindEvent:function(){var t=this;if(e.inArray(t.eventType,["click","mouseover","mouseenter"])&&t.con._delegate(t.eventType,function(e){e.halt(),t.massTrigger(function(){var n=Number(t.tabs.indexOf(e.currentTarget));t.carousel&&(n=(n+1)%t.length),t.go(n),t.autoSlide&&t.stop().play()},e.currentTarget)},"."+t.navClass+" "+t.triggerSelector),t.hoverStop&&(t.con._delegate("mouseover",function(){t.autoSlide&&t.stop()},"."+t.contentClass+" div."+t.pannelClass),t.con._delegate("mouseout",function(){t.autoSlide&&t.play()},"."+t.contentClass+" div."+t.pannelClass)),e.Event.on("resize",function(){t.fixSlideSize(t.currentTab),t.relocateCurrentTab()},window),t.on("beforeSwitch",function(){return this.layerSlide&&this.isAming()?!1:void 0}),"ontouchstart"in document.documentElement){if(!t.touchmove)return this;t.con._delegate("touchstart",function(e){t.stop(),t.touching=!0,t.is_last()&&t.carousel&&t.fix_next_carousel(),t.is_first()&&t.carousel&&t.fix_pre_carousel(),t.startX=e.changedTouches[0].clientX,t.startY=e.changedTouches[0].clientY,t.animwrap.setStyles({"-webkit-transition-duration":"0s"}),t.startT=Number(new Date)},"."+t.contentClass),t.con._delegate("touchend",function(e){t.touching=!1;var n=e.changedTouches[0].clientX,i=Number(t.animcon.get("region").width);t.deltaX=Math.abs(n-t.startX);var a=Math.abs(n)<Math.abs(t.startX),s=!a,r=t.carousel?!1:t.is_last()&&a||t.is_first()&&s,o=function(){t.animwrap.setStyles({"-webkit-transition-duration":Number(t.speed)/2+"s","-webkit-transform":"translate3d("+-1*t.currentTab*t.animcon.get("region").width/t.colspan+"px,0,0)"})},l=function(){var e=t.animcon.get("region").width/t.colspan,n=parseInt((t.deltaX-e/2)/e,10);a?(n>=1&&t.length>2&&(t.currentTab+=n+1,t.currentTab>=t.length-t.colspan&&(t.currentTab=t.length-t.colspan-1)),t.next()):(n>=1&&t.length>2&&(0>=t.currentTab-n?t.currentTab=1:t.currentTab+=-1*n-1),t.previous())};return t.touchmove&&30>t.deltaX?(o(),void 0):(!r&&(t.touchmove&&t.deltaX>i/3||!t.touchmove&&t.carousel||!t.carousel&&t.touchmove&&"hSlide"==t.effect||!t.touchmove&&!t.carousel||550>Number(new Date)-t.startT)?l():o(),t.autoSlide&&t.play(),void 0)},"."+t.contentClass),t.touchmove&&(t.con._delegate("touchmove",function(e){if(!(e.touches.length>1)){t.deltaX=e.touches[0].clientX-t.startX;var n=t.is_last()&&0>t.deltaX||t.is_first()&&t.deltaX>0;if(!t.carousel&&"hSlide"==t.effect&&n&&(t.deltaX=t.deltaX/3),t.isScrolling=Math.abs(t.deltaX)<Math.abs(e.touches[0].clientY-t.startY)?!0:!1,!t.isScrolling){e.halt(),t.stop();var i=Number(t.animcon.get("region").width/t.colspan),a=t.deltaX-t.currentTab*i;t.animwrap.setStyles({"-webkit-transition-duration":"0s","-webkit-transform":"translate3d("+a+"px,0,0)"})}}},"."+t.contentClass),t.animwrap.on("webkitTransitionEnd",function(){}))}return this},initLayer:function(){var t=this;if(!("ontouchstart"in document.documentElement||e.UA.ie>0&&9>e.UA.ie)){var n=["durationin","easingin","durationout","easingout","delayin","delayout","slideindirection","slideoutdirection","offsetin","offsetout","alpha","easeInStrong","easeOutStrong","easeBothStrong","easeNone","easeIn","easeOut","easeBoth","elasticIn","elasticOut","elasticBoth","backIn","backOut","backBoth","bounceIn","bounceOut","bounceBoth","left","top","right","bottom"],i={durationin:1e3,easingin:"easeIn",durationout:1e3,easingout:"easeOut",delayin:300,delayout:300,slideindirection:"right",slideoutdirection:"left",alpha:!0,offsetin:50,offsetout:50},a=function(t){function a(e,t){var n=o[t];s[t]=void 0===n||null===n?e:n}var s=this,r=t.attr("rel").replace(/"'/gi,"").replace(RegExp("("+n.join("|")+")","ig"),'"$1"'),o=e.JSON.parse("{"+r+"}");e.each(i,a),this.el=t,this.left=Number(t.css("left").replace("px","")),this.top=Number(t.css("top").replace("px","")),this.animIn=function(){var t=this,n=t.offsetin,i=t.slideindirection,a={left:function(){t.el.css({left:t.left-n})},top:function(){t.el.css({top:t.top-n})},right:function(){t.el.css({left:t.left+n})},bottom:function(){t.el.css({top:t.top+n})}};a[i](),setTimeout(function(){var n={left:{left:t.left},top:{top:t.top},bottom:{top:t.top},right:{left:t.left}},a={};e.mix(a,n[i]),t.alpha&&e.mix(a,{opacity:1}),e.Anim(t.el,a,t.durationin/1e3,t.easingin,function(){}).run()},t.delayin),t.alpha&&t.el.css({opacity:0})},this.animOut=function(){var t=this,n=t.offsetout,i=t.slideoutdirection,a={left:function(){t.el.css({left:t.left})},top:function(){t.el.css({top:t.top})},right:function(){t.el.css({left:t.left})},bottom:function(){t.el.css({top:t.top})}};a[i](),setTimeout(function(){var a={left:{left:t.left+n},top:{top:t.top+n},bottom:{top:t.top-n},right:{left:t.left-n}},s={};e.mix(s,a[i]),t.alpha&&e.mix(s,{opacity:0}),e.Anim(t.el,s,t.durationout/1e3,t.easingout,function(){}).run()},t.delayout),t.alpha&&t.el.css({opacity:1})}};t.sublayers=[],t.pannels.each(function(e,n){return("vSlide"==t.effect||"hSlide"==t.effect)&&e.css({position:"relative"}),0===e.all('[alt="sublayer"]').length?(t.sublayers[n]=[],void 0):(void 0===t.sublayers[n]&&(t.sublayers[n]=[]),e.all('[alt="sublayer"]').each(function(e){t.sublayers[n].push(new a(e))}),void 0)}),t.on("beforeSwitch",function(e){return e.index===t.currentTab?!1:(t.subLayerRunin(e.index),void 0)}),t.on("beforeTailSwitch",function(e){return t.subLayerRunout(e.index),t.getMaxAnimDelay(e.index)})}},subLayerRunin:function(t){var n=this,i=n.sublayers[t];e.each(i,function(e){e.animIn()})},subLayerRunout:function(t){var n=this,i=n.sublayers[t];e.each(i,function(e){e.animOut()})},buildParam:function(t){function n(e,n){var a=t[n];i[n]=void 0===a||null===a?e:a}var i=this;return(void 0===t||null===t)&&(t={}),e.each({autoSlide:!1,speed:500,timeout:3e3,effect:"none",eventType:"click",easing:"easeBoth",hoverStop:!0,selectedClass:"selected",conClass:"t-slide",navClass:"tab-nav",triggerSelector:"li",contentClass:"tab-content",pannelClass:"tab-pannel",carousel:!1,reverse:!1,touchmove:!1,adaptive_fixed_width:!1,adaptive_fixed_height:!1,adaptive_fixed_size:!1,adaptive_width:!1,adaptive_height:!1,defaultTab:0,layerSlide:!1,layerClass:"tab-animlayer",colspan:1,animWrapperAutoHeightSetting:!0,webkitOptimize:!0,triggerDelay:300},n),e.mix(i,{tabs:[],animcon:null,pannels:[],timmer:null,touching:!1}),i.speed=i.speed/1e3,0!==i.defaultTab&&(i.defaultTab=Number(i.defaultTab)-1),i.carousel&&(i.defaultTab=i.colspan,i.effect="hSlide"),i.currentTab=i.defaultTab,i.transitions="webkitTransition"in document.body.style&&i.webkitOptimize,i},fix_for_transition_when_carousel:function(e){var t=this;e===void 0&&(e=0);var n=t.con;if(t.animcon=t.con.one("."+t.contentClass),t.animwrap=t.animcon.one("div"),t.pannels=n.all("."+t.contentClass+" div."+t.pannelClass),"hSlide"==t.effect){var i=Number(t.animcon.get("region").width/t.colspan);Number(t.animcon.get("region").height),t.animwrap.setStyle("width",t.pannels.size()*i+2*i);var a=t.pannels.item(e).cloneNode(!0),s=t.pannels.item(t.pannels.size()-1-e).cloneNode(!0);t.animwrap.append(a),t.animwrap.prepend(s),t.transitions?t.animwrap.setStyles({"-webkit-transition-duration":"0s","-webkit-transform":"translate3d("+-1*i*(e/2+1)+"px,0,0)","-webkit-backface-visibility":"hidden",left:"0"}):t.animwrap.setStyle("left",-1*i*(e/2+1))}return t.pannels=n.all("."+t.contentClass+" div."+t.pannelClass),t.length=t.pannels.size(),this},isAming:function(){var e=this;return e.anim?e.anim.isRunning():!1},previous:function(e){var t=this;try{if(t.isAming()&&t.carousel)return this}catch(n){}var i=t.currentTab+t.length-1-(t.colspan-1);return i>=t.length-t.colspan+1&&(i%=t.length-t.colspan+1),t.carousel&&t.is_first()?(t.fix_pre_carousel(),t.previous.call(t),this):(t.go(i,e),this)},is_last:function(){var e=this;return e.currentTab==e.length-(e.colspan-1)-1?!0:!1},is_first:function(){var e=this;return 0===e.currentTab?!0:!1},next:function(e){var t=this;try{if(t.isAming()&&t.carousel)return this}catch(n){}var i=t.currentTab+1;return i>=t.length-t.colspan+1&&(i%=t.length-t.colspan+1),t.carousel&&t.is_last()?(t.fix_next_carousel(),t.next.call(t),this):(t.go(i,e),this)},fix_next_carousel:function(){var e=this;e.currentTab=e.colspan;var t=e.con;"none"!=e.effect&&(e.pannels=t.all("."+e.contentClass+" div."+e.pannelClass));var n="-"+(""+Number(e.animcon.get("region").width))+"px";"hSlide"==e.effect?e.transitions?e.animwrap.setStyles({"-webkit-transition-duration":"0s","-webkit-transform":"translate3d("+n+",0,0)"}):e.animwrap.setStyle("left",n):"vSlide"==e.effect},fix_pre_carousel:function(){var e=this;e.currentTab=e.length-1-2*e.colspan+1;var t=e.con;"none"!=e.effect&&(e.pannels=t.all("."+e.contentClass+" div."+e.pannelClass));var n="-"+(""+Number(e.animcon.get("region").width/e.colspan)*e.currentTab)+"px";"hSlide"==e.effect?e.transitions?e.animwrap.setStyles({"-webkit-transition-duration":"0s","-webkit-transform":"translate3d("+n+",0,0)"}):e.animwrap.setStyle("left",n):"vSlide"==e.effect},hightlightNav:function(e){var t=this;return t.carousel&&t.colspan>1?this:(t.tabs.item(e)&&(t.tabs.removeClass(t.selectedClass),t.tabs.item(e).addClass(t.selectedClass)),this)},switch_to:function(t,n){var i=this;if(n===!1)var a=!1;else var a=!0;var s=function(){e.isFunction(n)&&n.apply(i,i),i.fire("afterSwitch",{index:i.currentTab,navnode:i.tabs.item(i.getWrappedIndex(i.currentTab)),pannelnode:i.pannels.item(i.currentTab)})},r=i.fire("beforeTailSwitch",{index:i.currentTab,navnode:i.tabs.item(i.getWrappedIndex(i.currentTab)),pannelnode:i.pannels.item(i.currentTab)});if(i.fixSlideSize(t),i.autoSlide&&i.stop().play(),t>=i.length&&(t%=i.length),t==i.currentTab)return this;if(i.anim)try{i.anim.stop(),i.anim=null}catch(o){}var l={none:function(e){i.pannels.setStyles({display:"none"}),i.pannels.item(e).setStyles({display:"block"}),s()},vSlide:function(t){i.transitions?(i.animwrap.setStyles({"-webkit-transition-duration":(a?i.speed:"0")+"s","-webkit-transform":"translate3d(0,"+-1*t*i.animcon.get("region").height/i.colspan+"px,0)","-webkit-backface-visibility":"hidden"}),i.anim=e.Anim(i.animwrap,{opacity:1},a?i.speed:.01,i.easing,function(){s()}),i.anim.run()):a?(i.anim=e.Anim(i.animwrap,{top:-1*t*i.animcon.get("region").height/i.colspan},i.speed,i.easing,function(){s()}),i.anim.run()):(i.animwrap.css({top:-1*t*i.animcon.get("region").height/i.colspan}),s())},hSlide:function(t){i.transitions?(i.animwrap.setStyles({"-webkit-transition-duration":(a?i.speed:"0")+"s","-webkit-transform":"translate3d("+-1*t*i.animcon.get("region").width/i.colspan+"px,0,0)","-webkit-backface-visibility":"hidden"}),i.anim=e.Anim(i.animwrap,{opacity:1},a?i.speed:.01,i.easing,function(){s()}),i.anim.run()):a?(i.anim=e.Anim(i.animwrap,{left:-1*t*i.animcon.get("region").width/i.colspan},i.speed,i.easing,function(){s()}),i.anim.run()):(i.animwrap.css({left:-1*t*i.animcon.get("region").width/i.colspan}),s())},fade:function(t){var n=i.currentTab;i.anim=e.Anim(i.pannels.item(t),{opacity:1},a?i.speed:.01,i.easing,function(){i.pannels.item(n).setStyle("zIndex",0),i.pannels.item(t).setStyle("zIndex",1),i.pannels.item(n).setStyle("opacity",0),i.pannels.item(n).setStyles({display:"none"}),s()}),i.pannels.item(t).setStyles({display:"block"}),i.pannels.item(t).setStyle("opacity",0),i.pannels.item(n).setStyle("zIndex",1),i.pannels.item(t).setStyle("zIndex",2),i.anim.run()}},c=function(){var e=i.fire("beforeSwitch",{index:t,navnode:i.tabs.item(t),pannelnode:i.pannels.item(t)});if(e!==!1){t+i.colspan>i.pannels.size()&&(t=i.pannels.size()-i.colspan),l[i.effect](t),i.currentTab=t,i.hightlightNav(i.getWrappedIndex(t)),i.fire("switch",{index:t,navnode:i.tabs.item(i.getWrappedIndex(t)),pannelnode:i.pannels.item(t)});var n=i.pannels.item(t).all(".data-lazyload");n&&n.each(function(e){i.renderLazyData(e)})}};e.isNumber(r)?setTimeout(function(){c()},r):c()},go:function(e,t){var n=this;return n.switch_to(e,t),this},play:function(){var e=this;return null!==e.timer&&clearTimeout(e.timer),e.timer=setTimeout(function(){e.next().play()},Number(e.timeout)),this},stop:function(){var e=this;return clearTimeout(e.timer),e.timer=null,this}}),t},{requires:["node","event","json","./slide-util","./kissy2yui"]}),KISSY.add("gallery/slide/1.1/index",function(e,t){return t},{requires:["./base"]});