// builtins
const net = require('net');

// load env variables
require('dotenv').config();

// initialize server
// TODO: add ssl
const server = net.createServer();

// connect sockets
let sockets = [];

// listen to connection events: https://www.digitalocean.com/community/tutorials/how-to-develop-a-node-js-tcp-server-application-using-pm2-and-nginx-on-ubuntu-16-04
server.on('connection', (sock) => { 
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});

// start server
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log('TCP Server running on port ' + process.env.PORT);
});