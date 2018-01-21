
// Open a connection
var socket = new WebSocket('ws://localhost:8081/');

// When a connection is made
socket.onopen = function() {
  console.log('Opened connection ');

  // send data to the server
  var json = JSON.stringify({ message: 'Hello, from the client ' });
  socket.send(json);
}

// When data is received
socket.onmessage = function(event) {
  	let data = JSON.parse(event.data);
  	console.log("WOT?", data);
}

// A connection could not be made
socket.onerror = function(event) {
  	console.log(event);
}

// A connection was closed
socket.onclose = function(code, reason) {
  	console.log(code, reason);
}

// Close the connection when the window is closed
window.addEventListener('beforeunload', function() {
  	socket.close();
});