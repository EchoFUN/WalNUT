
exports.execute = function(request, response) {
	var _SESSION = request.session;
	Walnut.CMDContext.query(_SESSION.get('nickName'), function(resp) {
		var respTemp = {
			status: {
				code: 1,
				content: '',
				serverTime: new Date().getTime()
			},
			data: {}
		}
		OExtend(respTemp, resp);
		var body = new Buffer(JSON.stringify(respTemp));
		response.end(body);
	});
}