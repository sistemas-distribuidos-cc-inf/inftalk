'use strict';
let
  net = require('net'),
  readline = require('readline'),
  constant = require('./constant.js'),
  host = 'localhost',
  port = 5050,
  client = net.connect({ port: port, host: host }),
  myNick = null,
  portCliente = null,
  conectado = null,
  portConnection = null;

let udp = {
  dgram: require('dgram'),
  connection: null,
  create() {
    udp.connection = udp.dgram.createSocket('udp4', (message, rinfo) => {
      console.log('%s', message.toString());
    });
  },
  send(port, message) {
    const buffer = Buffer.from(message);
    udp.connection.send(buffer, port, (err) => {
      if (err)
        console.log(err)
    });
  },
  close() {
    udp.connection.close();
  }
}
udp.create();
udp.connection.bind();

client.on('data', function (data) {
  data = JSON.parse(data.toString());
  if (data[constant.CONNECTION]) {
    portConnection = data[constant.CONNECTION].port;
    udp.send(portConnection, 'You\'re welcome!')
  }
  if (data[constant.QUIT]) {
    console.log('Closed chat');
    portConnection = null;
    udp.close();
  }
  if (data[constant.BUSY]) {
    console.log(data[constant.BUSY].message);
  }
  if (data[constant.ESTABLISHED]) {
    console.log(data[constant.ESTABLISHED].message);
  }
  if (data[constant.SELECT_USER]) {
    console.log(data[constant.SELECT_USER].message);
    console.log(data[constant.SELECT_USER].list);
  }
});
client.on('end', function () {
  console.log('Server has disconnected.');
  process.exit();
});

function getData() {
  if (!myNick)
    console.log("What's your name?");
  else console.log("What's your port?");
}

readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', function (line) {
  if (!myNick || !portCliente) {
    line = line.trim();
    if (line.length < 1) {
      if (!myNick || !portCliente)
        getData();
    } else {
      if (!myNick)
        myNick = line;
      else if (!portCliente)
        portCliente = line;
    }
  } else {
    if (!conectado) {
      const obj = {
        [constant.CREATE_USER]: {
          nickname: myNick,
          port: portCliente
        }
      };
      client.write(JSON.stringify(obj));
      conectado = true;
    }
    if (portConnection) {
      if (line.indexOf('QUIT') >= 0) {
        conectado = false;
        const obj = {
          [constant.QUIT]: {
            quit: true
          }
        }
        client.write(JSON.stringify(obj));
      } else if (line.length) {
        udp.send(portConnection, line);
      }
    }
    if (line.indexOf('#') >= 0 && line.length) {
      const obj = {
        [constant.SELECT_USER]: {
          user: line.split('#')[1]
        }
      }
      client.write(JSON.stringify(obj));
    }
  }
});

getData();
