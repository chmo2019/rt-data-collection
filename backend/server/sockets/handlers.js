async function onDisconnect() {
    console.log('user disconnected');
}

// function sendDataFromDisk(fname) {
//     // get socker
//     sock = this;

//     // read file data into memory
//     const filedata = fs.readFileSync(fname, 'utf8').toString().split('\n');

//     // send data
//     sock.emit('data', filedata);
// }

module.exports = { onDisconnect };