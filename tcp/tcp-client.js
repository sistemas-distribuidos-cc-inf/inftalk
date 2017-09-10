'use strict';

let
    net = require('net'),
    readline = require('readline'),
    host = 'localhost',
    port = 5050,
    client = null,
    myNick = null,
    portCliente = null,
		conectado = null;

client = net.connect({ port: port, host: host }, function () {
		//client.write(myNick + '**' + port);
});
client.on('data', function (data) {
	data = data.toString();
	console.log(data);
});
client.on('end', function () {
		console.log('Server has disconnected.');
		process.exit();
});



function getNick(){
  console.log("What's your name?");
}
function getPort(){
  console.log("What's your port?");
}

console.log("What's your name?");
readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).on('line', function (line) {
		if(!myNick || !portCliente){
			line = line.trim();
			if(line.length < 1){
				if(!myNick)
					getNick();
				else getPort();
			} else {
					if(!myNick)
						myNick = line;
					else if(!portCliente)
						portCliente = line;
			}
		} else {
			if(!conectado) {
				client.write(myNick + '**' + portCliente);
				conectado = true;
			}
			client.write(line);
    }
});

// getNick();