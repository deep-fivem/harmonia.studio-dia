const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'htmlsite/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
