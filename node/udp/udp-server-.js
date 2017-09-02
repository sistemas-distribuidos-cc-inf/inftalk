'use strict';

let
  net = require('net'),
  readline = require('readline'),
  port = 5000,
  socket = null,
  myNick = null;

function startServer(){
  net.createServer(function (s) {
    if(socket) return s.end("Sorry this chat is full");

    socket = s;
    socket.write("Welcome to the chat, I'm " + myNick);

    socket.on('data', function (data) {
      data = data.toString();
      console.log(data);
    });

    socket.on('end', function(){
      console.log('Client has disconnected');
      socket = null;
    });

  }).listen(port);

  console.log("Chat server running at port "+port);
}

function getNick(){
  console.log("What's your name?");
}

readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', function(line){
  if(!myNick){
    line = line.trim();
    if(line.length < 1){
      getNick();
    } else {
      myNick = line;
      startServer();
    }
  } else {
    socket.write(myNick + ": " + line);
  }
});
;

getNick();