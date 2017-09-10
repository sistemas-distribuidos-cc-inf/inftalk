'use strict';

let
    net = require('net'),
    readline = require('readline'),
    host = 'localhost',
    port = 5050,
    client = null,
    myNick = null;

// function startClient(){
client = net.connect({ port: port, host: host }, function () {
    client.write("Hello, I'm ");
});

client.on('data', function (data) {
    data = data.toString();
    console.log(data);
});

client.on('end', function () {
    console.log('Server has disconnected.');
    process.exit();
});
// }

// function getNick(){
//   console.log("What's your name?");
// }

readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).on('line', function (line) {
    //   if(!myNick){
    //     line = line.trim();
    //     if(line.length < 1){
    //       getNick();
    //     } else {
    //       myNick = line;
    //       startClient();
    //     }
    //   } else {
    client.write(line);
    //   }
});

// getNick();