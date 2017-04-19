function GUI() {

  //Blocker
  this.Blocker = document.createElement("div");
  this.Blocker.className = "blocker";
  this.Blocker.up = function() {
    try {
      document.body.appendChild(this);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  this.Blocker.down = function() {
    try {
      document.body.removeChild(this);
    }
    catch (e) {
      console.log(e.message);
    }
  };

  //Dialogue Boxes
  this.dBox = document.createElement("div");

  this.dBox.className = "dialogueBox";

  this.dBox.usernameBox = document.createElement("input");
    this.dBox.usernameBox.type = "text";
    this.dBox.usernameBox.placeholder = "username";
  this.dBox.pwordBox = document.createElement("input");
    this.dBox.pwordBox.type = "password";
    this.dBox.pwordBox.placeholder = "password";
  this.dBox.confirmPwordBox = document.createElement("input");
    this.dBox.confirmPwordBox.type = "password";
    this.dBox.confirmPwordBox.placeholder = "confirm password";
  this.dBox.button = document.createElement("button");
    this.dBox.button.appendChild(document.createTextNode("join"));
    this.dBox.button.addEventListener("click", function(){
      signup();
    });
  this.dBox.loginLink = document.createElement("a");
    this.dBox.loginLink.innerHTML = "or log in";
    this.dBox.loginLink.addEventListener("click", function clickdefault(e) {
      gui.dBox.displayLogin(e);
    });

  this.dBox.appendChild(this.dBox.usernameBox);
  this.dBox.appendChild(this.dBox.pwordBox);
  this.dBox.appendChild(this.dBox.confirmPwordBox);
  this.dBox.appendChild(this.dBox.button);
  this.dBox.appendChild(this.dBox.loginLink);

  this.dBox.show = function() {
    try {
      document.body.appendChild(this);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  this.dBox.hide = function() {
    try {
      document.body.removeChild(this);
    }
    catch (e) {
      console.log(e.message);
    }
  };
  this.dBox.wiggle = function() {
    this.className = "dialogueBox wiggling";
    setTimeout(function() {gui.dBox.className = "dialogueBox";}, 750);
  };
  this.dBox.displayLogin = function(e=null) {
    try {
      this.removeChild(this.confirmPwordBox);
      this.removeChild(this.loginLink);
      this.loginLink = document.createElement("a");
      this.loginLink.innerHTML = "or join";
      this.loginLink.addEventListener("click", function(e) {
        gui.dBox.displaySignup(e);
      });
      this.removeChild(this.button);
      this.button = document.createElement("button");
      this.button.innerHTML = "log in";
      this.button.addEventListener("click", function() {
        login();
      });
      this.appendChild(this.button);
      this.appendChild(this.loginLink);
      e.preventDefault();
    }
    catch (e) {
      console.log(e.message);
    }
  };
  this.dBox.displaySignup = function(e=null) {
    try {
      this.insertBefore(this.confirmPwordBox, this.button);
      this.button.innerHTML = "join";
      this.removeChild(this.loginLink);
      this.loginLink = document.createElement("a");
      this.loginLink.innerHTML = "or log in";
      this.loginLink.addEventListener("click", function(e) {
        gui.dBox.displayLogin(e);
      });
      this.removeChild(this.button);
      this.button = document.createElement("button");
      this.button.innerHTML = "join";
      this.button.addEventListener("click", function() {
        signup();
      });
      this.appendChild(this.button);
      this.appendChild(this.loginLink);
      e.preventDefault();
    }
    catch (e) {
      console.log(e.message);
    }
  };

  //Chat Stuff
  this.messageBox = document.getElementById("message-text");
  this.sendButton = document.getElementById("sendbutton");
  this.messageDisplay = document.getElementById("message-box");

  //Displaying messages
  this.createMessageBlock = function(message) {
    var block = document.createElement("div");
    block.className = "message";

    block.authorLabel = document.createElement("div");
    block.authorLabel.className = "author";
    block.authorLabel.appendChild(document.createTextNode(message.author));

    block.timeStamp = document.createElement("span");
    block.timeStamp.className = "time";
    var d = new Date(message.timeStamp);
    block.timeStamp.appendChild(document.createTextNode(d.getHours()+":"+d.getMinutes()));

    block.body = document.createElement("div");
    block.body.className = "body";
    block.body.appendChild(document.createTextNode(message.body));

    block.authorLabel.appendChild(block.timeStamp);
    block.appendChild(block.authorLabel);
    block.appendChild(block.body);

    return block;
  };

}
