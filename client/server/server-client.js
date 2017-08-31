const express = require('express');
const server = express();
const http = require('http').Server(server);
const path = require("path");




// let clients = {};
server.use('/', express.static(path.resolve('./public')));

// var io = require('socket.io-client');
// var socket = io.connect('http://localhost:4320', { reconnect: true });

// // Add a connect listener
// socket.on('connect', function (socket) {
//   console.log('Connected!');
// });
// socket.emit('CH01', 'me', 'test msg 6666');

server.get('/', (req, res) => {
  res.sendFile(path.resolve('./client/index.html'));
});
http.listen(4325, () => {
  console.log('listing port 4325');
});

// socket.on('connection', (client) => {
//   console.log('connection cliente!');
//   socket.on('join', (name) => {
//     consele.log('connect', name);
//     clients[client.id] = name;
//   });
//   socket.on("disconnect", () => {
//     delete clients[client.id];
//   });
//   socket.on('send', function (message) {
//     console.log('message:', message);
//     socket.broadcast.emit("receive", clients[client.id], message)
//   });
// });


// var io = require('socket.io-client');
// var socket = io.connect('http://localhost:4320', {reconnect: true});

// // Add a connect listener
// socket.on('connect', function (socket) {
//     console.log('Connected!');
// });
//  socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'server cliente' });
//   });