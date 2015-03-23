var messageInterval;

function launchChat() {
	setTimeout(function(){ checkMessages(); },20);
	messageInterval = setInterval(function(){ checkMessages(); },3000);
}
function closeChat() {
	clearInterval(messageInterval);
}
function sendChatMessage() {
	var message = $('#chatMessage').val();
	var type = $('.ui.button.blue.super.small').attr('name');
	$.post(base + 'chat/' + type + cookies.url,$('#messageForm').serialize(),function(data,textResponse){
	},'json');
	var box = '<div class="message container new self"><div class="message content self">' + message + '</div></div>';
	//$('.chat.window .message.container:eq(0)').before(box);
	//setTimeout(function(){ $('.message.container.new').removeClass('new'); });
	$('#chatMessage').css({height:40}).val('');
}
function checkMessages() {
	var chatWindow = $('.chat.window');
	var type = $('.ui.button.blue.super.small').attr('name');
	$.getJSON(base + 'chat/' + type + cookies.url + '&since=' + chatWindow.attr('since')).done(function(data){
		var lastAirline = 0;
		_.each(data,function(message){
			var own = '';
			if(message.own) {
				own = ' self';
			}
			//(message.airline.id === lastAirline)||
			if((message.own)) {
				var box = '<div class="message container' + own + '"><div class="message content' + own + '">' + message.message + '</div></div>';
			} else {
				var box = '<div class="message container"><div class="message author">' + message.airline.name + '</div><div class="message airline"><div class="message content' + own + '">' + message.message + '</div></div>';
				lastAirline = message.airline.id;
			}
			chatWindow.find('.message.list').prepend(box);
		});
		chatWindow.attr('since',new Date().getTime()/1000);
	});
}