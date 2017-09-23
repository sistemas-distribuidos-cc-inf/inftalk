'use strict';
/*
 Declaração de variáveis
*/
let
  net = require('net'),
  readline = require('readline'),
  host = 'localhost',
  port = 5050,
  client = null,
  myNick = null,
  portCliente = null,
  conectado = null,
  portConnection = null;
/**
Função connect()
Abre conexão com servidor via tcp
@port porta do servidor
@host ip do servidor
*/
client = net.connect({ port: port, host: host });



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
      //client2.close();
    });
  },
  close() {
    udp.connection.close();
  }
}

udp.create();
udp.connection.bind();

/**
Função on()
Exibe dados ecoados do servidor
*/
client.on('data', function (data) {
  data = data.toString();
  if (data.indexOf('@@') > 1) {
    console.log("*****************************************************")
    var split = data.split("@@");
    console.log(split)
    portConnection = split[0];
    udp.send(portConnection, 'connection udp aberta');
  }
  console.log(data);
});
/**
Função on()
Exibe que a conexão foi fechada
*/
client.on('end', function () {
  console.log('Server has disconnected.');
  process.exit();
});


/**
Função getNick()
@return o nickname
*/
function getNick() {
  console.log("What's your name?");
}
/**
Função getPort()
@return a porta
*/
function getPort() {
  console.log("What's your port?");
}

/**
Função createInterface()
recebe dados digitados no console
*/
readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', function (line) {
  if (!myNick || !portCliente) {
    line = line.trim();
    if (line.length < 1) {
      if (!myNick)
        getNick();
      else getPort();
    } else {
      if (!myNick)
        myNick = line;
      else if (!portCliente)
        portCliente = line;
    }
  } else {
    if (!conectado) {
      client.write(myNick + '**' + portCliente);
      conectado = true;
    }
    if (portConnection) {
      // console.log(line);
      udp.send(portConnection, line);
    }
    else client.write(line);
  }
});

getNick();
