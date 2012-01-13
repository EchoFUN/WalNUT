
exports.execute = function(request, response) {
	var userName = request.post.username;
	var query = {
		status: 1,
		content: ''
	}
	if (!Walnut.hasOwnProperty('listedContacts'))
		Walnut.listedContacts = [];
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