/* 
* zxxbox.js 
* © 2010 by zhangxinxu http://www.zhangxinxu.com/
* v1.0 2010-03-20
* v1.1 2010-04-03 #添加拖拽
* v1.2 2010-07-12 #修改浏览器高宽以及页面滚动高度获取
* v2.0 2010-08-01 #重写js，增加可读性，维护性
*                 #添加问答框确认的回调方法
*                 #修复浏览器大小变化时黑背景高度不变化的bug，且弹框一直居中显示
* v3.0 2010-09-05 #修改自定义提示的调用方法
				  #增加提示方法的回调函数接口
				  #增加弹窗打开和关闭的回调方法接口
				  #增加Ajax功能
				  #增加外框CSS3外阴影效果，美化UI
				  #弹框关闭以渐隐动画显示
* v3.1 2010-11-25 #更准确使用$.noop方法
* v3.2 2010-11-26 #修改些属性，使向下兼容1.3版本
* v3.3 2010-11-30 #阻止弹框重复关闭执行
* v3.4 2011-01-21 #修复错别字符，修复IE下弹框高度超过一屏拖拽会隐藏的bug
* v3.5 2011-03-03 #添加新的api参数protect
* v3.6 2011-04-06 #修复ajax加载页面或html片段含JavaScript脚本时重复执行的bug
*/
(function($) {
	//给页面装载CSS样式
	var css = '<style type="text/css">#zxxBlank{position:absolute;z-index:2000;left:0;top:0;width:100%;height:0;background:black;}.wrap_out{padding:5px;background:#eee;box-shadow:0 0 6px rgba(0,0,0,.5);-moz-box-shadow:0 0 6px rgba(0,0,0,0.5);-webkit-box-shadow:0 0 6px rgba(0,0,0,.5);position:absolute;z-index:2000;}.wrap_in{background:#fafafa;border:1px solid #ccc;}.wrap_bar{width:100%;background:#f7f7f7;border-top:3px solid #f9f9f9;border-bottom:4px solid #eee;margin-top:2px;}.wrap_title{line-height:5px;background:#f3f3f3;border-top:4px solid #f5f5f5;border-bottom:5px solid #f1f1f1;margin-top:3px;}.wrap_title span{position:relative;margin-left:10px;cursor:text;}.wrap_body{display:inline-block;border-top:1px solid #ddd;background:white;}.wrap_close{margin-top:-18px;margin-right:10px;color:#34538b;font-weight:bold;text-decoration:none;cursor:pointer;float:right;}.wrap_close:hover{text-decoration:none;color:#f30;}.wrap_remind{width:16em;padding:30px 40px;}.wrap_remind p{margin:10px 0 0;}.submit_btn{    border:1px solid #999999;cursor:pointer;font-size:12px;height:23px;margin:0 6px 0 0;width:55px; }.cancel_btn{display:inline-block;padding:3px 12px 1.99px;background:#eee;border:1px solid;border-color:#f0f0f0 #bbb #bbb #f0f0f0;color:#333;line-height:16px;cursor:pointer;overflow:visible;}</style>';
	$("head").append(css);	  
	
	$.fn.zxxbox = function(options) {	
		return this.each(function() {
			var s = $.extend({}, zxxboxDefault, options || {});
			var node = this.nodeName.toLowerCase();
			if (node === "a" && s.ajaxTagA) {
				$(this).click(function() {
					var href = $.trim($(this).attr("href"));
					if (href) {
						if (href.indexOf('#') >= 0) {
							$.zxxbox($(href), options);
						} else if (/[\.jpg\.png\.gif\.bmp\.jpeg]$/i.test(href)) {
							//加载图片
							$.zxxbox.loading(options);
							var myImg = new Image(), element;
							myImg.onload = function() {
								var w = myImg.width, h = myImg.height;
								if (w > 0) {
									var element = $('<img src="'+href+'" width="'+w+'" height="'+h+'" />');
									$.zxxbox(element, options);
								}
							};
							myImg.onerror = function() {
								//显示加载图片失败
								var element = $('<div class="wrap_remind">图片加载失败！</div>');
								$.zxxbox(element, options);
							};
							myImg.src = href;
						} else {
							$.zxxbox.loading(options);
							$.get(href, {}, function(data) {
								$.zxxbox(data, options);
							});	
						}
					}	
					return false;
				});
			} else {
				$.zxxbox($(this), options);	
			}
		});				
	};
	
	$.zxxbox = function(elements, options) {
		if (!elements) {
			return;	
		}
		var s = $.extend({}, zxxboxDefault, options || {});
		//弹框的显示
		var WRAP = '<div id="zxxBlank" onselectstart="return false;"></div><div class="wrap_out" id="wrapOut"><div class="wrap_in" id="wrapIn"><div id="wrapBar" class="wrap_bar"  onselectstart="return false;"><div class="wrap_title"><span>'+s.title+'</span></div><a href="javasctipt:" class="wrap_close" id="wrapClose">'+s.shut+'</a></div><div class="wrap_body" id="wrapBody"></div></div></div>';
		if ($("#wrapOut").size()) {
			$("#wrapOut").show();
			if (s.bg) {
				$("#zxxBlank").show();	
			} else {
				$("#zxxBlank").hide();
			}
		} else {
			$("body").append(WRAP);	
		}
		
		if (typeof(elements) === "object") {
			elements.show();
		} else {
			elements = $(elements);
		}
		//一些元素对象
		$.o = {
			s: s,
			ele: elements,
			bg: $("#zxxBlank"), 
			out: $("#wrapOut"), 
			bar: $("#wrapBar"), 
			clo: $("#wrapClose"),
			bd: $("#wrapBody")
		};
		//装载元素
		$.o.bd.empty().append(elements);
		if ($.isFunction(s.onshow)) {
			s.onshow();
		}
		//尺寸
		$.zxxbox.setSize();
		//定位
		$.zxxbox.setPosition();

		if (s.fix) {
			$.zxxbox.setFixed();
		}
		if (s.drag) {
			$.zxxbox.drag();	
		} else {
			$(window).resize(function() {
				$.zxxbox.setPosition();					  
			});	
		}
		if (!s.bar) {
			$.zxxbox.barHide();	
		} else {
			$.zxxbox.barShow();	
		}
		if (!s.bg) {
			$.zxxbox.bgHide();
		} else {
			$.zxxbox.bgShow();
		}
		if (!s.btnclose) {
			$.zxxbox.closeBtnHide();	
		} else {
			$.o.clo.click(function() {
				$.zxxbox.hide();	
				return false;
			});
		}
		if (s.bgclose) {
			$.zxxbox.bgClickable();	
		}
		if (s.delay > 0) {
			setTimeout($.zxxbox.hide, s.delay);	
		}
	};
	$.extend($.zxxbox, {
		getSize: function(o) {
			//获取任意元素的高宽
			var w_h = {}, o_new = o.clone();
			$('<div id="wrapClone" style="position:absolute;left:-6000px;"></div>').appendTo("body").append(o_new);
			w_h.w = $("#wrapClone").width();
			w_h.h = $("#wrapClone").height();
			$("#wrapClone").remove();
			return w_h;
		},
		setSize: function() {
			if (!$.o.bd.size() || !$.o.ele.size() || !$.o.bd.size()) {
				return;	
			}
			//主体内容的尺寸
			var bd_w = parseInt($.o.s.width, 10), bd_h = parseInt($.o.s.height, 10);			
			if (!bd_w || bd_w <= 0 ) {
				var x_size = $.zxxbox.getSize($.o.ele), w = $(window).width();
				//宽度自动
				bd_w = x_size.w;
				if (bd_w < 50) {
					bd_w = 120;	
				} else if (bd_w > w) {
					bd_w = w - 120;
				}
			}
			$.o.bd.css("width", bd_w);
			$.o.out.css("width", bd_w+2);
			if (bd_h > 0) {
				$.o.bd.css("height", bd_h);
			}
			return $.o.bd;
		},
		setPosition: function(flag) {
			flag = flag || false;
			if (!$.o.bg.size() || !$.o.ele.size() || !$.o.out.size()) {
				return;	
			}
			var w = $(window).width(), h = $(window).height(), st = $(window).scrollTop(), ph = $("body").height();
			if (ph < h) {
				ph = h;	
			}
			$.o.bg.width(w).height(ph).css("opacity", $.o.s.opacity);
			//主体内容的位置
			//获取当前主体元素的尺寸
			var xh = $.o.out.outerHeight(), xw = $.o.out.outerWidth();
			var t = st + (h - xh)/2, l = (w - xw)/2;
			
			if ($.o.s.fix && window.XMLHttpRequest) {
				t = (h - xh)/2;
			}
			if (flag === true) {
				$.o.out.animate({
					top: t,
					left: l
				});
			} else {
				$.o.out.css({
					top: t,
					left: l,
					zIndex: $.o.s.index
				});
			}
			return $.o.out;
		},
		//定位
		setFixed: function() {
			if (!$.o.out || !$.o.out.size()) {
				return;	
			}
			if (window.XMLHttpRequest) {
				$.zxxbox.setPosition().css({
					position: "fixed"			
				});
			} else {
				$(window).scroll(function() {
					$.zxxbox.setPosition();						  
				});
			}
			return $.o.out;
		},
		//背景可点击
		bgClickable: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.click(function() {
					$.zxxbox.hide();
				});
			}
		},
		//背景隐藏
		bgHide: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.hide();
			}
		},
		//背景层显示
		bgShow: function() {
			if ($.o.bg && $.o.bg.size()) {
				$.o.bg.show();
			} else {
				$('<div id="zxxBlank"></div>').prependTo("body");	
			}
		},
		//标题栏隐藏
		barHide: function() {
			if ($.o.bar && $.o.bar.size()) {
				$.o.bar.hide();
			}
		},
		//标题栏显示
		barShow: function() {
			if ($.o.bar && $.o.bar.size()) {
				$.o.bar.show();
			}
		},
		//关闭按钮隐藏
		closeBtnHide: function() {
			if ($.o.clo && $.o.clo.size()) {
				$.o.clo.hide();
			}
		},
		//弹框隐藏
		hide: function() {
			if ($.o.ele && $.o.out.size() && $.o.bg.size() && $.o.out.css("display") !== "none") {
				if ($.o.s.protect && (!$.o.ele.hasClass("wrap_remind") || $.o.ele.attr("id"))) {
					$.o.ele.clone().hide().appendTo($("body"));
				}
				$.o.out.fadeOut("fast", function() {
					$(this).remove();
					if ($.isFunction($.o.s.onclose)) {
						$.o.s.onclose();
					}
				});
				$.o.bg.fadeOut("fast", function() {
					$(this).remove();								
				});
			}
			return false;
		},
		//拖拽
		drag: function() {
			if (!$.o.out.size() || !$.o.bar.size()) {
				$(document).unbind("mouseover").unbind("mouseup");
				return;
			}
			var bar = $.o.bar, out = $.o.out;
			var drag = false;
			var currentX = 0, currentY = 0, posX = out.css("left"), posY = out.css("top");
			bar.mousedown(function(e) {
				drag = true;
				currentX = e.pageX;
				currentY = e.pageY;							 
			}).css("cursor", "move");	
			$(document).mousemove(function(e) {
				if (drag) {
					var nowX = e.pageX, nowY = e.pageY;
					var disX = nowX - currentX, disY = nowY - currentY;
					out.css("left", parseInt(posX) + disX).css("top", parseInt(posY) + disY);
				}					   
			});
			$(document).mouseup(function() {
				drag = false;
				posX = out.css("left");
				posY = out.css("top");
			});
		},
		//预载
		loading: function(options) {
			var element = $('<div class="wrap_remind">加载中...</div>');
			options = options || {}
			var newOptions = $.extend({}, options, {bar: false});
			$.zxxbox(element, newOptions);
		},
		//ask询问方法
		ask: function(message, sureCall, cancelCall, options) {
			var element = $('<div class="wrap_remind">'+message+'<p><button id="zxxSureBtn" class="submit_btn">确认</button>&nbsp;&nbsp;<button id="zxxCancelBtn" class="cancel_btn">取消</button></p></div>');
			$.zxxbox(element, options);
			//回调方法
			$("#zxxSureBtn").click(function() {
				if ($.isFunction(sureCall)) {
					sureCall.call(this);
				}						
			});
			$("#zxxCancelBtn").click(function() {
				if (cancelCall && $.isFunction(cancelCall)) {
					cancelCall.call(this);
				}
				$.zxxbox.hide();						  
			});	
		},
		//remind提醒方法
		remind: function(message, callback, options) {
			var element = $('<div class="wrap_remind">'+message+'<p><button id="zxxSubmitBtn" class="submit_btn">确认</button</p></div>');
			$.zxxbox(element, options);
			$("#zxxSubmitBtn").click(function() {
				//回调方法
				if (callback && $.isFunction(callback)) {
					callback.call(this);	
				}
				$.zxxbox.hide();							  
			});
				
		},
		//uri Ajax方法
		ajax: function(uri, params, options) {
			if (!params || typeof(params) !== "object") {
				params = {};	
			}
			if (uri) {
				$.zxxbox.loading(options);
				$.get(uri, params, function(data) {
					var scriptReg = /<script>.*<\/script>/g;
					var html = data.replace(scriptReg, ""), arrScript = data.match(scriptReg);
					$.zxxbox(html, options);
					$.each(arrScript, function(i, n) {
						$("head").append($(n));	
					});
				});		
			}
		}
	});
	var zxxboxDefault = {
		title: "对话框",
		shut: "×",
		index: 2000,
		opacity: 0.3,
		
		width: "auto",
		height: "auto",
		
		bar: true, //是否显示标题栏
		bg: true, //是否显示半透明背景
		btnclose:true, //是否显示关闭按钮
		
		fix: false, //是否弹出框固定在页面上
		bgclose: false, //是否点击半透明背景隐藏弹出框
		drag: false, //是否可拖拽
		
		ajaxTagA: true, //是否a标签默认Ajax操作
		
		protect: "auto", //保护装载的内容
		
		onshow: $.noop, //弹窗显示后触发事件
		onclose: $.noop, //弹窗关闭后触发事件
		
		delay: 0 //弹窗打开后关闭的时间, 0和负值不触发
	};
})(jQuery);
