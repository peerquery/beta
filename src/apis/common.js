'use strict';

var content = require('./content'),
    _status = require('./status');

module.exports = async function(app) {
    content(app);
    _status(app);
};
