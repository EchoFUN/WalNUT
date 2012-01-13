
exports.execute = function(request, response) {
	var object1 = {
		apple : 0,
		banana : {
			weight : 52222,
			price : 100
		}
	};
	var object2 = {
		banana : {
			price : 200,
			dam : 100
		},
		durian : 100
	}
	OExtend(object1, object2);
	console.log(object1);

	response.end('end!');
}