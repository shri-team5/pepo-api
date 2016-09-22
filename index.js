const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const config = require('./config');
const tweetsRouter = require('./routers/tweets');
const usersRouter = require('./routers/users');

const app = express();

const io = require('socket.io').listen(8086);
io.sockets.on('connection', function (socket) {
    var time = (new Date).toLocaleTimeString();
    socket.json.send({'event': 'connected', 'time': time}); 
});


app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tweets', tweetsRouter);
app.use('/users', usersRouter);

function connect() {
    return mongoose.connect(config.mongodb.uri).connection;
}

function listen() {
    const port = process.env.PORT || config.defaultPort;

    return app.listen(port, () => {
        console.log(`Server started at port: ${port}`);
    });
}

const server = listen();

connect()
    .on('error', console.error)
    .on('disconnect', connect)
    .once('open',  function() {
        console.log('Mongoose connected!');
    });


module.exports = server;
