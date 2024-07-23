const { sockets, onData, onClose } = require('./handlers');

function TCPInit(server, components, options) {
    // listen to connection events: https://www.digitalocean.com/community/tutorials/how-to-develop-a-node-js-tcp-server-application-using-pm2-and-nginx-on-ubuntu-16-04
    server.on('connection', (sock) => {
        sockets.push(sock);
        sock.on('data', onData);
        sock.on('close', onClose);
        // io.emit('data', 'hello');
    });
}

module.exports = { TCPInit };