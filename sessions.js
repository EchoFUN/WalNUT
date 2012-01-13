/**
 * @description Session Management
 * WALNUT NodeJS MVC framework
 *
 * Copy right 2011, xukai.ken@gmail.com (XU Kai)
 * Date 2011.11.28
 */

var parse = require('querystring').parse;

/**
 * @description 设置session过期时间
 */
var EXPIRE_TIME = 3 * 60 * 1000;

/**
 * @description 存放服务器端所有session
 */
var _sessions = {};

function genSID(pre) {
	pre = (pre)?pre : 'SESSION';
	var time = new Date().getTime() + '';
    var id = pre + '_' + (time).substring(time.length - 6) + '_' + (Math.round(Math.random() * 1000));
    return id;
}

/**
 * @description 定时清理过期的session
 */
setInterval(function(){
	for (var id in _sessions) {
	    if (!_sessions.hasOwnProperty(id)) 
	    	continue;
		if (new Date() - _sessions[id].timestamp > EXPIRE_TIME)
			delete _sessions[id];
	}
}, 1000);

var createSession = function(sID) {
	var session = {
		SID: sID,
		timestamp: new Date()
	}
	return session;
}

/**
 * @description 维护了对session的引用，可进行增删查改操作
 * @param {string} sID 当前用户的session ID
 * @param {object} _sessions
 */
var context = function(_sessions, sID) {
	this.poke = function() {
		_sessions[sID].timestamp = new Date();
	};
	this.destory = function() {
		delete _sessions[sID];
	};
	this.del = function(key) {
		this.poke();
		delete _sessions[sID][key];
	}
	this.set = function(key, value) {
		this.poke();
		_sessions[sID][key] = value;
	};
	this.get = function(key) {
		this.poke();
		return _sessions[sID][key];
	};
}

/**
 * @description 开始session
 * @param {object} request 
 * @param {object} response
 * @param {function} process 回调函数
 */
exports.startSession = function(request, response, process) {
	var cookies = parse(request.headers.cookie, '; ');
	var sID;
	for (var i in cookies) {
		if (i == 'NODESESSID') {
			sID = cookies[i];
			break;
		}
	}
	if (!sID || typeof _sessions[sID] == 'undefined') {
		var sID = genSID();
		_sessions[sID] = createSession(sID);
	}
	response.setHeader('Set-Cookie', ['NODESESSID=' + sID]);
	process.call(new context(_sessions, sID), request, response);
}