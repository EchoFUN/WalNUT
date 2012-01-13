
var WinManager = {
	
	pos: {
		left: 0,
		top: 0
	},
	
	winList: [],
	talkWindow: null,
	
	create: function(target, callback) {
		var name = 'Talking to: <span>'+ target +'</span>';
		var chatHTML = '<div class="chat_win win_with_'+ target +'" id='+ uniqueID('WIN') +'><div class="chat_title"><div class="chat_title_name">'+ name +'</div><div class="chat_title_close">X</div></div><div class="chat_records"><ul></ul></div><div class="chat_inputarea"><textarea class="inputarea" id="inputarea"></textarea></div></div>';
		var chatWindow = $(chatHTML);
		chatWindow.data('to', target);
		var cw = chatWindow;
		this.evtBind(cw);
		this.winList.push(cw.attr('id'));
		cw.css('left', this.pos.left + 'px');
		cw.css('top', this.pos.top + 'px');
		this.pos.left += 5;
		this.pos.top += 5;
		o.Content.append(cw);
		
		if (typeof callback == 'function')
			callback(cw);
	},
	
	destroy : function(id) {
		var winID;
		for(var i in this.winList)
			if (this.winList[i] == id)
				winID = this.winList.splice(i, 1);
		$('#' + winID).remove();
	},
	
	evtBind: function(chatWindow) {
		var cw = chatWindow;
		Drag.init(cw.find('.chat_title')[0], cw[0]);
		
		var self = this;
		cw.find('.chat_title_close').bind('click', function(){
			self.destroy(cw.attr('id'));
		});
		cw.bind('click', function(){
			var maxIndex = 0;
			for(var i in self.winList) {
				var win = $('#' + self.winList[i]);
				if (win.css('z-index')) {
					var currOne =  Number(win.css('z-index'));
					if (maxIndex < currOne)
						maxIndex = currOne;
				}
			}
			$(this).css('z-index', maxIndex + 1);
		});
		cw.find('#inputarea').bind('keydown', function(evt){
			if (evt.keyCode == 13) {
				evt.preventDefault();
				WinManager.talkWindow = cw;
				var chatText = $(this).val();
				var self = this;
				var to = cw.data('to');
				interfaces.n.appendMessage(to, chatText, function() {
					$(self).val('');
				});
			}
		});
	},
	
	appendMessage: function(from, content, time) {
		var jqTarget = '.win_with_' + from,
			jqListTarget = '#user_' + from;
			jqInform = '#' + from + '_queue';
		var time = new Date(time);
		var timeHTML = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
		var messageHTML = '<li><p><span class="self">' + from + '</span>&nbsp;&nbsp;&nbsp;' + timeHTML + '</p>' + content + '</li>';
		if ($(jqTarget).length == 0 && nickName != from) {
			var informHTML = '<div class="inform" id="' + from + '_queue">Message from<span>"'+ from +'"</span></div>';
			var inform;
			if ($(jqInform).length > 0) {
				inform = $(jqInform);
				var existContent = inform.data('content');		
				inform.data('content', existContent + messageHTML);
			} else {
				inform = $(informHTML);
				var self = this;
				inform.bind('click', function(){
					var datas = this.id.split('_');
					var targetID = datas[0];
					var informSelf = this;
					self.create(targetID, function(newWindow){
						var content = $(informSelf).data('content')
						newWindow.find('.chat_records ul').append(content);
						newWindow.find('.chat_records').jScrollPane({showArrows: true});
						$(informSelf).remove();
					});
				});
				inform.data('content', messageHTML);
				o.StatusBar.append(inform);
			}
			return;
		}
		var talkWindow;
		if (nickName == from)
			talkWindow = WinManager.talkWindow;
		else 
			talkWindow = $(jqTarget);
		talkWindow.find('.chat_records ul').append(messageHTML);
		var scrollHandler = talkWindow.find('.chat_records');
		scrollHandler.jScrollPane({showArrows: true});
		var api = scrollHandler.data('jsp');
		api.scrollToBottom();
	}
}
