process.title = 'pepoApi';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const config = require('./config');
const tweetsRouter = require('./routers/tweets');
const usersRouter = require('./routers/users');

const app = express();

app.use(bodyParser.json());

app.use('/tweets', tweetsRouter);
app.use('/users', usersRouter);

function connect() {
    return mongoose.connect(config.mongodb.uri).connection;
}

function listen() {
    const port = process.env.PORT || config.defaultPort;

    app.listen(port, () => {
        console.log(`Server started at port: ${port}`);
    });
}

connect()
    .on('error', console.error)
    .on('disconnect', connect)
    .once('open', listen);
