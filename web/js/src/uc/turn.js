Turn = {
	init: function() {
		this.Action();
	},
	
	Action: function() {
		var self = this;
		interfaces.n.initComet(function(data){
			if (data.hasOwnProperty('type')) {
				if (data.type == 1)
					WinManager.appendMessage(data.data.from, data.data.content, data.status.serverTime);
				else if (data.type == 2)
					ContactManager.turnHandler(data.data.addedUser);
			}
			self.Action();
		}, function(){
			setTimeout(function(){
				self.Action();
			}, 3000);
		});
	}
}
