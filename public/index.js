var chatroom = require("./chatroom.js");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

server = new chatroom.Server();

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get(/^(.+)$/, function(req, res) {
  console.log("static file request: " + req.params);
  res.sendFile(__dirname + req.params[0]);
});

io.on('connection', function(socket) {
  console.log("A client has connected");
  socket.on('disconnect', function() {
    console.log("A client has disconnected");
  });
  socket.on('signup attempt', function(attempt){
    if (server.createAccount(attempt.username, attempt.password)) {
      var user = server.getUser(attempt.username);
      this.emit('token', user.token);
      user.room.sockets.push(this);
    }
    else {
      this.emit('token', false);
    }
  });
  socket.on('login attempt', function(attempt) {
    if (server.login(attempt.username, attempt.password)) {
      var user = server.getUser(attempt.username);
      this.emit('token', user.token);
      user.room.sockets.push(this);
    }
    else {
      this.emit('token', false);
    }
  });
  socket.on('outgoing message', function(message) {
    var user = server.getUserByToken(message.token);
    if (user != null) {
      var incoming = new chatroom.Message(user, message.body);
      //io.emit("incoming message", incoming);
      sendItOut(user, incoming);
    }
    else {
      console.log("A user with token " + message.token + " failed to send a message");
    }
  });
});

function sendItOut(user, message) {
  console.log("Sending '"+message.body+"' to room #"+user.room.id);
  for (var i = 0; i<user.room.sockets.length; i++) {
    console.log(user.room.sockets[i].emit('incoming message', message));
  }
}

http.listen(3000, function() {
  console.log('listening on *:3000');
});
