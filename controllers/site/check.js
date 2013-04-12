var async = require('async');

exports.execute = function(req, resp) {
	var userName = req.post.username;
	var query = {};
	if (!Walnut.listedContacts) {
		Walnut.listedContacts = [];
	}
	
	var listedContacts = Walnut.listedContacts;
	if (inArray(listedContacts, userName)) {
		query.status = 0;
		query.content = '用户名已存在！';
	} else {
		listedContacts.push(userName);
		var _SESSION = request.session;
		_SESSION.set('nickName', userName);
	}
	response.end(JSON.stringify(query));
}