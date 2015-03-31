var socket, host;
host = 'ws://localhost:3001' + cookies.url;
function connect() {
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
      addMessage("Received: " + msg.data);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}
function send() {
  //var text = $("#message").val();
	var text = 'hello';
  if (text == '') {
    addMessage("Please Enter a Message");
    return;
  }
  try {
		var message = '{"type_id":"1","message_type":"alliance","body":"THIS R MSG"}';
    socket.send(message + 'lIlIlIIlIlIl' + cookies.url);
    addMessage("Sent: " + text);
  } catch(exception) {
    addMessage("Failed To Send");
  }
  $("#message").val('');
}
(function(){
	connect();
})();
$('#message').keypress(function(event) {
  if (event.keyCode == '13') { send(); }
});
$("#disconnect").click(function() {
  socket.close()
});
function addMessage(message){
	console.log(message);
}