/***********************************
 * Author KEN
 * xukai.ken@gmail.com
 *
 * Walnut 1.1 namespace.js 公共方法类
 *
 * 2011.07.06
 **********************************/

// 根据ID返回对象
function ID(id) {
	return document.getElementById(id);
}

// 提示框
function remind(words, title, callback) {
	if (title == null)
		title = '系统提示';
	$.zxxbox.remind(words, callback, {title: title, drag: true});
}

// 封装了系统中用到的ajax请求
function W_post_data(url, data, sucCallback, errCallback, dataType, method) {
	if (typeof method == 'undefined')
		method = 'post';
	if (typeof dataType == 'undefined')
		dataType = 'json';
	$.ajax ({
		type : method,
		url : url,
		data : data,
		dataType : dataType,
		success : function(ret) {
			if(typeof(sucCallback) == 'function')
				sucCallback(ret);
		},
		error : function() {
			if(typeof(errCallback) == 'function')
				errCallback();
		}
	});
}

// 产生唯一ID
function uniqueID(pre) {
	var time = new Date().getTime() + '';
    var id = pre + '_' + (time).substring(time.length - 6) + '_' + (Math.round(Math.random() * 1000));
    return id;
}


