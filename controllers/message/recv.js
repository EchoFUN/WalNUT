
exports.execute = function(request, response) {
	var _SESSION = request.session;
	var content = unescape(request.post.content);
	var to = request.post.to;
	var CMDContext = Walnut.CMDContext;
	var nickName = _SESSION.get('nickName');
	var query = {
		type: 1,
		data: {
			to: to,
			from: nickName,
			content: content
		}
	}
	CMDContext.appendMessage(query);
	response.end(JSON.stringify({}));
}
