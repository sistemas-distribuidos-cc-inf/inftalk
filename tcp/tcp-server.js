const
    net = require('net'),
    readline = require('readline'),
    port = 5050;

var
    clientList = [];

net.createServer((client) => {
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
            client.write('Wait for the connection\n\n');
            establishConnection(client);
        } else if (data.indexOf('SAIR') > -1) {
            desconect(client);
        } else if (client.chat.connection) {
            sendChat(client, data);
        }

    });
    client.on('end', function () {
        console.log('cliente desconectou')
        for (var i = 0; i < clientList.length; i++) {
            if (clientList[i] == client) {
                console.log('Client has disconnected', client.name);
                delete clientList[i];
            }
        }
    });
}).listen(port, () => {
    console.log("Chat server running at port " + port);
});


function sendChat(client, message) {
    clientList.forEach((_c) => {
        if (_c.name == client.chat.socketId) {
            _c.write(client.name + ': ' + message);
            _c.write('\n');
            client.write("Type message: ")
        }
    });
}
function desconect(client, message) {
    clientList = clientList.map((_c) => {
        if (_c.name == client.chat.socketId) {
            _c.write(client.name + ': desconectou'); //PASSSAR PARA O INGLES
            _c.write('\n');
            client.write(_c.name + ": desconectou");
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
function establishConnection(client) {
    clientList = clientList.map((_c) => {
        if (_c.name == client.chat.socketId) {
            client.chat.connection = true;
            if(_c.chat.socketId) 
                client.write("client already connection active")
            else {
                _c.chat = {
                        socketId: clone(client.name),
                        connection: true
                }
                client.write('Establish connection with' + _c.chat.socketId + "\n");
                client.write('Para sair da conexão da conexão digite SAIR \n');
                client.write('Type message: ');
                _c.write('Establish connection with' + client.chat.socketId + "\n");
                _c.write('Type message: ');
            }
        }
        return _c;
    });
}

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
                _c.write('select a person to start conversation by starting with #ID (example: #0)\n');
                _c.write(list.join('\n'));
            }
            else 
            _c.write('Ninguém conectado no momento\n');
        }
    })

}

function broadcast(message, sender) {
    clientList.forEach(function (client) {
        // Don't want to send it to sender
        // if (client === sender) return;
        client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
}

// function startServer() {
//     net.createServer(function (s) {
//         if (socket) return s.end("Sorry this chat is full");

//         socket = s;
//         socket.write("Welcome to the chat, I'm " + myNick);

//         socket.on('data', function (data) {
//             data = data.toString();
//             console.log(data);
//         });

//         socket.on('end', function () {
//             console.log('Client has disconnected');
//             socket = null;
//         });

//     }).listen(port);

//     console.log("Chat server running at port " + port);
// }

// function getNick() {
//     console.log("What's your name?");
// }

// readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// }).on('line', function (line) {
//     if (!myNick) {
//         line = line.trim();
//         if (line.length < 1) {
//             getNick();
//         } else {
//             myNick = line;
//             startServer();
//         }
//     } else {
//         socket.write(myNick + ": " + line);
//     }
// });
// ;

// getNick();

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