
exports.execute = function(request, response) {
	var _SESSION = request.session;
	var nickName = _SESSION.get('nickName');
	var CMDContext = Walnut.CMDContext;
	var query = {
		type: 2,
		data: {
			addedUser: nickName
		}
	}
	CMDContext.updateContacts(query);
	var listedContacts = Walnut.listedContacts;
	var data = {
		nickName: nickName,
		list: listedContacts
	}
	response.end(JSON.stringify(data));
}
