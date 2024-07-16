// builtins
// const tls = require('tls');
const net = require('net');
const fs = require('fs');
const http = require('http');

const { sockets, onData, onClose } = require('./tcp/handlers');

// third party
const express = require('express');
const { Server } = require("socket.io");

// load env variables
require('dotenv').config();

// initialize tcp server
// TODO: add tls
const tcp = net.createServer();

// initialize express and socket io servers
const app = express();
const server = http.createServer(app);
const io = new Server(server);

function sendDataFromDisk(fname) {
    // get socker
    sock = this;

    // read file data into memory
    const filedata = fs.readFileSync(fname, 'utf8').toString().split('\n');

    // send data
    sock.emit('data', filedata);
}

function onDisconnect() {
    console.log('user disconnected');
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

// listen to connection events: https://www.digitalocean.com/community/tutorials/how-to-develop-a-node-js-tcp-server-application-using-pm2-and-nginx-on-ubuntu-16-04
tcp.on('connection', (sock) => {

    sockets.push(sock);
    sock.on('data', onData);
    sock.on('close', onClose);
    // io.emit('data', 'hello');
});

// socket io connection handler
io.on('connection', (socket) => {
    console.log('user connected');

    let intervalId;

    socket.on('start', (data) => {
        console.log(data);
        if (data === "start") {
            intervalId = setInterval(() => {io.emit('data', 'hello')}, 2000);
        } else if (data === "stop") {
            clearInterval(intervalId);
        }
    });

    // sendDataFromDisk(io, `${process.env.DATA_PATH}test-client.txt`);
    // socket.on("data", sendDataFromDisk, `${process.env.DATA_PATH}test-client.txt`);
    socket.on('disconnect', onDisconnect);
});

// start tcp server
tcp.listen(process.env.TCP_PORT, process.env.HOST, () => {
    console.log('TCP Server running on port ' + process.env.TCP_PORT);
});

// start http server
// server.listen(process.env.HTTP_PORT, () => {
//     console.log('HTTP Server running on port ' + process.env.HTTP_PORT);
// })