/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 namespace.js 全局命名空间文件
 *
 * 2011.07.06
 **********************************/

// 前后端交互接口
var interfaces = {};

// 当前窗口的宽度和高度
var WHEIGHT = $(window).height();
var WWIDTH  = $(window).width();

// 登陆窗口的宽度和高度
var LHEIGHT = 210;
var LWIDTH  = 400;

var showRegister = false;

// 系统url地址管理
var URL = {
	site: '/site',
	msg: '/message'
}

var nickName;