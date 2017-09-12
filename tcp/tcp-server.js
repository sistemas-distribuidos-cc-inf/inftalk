/*
Declaração de variáveis
 */
const
    net = require('net'),
    readline = require('readline'),
    port = 5050;

var
    clientList = [],
    server;

/**
 Função createServer()
 Cria o server tcp
*/
server = net.createServer((client) => {
    client.on('data', function (data) {
        data = data.toString();
        console.log("************data*********")
        console.log(data)
        if(data.indexOf('**') > 1) {
            var split = data.split("**");
            client.name = split[0] + ":" + split[1];
            client.chat = [];
            clientList.push(client);
            showClientForStart(client);
        }
        else if (data.indexOf('#') > -1) {
            var socketIndex = data.split('#')[1];
            var socketId = clientList[socketIndex].name;
            console.log(socketId);
            console.log(client.chat)
            client.chat.socketId = socketId;
            client.chat.connection = false;
            client.write('Wait connection\n\n');
            establishConnection(client);
        } else if (data.indexOf('QUIT') > -1) {
            disconnect(client);
        } else if (client.chat.connection) {
            sendChat(client, data);
        }

    });
    client.on('end', function () {
        console.log('client disconnected')
        for (var i = 0; i < clientList.length; i++) {
            if (clientList[i] == client) {
                console.log('Client has disconnected', client.name);
                delete clientList[i];
            }
        }
    });
});
/**
 Função listen()
 Servidor passa a ouvir na porta @port
 */
server.listen(port, () => {
    console.log("Chat server running at port " + port);
});

/**
 Função sendChat()
 envia mensagem para o @client
 */
function sendChat(client, message) {
    clientList.forEach((_c) => {
        if (_c.name == client.chat.socketId) {
            _c.write(client.name + ': ' + message);
            _c.write('\n');
            client.write("Type message: ")
        }
    });
}
/**
Função disconnect()
Desconecta os clientes em conexão aberta
*/
function disconnect(client, message) {
    clientList = clientList.map((_c) => {
        if (_c.name == client.chat.socketId) {
            _c.write(client.name + ': disconnected'); //PASSSAR PARA O INGLES
            _c.write('\n');
            client.write(_c.name + ": disconnected");
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
    showClientForStart({})
}
/**
 Função establishConnection()
 Estabelece a conexão entre os clientes
 */
function establishConnection(client) {
    clientList = clientList.map((_c) => {
        if (_c.name == client.chat.socketId) {
            client.chat.connection = true;
            if(_c.chat.socketId) 
                client.write("client are busy")
            else {
                _c.chat = {
                        socketId: clone(client.name),
                        connection: true
                }
                client.write('Connection established with' + _c.chat.socketId + "\n");
                client.write('To close chat type QUIT \n');
                client.write('Type message: ');
                _c.write('Connection established with' + client.chat.socketId + "\n");
                _c.write('Type message: ');
            }
        }
        return _c;
    });
}

/**
 Função showClientForStart()
 Mostra todos os clientes conectados
 */
function showClientForStart(client) {
    client.chat = {
        connection: false,
        socketId: null
    };
    clientList.forEach((_c) => {
        var list = [];
        list = clientList.filter((c) =>!(c == _c));
        list = list.map((c, index) => [index, '-', c.name].join(' '));
        if(!_c.chat.connection) {
            if(list.length) {
                _c.write('Select a person to start talk by starting with #ID (example: #0)\n');
                _c.write(list.join('\n'));
            }
            else 
            _c.write('Nobody online\n');
        }
    })

}

/**
 Função clone()
 Copia um objeto
 */
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
