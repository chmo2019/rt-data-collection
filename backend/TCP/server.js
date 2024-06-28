// builtins
// const tls = require('tls');
const net = require('net');
const fs = require('fs');

// load env variables
require('dotenv').config();

// initialize server
// TODO: add ssl
const server = net.createServer();

function tryParseJson(str) {
    try {
        JSON.parse(str.toString());
    } catch (e) {
        return false;
    }
    return JSON.parse(str.toString());
}

// listen to connection events: https://www.digitalocean.com/community/tutorials/how-to-develop-a-node-js-tcp-server-application-using-pm2-and-nginx-on-ubuntu-16-04
server.on('connection', (sock) => { 
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        const parsedData = tryParseJson(data);
        if (parsedData) {
            fs.appendFile(`${process.env.DATA_PATH}${parsedData.name}.txt`, `${parsedData.ts},${parsedData.data}\n`, (err) => {
                if (err) return console.log(err);
                console.log(parsedData);
            })
        }
        sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
    });
});

// start server
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log('TCP Server running on port ' + process.env.PORT);
});