var socket, host;
var notificationList;
var hideNotifications;
var conversationList;

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
	});
}
function routeMessage(message) {
	if(message.notificationable_type == "Data") {
		updateGameTurn(message.notificationable_id);
	} else if(message.notificationable_type == "Game") {
		updateGameMessage(message);
	} else if(message.notificationable_type == "Alliance") {
		updateAllianceMessage(message);
	} else if(message.notificationable_type == "Conversation") {
		openMessages(message);
	} else if(message.notificationable_type == "Route") {
		displayRouteNotification(message);
	}
}
function updateGameTurn(gameId) {

}
function updateGameMessage(message) {
	openMessages('game');
}
function updateAllianceMessage(message) {
	openMessages('alliance');
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

var Conversation = Backbone.Model.extend({
});
var ConversationList = Backbone.Collection.extend({
	model:Conversation,
	search: function(query, callback){
		var collection = this;
		var result;
		collection.find(function(model) {
			var key = Object.keys(query)[0];
			if(model.get(key) === query[key]) {
				result = model;
			}
		});
		return result;
	}
});
var ConversationView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		var variables = this.model.attributes;
		var template = _.template($('#conversationTemplate').html(),variables);
		this.$el.html(template);
		return this;
	}
});
var ConversationListView = Backbone.View.extend({
	initialize:function(){
		this.render();
		this.listenTo(aircraftList,'add',this.addOne);
	},
	render:function(){
		this.addAll();
	},
	addOne:function(aircraft){
		var view = new ConversationView({model:aircraft});
    this.$el.append(view.$el);
	},
	addAll:function(){
		this.$el.html('');
		aircraftList.each(this.addOne,this);
	}
});
function openMessages(id) {
	$.getJSON(base + 'chat/conversations' + cookies.url).done(function(data){
		if($('.conversationPanel').length === 1) {
			loadConversation(id);
		} else {
			createConversationList(data);
			var template = _.template($('#conversationModalTemplate').html(),data);
			$('body').append(template);
			$('.conversationPanel').modal('show');
			if(id) {
				setTimeout(function(){
					loadConversation(id);
				},500);
			}
			$('.conversationPanel').on('click','.conversation',function(e){
				var conversationId = $(e.currentTarget).data('conversationid');
				loadConversation(conversationId);
			});
		}
	});
}
function loadConversation(id) {
	$.getJSON(base + 'chat/conversation/' + id + cookies.url).done(function(data){
		$('.conversation-info').html('');
		var lastMessage = { sent:0 };
		var messages = data.messages;
		_.each(messages, function(message){
			var messageClass = 'left';
			var messageHeader = '';
			var messageFooter = '';
			if ((lastMessage.sent + 1800) < message.sent) {
				messageHeader = '<div class="message date">' + dateFromTimestamp(message.sent) + '</div>';
			}
			if(message.sender === true) {
				messageClass = 'right blue';
			} else if((message.sender !== false)&&(((lastMessage.sender)&&(message.sender.name !== lastMessage.sender.name))||(messageHeader !== ''))) {
				messageHeader += '<div class="message name">' + message.sender.name + '</div>';
			}
			var	messageBody = '<div class="message text"><div class="ui pointing label ' + messageClass + '" title="' + dateFromTimestamp(message.sent, 'long') + '">' + message.body + '</div></div>';
			var messageContent = messageHeader + messageBody + messageFooter;
			lastMessage = message;
			$('.conversation-info').append(messageContent);
		});
		// var chatMessages = '<div class="ui left pointing label">That name is taken!</div><div class="ui right blue pointing label">That name is taken!</div>';
		// $('.conversation-info').html(chatMessages);
	});
}
function createConversationList(data) {
	var conversations = []
	_.each(data, function(conversation){
		conversations.push(new Conversation(conversation))
	});
	conversationList = new ConversationList(conversations);
	conversationListView = new ConversationListView({el:'#conversationList'});
}
function dateFromTimestamp(timestamp, format) {
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var date = new Date(timestamp*1000);
	var hoursInt = date.getHours();
	var hourType = hoursInt >= 12 ? "PM" : "AM"
	var hours = hoursInt > 12 ? (hoursInt - 12) : hoursInt;
	hours = hours === 0 ? 12 : hours;
	var minutes = ('0' + date.getMinutes()).substr(-2);
	var formattedTime = hours + ':' + minutes + hourType;
	var formattedDate = '';
	if(format === 'short') {
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		formattedDate = months[date.getMonth()] + ' ' + date.getDate();
	} else if(format === 'full') {
		var seconds = '0' + date.getSeconds();
		formattedTime += ':' + seconds.substr(-2);
		formattedDate = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	} else {
		formattedDate = months[date.getMonth()] + ' ' + date.getDate();
	}
	return formattedDate + ' ' + formattedTime
}
