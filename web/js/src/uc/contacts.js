
var ContactManager = {
	turnHandler: function(id) {
		var addUserHTML = '<li class="userItem" id="user_' + id +'">'+ id +'</li>';
		o.userList.find('ul').append(addUserHTML);
		o.userList.jScrollPane({showArrows: true});
	}
}
