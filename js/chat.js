var socket, host;
function connect() {
	host = 'ws://localhost:3001' + cookies.url;
  try {
    socket = new WebSocket(host);
    socket.onopen = function() {
    }
    socket.onclose = function() {
    }
    socket.onmessage = function(msg) {
		parseMessage(msg);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}
function sendChatMessage() {
	var text = $('#chatMessage').val().replace(/(\r\n|\n|\r)/gm,"  ");
  if (text === '') {
    return;
  }
  try {
		var data = {
			game_id: cookies.game_id,
			user_id: cookies.user_id,
			message: {
				body: text,
				type: "alliance"
			}
		}
    socket.send(JSON.stringify(data));
  } catch(exception) {
  }
}
$("#disconnect").click(function() {
  socket.close()
});
function parseMessage(message) {
	message = JSON.parse(message.data);
	console.log(message);
	if(message.type === 'alliance') {
		if(message.sender.id === airline.id) {
			var own = ' self';
		} else {
			var own = '';
		}
		if($('.chat.window[data-tab="alliance_chat"] .message.container').length > 0) {
			var lastAirline = $('.chat.window[data-tab="alliance_chat"] .message.container').last().data('airline');
		}
		if(message.sender.id === lastAirline) {
			var box = '<div class="message container continuation new' + own + '" data-airline="' + message.sender.id + '"><div class="message divider author">&nbsp;</div><div class="message content' + own + '">' + message.body + '</div></div>';
		} else if(own === ' self') {
			var box = '<div class="message container new' + own + '" data-airline="' + message.sender.id + '"><div class="message content' + own + '">' + message.body + '</div></div>';
		} else {
			var box = '<div class="message container new" data-airline="' + message.sender.id + '"><div class="message author">' + message.sender.name + '</div><div class="message airline"><div class="message content' + own + '">' + message.body + '</div></div>';
		}
		$('.chat.window[data-tab="alliance_chat"] .message.list').append(box);
		$('.chat.window[data-tab="alliance_chat"] .message.list .new').removeClass('new');
		$('.message.list').scrollTop(10000);
	} else if(message.type === 'game') {

	} else if(message.type === 'conversation') {

	}
}
