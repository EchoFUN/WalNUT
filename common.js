/**
 * @description Common utils functions for Walnut.
 * WALNUT NodeJS MVC framework
 *
 * Copy right 2011, xukai.ken@gmail.com (XU Kai)
 * Date 2011.11.22
 */

global.jCTRender = function (html, data) {
    var temp = new jCT(html).Build();
    return temp.GetView(data);
}

global.OExtend = function(target, options) {
	for (var i in options) {
		var copy = options[i];
		if (copy instanceof Array) {
			target[i] = this.OExtend(target[i], copy);
		} else if (copy instanceof Object) {
			target[i] = this.OExtend(target[i], copy);
		} else {
			target[i] = copy;
		}
	}
	return target;
}

global.deleteArrValue = function(arr, value) {
	if (arr instanceof Array) {
		for(var i=0; i<arr.length; i++) {
			var current = arr[i];
			if (current == value)
				arr.splice(i, 1);
		}
	}
	return arr;
}

global.inArray = function(arr, val) {
	var flag = false;
	for (var i in arr) {
		if (arr[i] == val)
			flag = true;
	}
	return flag;
}
