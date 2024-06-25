// builtins
const net = require('net');

// load env variables
require('dotenv').config();

// initialize server
const server = net.createServer();

// start server
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log('TCP Server running on port ' + process.env.PORT);
});