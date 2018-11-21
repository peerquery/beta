'use strict';

var statistics = require('./statistics'),
    search = require('./search'),
    blog = require('./blog'),
    curation = require('./curation');

module.exports = function(app) {
    search(app);
    statistics(app);
    blog(app);
    curation(app);
};
