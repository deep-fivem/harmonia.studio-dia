const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

var current = 0;
var max = 10;

// function to encode file data to base64 encoded string
function base64_encode(file) {
    return fs.readFileSync(file, 'base64');
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.join('justconnected');
    var filename = current + '.txt';
    console.log(filename);
    fs.readFile(filename, 'UTF-8', function(err, data) {
        if (err) return;

        console.log('OK: ' + filename);

        var img_filename = current + '.png';

        console.log(img_filename);

        var img = base64_encode(img_filename);

        var text = data;

        io.to('justconnected').emit('change', text, img);
        socket.leave('justconnected');
    });

    socket.on('log in', (input) => {
        if (input == '237') {
            socket.join('admin');
            io.to('admin').emit('logged');
            socket.leave('admin');
            console.log('logged in');
        } else {
            console.log('tried logging in with input: ' + input);
        }
    });

    socket.on('leftbutton', () => {
        console.log('someone pressed left button');
        io.emit('print', 'someone pressed left button');

        if (current <= 0) {
            current = 0;
        } else {
            current = current - 1;
        }

        console.log(current);

        var filename = current + '.txt';
        console.log(filename);
        fs.readFile(filename, 'UTF-8', function(err, data) {
            if (err) {
                current = current + 1;
                return;
            }

            console.log('OK: ' + filename);

            var img_filename = current + '.png';

            console.log(img_filename);

            var img = base64_encode(img_filename);

            var text = data;

            io.emit('change', text, img);
        });
    })
    socket.on('rightbutton', () => {
        console.log('someone pressed right button');
        io.emit('print', 'someone pressed right button');

        if (current >= max) {
            current = max;
        } else {
            current = current + 1;
        }

        console.log(current);

        var filename = current + '.txt';
        console.log(filename);
        fs.readFile(filename, 'UTF-8', function(err, data) {
            if (err) {
                current = current - 1;
                return;
            }

            console.log('OK: ' + filename);
            var img_filename = current + '.png';

            console.log(img_filename);

            var img = base64_encode(img_filename);

            var text = data;

            io.emit('change', text, img);
        });
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});