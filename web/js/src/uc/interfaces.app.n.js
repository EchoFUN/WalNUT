/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 interfaces.app.n.js 客户端和服务器端交互接口
 *
 * 2011.07.09
 **********************************/

interfaces.n = {
	
	// 匿名用户登陆接口
	anonymousLogin: function(callback) {
		var query = 'q=anonymous';	
		W_post_data(URL.site, query, callback, function(){
			remind(W_MSG.error.login);
		});
	},
	
	closeSession: function(callback) {
		var query = 'q=logoff';
		W_post_data(URL.site, query, callback, function(){
			remind(W_MSG.error.loginOut);
		});
	},
	
	initComet: function(sucCB, errCB) {
		var query = 'q=poll';
		W_post_data(URL.site, query, sucCB, function(){
			remind(W_MSG.error.longPoll);
			errCB();
		});
	},
	
	appendMessage: function(to, chatText, callback) {
		var query = 'q=recv&to='+ to +'&content=' + escape(chatText);
		W_post_data(URL.msg, query, callback, function(){
			remind(W_MSG.error.sendMsg);
		});
	},
	
	checkUserName: function(userName, callback) {
		var query = 'q=check&username=' + userName;
		W_post_data(URL.site, query, callback, function(){
			remind(W_MSG.error.checkName);
		});
	}
}
