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
  messageHandler.mySockets.push(socket);
  socket.room = null;
  socket.on('disconnect', function() {
    var index = messageHandler.mySockets.indexOf(this);
    messageHandler.mySockets.splice(index, 1);
    console.log("A client has disconnected");
  });
  socket.on('signup attempt', function(attempt){
    var tok = server.createAccount(attempt.username, attempt.password);
    this.emit('token', tok);
    var usr = server.getUserByToken(tok);
    if (usr != null) {
      this.room = usr.room;
    }
  });
  socket.on('login attempt', function(attempt) {
    var tok = server.login(attempt.username, attempt.password);
    if (tok) {
      var usr = server.getUserByToken(tok);
      this.room = usr.room;
    }
    this.emit('token', tok);
  });
  socket.on('outgoing message', function(message) {
    var user = server.getUserByToken(message.token);
    if (user != null) {
      var incoming = new chatroom.Message(user.username, message.body, user.room);
      //io.emit("incoming message", incoming);
      user.room.postMessage(new chatroom.Message(user.username, message.body));
      messageHandler.sendIt(incoming);
    }
    else {
      console.log("A user with token " + message.token + " failed to send a message");
    }
  });
  socket.on('msg req', function(tkn) {
    var usr = server.getUserByToken(tkn);
    var room = usr.room;
    for (var i = 0; i<room.messages.length; i++) {
      this.emit('incoming message', room.messages[i]);
    }
  });
});

messageHandler = {
  mySockets: [],
  sendIt: function(message) {
    console.log(message.author + " (Room #" + message.room.id + ")" + ": " + message.body);
    for (var i = 0; i<this.mySockets.length; i++) {
      if (message.room == this.mySockets[i].room) {
        try {
          this.mySockets[i].emit("incoming message", message);
        }
        catch (e) {
          console.log(e.message);
        }
      }
    }
  }
};

http.listen(3000, function() {
  console.log('listening on *:3000');
});
