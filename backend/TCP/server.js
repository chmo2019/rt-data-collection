// builtins
// const tls = require('tls');
const net = require('net');
const fs = require('fs');
const http = require('http');

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

// array of socket
let sockets = [];

function tryParseJson(str) {
    try {
        JSON.parse(str.toString());
    } catch (e) {
        return false;
    }
    return JSON.parse(str.toString());
}

function getData(payload) {
    // get socket
    const sock = this;

    // print data to console
    // console.log('DATA ' + sock.remoteAddress + ': ' + payload);

    // try parsing json payload
    const parsedData = tryParseJson(payload);

    // write to file if data is valid
    if (parsedData) {
        fs.appendFile(`${process.env.DATA_PATH}${parsedData.name}.txt`, `${parsedData.ts},${parsedData.data}\n`, (err) => {
            if (err) return console.log(err);
            // console.log(parsedData);
        })
    }

    // send data back to node
    sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + payload + '\n');
}

function sendDataFromDisk(fname) {
    // get socker
    sock = this;

    // read file data into memory
    const filedata = fs.readFileSync(fname, 'utf8').toString().split('\n');

    // send data
    sock.emit('data', filedata);
}

function onClose() {
    sock = this;

    let index = sockets.findIndex(function(o) {
        return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
    })
    if (index !== -1) sockets.splice(index, 1);
    // console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
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
    sock.on('data', getData);
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
server.listen(process.env.HTTP_PORT, () => {
    console.log('HTTP Server running on port ' + process.env.HTTP_PORT);
})