'use strict';

var manage = require('./manage'),
    settings = require('./settings'),
    update = require('./update'),
    account = require('./account'),
    _status = require('./status');

module.exports = function(app) {
    manage(app);
    settings(app);
    update(app);
    account(app);
    _status(app);
};
