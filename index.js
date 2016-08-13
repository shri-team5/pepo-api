const express = require('express');

const tweetsRouter = require('./routers/tweets');

const app = express();

app.use('/tweets', tweetsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
