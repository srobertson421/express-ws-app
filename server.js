var httpServer = require('http').createServer();
var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({server: httpServer});
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var connectedUsers = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

socketServer.on('connection', function(socket) {
  console.log('Connection!');


  socket.on('message', function incoming(message) {
    console.log('Received: ' + message);
    socketServer.clients.forEach(function(client) {
      if(client !== socket) {
        client.send(message);
      }
    });
  });
});

httpServer.on('request', app);
httpServer.listen(PORT, function() {
  console.log('Listening on ' + PORT);
});
