const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const tweetsRouter = require('./routers/tweets');

const app = express();

app.use(bodyParser());

app.use('/tweets', tweetsRouter);

const port = process.env.PORT || 4000;

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
