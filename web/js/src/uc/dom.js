/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 dom.js 寻找页面中所有DOM结构的操作，按照相同的业务逻辑来分类
 *
 * 2011.07.06
 **********************************/

//前端所有用到的DOM对象的集合
var o = {};

//匿名登录对象
o.anonymousLogin = $('.anonymous_login');

//打开注册窗口
o.register = $('.register');

//登录窗口，登录窗口句柄
o.loginForm        = $('.login_form');
o.loginFormHandler = $('.login_form .title');

//在线列表的窗口，在线列表窗口的句柄
o.onlineUsers        = $('.online_users');
o.onlineUsersHandler = $('.online_users .title');

//用户注册框
o.userRegister = $('.user_register');

//用户列表
o.userList = $('.user_list');

//在线用户列表，在线用户列表移动的句柄
o.onlineUsers      = $('.online_users');
o.onlineUsersTitle = $('.online_users .title');

//头部
o.header = $('.header');

//Have FUN的小气泡提示
o.haveFun = $('.have_fun');

//提示的小气泡，气泡关闭按钮
o.informBalloon      = $('.inform_balloon');
o.informBalloonClose = $('.inform_balloon .close');

//底部
o.loginAs = $('#login_as');
o.Content = $('#content');
o.StatusBar = $('.state');

