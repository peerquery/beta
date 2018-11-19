'use strict';

var statistics = require('./statistics'),
    search = require('./search');

module.exports = function(app) {
    search(app);
    statistics(app);
};
