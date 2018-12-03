'use strict';

var reports = require('./reports'),
    queries = require('./queries'),
    projects = require('./projects'),
    peers = require('./peers'),
    activity = require('./activity'),
    messages = require('./messages'),
    notifications = require('./notifications');

module.exports = function(app) {
    reports(app);
    queries(app);
    projects(app);
    peers(app);
    activity(app);
    messages(app);
    notifications(app);
};
