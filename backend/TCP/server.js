// builtins
// const tls = require('tls');
const net = require('net');
const fs = require('fs');
const http = require('http');

// third party
const express = require('express');
const { Server, Socket } = require("socket.io");

// load env variables
require('dotenv').config();

// initialize tcp server
// TODO: add tls
const tcp = net.createServer();

// initialize express and socket io servers
const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
    console.log('DATA ' + sock.remoteAddress + ': ' + payload);

    // try parsing json payload
    const parsedData = tryParseJson(payload);

    // write to file if data is valid
    if (parsedData) {
        fs.appendFile(`${process.env.DATA_PATH}${parsedData.name}.txt`, `${parsedData.ts},${parsedData.data}\n`, (err) => {
            if (err) return console.log(err);
            console.log(parsedData);
        })
    }

    // send data back to node
    sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + payload + '\n');
}

function sendData(payload) {
    // get socket
    const sock = this;

    sock.emit('data', payload);
}

function sendDataFromDisk(fname) {
    // read file data into memory
    const filedata = fs.readFileSync(fname, 'utf8').toString().split('\n');

    // send data
    sendData(filedata[filedata.length-2]);
}

// listen to connection events: https://www.digitalocean.com/community/tutorials/how-to-develop-a-node-js-tcp-server-application-using-pm2-and-nginx-on-ubuntu-16-04
tcp.on('connection', (sock) => { 
    sock.on('data', getData);
});

io.on('connection', (socket) => {
    io.on("data", sendDataFromDisk);
});

// start tcp server
tcp.listen(process.env.TCP_PORT, process.env.HOST, () => {
    console.log('TCP Server running on port ' + process.env.TCP_PORT);
});

// start http server
server.listen(process.env.HTTP_PORT, () => {
    console.log('HTTP Server running on port ' + process.env.HTTP_PORT);
})