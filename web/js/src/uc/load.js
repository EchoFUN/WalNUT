/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 load.js 运行时加载文件
 *
 * 2011.07.06
 **********************************/

// 初始化登陆窗口
var login_form_handler = o.loginFormHandler[0];
var login_form         = o.loginForm[0]
Drag.init(
	login_form_handler, 
	login_form, 
	4-(WWIDTH-LWIDTH)/2,
	(WWIDTH-LWIDTH)/2-4,
	1, 
	WHEIGHT-LHEIGHT-157
);
var online_users_handler = o.onlineUsersHandler[0];
var online_users         = o.onlineUsers[0];
Drag.init(
	online_users_handler, 
	online_users, 
	2-(WWIDTH-LWIDTH)/2, 
	(WWIDTH+LWIDTH)/2-199, 
	0, 
	0
);

o.loginForm.css({'top': (WHEIGHT-LHEIGHT)/2 - 151 + 'px'});

// 打开注册窗口
o.register.bind('click', interfaces.f.showRegister);

// 匿名用户进行聊天
o.anonymousLogin.bind('click', interfaces.f.anonymousLogin);

