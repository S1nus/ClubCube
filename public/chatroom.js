m = module.exports = {
  Server : function() {
    this.registeredAccounts = [];
    this.rooms = [new m.Room(0)];

    this.createAccount = function(username, password) {
      for (var i = 0; i<this.registeredAccounts.length; i++) {
        if (this.registeredAccounts[i].username == username) {
          console.log("Failed attempt to create account named " + username);
          return false;
        }
      }
      this.registeredAccounts.push(new m.Account(username, password, this.rooms[0]));
      var tok = this.login(username, password);
      console.log("Welcome new user " + username);
      return tok;
    };

    this.login = function(username, password) {
      for (var i = 0; i<this.registeredAccounts.length; i++) {
        if (this.registeredAccounts[i].username == username) {
          if (this.registeredAccounts[i].password == password) {
            var user = this.registeredAccounts[i];
            user.login();
            user.token = this.generateToken();
            console.log(username + " has logged in succesfully");
            return user.token;
          }
        }
      }
      console.log("failed login attempt for " + username);
      return false;
    };

    this.generateToken = function() {
      var xyz = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      var str = "";
      for (var i = 0; i<20; i++) {
        str += xyz[Math.floor(Math.random()*(xyz.length+1))];
      }
      return str;
    };

    this.getUser = function(value) {
      for (var i = 0; i<this.registeredAccounts.length; i++) {
        if (this.registeredAccounts[i].username == value) {
          return this.registeredAccounts[i];
        }
      }
      return null;
    };

    this.getUserByToken = function(token) {
      for (var i = 0; i<this.registeredAccounts.length; i++) {
        if (this.registeredAccounts[i].token == token) {
          return this.registeredAccounts[i];
        }
      }
      return null;
    };

    this.generateIncomingMessage = function(ogMessage, callback) {
      var user = this.getUserByToken(ogMessage.token);
      if (user != null && ogMessage.body!="") {
        callback(new m.Message(user.username, ogMessage.body, user.room, user.color));
      }
      callback(null);
    };
  },

  Account : function (username, password, room=null) {
    this.username = username;
    this.password = password;
    this.logout = function() {
      this.online = false;
    };
    this.login = function() {
      this.online = true;
    };
    this.room = room;
    this.online = false;
    this.color = {'r': Math.floor(Math.random()*256), 'g': Math.floor(Math.random()*256), 'b': Math.floor(Math.random()*256)};
    this.say = function(body) {
      if (this.online) {
        if (this.room != null) {
          this.room.postMessage(new m.Message(this.username, body));
          return true;
        }
      }
      return false;
    };
    this.token = m.generateToken();
  },

  Room : function (id, items=[]) {
    this.id = id;
    this.items = items;
    this.players = [];
    this.sockets = [];
    this.messages = [];

    this.addPlayer = function(player) {
      player.room = this;
      this.players.push(player);
    };
    this.removePlayer = function(player) {
      for (var i = 0; i<this.players.length; i++) {
        if (this.players[i] == player) {
          console.log(this.players);
          console.log("removing " + player.username);
          this.players.splice(i, 1);
          console.log(this.players);
        }
      }
    };
    this.postMessage = function(message) {
      this.messages.push(message);
    };
  },

  Message : function(author, body, room=null, color=null) {
    this.author = author;
    this.color = color;
    this.body = body;
    this.timeStamp = Date.now();
    this.deleted = false;
    this.room = room;
    this.delete = function() {
      this.deleted = true;
      this.body = "";
      this.author = "";
    };
  },

  generateToken : function() {
    var xyz = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var str = "";
    for (var i = 0; i<20; i++) {
      str += xyz[Math.floor(Math.random()*(xyz.length+1))];
    }
    return str;
  }
};
