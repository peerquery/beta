'use strict';

var team = require('./team'),
    settings = require('./settings'),
    curation = require('./curation'),
    dashboard = require('./dashboard');

module.exports = function(app) {
    curation(app);
    team(app);
    settings(app);
    dashboard(app);
};
