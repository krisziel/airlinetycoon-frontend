var socket, host;
var notificationList;
var hideNotifications;

function connect() {
	host = 'ws://localhost:3001' + cookies.url;
  try {
    socket = new WebSocket(host);
    socket.onopen = function() {
			notificationList = new NotificationList();
			$('#notifications').on('click', '.notification', function(e) {
				openNotification(e.currentTarget.attributes["data-id"].value);
			});
    }
    socket.onclose = function() {
    }
    socket.onmessage = function(messages) {
			messages = JSON.parse(messages.data);
			routeMessages(messages);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}
function routeMessages(messages) {
	_.each(messages, function(message) {
		clearTimeout(hideNotifications);
		var notification = new Notification(message);
		notificationList.push(notification);
	  var notificationView = new NotificationView({ model:notification });
		hideNotifications = setTimeout(function(){
			$('#notifications').css({ opacity:0 }).delay(2000).css({ display:'none' });
		}, 9900);
		// routeMessage();
	});
}
function routeMessage(message) {
	console.log(message);
	if(message.notificationable_type == "Data") {
		updateGameTurn(message.notificationable_id);
	} else if(message.notificationable_type == "Game") {
		displayGameMessage(message);
	} else if(message.notificationable_type == "Alliance") {
		displayAllianceMessage(message);
	} else if(message.notificationable_type == "Conversation") {
		displayConversationMessage(message);
	} else if(message.notificationable_type == "Route") {
		displayRouteNotification(message);
	}
}
function updateGameTurn(gameId) {

}
function updateGameMessage(message) {

}
function updateAllianceMessage(message) {

}
function updateConversationMessage(message) {

}
function displayRouteNotification(message) {

}
function showNotification(title, text, deepLink) {

}
function routeDeepLink(deepLink) {

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
