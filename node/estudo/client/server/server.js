const express = require('express');
const server = express();
const http = require('http').Server(server);
const path = require("path");
const io_server = require('socket.io')(http);
let clients = {};
server.use('/', express.static(path.resolve('./public')));
server.use('/', express.static(path.resolve('./client')));

server.get('/', (req, res) => {
  res.sendFile(path.resolve('./client/chat.html'));
});
http.listen(3000, () => {
  console.log('listing port 3000');
});
var io_client = require('socket.io-client');
var server_socket = io_client.connect('http://localhost:4320', {reconnect: true});

io_server.on('connection', (socket) => {
  socket.on('join', (name) => {
    consele.log('connect', name);
    clients[socket.id] = name;
  });
  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
  socket.on('send', function (message) {
    console.log('message:', message);
    server_socket.emit("receive", message)
  });
});


// Add a connect listener
server_socket.on('connect', function (socket) {
    console.log('Connected!');
});
server_socket.emit('CH01', 'me', 'test msg');