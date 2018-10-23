'use strict';

var auth = require('./auth'),
    create = require('./create'),
    manage = require('./manage'),
    settings = require('./settings'),
    update = require('./update');

module.exports = async function(app) {
    auth(app);
    create(app);
    manage(app);
    settings(app);
    update(app);
};
