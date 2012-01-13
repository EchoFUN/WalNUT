/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 interfaces.app.f.js 用户界面交互交互接口
 *
 * 2011.07.06
 **********************************/

interfaces.f = {
	
	// 显示注册界面
	showRegister: function() {
		if (showRegister) {
			o.userRegister.fadeOut(500);
			o.loginForm.animate({height: '210px'}, 700, function(){
				o.register.html('Register as new user ');
			});
			showRegister = false;
		}else {
			o.loginForm.animate({height: '405px'}, 700, function(){
				o.userRegister.fadeIn(500);
				o.register.html('Roll up');
			});
			showRegister = true;
		}
	},
	
	// 匿名用户登陆界面接口
	anonymousLogin: function() {
		remind('<input type="text" id="userName" style="width:200px;height:16px;padding:3px;border:1px solid #CCC;border-top-color:#999;border-right-color:#999;">', '填写用户名', function(){
			var jqUserName = '#userName';
			var userName = $(jqUserName).val();
			if ($.trim(userName).length == 0)
				return;
			interfaces.n.checkUserName(userName, function(data){
				if (data.status == 1) {
					interfaces.n.anonymousLogin(function(ret){
						if(ret) {
							o.loginForm.fadeOut(500, function(){
								o.userList.css({'height': (WHEIGHT - 179) + 'px'});
								o.onlineUsers.css({'left': ((WWIDTH + LWIDTH)/2 - 199) + 'px', 'top': '0'});
								o.header.animate({height: '120px'}, function() { 
									o.haveFun.remove(); 
									interfaces.f.initUserList(ret);
									o.onlineUsers.fadeIn(1000).css({'height': (WHEIGHT-151-2)+'px'});
									o.onlineUsers.mouseover(function(){ if (this.isOver == false || this.isOver == null) o.informBalloon.fadeIn(); this.isOver = true; });
									o.onlineUsersTitle.mousedown(function(){ o.informBalloon.hide()}); o.informBalloonClose.click(function(){ o.onlineUsers[0].isOver = true; o.informBalloon.hide(); });
									
									// 初始化Comet链接
									Turn.init();
									
									// 事件的绑定
									interfaces.f.evtBind();
									
									nickName = ret.nickName;
									o.loginAs.html(nickName);
									
									// 用户登出系统
									window.onbeforeunload = function() {return W_MSG.warn.logout};  
									$(window).bind('unload', interfaces.n.closeSession)
								});
							});
						}
					});
				} else if (data.status == 0) {
					var content = data.content;
					setTimeout(function(){
						remind(content);
					}, 300);
				}
			});
		});
		
		/*

		*/
	},
	
	initUserList: function(data) {
		var html = '<ul>';
		$.each(data.list, function(k, v){
			html += '<li class="userItem" id="user_' + v +'">'+ v +'</li>';
		});
		html += '</ul>';
		o.userList.html(html);
		setTimeout(function(){
			o.userList.jScrollPane({showArrows: true});
		}, 0);
	},
	
	evtBind: function() {
		var jqUserItem = '#user_list';
		$(jqUserItem).bind('click', function(evt){
			var target = evt.target;
			if (target.id.substr(0, 5) == 'user_') {
				var targetUser = target.id.substr(5);
				if (targetUser == nickName) {
					remind(W_MSG.warn.talkSelf);
					return;
				}
				if ($('.win_with_' + targetUser).length > 0) {
					remind(W_MSG.warn.openWin);
					return;
				}
				WinManager.create(targetUser);
			}
		});
	}
}
