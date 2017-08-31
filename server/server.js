// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const firebase = require("firebase-admin");

// io.on('connection', function (socket){
//   console.log('connection server');
//   socket.on('receive', function (from, msg) {
//     console.log('MSG', from, ' saying ', msg);
//   });
// });

// http.listen(4320, function () {
//   console.log('listening on *:4320');
// });

// const serviceAccount = require("./firebase/inftalkufg-firebase-adminsdk-jtlak-f87daeb2ca");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://inftalkufg.firebaseio.com"
// });

// io.on('connection', (client) => {
//     console.log('connect ----');
//   client.on('join', (name) => {
//     console.log('connect', name);
//     // clients[client.id] = name;
//   });
//   client.on("disconnect", () => {
//     console.log('disconnect server');
//     // delete clients[client.id];
//   });
//   client.on('send', function (message) {
//     console.log('message:', message);
//     socket.broadcast.emit("receive",  message)
//   });
// });

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4320);

// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
      