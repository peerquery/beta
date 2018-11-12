'use strict';

var manage = require('./manage'),
    settings = require('./settings'),
    update = require('./update'),
    _status = require('./status');

module.exports = function(app) {
    manage(app);
    settings(app);
    update(app);
    _status(app);
};
