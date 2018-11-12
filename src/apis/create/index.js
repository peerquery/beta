'use strict';

var _new = require('./new'),
    membership = require('./membership');

module.exports = function(app) {
    _new(app);
    membership(app);
};
