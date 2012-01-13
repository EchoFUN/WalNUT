
exports.execute = function(request, response) {
	var _SESSION = request.session;
	Walnut.listedContacts = deleteArrValue(Walnut.listedContacts, _SESSION.get('nickName'));
	_SESSION.destory();
	response.end(JSON.stringify({}));
}
