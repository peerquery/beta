'use strict';

var team = require('./team'),
    settings = require('./settings'),
    curation = require('./curation');

module.exports = function(app) {
    curation(app);
    team(app);
    settings(app);
};
