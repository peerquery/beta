'use strict';

var auth = require('./auth'),
    create = require('./create'),
    office = require('./office'),
    manage = require('./manage'),
    settings = require('./settings'),
    update = require('./update');

module.exports = async function(app) {
    auth(app);
    create(app);
    manage(app);
    office(app);
    settings(app);
    update(app);
};
