var socket, host;
function connect() {
	host = 'ws://localhost:3001' + cookies.url;
  try {
    socket = new WebSocket(host);
    addMessage("Socket State: " + socket.readyState);
    socket.onopen = function() {
      addMessage("Socket Status: " + socket.readyState + " (open)");
    }
    socket.onclose = function() {
      addMessage("Socket Status: " + socket.readyState + " (closed)");
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
    addMessage("Please Enter a Message");
    return;
  }
  try {
		var message = '{"type_id":"' + alliance.get('id') + '","message_type":"alliance","body":"' + text + '"}';
		console.log(message);
    socket.send(message + 'lIlIlIIlIlIl' + cookies.url);
  } catch(exception) {
    addMessage("Failed To Send");
  }
}
$("#disconnect").click(function() {
  socket.close()
});
function addMessage(message){
	console.log(message);
}
function parseMessage(message) {
	message = JSON.parse(message.data);
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