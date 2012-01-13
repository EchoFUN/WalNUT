
exports.execute = function(request, response) {
	var _SESSION = request.session;
	response.end(_SESSION.get('t'));
}
