var messageInterval;

function launchChat() {
	$('.message.list').css({height:$('.chat.window').height()-54});
	$('body').on('click','.ui.button.blue.super.small',function(e){
		e.preventDefault();
		sendChatMessage();
	});
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
	var lastMessage = $('.message.list .message.container:last-child');
	var scroll = false;
	if(lastMessage.length > 0) {
		if($('.message.list').scrollTop() > lastMessage.position().top+lastMessage.height()) {
			scroll = true;
		}
	} else {
		scroll = true;
	}
	$.getJSON(base + 'chat/' + type + cookies.url + '&since=' + chatWindow.attr('since')).done(function(data){
		var lastAirline = 0;
		_.each(data,function(message){
			var own = '';
			if(message.own) {
				own = ' self';
			}
			lastAirline = $('.message.list .message.container:last-child').data('airline');
			if(message.airline.id === lastAirline) {
				var box = '<div class="message container continuation new' + own + '" data-airline="' + message.airline.id + '"><div class="message divider author">&nbsp;</div><div class="message content' + own + '">' + message.message + '</div></div>';
			} else if(message.own) {
				var box = '<div class="message container new' + own + '" data-airline="' + message.airline.id + '"><div class="message content' + own + '">' + message.message + '</div></div>';
			} else {
				var box = '<div class="message container new" data-airline="' + message.airline.id + '"><div class="message author">' + message.airline.name + '</div><div class="message airline"><div class="message content' + own + '">' + message.message + '</div></div>';
			}
			chatWindow.find('.message.list').append(box);
		});
		chatWindow.attr('since',new Date().getTime()/1000);
		if(data.length > 0) {
			$('.message.container.new').removeClass('new');
			if(scroll) {
				$('.message.list').scrollTop(10000);
			} else {
				
			}
		}
	});
}