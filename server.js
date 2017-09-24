let clientList = [];
constant = require('./constant.js');
const server = {
	net: require('net'),
	dgram: require('dgram'),
	port: 5050,
	connection: null,
	create() {
		server.connection = server.net.createServer((client) => {
			client.on('data', function (data) {
				data = JSON.parse(data.toString());
				if (data[constant.CREATE_USER]) {
					var split = data[constant.CREATE_USER];
					client.name = data[constant.CREATE_USER].nickname;
					client.port = data[constant.CREATE_USER].port;
					client.chat = [];
					clientList.push(client);
					server.showClientForStart(client);
				}
				else if (data[constant.SELECT_USER]) {
					var socketIndex = data[constant.SELECT_USER].user;
					var socketId = clientList[socketIndex].name;
					client.chat.socketId = socketId;
					client.chat.connection = false;
					server.establishConnection(client);
				} else if (data[constant.QUIT]) {
					server.disconnect(client);
				} else if (client.chat && client.chat.connection) {
					///server.sendChat(client, data);
				}

			});
			client.on('end', function () {
				for (var i = 0; i < clientList.length; i++) {
					if (clientList[i] == client) {
						console.log('Client has disconnected', client.name);
						delete clientList[i];
					}
				}
			});
		});
	},
	listen() {
		server.connection.listen(server.port);
	},
	sendChat() {
		clientList.forEach((_c) => {
			if (_c.name == client.chat.socketId) {
				_c.write(client.name + ': ' + message);
				_c.write('\n');
				client.write("Type message: ")
			}
		});
	},
	disconnect(client, message) {
		clientList = clientList.map((_c) => {
			if (_c.name == client.chat.socketId) {
				const obj = {
					[constant.QUIT]: {
						quit: true
					}
				};
				_c.write(JSON.stringify(obj));
				client.write(JSON.stringify(obj));
				_c.chat = {
					socketId: null,
					connection: false
				};
				client.chat = {
					socketId: null,
					connection: false
				};
			}
			return _c;
		});

		server.showClientForStart({});
	},
	establishConnection(client) {
		clientList = clientList.map((_c) => {
			if (_c.name == client.chat.socketId) {
				client.chat.connection = true;
				if (_c.chat.socketId) {
					const obj = {
						[constant.BUSY]: {
							message: 'client are busy'
						}
					};
					client.write(JSON.stringify(obj));
				}
				else {
					_c.chat = {
						socketId: clone(client.name),
						connection: true
					};
					const obj = {
						[constant.ESTABLISHED]: {
							message: 'Connection established with\nTo close chat type QUIT \nType message: '
						}
					};
					client.write(JSON.stringify(obj));
					_c.write(JSON.stringify(obj));
					server.startUDPServer(client, (cliente) => {
						const obj = {
							[constant.CONNECTION]: {
								port: cliente.port
							}
						};
						cliente.write(JSON.stringify(obj));
						_c.write(JSON.stringify(obj));
					});
				}
			}
			return _c;
		});
	},
	showClientForStart(client) {
		client.chat = {
			connection: false,
			socketId: null
		};
		clientList.forEach((_c) => {
			var list = [];
			list = clientList.map((c, index) => {
				if (!(c == _c))
					return [index, '-', c.name].join(' ')
			});
			if (!_c.chat.connection) {
				if (list.every((l) => !l))
					list = ['Nobody users'];
				const obj1 = {
					[constant.SELECT_USER]: {
						message: 'Select a person to start talk by starting with #ID (example: #0)\n',
						list: list.join('\n')
					}
				};
				_c.write(JSON.stringify(obj1));
			}
		})

	},
	startUDPServer(cliente, callback) {
		cliente.clientConnection = [];
		cliente.serverUDP = server.dgram.createSocket('udp4');
		cliente.serverUDP.on('error', (err) => {
			console.log(`cliente.serverUDP error:\n${err.stack}`);
			cliente.serverUDP.close();
		});
		cliente.serverUDP.on('message', (msg, rinfo) => {
			if (cliente.clientConnection.every((cn) => cn.port != rinfo.port))
				cliente.clientConnection.push(rinfo);
			server.brodcastUPD(cliente.clientConnection, msg, rinfo, cliente);
			// console.log(`cliente.serverUDP got: ${msg} from ${rinfo.address}:${rinfo.port}`);
		});
		cliente.serverUDP.on('listening', () => {
			const address = cliente.serverUDP.address();
			// console.log(`cliente.serverUDP listening ${address.address}:${address.port}`);
		});
		cliente.serverUDP.bind(cliente.port, () => {
			console.log('server udp port', cliente.port);
		});
		if (callback) callback(cliente);
	},
	brodcastUPD(clients, message, rinfo, cliente) {
		var _buffer = new Buffer("==> " + message);
		clients.forEach(function (current) {
			if (current.port != rinfo.port) {
				cliente.serverUDP.send(_buffer, 0, _buffer.length, current.port, current.address);
			}
		});
	}
};

function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}

server.create();
server.listen();