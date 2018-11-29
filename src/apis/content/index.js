'use strict';

var reports = require('./reports'),
    queries = require('./queries'),
    projects = require('./projects'),
    peers = require('./peers'),
    messages = require('./messages');

module.exports = function(app) {
    reports(app);
    queries(app);
    projects(app);
    peers(app);
    messages(app);
};
