'use strict';

require('dotenv').config();

const mongoose = require('./configs/mongoose'),
    path = require('path'),
    favicon = require('serve-favicon'),
    express = require('./server/server'),
    init = require('./server/init');

try {
    var db = mongoose();
    var app = express();
} catch (err) {
    console.log(err);
}

app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

const node_env = process.env.NODE_ENV,
    server_port = Number(process.env.SERVER_PORT),
    port =
        node_env == 'production' || node_env == 'staging'
            ? server_port + 8001
            : server_port;

async function start() {
    var status = await init();
    if (!status) return;

    if (!module.parent) app.listen(port);
    console.log('\n\n\nServer running at port: ' + port);
}

start();

module.exports = app;
