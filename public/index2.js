var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get(/^(.+)$/, function(req, res) {
  console.log('static file request: ' + req.params);
  res.sendFile(__dirname + req.params[0]);
});

io.on('connection', function(socket) {
  console.log("a user connected");
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('signup attempt', function(attempt) {

  });
  socket.on('chat message', function(message) {
    console.log(message.author + ": " + message.body);
    io.emit('chat message', message);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
