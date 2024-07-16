const tryParseJson = require('../utils').tryParseJson;

let sockets = [];

async function onData(payload) {
    const socket = this;

    const data = tryParseJson(payload);

    socket.write(JSON.stringify(data));
}

async function onClose() {
    const socket = this;

    let index = sockets.findIndex(function(o) {
        return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
    });

    if (index !== -1) sockets.splice(index, 1);
}

module.exports = { sockets, onData, onClose };