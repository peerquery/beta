'use strict';

var beneficiaries = require('./beneficiaries');
var memberships = require('./memberships');
var relations = require('./relations');
var settings = require('./settings');
var hires = require('./hires');

module.exports = function(app) {
    beneficiaries(app);
    memberships(app);
    relations(app);
    hires(app);
    settings(app);
};
