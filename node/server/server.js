const express = require('express');
const server = express();
const http = require('http').Server(server);
const path = require("path");
const io = require('socket.io')(http);
let clients = {};
server.use('/', express.static(path.resolve('./public')));

server.get('/', (req, res) => {
  res.sendFile(path.resolve('./client/index.html'));
});
http.listen(3000, () => {
  console.log('listing port 3000');
});

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    consele.log('connect', name);
    clients[socket.id] = name;
  });
  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
  socket.on('send', function (message) {
    console.log('message:', message);
    socket.broadcast.emit("receive", message)
  });
});
